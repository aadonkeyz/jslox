import { Token } from '../scanner';
import { produceError } from '../util';
import { EnvironmentValue } from '../environment';
import LoxClass from './LoxClass';

class LoxInstance {
  belongClass: LoxClass;
  fields: Record<string, EnvironmentValue>;

  constructor(belongClass: LoxClass) {
    this.belongClass = belongClass;
    this.fields = {};
  }

  get(name: Token): EnvironmentValue {
    if (name.lexeme in this.fields) {
      return this.fields[name.lexeme];
    }

    if (name.lexeme in this.belongClass.methods) {
      return this.belongClass.methods[name.lexeme].bind(this);
    }

    throw produceError(
      name.line,
      name.lexeme,
      `Undefined property "${name.lexeme}".`,
    );
  }

  set(name: Token, value: EnvironmentValue): void {
    this.fields[name.lexeme] = value;
  }
}

export default LoxInstance;
