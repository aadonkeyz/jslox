import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression } from '../../../compiler/parser';

describe('term', () => {
  test('factor+factor', () => {
    const source = '1 * -1 + -1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        new Expression.BinaryExpression(
          new Expression.LiteralExpression(1),
          new Token({ type: TokenType.STAR, lexeme: '*', line: 1, column: 3 }),
          new Expression.UnaryExpression(
            new Token({
              type: TokenType.MINUS,
              lexeme: '-',
              line: 1,
              column: 5,
            }),
            new Expression.LiteralExpression(1),
          ),
        ),
        new Token({ type: TokenType.PLUS, lexeme: '+', line: 1, column: 8 }),
        new Expression.UnaryExpression(
          new Token({
            type: TokenType.MINUS,
            lexeme: '-',
            line: 1,
            column: 10,
          }),
          new Expression.LiteralExpression(1),
        ),
      ),
    );
  });

  test('factor-factor', () => {
    const source = '1 * -1 - -1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        new Expression.BinaryExpression(
          new Expression.LiteralExpression(1),
          new Token({ type: TokenType.STAR, lexeme: '*', line: 1, column: 3 }),
          new Expression.UnaryExpression(
            new Token({
              type: TokenType.MINUS,
              lexeme: '-',
              line: 1,
              column: 5,
            }),
            new Expression.LiteralExpression(1),
          ),
        ),
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 8 }),
        new Expression.UnaryExpression(
          new Token({
            type: TokenType.MINUS,
            lexeme: '-',
            line: 1,
            column: 10,
          }),
          new Expression.LiteralExpression(1),
        ),
      ),
    );
  });
});
