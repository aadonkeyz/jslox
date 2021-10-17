import { Expression, Statement } from '../parser';
import { Token } from '../scanner';

class ScopeAnalyst {
  statements: Statement.BaseStatement[];
  scopes: Record<string, boolean>[];
  scopeRecord: Map<Expression.BaseExpression, number>;
  errors: { line: number; where: string; message: string }[];

  constructor(statements: Statement.BaseStatement[]) {
    this.statements = statements;
    this.scopes = [];
    this.scopeRecord = new Map();
    this.errors = [];
  }

  analysis(): void {
    this.evaluateList(this.statements);
  }

  evaluateList(
    list: Statement.BaseStatement[] | Expression.BaseExpression[],
  ): void {
    for (let i = 0; i < list.length; i++) {
      this.evaluateItem(list[i]);
    }
  }

  evaluateItem(
    node: Statement.BaseStatement | Expression.BaseExpression,
  ): void {
    node.accept(this);
  }

  declare(name: Token): void {
    if (this.scopes.length !== 0) {
      this.scopes[this.scopes.length - 1][name.lexeme] = false;
    }
  }

  define(name: Token): void {
    if (this.scopes.length !== 0) {
      this.scopes[this.scopes.length - 1][name.lexeme] = true;
    }
  }

  calculate(
    node: Statement.BaseStatement | Expression.BaseExpression,
    name: Token,
  ): void {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (name.lexeme in this.scopes[i]) {
        this.scopeRecord.set(node, this.scopes.length - 1 - i);
        return;
      }
    }
  }

  visitExpressionStatement(node: Statement.ExpressionStatement): void {
    this.evaluateItem(node.expression);
  }

  visitIfStatement(node: Statement.IfStatement): void {
    this.evaluateItem(node.condition);
    this.evaluateItem(node.thenBranch);
    node.elseBranch && this.evaluateItem(node.elseBranch);
  }

  visitPrintStatement(node: Statement.PrintStatement): void {
    this.evaluateItem(node.expression);
  }

  visitWhileStatement(node: Statement.WhileStatement): void {
    this.evaluateItem(node.condition);
    this.evaluateItem(node.body);
  }

  visitForStatement(node: Statement.ForStatement): void {
    this.scopes.push({});
    node.initializer && this.evaluateItem(node.initializer);
    node.condition && this.evaluateItem(node.condition);
    node.updator && this.evaluateItem(node.updator);
    this.evaluateItem(node.body);
    this.scopes.pop();
  }

  visitVarStatement(node: Statement.VarStatement): void {
    this.declare(node.name);
    node.initializer && this.evaluateItem(node.initializer);
    this.define(node.name);
  }

  visitBlockStatement(node: Statement.BlockStatement): void {
    this.scopes.push({});
    this.evaluateList(node.statements);
    this.scopes.pop();
  }

  visitFunctionStatement(node: Statement.FunctionStatement): void {
    this.declare(node.name);
    this.define(node.name);

    this.scopes.push({});

    node.params.forEach((item) => {
      this.declare(item);
      this.define(item);
    });
    this.evaluateList(node.body.statements);

    this.scopes.pop();
  }

  visitReturnStatement(node: Statement.ReturnStatement): void {
    node.value && this.evaluateItem(node.value);
  }

  visitBinaryExpression(node: Expression.BinaryExpression): void {
    this.evaluateItem(node.left);
    this.evaluateItem(node.right);
  }

  visitLogicalExpression(node: Expression.LogicalExpression): void {
    this.evaluateItem(node.left);
    this.evaluateItem(node.right);
  }

  visitGroupingExpression(node: Expression.GroupingExpression): void {
    this.evaluateItem(node.expression);
  }

  visitLiteralExpression(node: Expression.LiteralExpression): void {}

  visitUnaryExpression(node: Expression.UnaryExpression): void {
    this.evaluateItem(node.expression);
  }

  visitVariableExpression(node: Expression.VariableExpression): void {
    if (
      this.scopes.length !== 0 &&
      this.scopes[this.scopes.length - 1][node.name.lexeme] === false
    ) {
      this.errors.push({
        line: node.name.line,
        where: node.name.lexeme,
        message: "Can't read local variable in its own initializer.",
      });
    }

    this.calculate(node, node.name);
  }

  visitAssignmentExpression(node: Expression.AssignmentExpression): void {
    this.evaluateItem(node.value);
    this.calculate(node, node.name);
  }

  visitCallExpression(node: Expression.CallExpression): void {
    this.evaluateItem(node.callee);
    this.evaluateList(node.args);
  }
}

export default ScopeAnalyst;
