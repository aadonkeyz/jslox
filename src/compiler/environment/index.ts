import { Token } from '../scanner';
import reportError from '../util/reportError';

class Environment {
  values: Record<string, any>;
  enclosing?: Environment;

  constructor(enclosing?: Environment) {
    this.values = {};
    this.enclosing = enclosing;
  }

  define(name: string, value: any): void {
    this.values[name] = value;
  }

  get(nameToken: Token): any {
    if (nameToken.lexeme in this.values) {
      return this.values[nameToken.lexeme];
    }

    if (this.enclosing) {
      return this.enclosing.get(nameToken);
    }

    reportError(nameToken.line, nameToken.lexeme, 'Undefined variable');
  }

  getEnvironmentByDistance(distance: number): any {
    let environment: Environment = this;

    while (distance > 0 && environment.enclosing) {
      environment = environment.enclosing;
      distance = distance - 1;
    }

    return environment;
  }

  assign(nameToken: Token, value: any): void {
    if (nameToken.lexeme in this.values) {
      this.values[nameToken.lexeme] = value;
      return;
    }

    if (this.enclosing) {
      this.enclosing.assign(nameToken, value);
      return;
    }

    reportError(nameToken.line, nameToken.lexeme, 'Undefined variable');
  }
}

export default Environment;
