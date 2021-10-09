import { BaseExpression } from './expression';
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
  PrintStatement,
  VarStatement,
  BlockStatement,
};
