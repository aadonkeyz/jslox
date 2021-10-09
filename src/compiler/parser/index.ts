import { Token, TokenType } from '../scanner';
import * as Expression from './expression';
import * as Statement from './statement';

/**
 * program        → declaration* EOF
 * declaration    → varDecl | statement
 * varDecl        → "var" IDENTIFIER ( "=" expression )? ";"
 * statement      → exprStmt | printStmt | block
 * block          → "{" declaration* "}" ;
 * exprStmt       → expression ";"
 * printStmt      → "print" expression ";"
 * 
 * 
 * 
 * expression     → assignment
 * assignment     → IDENTIFIER "=" assignment | equality
 * equality       → comparison ( ( "!=" | "==" ) comparison )*
 * comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )*
 * term           → factor ( ( "-" | "+" ) factor )*
 * factor         → unary ( ( "/" | "*" ) unary )*
 * unary          → ( "!" | "-" ) unary | primary
 * primary        → NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")" | IDENTIFIER
 */

class Parser {
  tokens: Token[];
  current: number;
  statements: Statement.BaseStatement[];
  errors: { line: number; where: string; message: string }[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
    this.statements = [];
    this.errors = [];
  }

  parse(): void {
    while (!this.isAtEnd()) {
      const statement = this.declaration();
      if (statement) {
        this.statements.push(statement);
      }
    }
  }

  declaration(): Statement.BaseStatement | undefined {
    try {
      if (this.match([TokenType.VAR])) {
        return this.varDeclaration();
      }

      return this.statement();
    } catch (error) {
      this.synchronize();
    }
  }

  varDeclaration(): Statement.BaseStatement {
    const name = this.consume(TokenType.IDENTIFIER, 'Expect variable name.');
    let initializer;
    if (this.match([TokenType.EQUAL])) {
      initializer = this.expression();
    }

    this.consume(TokenType.SEMICOLON, 'Expect ";" after variable declaration.');
    return new Statement.VarStatement(name, initializer);
  }

  statement(): Statement.BaseStatement {
    if (this.match([TokenType.PRINT])) {
      return this.printStatement();
    }

    if (this.match([TokenType.LEFT_BRACE])) {
      return new Statement.BlockStatement(this.block());
    }

    return this.expressionStatement()
  }

  block(): Statement.BaseStatement[] {
    const statements: Statement.BaseStatement[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      const statement = this.declaration();
      if (statement) {
        statements.push(statement);
      }
    }

    this.consume(TokenType.RIGHT_BRACE, 'Expect "}" after block.');
    return statements;
  }

  expressionStatement(): Statement.BaseStatement {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, 'Expect ";" after expression.');
    return new Statement.ExpressionStatement(expr);
  }

  printStatement(): Statement.BaseStatement {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, 'Expect ";" after value.');
    return new Statement.PrintStatement(expr);
  }

  expression(): Expression.BaseExpression {
    return this.assignment();
  }

  assignment(): Expression.BaseExpression {
    let expr = this.equality();

    if (this.match([TokenType.EQUAL])) {
      const equals = this.previous();
      const value = this.assignment();

      if (expr instanceof Expression.VariableExpression) {
        const name = expr.name;
        return new Expression.AssignExpression(name, value);
      }

      this.errors.push({
        line: equals.line,
        where: equals.lexeme,
        message: 'Invalid assignment target.',
      })
      throw new Error();
    }

    return expr;
  }

  equality(): Expression.BaseExpression {
    let expr = this.comparison();

    while (this.match([TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL])) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new Expression.BinaryExpression(expr, operator, right);
    }

    return expr;
  }

  comparison(): Expression.BaseExpression {
    let expr = this.term();

    while (this.match([TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL])) {
      const operator = this.previous();
      const right = this.term();
      expr = new Expression.BinaryExpression(expr, operator, right);
    }

    return expr;
  }

  term(): Expression.BaseExpression {
    let expr = this.factor();

    while (this.match([TokenType.MINUS, TokenType.PLUS])) {
      const operator = this.previous();
      const right = this.factor();
      expr = new Expression.BinaryExpression(expr, operator, right);
    }

    return expr;
  }

  factor(): Expression.BaseExpression {
    let expr = this.unary();

    while (this.match([TokenType.SLASH, TokenType.STAR])) {
      const operator = this.previous();
      const right = this.unary();
      expr = new Expression.BinaryExpression(expr, operator, right);
    }

    return expr;
  }

  unary(): Expression.BaseExpression {
    if (this.match([TokenType.BANG, TokenType.MINUS])) {
      const operator = this.previous();
      const right = this.unary();
      return new Expression.UnaryExpression(operator, right);
    }

    return this.primary();
  }

  primary(): Expression.BaseExpression {
    if (this.match([TokenType.NUMBER, TokenType.STRING])) {
      return new Expression.LiteralExpression(this.previous().literal);
    }

    if (this.match([TokenType.TRUE])) {
      return new Expression.LiteralExpression(true);
    }

    if (this.match([TokenType.FALSE])) {
      return new Expression.LiteralExpression(false);
    }

    if (this.match([TokenType.NIL])) {
      return new Expression.LiteralExpression(null);
    }

    if (this.match([TokenType.LEFT_PAREN])) {
      const expr = new Expression.GroupingExpression(this.expression());
      this.consume(TokenType.RIGHT_PAREN, 'Expect ")" after expression.');
      return expr;
    }

    if (this.match([TokenType.IDENTIFIER])) {
      return new Expression.VariableExpression(this.previous());
    }

    this.errors.push({
      line: this.peek().line,
      where: this.peek().lexeme,
      message: 'Expect expression.',
    })
    throw new Error();
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
  Expression,
  Statement
};