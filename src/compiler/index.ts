import Scanner, { Token, TokenType } from './scanner';

class Lox {
  scanner: Scanner;
  tokens: Token[];

  constructor(source: string) {
    this.scanner = new Scanner(source);
    this.tokens = this.scanner.tokens;
  }
}

export {
  Lox as default,
  Scanner,
  Token,
  TokenType,
}