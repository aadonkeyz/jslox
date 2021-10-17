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

  get(name: Token): any {
    if (name.lexeme in this.values) {
      return this.values[name.lexeme];
    }

    if (this.enclosing) {
      return this.enclosing.get(name);
    }

    reportError(name.line, name.lexeme, 'Undefined variable');
  }

  assign(name: Token, value: any): void {
    if (name.lexeme in this.values) {
      this.values[name.lexeme] = value;
      return;
    }

    if (this.enclosing) {
      this.enclosing.assign(name, value);
      return;
    }

    reportError(name.line, name.lexeme, 'Undefined variable');
  }
}

export default Environment;
