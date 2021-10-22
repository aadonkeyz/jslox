import { Statement } from '../parser';
import Environment from '../environment';
import Interpreter from '.';
import LoxReturn from './LoxReturn';
import LoxInstance from './LoxInstance';

class LoxFunction {
  declaration: Statement.FunctionStatement;
  closure: Environment;
  isInitializer: boolean;

  constructor(
    declaration: Statement.FunctionStatement,
    closure: Environment,
    isInitializer?: boolean,
  ) {
    this.declaration = declaration;
    this.closure = closure;
    this.isInitializer = !!isInitializer;
  }

  arity(): number {
    return this.declaration.params.length;
  }

  call(interpreter: Interpreter, args: any[]): any {
    const environment = new Environment(this.closure);

    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].lexeme, args[i]);
    }

    let returnVal = null;
    try {
      interpreter.visitBlockStatement(this.declaration.body, environment);
    } catch (error) {
      if (error instanceof LoxReturn) {
        returnVal = error.value;
      } else {
        throw error;
      }
    }

    if (this.isInitializer) {
      return this.closure.values.this;
    }

    return returnVal;
  }

  bind(instance: LoxInstance): LoxFunction {
    const environment = new Environment(this.closure);
    environment.define('this', instance);
    return new LoxFunction(this.declaration, environment, this.isInitializer);
  }
}

export default LoxFunction;
