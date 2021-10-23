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

  get(nameToken: Token): EnvironmentValue {
    if (nameToken.lexeme in this.values) {
      return this.values[nameToken.lexeme];
    }

    if (this.enclosing) {
      return this.enclosing.get(nameToken);
    }

    throw produceError(nameToken.line, nameToken.lexeme, 'Undefined variable');
  }

  getEnvironmentByDistance(distance: number): Environment {
    let environment: Environment = this;

    while (distance > 0 && environment.enclosing) {
      environment = environment.enclosing;
      distance = distance - 1;
    }

    return environment;
  }

  assign(nameToken: Token, value: EnvironmentValue): void {
    if (nameToken.lexeme in this.values) {
      this.values[nameToken.lexeme] = value;
      return;
    }

    if (this.enclosing) {
      this.enclosing.assign(nameToken, value);
      return;
    }

    throw produceError(nameToken.line, nameToken.lexeme, 'Undefined variable');
  }
}

export default Environment;
