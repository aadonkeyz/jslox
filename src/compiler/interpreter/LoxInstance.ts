import { Token } from '../scanner';
import { produceError } from '../util';
import { EnvironmentValue } from '../environment';
import LoxClass from './LoxClass';
import { LoxNativeClass } from './LoxNative';

class LoxInstance {
  belongClass: LoxClass | LoxNativeClass;
  fields: Record<string, EnvironmentValue>;

  constructor(belongClass: LoxClass | LoxNativeClass) {
    this.belongClass = belongClass;
    this.fields = {};
  }

  get(name: Token): EnvironmentValue {
    if (name.lexeme in this.fields) {
      return this.fields[name.lexeme];
    }

    const method = this.belongClass.findMethod(name.lexeme);
    if (method) {
      return method.bind(this);
    }

    throw produceError(
      name.line,
      name.column,
      `Undefined property "${name.lexeme}"`,
    );
  }

  set(name: Token, value: EnvironmentValue): void {
    this.fields[name.lexeme] = value;
  }
}

export default LoxInstance;
