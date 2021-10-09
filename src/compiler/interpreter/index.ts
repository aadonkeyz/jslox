import { Token, TokenType } from '../scanner';
import { Expression, Statement } from '../parser';
import Environment from '../environment';

class Interpreter {
  errors: { token: Token; message: string }[];
  environment: Environment;
  statements: Statement.BaseStatement[];

  constructor(statements: Statement.BaseStatement[]) {
    this.errors = [];
    this.environment = new Environment();
    this.statements = statements;
  }

  interpret(): void {
    try {
      for (let i = 0; i < this.statements.length; i++) {
        this.execute(this.statements[i]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  visitExpressionStatement(statement: Statement.ExpressionStatement): void {
    this.evaluate(statement.expression);
  }

  visitPrintStatement(statement: Statement.PrintStatement): void {
    const val = this.evaluate(statement.expression);
    console.log(val);
  }

  visitVarStatement(statement: Statement.VarStatement): void {
    const value = statement.initializer
      ? this.evaluate(statement.initializer)
      : undefined;

    this.environment.define(statement.name.lexeme, value);
  }

  visitBlockStatement(statement: Statement.BlockStatement): void {
    const previous = this.environment;
    this.environment = new Environment();

    for (let i = 0; i < statement.statements.length; i++) {
      this.execute(statement.statements[i]);
    }

    this.environment = previous;
  }

  visitLiteralExpression(expr: Expression.LiteralExpression): any {
    return expr.value;
  }

  visitGroupingExpression(expr: Expression.GroupingExpression): any {
    return this.evaluate(expr.expression);
  }

  visitUnaryExpression(expr: Expression.UnaryExpression): any {
    const right = this.evaluate(expr.expression);

    if (expr.operator.type === TokenType.MINUS) {
      this.checkNumberOperand(expr.operator, right);
      return -right;
    }

    if (expr.operator.type === TokenType.BANG) {
      return !right;
    }
  }

  visitBinaryExpression(expr: Expression.BinaryExpression): any {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.PLUS:
        if (typeof left === 'number' && typeof right === 'number') {
          return left + right;
        }

        if (typeof left === 'string' && typeof right === 'string') {
          return left + right;
        }

        this.errors.push({
          token: expr.operator,
          message: 'Operands must be two numbers or two strings.',
        });
        throw new Error();
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return left - right;
      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right);
        return left / right;
      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right);
        return left * right;
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return left > right;
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return left >= right;
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return left < right;
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return left <= right;
      case TokenType.BANG_EQUAL:
        return left !== right;
      case TokenType.EQUAL_EQUAL:
        return left === right;
    }
  }

  visitAssignmentExpression(expr: Expression.AssignmentExpression): any {
    const value = this.evaluate(expr.value);
    this.environment.assign(expr.name, value);
    return value;
  }

  visitVariableExpression(expr: Expression.VariableExpression): any {
    return this.environment.get(expr.name);
  }

  evaluate(expr: Expression.BaseExpression): any {
    return expr.accept(this);
  }

  execute(statement: Statement.BaseStatement): void {
    statement.accept(this);
  }

  checkNumberOperand(token: Token, operand: any) {
    if (typeof operand !== 'number') {
      this.errors.push({
        token,
        message: 'Operand must be a number.',
      });
      throw new Error();
    }
  }

  checkNumberOperands(token: Token, left: any, right: any) {
    if (typeof left !== 'number' || typeof right !== 'number') {
      this.errors.push({
        token,
        message: 'Operands must be numbers.',
      });
      throw new Error();
    }
  }
}

export { Interpreter as default };
