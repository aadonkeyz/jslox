import { EnvironmentValue } from '../environment';
import Interpreter from '.';
import LoxFunction from './LoxFunction';
import LoxInstance from './LoxInstance';

class LoxClass {
  name: string;
  methods: Record<string, LoxFunction>;

  constructor(name: string, methods: Record<string, LoxFunction>) {
    this.name = name;
    this.methods = methods;
  }

  arity(): number {
    let initializer = this.methods.init;
    if (initializer) {
      return initializer.arity();
    }
    return 0;
  }

  call(interpreter: Interpreter, args: EnvironmentValue[]): LoxInstance {
    const instance = new LoxInstance(this);
    const initializer = this.methods.init;
    if (initializer) {
      initializer.bind(instance).call(interpreter, args);
    }
    return instance;
  }
}

export default LoxClass;
