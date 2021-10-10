function reportError(line: number, where: string, message: string): void {
  throw new Error(`${message} at "${where}" in line ${line}.`);
}

export default reportError;
