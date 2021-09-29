import { Token } from '../scanner';

class Expr {
};

class Binary extends Expr {
  left: Expr;
  operator: Token;
  right: Expr;

  constructor(left: Expr, operator: Token, right: Expr) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

class Grouping extends Expr {
  expression: Expr;

  constructor(expr: Expr) {
    super();
    this.expression = expr;
  }
}

class Literal extends Expr {
  value: any;

  constructor(value: any) {
    super();
    this.value = value;
  }
}

class Unary extends Expr {
  operator: Token;
  expression: Expr;

  constructor(operator: Token, expression: Expr) {
    super();
    this.operator = operator;
    this.expression = expression;
  }
}

export {
  Expr,
  Binary,
  Grouping,
  Literal,
  Unary,
}