import { Token, TokenType } from '../scanner';
import { Expression, Statement } from '../parser';
import Environment from '../environment';
import reportError from '../util/reportError';
import LoxFunction from './LoxFunction';
import LoxReturn from './LoxReturn';

class Interpreter {
  global: Environment;
  environment: Environment;
  statements: Statement.BaseStatement[];

  constructor(statements: Statement.BaseStatement[]) {
    this.global = new Environment();
    this.environment = this.global;
    this.statements = statements;
  }

  interpret(): void {
    for (let i = 0; i < this.statements.length; i++) {
      this.execute(this.statements[i]);
    }
  }

  visitFunctionStatement(node: Statement.FunctionStatement): void {
    const fun = new LoxFunction(node, this.environment);
    this.environment.define(node.name.lexeme, fun);
  }

  visitReturnStatement(node: Statement.ReturnStatement): void {
    throw new LoxReturn(this.evaluate(node.value));
  }

  visitExpressionStatement(node: Statement.ExpressionStatement): void {
    this.evaluate(node.expression);
  }

  visitIfStatement(node: Statement.IfStatement): void {
    if (this.evaluate(node.condition)) {
      this.execute(node.thenBranch);
    } else if (node.elseBranch) {
      this.execute(node.elseBranch);
    }
  }

  visitWhileStatement(node: Statement.WhileStatement): void {
    while (this.evaluate(node.condition)) {
      this.execute(node.body);
    }
  }

  visitForStatement(node: Statement.ForStatement): void {
    const previous = this.environment;
    this.environment = new Environment(previous);

    node.initializer && this.evaluate(node.initializer);
    while (node.condition && this.evaluate(node.condition)) {
      this.execute(node.body);
      node.updator && this.evaluate(node.updator);
    }

    this.environment = previous;
  }

  visitPrintStatement(node: Statement.PrintStatement): void {
    const val = this.evaluate(node.expression);
    console.log(val);
  }

  visitVarStatement(node: Statement.VarStatement): void {
    const value = node.initializer
      ? this.evaluate(node.initializer)
      : undefined;

    this.environment.define(node.name.lexeme, value);
  }

  visitBlockStatement(node: Statement.BlockStatement): void {
    this.executeBlock(node.statements, new Environment(this.environment));
  }

  visitLiteralExpression(node: Expression.LiteralExpression): any {
    return node.value;
  }

  visitGroupingExpression(node: Expression.GroupingExpression): any {
    return this.evaluate(node.expression);
  }

  visitUnaryExpression(node: Expression.UnaryExpression): any {
    const right = this.evaluate(node.expression);

    if (node.operator.type === TokenType.MINUS) {
      this.checkNumberOperand(node.operator, right);
      return -right;
    }

    if (node.operator.type === TokenType.BANG) {
      return !right;
    }
  }

  visitBinaryExpression(node: Expression.BinaryExpression): any {
    const left = this.evaluate(node.left);
    const right = this.evaluate(node.right);

    switch (node.operator.type) {
      case TokenType.PLUS:
        if (typeof left === 'number' && typeof right === 'number') {
          return left + right;
        }

        if (typeof left === 'string' && typeof right === 'string') {
          return left + right;
        }

        reportError(
          node.operator.line,
          node.operator.lexeme,
          'Operands must be two numbers or two strings',
        );
        break;
      case TokenType.MINUS:
        this.checkNumberOperands(node.operator, left, right);
        return left - right;
      case TokenType.SLASH:
        this.checkNumberOperands(node.operator, left, right);
        return left / right;
      case TokenType.STAR:
        this.checkNumberOperands(node.operator, left, right);
        return left * right;
      case TokenType.GREATER:
        this.checkNumberOperands(node.operator, left, right);
        return left > right;
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(node.operator, left, right);
        return left >= right;
      case TokenType.LESS:
        this.checkNumberOperands(node.operator, left, right);
        return left < right;
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(node.operator, left, right);
        return left <= right;
      case TokenType.BANG_EQUAL:
        return left !== right;
      case TokenType.EQUAL_EQUAL:
        return left === right;
    }
  }

  visitLogicalExpression(node: Expression.LogicalExpression): any {
    const left = this.evaluate(node.left);

    if (node.operator.type === TokenType.OR) {
      if (left) {
        return left;
      }
      return this.evaluate(node.right);
    }

    if (node.operator.type === TokenType.AND) {
      if (left) {
        return this.evaluate(node.right);
      }
      return left;
    }
  }

  visitAssignmentExpression(node: Expression.AssignmentExpression): any {
    const value = this.evaluate(node.value);
    this.environment.assign(node.name, value);
    return value;
  }

  visitVariableExpression(node: Expression.VariableExpression): any {
    return this.environment.get(node.name);
  }

  visitCallExpression(node: Expression.CallExpression): any {
    const callee = this.evaluate(node.callee);
    const args = node.args.map((item) => this.evaluate(item));

    if (!(callee instanceof LoxFunction)) {
      reportError(
        node.endParenthese.line,
        node.endParenthese.lexeme,
        'Can only call functions and classes.',
      );
    }

    if (args.length !== callee.declaration.params.length) {
      reportError(
        node.endParenthese.line,
        node.endParenthese.lexeme,
        `Expect ${callee.declaration.params.length} arguments but got ${args.length}.`,
      );
    }

    return callee.call(this, args);
  }

  evaluate(node: Expression.BaseExpression): any {
    return node.accept(this);
  }

  execute(node: Statement.BaseStatement): void {
    node.accept(this);
  }

  executeBlock(
    statements: Statement.BaseStatement[],
    newEnvironment: Environment,
  ): void {
    const previous = this.environment;
    this.environment = newEnvironment;

    try {
      for (let i = 0; i < statements.length; i++) {
        this.execute(statements[i]);
      }
    } catch (error) {
      if (error instanceof LoxReturn) {
        this.environment = previous;
        throw error;
      }
    }

    this.environment = previous;
  }

  checkNumberOperand(token: Token, operand: any) {
    if (typeof operand !== 'number') {
      reportError(token.line, token.lexeme, 'Operand must be a number');
    }
  }

  checkNumberOperands(token: Token, left: any, right: any) {
    if (typeof left !== 'number' || typeof right !== 'number') {
      reportError(token.line, token.lexeme, 'Operands must be numbers');
    }
  }
}

export { Interpreter as default };
