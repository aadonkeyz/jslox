import { Token } from '../scanner';
import Interpreter from '../interpreter';
import ScopeAnalysis from '../semantic/ScopeAnalyst';

type Visitor = Interpreter | ScopeAnalysis;

class BaseExpression {
  accept(visitor: Visitor) {}
}

class BinaryExpression extends BaseExpression {
  left: BaseExpression;
  operator: Token;
  right: BaseExpression;

  constructor(left: BaseExpression, operator: Token, right: BaseExpression) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept(visitor: Visitor): any {
    return visitor.visitBinaryExpression(this);
  }
}

class LogicalExpression extends BaseExpression {
  left: BaseExpression;
  operator: Token;
  right: BaseExpression;

  constructor(left: BaseExpression, operator: Token, right: BaseExpression) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept(visitor: Visitor): any {
    return visitor.visitLogicalExpression(this);
  }
}

class GroupingExpression extends BaseExpression {
  expression: BaseExpression;

  constructor(BaseExpression: BaseExpression) {
    super();
    this.expression = BaseExpression;
  }

  accept(visitor: Visitor): any {
    return visitor.visitGroupingExpression(this);
  }
}

class LiteralExpression extends BaseExpression {
  value: any;

  constructor(value: any) {
    super();
    this.value = value;
  }

  accept(visitor: Visitor): any {
    return visitor.visitLiteralExpression(this);
  }
}

class UnaryExpression extends BaseExpression {
  operator: Token;
  expression: BaseExpression;

  constructor(operator: Token, expression: BaseExpression) {
    super();
    this.operator = operator;
    this.expression = expression;
  }

  accept(visitor: Visitor): any {
    return visitor.visitUnaryExpression(this);
  }
}

class VariableExpression extends BaseExpression {
  name: Token;

  constructor(name: Token) {
    super();
    this.name = name;
  }

  accept(visitor: Visitor): any {
    return visitor.visitVariableExpression(this);
  }
}

class AssignmentExpression extends BaseExpression {
  name: Token;
  value: BaseExpression;

  constructor(name: Token, value: BaseExpression) {
    super();
    this.name = name;
    this.value = value;
  }

  accept(visitor: Visitor): any {
    return visitor.visitAssignmentExpression(this);
  }
}

class CallExpression extends BaseExpression {
  callee: BaseExpression;
  args: BaseExpression[];
  endParenthese: Token;

  constructor(
    callee: BaseExpression,
    args: BaseExpression[],
    endParenthese: Token,
  ) {
    super();
    this.callee = callee;
    this.args = args;
    this.endParenthese = endParenthese;
  }

  accept(visitor: Visitor): any {
    return visitor.visitCallExpression(this);
  }
}

export {
  BaseExpression,
  BinaryExpression,
  LogicalExpression,
  GroupingExpression,
  LiteralExpression,
  UnaryExpression,
  VariableExpression,
  AssignmentExpression,
  CallExpression,
};
