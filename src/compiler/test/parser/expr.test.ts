import Scanner, { Token, TokenType } from '../../scanner';
import Parser, { Expr } from '../../parser';

describe('expr', () => {
  test('plus', () => {
    const source = '1 + 2';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    expect(parser.ast).toBe(
      new Expr.Binary(
        new Token(TokenType.NUMBER, '1', 1, 1),
        new Token(TokenType.PLUS, '+', '', 1),
        new Token(TokenType.NUMBER, '2', 2, 1),
      )
    )
  })
})