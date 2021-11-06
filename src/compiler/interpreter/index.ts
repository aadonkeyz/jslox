import { Token, TokenType, LiteralValue } from '../scanner';
import { Expression, Statement } from '../parser';
import Environment, { EnvironmentValue } from '../environment';
import { produceError } from '../util';
import LoxClass from './LoxClass';
import LoxFunction from './LoxFunction';
import LoxInstance from './LoxInstance';
import LoxReturn from './LoxReturn';
import { LoxNativeFunction, LoxNativeClass } from './LoxNative';
import defineNative from './defineNative';

class Interpreter {
  global: Environment;
  environment: Environment;
  statements: Statement.BaseStatement[];
  scopeRecord: Map<Expression.BaseExpression, number>;

  constructor(
    statements: Statement.BaseStatement[],
    scopeRecord?: Map<Expression.BaseExpression, number>,
  ) {
    this.global = new Environment();
    this.environment = this.global;
    this.statements = statements;
    this.scopeRecord = scopeRecord || new Map();

    defineNative(this.global);
  }

  interpret(): void {
    for (let i = 0; i < this.statements.length; i++) {
      this.execute(this.statements[i]);
    }
  }

  evaluate(node: Expression.BaseExpression): EnvironmentValue {
    return node.accept(this);
  }

  execute(node: Statement.BaseStatement): void {
    node.accept(this);
  }

  visitFunctionStatement(node: Statement.FunctionStatement): void {
    const loxFunction = new LoxFunction(node, this.environment);
    this.environment.define(node.name.lexeme, loxFunction);
  }

  visitClassStatement(node: Statement.ClassStatement): void {
    this.environment.define(node.name.lexeme, null);

    let superclass = null;
    let previous = null;
    if (node.superclass) {
      superclass = this.evaluate(node.superclass);

      if (!(superclass instanceof LoxClass)) {
        throw produceError(
          node.superclass.name.line,
          node.superclass.name.column,
          `Superclass must be a class at "${node.superclass.name.lexeme}"`,
        );
      }

      previous = this.environment;
      this.environment = new Environment(previous);
      this.environment.define('super', superclass);
    }

    const methods = node.methods.reduce((pre, cur) => {
      const method = new LoxFunction(
        cur,
        this.environment,
        cur.name.lexeme === 'init',
      );
      return {
        ...pre,
        [cur.name.lexeme]: method,
      };
    }, {});

    const loxClass = new LoxClass(node.name.lexeme, superclass, methods);

    if (previous) {
      this.environment = previous;
    }

    this.environment.assign(node.name, loxClass);
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
    const value = node.initializer ? this.evaluate(node.initializer) : null;

    this.environment.define(node.name.lexeme, value);
  }

  visitBlockStatement(
    node: Statement.BlockStatement,
    newEnvironment?: Environment,
  ): void {
    const previous = this.environment;
    this.environment = newEnvironment || new Environment(this.environment);

    try {
      for (let i = 0; i < node.statements.length; i++) {
        this.execute(node.statements[i]);
      }
    } catch (error) {
      this.environment = previous;
      throw error;
    }

    this.environment = previous;
  }

  visitLiteralExpression(node: Expression.LiteralExpression): LiteralValue {
    return node.value;
  }

  visitGroupingExpression(
    node: Expression.GroupingExpression,
  ): EnvironmentValue {
    return this.evaluate(node.expression);
  }

  visitUnaryExpression(node: Expression.UnaryExpression): EnvironmentValue {
    const right = this.evaluate(node.expression);

    if (node.operator.type === TokenType.MINUS) {
      if (typeof right !== 'number') {
        throw produceError(
          node.operator.line,
          node.operator.column,
          `Operand must be a number at "${node.operator.lexeme}"`,
        );
      }
      return -right;
    }

    if (node.operator.type === TokenType.BANG) {
      return !right;
    }

    throw produceError(
      node.operator.line,
      node.operator.column,
      'Should not happen',
    );
  }

