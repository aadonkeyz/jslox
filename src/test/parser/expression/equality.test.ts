import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression } from '../../../compiler/parser';

describe('equality', () => {
  test('1 == 1', () => {
    const source = '1 == 1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({
          type: TokenType.EQUAL_EQUAL,
          lexeme: '==',
          line: 1,
          column: 3,
        }),
        new Expression.LiteralExpression(1),
      ),
    );
  });

  test('comparison != comparison', () => {
    const source = '1 != 1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({
          type: TokenType.BANG_EQUAL,
          lexeme: '!=',
          line: 1,
          column: 3,
        }),
        new Expression.LiteralExpression(1),
      ),
    );
  });
});
