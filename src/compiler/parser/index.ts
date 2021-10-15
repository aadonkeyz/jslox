import { Token, TokenType } from '../scanner';
import * as Expression from './expression';
import * as Statement from './statement';

/**
 * program        → declaration* EOF
 * declaration    → funDecl | varDecl | statement
 * funDecl        → "fun" function
 * function       → IDENTIFIER "(" parameters? ")" block
 * parameters     → IDENTIFIER ( "," IDENTIFIER )*
 * varDecl        → "var" IDENTIFIER ( "=" expression )? ";"
 * statement      → exprStmt | forStmt | ifStmt | printStmt | returnStmt | whileStmt | block
 * exprStmt       → expression ";"
 * ifStmt         → "if" "(" expression ")" statement ( "else" statement )?
 * forStmt        → "for" "(" ( varDecl | exprStmt | ";" ) expression? ";" expression? ")" statement
 * printStmt      → "print" expression ";"
 * returnStmt     → "return" expression? ";"
 * whileStmt      → "while" "(" expression ")" statement
 * block          → "{" declaration* "}" ;
 *
 *
 *
 * expression     → assignment
 * assignment     → IDENTIFIER "=" assignment | logicOr
 * logicOr        → logicAnd ("or" logicAnd)*
 * logicAnd       → equality ("and" equality)*
 * equality       → comparison ( ( "!=" | "==" ) comparison )*
 * comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )*
 * term           → factor ( ( "-" | "+" ) factor )*
 * factor         → unary ( ( "/" | "*" ) unary )*
 * unary          → ( "!" | "-" ) unary | call
 * call           → primary ( "(" arguments? ")" )*
 * arguments      → expression ( "," expression )*
 * primary        → NUMBER | STRING | "true" | "false" | "nil" | IDENTIFIER | "(" expression ")"
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
      if (this.match([TokenType.FUN])) {
        return this.funDecl('function');
      }

      if (this.match([TokenType.VAR])) {
        return this.varDecl();
      }

      return this.statement();
    } catch (error) {
      this.synchronize();
    }
  }

  funDecl(kind: 'function' | 'class'): Statement.BaseStatement {
    const name = this.consume(TokenType.IDENTIFIER, `Expect ${kind} name`);
    this.consume(TokenType.LEFT_PARENTHESE, `Expect "(" after ${kind} name.`);

    const params: Token[] = [];
    if (!this.check(TokenType.RIGHT_PARENTHESE)) {
      do {
        params.push(
          this.consume(TokenType.IDENTIFIER, 'Expect parameter name.'),
        );
      } while (this.match([TokenType.COMMA]));
    }
    this.consume(TokenType.RIGHT_PARENTHESE, 'Expect ")" after parameters.');

    this.consume(TokenType.LEFT_BRACE, `Expect "{" before ${kind} body.`);
    const statements = this.block();

    return new Statement.FunctionStatement(name, params, statements);
  }

  varDecl(): Statement.BaseStatement {
    const name = this.consume(TokenType.IDENTIFIER, 'Expect variable name.');
    let initializer;
    if (this.match([TokenType.EQUAL])) {
      initializer = this.expression();
    }

    this.consume(TokenType.SEMICOLON, 'Expect ";" after variable declaration.');
    return new Statement.VarStatement(name, initializer);
  }

  statement(): Statement.BaseStatement {
    if (this.match([TokenType.IF])) {
      return this.ifStmt();
    }

    if (this.match([TokenType.PRINT])) {
      return this.printStmt();
    }

    if (this.match([TokenType.RETURN])) {
      return this.returnStmt();
    }

    if (this.match([TokenType.WHILE])) {
      return this.whileStmt();
    }

    if (this.match([TokenType.FOR])) {
      return this.forStmt();
    }

    if (this.match([TokenType.LEFT_BRACE])) {
      return new Statement.BlockStatement(this.block());
    }

    return this.exprStmt();
  }

  ifStmt(): Statement.BaseStatement {
    this.consume(TokenType.LEFT_PARENTHESE, 'Expect "(" after "if".');

    const condition = this.expression();

    this.consume(TokenType.RIGHT_PARENTHESE, 'Expect "(" after if condition.');

    const thenBranch = this.statement();
    const elseBranch = this.match([TokenType.ELSE])
      ? this.statement()
      : undefined;

    return new Statement.IfStatement(condition, thenBranch, elseBranch);
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

  exprStmt(): Statement.BaseStatement {
    const expression = this.expression();
    this.consume(TokenType.SEMICOLON, 'Expect ";" after expression.');
    return new Statement.ExpressionStatement(expression);
  }

  printStmt(): Statement.BaseStatement {
    const expression = this.expression();
    this.consume(TokenType.SEMICOLON, 'Expect ";" after value.');
    return new Statement.PrintStatement(expression);
  }

  returnStmt(): Statement.BaseStatement {
    const keyword = this.previous();
    const value = this.check(TokenType.SEMICOLON)
      ? new Expression.LiteralExpression(null)
      : this.expression();
    this.consume(TokenType.SEMICOLON, 'Expect ";" after return value.');
    return new Statement.ReturnStatement(keyword, value);
  }

  whileStmt(): Statement.BaseStatement {
    this.consume(TokenType.LEFT_PARENTHESE, 'Expect "(" after "while".');
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PARENTHESE, 'Expect ")" after condition.');
    const statement = this.statement();
    return new Statement.WhileStatement(condition, statement);
  }

  forStmt(): Statement.ForStatement {
    this.consume(TokenType.LEFT_PARENTHESE, 'Expect "(" after "for".');

    if (this.check(TokenType.RIGHT_PARENTHESE)) {
      this.errors.push({
        line: this.peek().line,
        where: this.peek().lexeme,
        message: 'There is nothing exist in the parenthese of "for".',
      });
      throw new Error();
    }

    let initializer;
    let condition;
    let updator;

    if (!this.check(TokenType.SEMICOLON)) {
      initializer = this.declaration();
    } else {
      this.advance();
    }

    if (!this.match([TokenType.SEMICOLON])) {
      condition = this.expression();
      this.consume(
        TokenType.SEMICOLON,
        'Expect ";" after the condition of "for".',
      );
    }

    if (!this.match([TokenType.RIGHT_PARENTHESE])) {
      updator = this.expression();
      this.consume(
        TokenType.RIGHT_PARENTHESE,
        'Expect ")" after the parenthese of "for".',
      );
    }

    const body = this.statement();

    return new Statement.ForStatement({
      initializer,
      condition,
      updator,
      body,
    });
  }

  expression(): Expression.BaseExpression {
    return this.assignment();
  }

  assignment(): Expression.BaseExpression {
    let expression = this.logicOr();

    if (this.match([TokenType.EQUAL])) {
      const equals = this.previous();
      const value = this.assignment();

      if (expression instanceof Expression.VariableExpression) {
        const name = expression.name;
        return new Expression.AssignmentExpression(name, value);
      }

      this.errors.push({
        line: equals.line,
        where: equals.lexeme,
        message: 'Invalid assignment target.',
      });
      throw new Error();
    }

    return expression;
  }

  logicOr(): Expression.BaseExpression {
    let expression = this.logicAnd();

    while (this.match([TokenType.OR])) {
      const operator = this.previous();
      const right = this.logicAnd();
      expression = new Expression.LogicalExpression(
        expression,
        operator,
        right,
      );
    }

    return expression;
  }

  logicAnd(): Expression.BaseExpression {
    let expression = this.equality();

    while (this.match([TokenType.AND])) {
      const operator = this.previous();
      const right = this.equality();
      expression = new Expression.LogicalExpression(
        expression,
        operator,
        right,
      );
    }

    return expression;
  }

  equality(): Expression.BaseExpression {
    let expression = this.comparison();

    while (this.match([TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL])) {
      const operator = this.previous();
      const right = this.comparison();
      expression = new Expression.BinaryExpression(expression, operator, right);
    }

    return expression;
  }

  comparison(): Expression.BaseExpression {
    let expression = this.term();

    while (
      this.match([
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL,
      ])
    ) {
      const operator = this.previous();
      const right = this.term();
      expression = new Expression.BinaryExpression(expression, operator, right);
    }

    return expression;
  }

  term(): Expression.BaseExpression {
    let expression = this.factor();

    while (this.match([TokenType.MINUS, TokenType.PLUS])) {
      const operator = this.previous();
      const right = this.factor();
      expression = new Expression.BinaryExpression(expression, operator, right);
    }

    return expression;
  }

  factor(): Expression.BaseExpression {
    let expression = this.unary();

    while (this.match([TokenType.SLASH, TokenType.STAR])) {
      const operator = this.previous();
      const right = this.unary();
      expression = new Expression.BinaryExpression(expression, operator, right);
    }

    return expression;
  }

  unary(): Expression.BaseExpression {
    if (this.match([TokenType.BANG, TokenType.MINUS])) {
      const operator = this.previous();
      const right = this.unary();
      return new Expression.UnaryExpression(operator, right);
    }

    return this.call();
  }

  call(): Expression.BaseExpression {
    let expression = this.primary();

    while (this.match([TokenType.LEFT_PARENTHESE])) {
      expression = this.finishCall(expression);
    }

    return expression;
  }

  finishCall(callee: Expression.BaseExpression): Expression.BaseExpression {
    const args: Expression.BaseExpression[] = [];

    if (!this.check(TokenType.RIGHT_PARENTHESE)) {
      do {
        args.push(this.expression());
      } while (this.match([TokenType.COMMA]));
    }

    const endParenthese = this.consume(
      TokenType.RIGHT_PARENTHESE,
      'Expect ")" after arguments.',
    );

    return new Expression.CallExpression(callee, args, endParenthese);
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

    if (this.match([TokenType.IDENTIFIER])) {
      return new Expression.VariableExpression(this.previous());
    }

    if (this.match([TokenType.LEFT_PARENTHESE])) {
      const expression = new Expression.GroupingExpression(this.expression());
      this.consume(TokenType.RIGHT_PARENTHESE, 'Expect ")" after expression.');
      return expression;
    }

    this.errors.push({
      line: this.peek().line,
      where: this.peek().lexeme,
      message: `Unexpected token "${this.peek().lexeme}".`,
    });
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
      where:
        tokenType === TokenType.EOF ? 'at end' : `at ${this.peek().lexeme}`,
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

export { Parser as default, Expression, Statement };
