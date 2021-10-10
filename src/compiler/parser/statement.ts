import { BaseExpression, AssignmentExpression } from './expression';
import Interpreter from '../interpreter';
import { Token } from '../scanner';

class BaseStatement {
  accept(interpreter: Interpreter) {}
}

class ExpressionStatement extends BaseStatement {
  expression: BaseExpression;

  constructor(expression: BaseExpression) {
    super();
    this.expression = expression;
  }

  accept(interpreter: Interpreter): any {
    return interpreter.visitExpressionStatement(this);
  }
}

class IfStatement extends BaseStatement {
  condition: BaseExpression;
  thenBranch: BaseStatement;
  elseBranch?: BaseStatement;

  constructor(
    condition: BaseExpression,
    thenBranch: BaseStatement,
    elseBranch?: BaseStatement,
  ) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }

  accept(interpreter: Interpreter): any {
    return interpreter.visitIfStatement(this);
  }
}

class PrintStatement extends BaseStatement {
  expression: BaseExpression;

  constructor(expression: BaseExpression) {
    super();
    this.expression = expression;
  }

  accept(interpreter: Interpreter): any {
    return interpreter.visitPrintStatement(this);
  }
}

class WhileStatement extends BaseStatement {
  condition: BaseExpression;
  body: BaseStatement;

  constructor(condition: BaseExpression, body: BaseStatement) {
    super();
    this.condition = condition;
    this.body = body;
  }

  accept(interpreter: Interpreter): any {
    return interpreter.visitWhileStatement(this);
  }
}

class ForStatement extends BaseStatement {
  initializer?: BaseStatement;
  condition?: BaseExpression;
  updator?: BaseExpression;
  body: BaseStatement;

  constructor(props: {
    initializer?: BaseStatement;
    condition?: BaseExpression;
    updator?: BaseExpression;
    body: BaseStatement;
  }) {
    super();
    this.initializer = props.initializer;
    this.condition = props.condition;
    this.updator = props.updator;
    this.body = props.body;
  }

  accept(interpreter: Interpreter): any {
    return interpreter.visitForStatement(this);
  }
}

class VarStatement extends BaseStatement {
  name: Token;
  initializer?: BaseExpression;

  constructor(name: Token, initializer?: BaseExpression) {
    super();
    this.name = name;
    this.initializer = initializer;
  }

  accept(interpreter: Interpreter): void {
    return interpreter.visitVarStatement(this);
  }
}

class BlockStatement extends BaseStatement {
  statements: BaseStatement[];

  constructor(statements: BaseStatement[]) {
    super();
    this.statements = statements;
  }

  accept(interpreter: Interpreter): void {
    return interpreter.visitBlockStatement(this);
  }
}

export {
  BaseStatement,
  ExpressionStatement,
  IfStatement,
  PrintStatement,
  WhileStatement,
  ForStatement,
  VarStatement,
  BlockStatement,
};
