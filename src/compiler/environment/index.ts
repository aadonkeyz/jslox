import { Token, LiteralValue } from '../scanner';
import { produceError } from '../util';
import { LoxClass, LoxFunction, LoxInstance } from '../interpreter';

export type EnvironmentValue =
  | LoxClass
  | LoxFunction
  | LoxInstance
  | LiteralValue;
class Environment {
  values: Record<string, EnvironmentValue>;
  enclosing?: Environment;

  constructor(enclosing?: Environment) {
    this.values = {};
    this.enclosing = enclosing;
  }

  define(name: string, value: EnvironmentValue): void {
    this.values[name] = value;
  }

  get(name: Token): EnvironmentValue {
    if (name.lexeme in this.values) {
      return this.values[name.lexeme];
    }

    if (this.enclosing) {
      return this.enclosing.get(name);
    }

    throw produceError(name.line, name.lexeme, 'Undefined variable');
  }

  getEnvironmentByDistance(distance: number): Environment {
    let environment: Environment = this;

    while (distance > 0 && environment.enclosing) {
      environment = environment.enclosing;
      distance = distance - 1;
    }

    return environment;
  }

  assign(name: Token, value: EnvironmentValue): void {
    if (name.lexeme in this.values) {
      this.values[name.lexeme] = value;
      return;
    }

    if (this.enclosing) {
      this.enclosing.assign(name, value);
      return;
    }

    throw produceError(name.line, name.lexeme, 'Undefined variable');
  }
}

export default Environment;
