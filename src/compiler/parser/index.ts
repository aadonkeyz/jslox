import { Token, TokenType } from '../scanner';
import * as Expr from './expr';

/**
 * expression     → equality
 * equality       → comparison ( ( "!=" | "==" ) comparison )*
 * comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )*
 * term           → factor ( ( "-" | "+" ) factor )*
 * factor         → unary ( ( "/" | "*" ) unary )*
 * unary          → ( "!" | "-" ) unary | primary
 * primary        → NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")"
 */

class Parser {
  tokens: Token[];
  current: number;
  ast: Expr.Expr;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;

    this.ast = this.expression();
  }

  // expression → equality
  expression(): Expr.Expr {
    return this.equality();
  }

  // equality → comparison ( ( "!=" | "==" ) comparison )*
  equality(): Expr.Expr {
    let expr = this.comparison();

    while (this.match([TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL])) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  // comparison → term ( ( ">" | ">=" | "<" | "<=" ) term )*
  comparison(): Expr.Expr {
    let expr = this.term();

    while (this.match([TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL])) {
      const operator = this.previous();
      const right = this.term();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  // term → factor ( ( "-" | "+" ) factor )*
  term(): Expr.Expr {
    let expr = this.factor();

    while (this.match([TokenType.MINUS, TokenType.PLUS])) {
      const operator = this.previous();
      const right = this.factor();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  // factor → unary ( ( "/" | "*" ) unary )*
  factor(): Expr.Expr {
    let expr = this.unary();

    while (this.match([TokenType.SLASH, TokenType.STAR])) {
      const operator = this.previous();
      const right = this.unary();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  // unary → ( "!" | "-" ) unary | primary
  unary(): Expr.Expr {
    if (this.match([TokenType.BANG, TokenType.MINUS])) {
      const operator = this.previous();
      const right = this.unary();
      return new Expr.Unary(operator, right);
    }

    return this.primary();
  }

  // primary → NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")"
  primary(): Expr.Expr {
    if (this.match([TokenType.NUMBER, TokenType.STRING])) {
      return new Expr.Literal(this.previous());
    }

    if (this.match([TokenType.TRUE])) {
      return new Expr.Literal(true);
    }

    if (this.match([TokenType.FALSE])) {
      return new Expr.Literal(false);
    }

    if (this.match([TokenType.NIL])) {
      return new Expr.Literal(null);
    }

    if (this.match([TokenType.LEFT_PAREN])) {
      const expr = new Expr.Grouping(this.expression());
      this.consume(TokenType.RIGHT_PAREN, 'Expect ")" after expression.');
      return expr;
    }

    throw new Error('')
  }

  match(tokenTypes: TokenType[]) {
    for (let i = 0; i < tokenTypes.length; i++) {
      if (this.check(tokenTypes[i])) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  consume(tokenType: TokenType, message: string) {
    if (this.check(tokenType)) {
      return this.advance();
    }

    throw new Error(message);
  }

  check(tokenType: TokenType) {
    if (this.isAtEnd()) {
      return false;
    }

    if (tokenType !== this.tokens[this.current].type) {
      return false;
    }

    return true;
  }

  advance() {
    if (this.isAtEnd()) {
      return this.tokens[this.tokens.length - 1];
    }
    return this.tokens[this.current++];
  }

  peek() {
    return this.tokens[this.current + 1];
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  // the last one is EOF
  isAtEnd() {
    return this.current >= this.tokens.length - 1;
  }
}

export {
  Parser as default,
  Expr
};