import { Token } from '../scanner';
import Interpreter from '../interpreter';

class BaseExpression {
  accept(interpreter: Interpreter) {

  }
};

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

  accept(interpreter: Interpreter): any {
    return interpreter.visitBinaryExpression(this);
  }
}

class GroupingExpression extends BaseExpression {
  expression: BaseExpression;

  constructor(BaseExpression: BaseExpression) {
    super();
    this.expression = BaseExpression;
  }

  accept(interpreter: Interpreter): any {
    return interpreter.visitGroupingExpression(this);
  }
}

class LiteralExpression extends BaseExpression {
  value: any;

  constructor(value: any) {
    super();
    this.value = value;
  }

  accept(interpreter: Interpreter): any {
    return interpreter.visitLiteralExpression(this);
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

  accept(interpreter: Interpreter): any {
    return interpreter.visitUnaryExpression(this);
  }
}

class VariableExpression extends BaseExpression {
  name: Token;

  constructor(name: Token) {
    super();
    this.name = name;
  }

  accept(interpreter: Interpreter): any {
    return interpreter.visitVariableExpression(this);
  }
}

class AssignExpression extends BaseExpression {
  name: Token;
  value: BaseExpression;

  constructor(name: Token, value: BaseExpression) {
    super();
    this.name = name;
    this.value = value;
  }

  accept(interpreter: Interpreter): any {
    return interpreter.visitAssignExpression(this);
  }
}

export {
  BaseExpression,
  BinaryExpression,
  GroupingExpression,
  LiteralExpression,
  UnaryExpression,
  VariableExpression,
  AssignExpression,
}