import Interpreter from '../interpreter';
import { ScopeAnalyst } from '../semantic';
import { Token } from '../scanner';
import { BaseExpression } from './expression';

type Visitor = Interpreter | ScopeAnalyst;

class BaseStatement {
  accept(visitor: Visitor) {}
}

class ExpressionStatement extends BaseStatement {
  expression: BaseExpression;

  constructor(expression: BaseExpression) {
    super();
    this.expression = expression;
  }

  accept(visitor: Visitor) {
    visitor.visitExpressionStatement(this);
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

  accept(visitor: Visitor) {
    visitor.visitIfStatement(this);
  }
}

class PrintStatement extends BaseStatement {
  expression: BaseExpression;

  constructor(expression: BaseExpression) {
    super();
    this.expression = expression;
  }

  accept(visitor: Visitor) {
    visitor.visitPrintStatement(this);
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

  accept(visitor: Visitor) {
    visitor.visitWhileStatement(this);
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

  accept(visitor: Visitor) {
    visitor.visitForStatement(this);
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

  accept(visitor: Visitor) {
    visitor.visitVarStatement(this);
  }
}

class BlockStatement extends BaseStatement {
  statements: BaseStatement[];

  constructor(statements: BaseStatement[]) {
    super();
    this.statements = statements;
  }

  accept(visitor: Visitor) {
    visitor.visitBlockStatement(this);
  }
}

class FunctionStatement extends BaseStatement {
  name: Token;
  params: Token[];
  body: BlockStatement;

  constructor(name: Token, params: Token[], body: BlockStatement) {
    super();
    this.name = name;
    this.params = params;
    this.body = body;
  }

  accept(visitor: Visitor) {
    visitor.visitFunctionStatement(this);
  }
}

class ReturnStatement extends BaseStatement {
  keyword: Token;
  value: BaseExpression;

  constructor(keyword: Token, value: BaseExpression) {
    super();
    this.keyword = keyword;
    this.value = value;
  }

  accept(visitor: Visitor) {
    visitor.visitReturnStatement(this);
  }
}

class ClassStatement extends BaseStatement {
  name: Token;
  methods: FunctionStatement[];

  constructor(name: Token, methods: FunctionStatement[]) {
    super();
    this.name = name;
    this.methods = methods;
  }

  accept(visitor: Visitor) {
    visitor.visitClassStatement(this);
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
  FunctionStatement,
  ReturnStatement,
  ClassStatement,
};
