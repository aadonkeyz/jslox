import { Token } from './scanner';

class Environment {
  values: Record<string, any>;
  enclosing: Environment | null;

  constructor() {
    this.values = {};
    this.enclosing = null;
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

    throw new Error(`Undefined variable "${name.lexeme}".`)
  }

  assign(name: Token, value: any): void {
    if (name.lexeme in this.values) {
      this.values[name.lexeme] = value;
    }

    if (this.enclosing) {
      this.enclosing.assign(name, value);
      return;
    }

    throw new Error(`Undefined variable "${name.lexeme}".`)
  }
}

export default Environment;