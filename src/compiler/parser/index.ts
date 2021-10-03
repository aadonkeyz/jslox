import { Token, TokenType } from '../scanner';
import { Expr, Binary, Grouping, Literal, Unary } from './expr';

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
  ast: Expr;
  errors: { line: number; where: string; message: string }[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
    this.errors = [];

    this.ast = this.expression();
  }

  // expression → equality
  expression(): Expr {
    return this.equality();
  }

  // equality → comparison ( ( "!=" | "==" ) comparison )*
  equality(): Expr {
    let expr = this.comparison();

    while (this.match([TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL])) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  // comparison → term ( ( ">" | ">=" | "<" | "<=" ) term )*
  comparison(): Expr {
    let expr = this.term();

    while (this.match([TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL])) {
      const operator = this.previous();
      const right = this.term();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  // term → factor ( ( "-" | "+" ) factor )*
  term(): Expr {
    let expr = this.factor();

    while (this.match([TokenType.MINUS, TokenType.PLUS])) {
      const operator = this.previous();
      const right = this.factor();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  // factor → unary ( ( "/" | "*" ) unary )*
  factor(): Expr {
    let expr = this.unary();

    while (this.match([TokenType.SLASH, TokenType.STAR])) {
      const operator = this.previous();
      const right = this.unary();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  // unary → ( "!" | "-" ) unary | primary
  unary(): Expr {
    if (this.match([TokenType.BANG, TokenType.MINUS])) {
      const operator = this.previous();
      const right = this.unary();
      return new Unary(operator, right);
    }

    return this.primary();
  }

  // primary → NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")"
  primary(): Expr {
    if (this.match([TokenType.NUMBER, TokenType.STRING])) {
      return new Literal(this.previous().literal);
    }

    if (this.match([TokenType.TRUE])) {
      return new Literal(true);
    }

    if (this.match([TokenType.FALSE])) {
      return new Literal(false);
    }

    if (this.match([TokenType.NIL])) {
      return new Literal(null);
    }

    if (this.match([TokenType.LEFT_PAREN])) {
      const expr = new Grouping(this.expression());
      this.consume(TokenType.RIGHT_PAREN, 'Expect ")" after expression.');
      return expr;
    }

    this.errors.push({
      line: this.peek().line,
      where: this.peek().lexeme,
      message: 'Expect expression.',
    })
    throw new Error()
  }

  match(tokenTypes: TokenType[]): boolean {
    for (let i = 0; i < tokenTypes.length; i++) {
      if (this.check(tokenTypes[i])) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  consume(tokenType: TokenType, message: string): Token {
    if (this.check(tokenType)) {
      return this.advance();
    }

    this.errors.push({
      line: this.peek().line,
      where: tokenType === TokenType.EOF ? 'at end' : `at ${this.peek().lexeme}`,
      message,
    });
    throw new Error();
  }

  check(tokenType: TokenType): boolean {
    if (this.isAtEnd()) {
      return false;
    }

    return tokenType === this.peek().type;
  }

  advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  peek(): Token {
    return this.tokens[this.current];
  }

  previous(): Token {
    return this.tokens[this.current - 1];
  }

  isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  synchronize() {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }
}

export {
  Parser as default,
  Expr,
  Binary,
  Grouping,
  Literal,
  Unary,
};