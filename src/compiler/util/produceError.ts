function produceError(line: number, where: string, message: string): Error {
  return new Error(`${message} at "${where}" in line ${line}.`);
}

export default produceError;
