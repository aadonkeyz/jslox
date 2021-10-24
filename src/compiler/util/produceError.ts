function produceError(line: number, column: number, message: string): Error {
  return new Error(`${message} in line ${line} column ${column}.`);
}

export default produceError;
