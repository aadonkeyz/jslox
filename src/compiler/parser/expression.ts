import { Token, LiteralValue } from '../scanner';
import Interpreter from '../interpreter';
import { ScopeAnalyst } from '../semantic';

type Visitor = Interpreter | ScopeAnalyst;

class BaseExpression {
  accept(visitor: Visitor): any {}
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

  accept(visitor: Visitor) {
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

  accept(visitor: Visitor) {
    return visitor.visitLogicalExpression(this);
  }
}

class GroupingExpression extends BaseExpression {
  expression: BaseExpression;

  constructor(BaseExpression: BaseExpression) {
    super();
    this.expression = BaseExpression;
  }

  accept(visitor: Visitor) {
    return visitor.visitGroupingExpression(this);
  }
}

class LiteralExpression extends BaseExpression {
  value: LiteralValue;

  constructor(value: LiteralValue) {
    super();
    this.value = value;
  }

  accept(visitor: Visitor) {
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

  accept(visitor: Visitor) {
    return visitor.visitUnaryExpression(this);
  }
}

class VariableExpression extends BaseExpression {
  name: Token;

  constructor(name: Token) {
    super();
    this.name = name;
  }

  accept(visitor: Visitor) {
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

  accept(visitor: Visitor) {
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

  accept(visitor: Visitor) {
    return visitor.visitCallExpression(this);
  }
}

class GetExpression extends BaseExpression {
  object: BaseExpression;
  name: Token;

  constructor(object: BaseExpression, name: Token) {
    super();
    this.object = object;
    this.name = name;
  }

  accept(visitor: Visitor) {
    return visitor.visitGetExpression(this);
  }
}

class SetExpression extends BaseExpression {
  object: BaseExpression;
  name: Token;
  value: BaseExpression;

  constructor(object: BaseExpression, name: Token, value: BaseExpression) {
    super();
    this.object = object;
    this.name = name;
    this.value = value;
  }

  accept(visitor: Visitor) {
    return visitor.visitSetExpression(this);
  }
}

class ThisExpression extends BaseExpression {
  keyword: Token;

  constructor(keyword: Token) {
    super();
    this.keyword = keyword;
  }

  accept(visitor: Visitor) {
    return visitor.visitThisExpression(this);
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
  GetExpression,
  SetExpression,
  ThisExpression,
};
