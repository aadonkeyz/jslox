import Environment, { EnvironmentValue } from '../environment';
import { LoxInstance, LoxNativeFunction, LoxNativeClass } from '.';

function defineNative(global: Environment): void {
  defineString(global);
  defineDate(global);
}

function defineString(global: Environment): void {
  global.define(
    'String',
    new LoxNativeFunction((args: number[]) => {
      return String(args[0]);
    }),
  );
}

function defineDate(global: Environment): void {
  const NativeDate = new LoxNativeClass('Date', {
    init: new LoxNativeFunction(
      (args: [string | undefined], instance: LoxInstance) => {
        let now = args[0] ? new Date(args[0]) : new Date();
        instance.fields.year = now.getFullYear();
        instance.fields.month = now.getMonth() + 1;
        instance.fields.date = now.getDate();
      },
    ),

    getFullYear: new LoxNativeFunction(
      (args: EnvironmentValue[], instance: LoxInstance) => {
        return instance.fields.year;
      },
    ),

    getMonth: new LoxNativeFunction(
      (args: EnvironmentValue[], instance: LoxInstance) => {
        return instance.fields.month;
      },
    ),

    getDate: new LoxNativeFunction(
      (args: EnvironmentValue[], instance: LoxInstance) => {
        return instance.fields.date;
      },
    ),
  });

  global.define('Date', NativeDate);
}

export default defineNative;
