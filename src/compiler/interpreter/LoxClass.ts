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

  call(interpreter: Interpreter, args: any[]): any {
    const instance = new LoxInstance(this);
    let initializer = this.methods.init;
    if (initializer) {
      initializer = initializer.bind(instance).call(interpreter, args);
    }
    return instance;
  }
}

export default LoxClass;
