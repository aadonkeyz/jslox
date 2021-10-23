import { EnvironmentValue } from '../environment';

class LoxReturn {
  value: EnvironmentValue;

  constructor(value: EnvironmentValue) {
    this.value = value;
  }
}

export default LoxReturn;
