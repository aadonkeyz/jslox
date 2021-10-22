import { Token } from '../scanner';
import reportError from '../util/reportError';
import LoxClass from './LoxClass';

class LoxInstance {
  belongClass: LoxClass;
  fields: Record<string, any>;

  constructor(belongClass: LoxClass) {
    this.belongClass = belongClass;
    this.fields = {};
  }

  get(name: Token): any {
    if (name.lexeme in this.fields) {
      return this.fields[name.lexeme];
    }

    if (name.lexeme in this.belongClass.methods) {
      return this.belongClass.methods[name.lexeme].bind(this);
    }

    reportError(name.line, name.lexeme, `Undefined property "${name.lexeme}".`);
  }

  set(name: Token, value: any): any {
    this.fields[name.lexeme] = value;
  }
}

export default LoxInstance;
