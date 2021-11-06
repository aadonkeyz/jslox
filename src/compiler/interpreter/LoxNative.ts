import { EnvironmentValue } from '../environment';
import { LoxInstance } from '.';

class LoxNativeFunction {
  nativeFn: Function;
  /**
   * LoxNativeClass 上的 LoxNativeFunction 一定是有 instance 的，直接调用的则没有
   */
  instance?: LoxInstance;

  constructor(nativeFn: Function, instance?: LoxInstance) {
    this.nativeFn = nativeFn;
    this.instance = instance;
  }

  call(args: EnvironmentValue[]) {
    return this.nativeFn(args, this.instance);
  }

  bind(instance: LoxInstance): LoxNativeFunction {
    return new LoxNativeFunction(this.nativeFn, instance);
  }
}

class LoxNativeClass {
  name: string;
  methods: Record<string, LoxNativeFunction>;

  constructor(name: string, methods: Record<string, LoxNativeFunction>) {
    this.name = name;
    this.methods = methods;
  }

  findMethod(name: string): LoxNativeFunction | null {
    if (name in this.methods) {
      return this.methods[name];
    }

    return null;
  }

  call(args: EnvironmentValue[]): LoxInstance {
    const instance = new LoxInstance(this);
    const initializer = this.methods.init;
    if (initializer) {
      initializer.bind(instance).call(args);
    }
    return instance;
  }
}

export { LoxNativeFunction, LoxNativeClass };
