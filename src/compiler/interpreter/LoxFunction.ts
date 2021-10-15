import { Statement } from '../parser';
import Environment from '../environment';
import Interpreter from '.';
import LoxReturn from './LoxReturn';

class LoxFunction {
  declaration: Statement.FunctionStatement;
  closure: Environment;

  constructor(declaration: Statement.FunctionStatement, closure: Environment) {
    this.declaration = declaration;
    this.closure = closure;
  }

  call(interpreter: Interpreter, args: any[]): any {
    const environment = new Environment(this.closure);

    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].lexeme, args[i]);
    }

    try {
      interpreter.executeBlock(this.declaration.statements, environment);
    } catch (err) {
      if (err instanceof LoxReturn) {
        return err.value;
      }

      throw err;
    }

    return null;
  }
}

export default LoxFunction;
