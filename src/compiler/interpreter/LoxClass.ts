import { EnvironmentValue } from '../environment';
import Interpreter from '.';
import LoxFunction from './LoxFunction';
import LoxInstance from './LoxInstance';

class LoxClass {
  name: string;
  superclass: LoxClass | null;
  methods: Record<string, LoxFunction>;

  constructor(
    name: string,
    superclass: LoxClass | null,
    methods: Record<string, LoxFunction>,
  ) {
    this.name = name;
    this.superclass = superclass;
    this.methods = methods;
  }

  arity(): number {
    let initializer = this.methods.init;
    if (initializer) {
      return initializer.arity();
    }
    return 0;
  }

  findMethod(name: string): LoxFunction | null {
    if (name in this.methods) {
      return this.methods[name];
    }

    if (this.superclass) {
      return this.superclass.findMethod(name);
    }

    return null;
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