  visitBinaryExpression(
    node: Expression.BinaryExpression,
  ): number | string | boolean {
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

        throw produceError(
          node.operator.line,
          node.operator.column,
          `Operands must be two numbers or two strings "${node.operator.lexeme}"`,
        );
      case TokenType.MINUS:
      case TokenType.SLASH:
      case TokenType.STAR:
      case TokenType.GREATER:
      case TokenType.GREATER_EQUAL:
      case TokenType.LESS:
      case TokenType.LESS_EQUAL:
        return this.numberBinaryCalculate(node.operator, left, right);
      case TokenType.BANG_EQUAL:
        return left !== right;
      case TokenType.EQUAL_EQUAL:
        return left === right;
      default:
        throw produceError(
          node.operator.line,
          node.operator.column,
          'Should not happen',
        );
    }
  }

  numberBinaryCalculate(
    token: Token,
    left: EnvironmentValue,
    right: EnvironmentValue,
  ): number | boolean {
    if (typeof left !== 'number' || typeof right !== 'number') {
      throw produceError(
        token.line,
        token.column,
        `Operands must be numbers at "${token.lexeme}"`,
      );
    }
    switch (token.type) {
      case TokenType.MINUS:
        return left - right;
      case TokenType.SLASH:
        return left / right;
      case TokenType.STAR:
        return left * right;
      case TokenType.GREATER:
        return left > right;
      case TokenType.GREATER_EQUAL:
        return left >= right;
      case TokenType.LESS:
        return left < right;
      case TokenType.LESS_EQUAL:
        return left <= right;
      default:
        throw produceError(token.line, token.column, 'Should not happen');
    }
  }

  visitLogicalExpression(node: Expression.LogicalExpression): EnvironmentValue {
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

    throw produceError(
      node.operator.line,
      node.operator.column,
      'Should not happen',
    );
  }

  visitAssignmentExpression(
    node: Expression.AssignmentExpression,
  ): EnvironmentValue {
    const value = this.evaluate(node.value);

    if (!this.scopeRecord.has(node)) {
      this.global.assign(node.name, value);
      return value;
    }

    const distance = this.scopeRecord.get(node)!;
    const environment = this.environment.getEnvironmentByDistance(distance);

    environment.assign(node.name, value);

    return value;
  }

  visitVariableExpression(
    node: Expression.VariableExpression,
  ): EnvironmentValue {
    if (!this.scopeRecord.has(node)) {
      return this.global.get(node.name);
    }

    const distance = this.scopeRecord.get(node)!;
    const environment = this.environment.getEnvironmentByDistance(distance);

    return environment.get(node.name);
  }

  visitCallExpression(node: Expression.CallExpression): EnvironmentValue {
    const callee = this.evaluate(node.callee);
    const args = node.args.map((item) => this.evaluate(item));

    if (
      callee instanceof LoxNativeFunction ||
      callee instanceof LoxNativeClass
    ) {
      return callee.call(args);
    }

    if (!(callee instanceof LoxFunction || callee instanceof LoxClass)) {
      throw produceError(
        node.endParenthese.line,
        node.endParenthese.column,
        `Can only call functions and classes at "${node.endParenthese.lexeme}"`,
      );
    }

    if (args.length !== callee.arity()) {
      throw produceError(
        node.endParenthese.line,
        node.endParenthese.column,
        `Expect ${callee.arity()} arguments but got ${args.length} at ")"`,
      );
    }

    return callee.call(this, args);
  }

  visitGetExpression(node: Expression.GetExpression): EnvironmentValue {
    const obj = this.evaluate(node.object);
    if (obj instanceof LoxInstance) {
      return obj.get(node.name);
    }

    throw produceError(
      node.name.line,
      node.name.column,
      `Only instances have properties at "${node.name.lexeme}"`,
    );
  }

  visitSetExpression(node: Expression.SetExpression): EnvironmentValue {
    const obj = this.evaluate(node.object);

    if (obj instanceof LoxInstance) {
      const value = this.evaluate(node.value);

      obj.set(node.name, value);

      return value;
    }

    throw produceError(
      node.name.line,
      node.name.column,
      `Only instances have properties at "${node.name.lexeme}"`,
    );
  }

  visitThisExpression(node: Expression.ThisExpression): LoxInstance {
    const distance = this.scopeRecord.get(node)!;
    const environment = this.environment.getEnvironmentByDistance(distance);

    return environment.get(node.keyword) as LoxInstance;
  }

  visitSuperExpression(node: Expression.SuperExpression): LoxFunction {
    const distance = this.scopeRecord.get(node)!;
    const environment = this.environment.getEnvironmentByDistance(distance);

    const superclass = environment.get(node.keyword) as LoxClass;
    const obj = this.environment.getEnvironmentByDistance(distance - 1).values
      .this as LoxInstance;

    const method = superclass.findMethod(node.method.lexeme);

    if (method) {
      return method.bind(obj);
    }

    throw produceError(
      node.keyword.line,
      node.keyword.column,
      `Undefined property ${node.method.lexeme}`,
    );
  }
}

export {
  Interpreter as default,
  LoxClass,
  LoxFunction,
  LoxInstance,
  LoxNativeFunction,
  LoxNativeClass,
};
