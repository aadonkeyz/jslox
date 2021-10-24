import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression } from '../../../compiler/parser';

describe('comparison', () => {
  test('term>term', () => {
    const source = '1 * -1 + -1 > 1 * -1 + -1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    const term1 = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1, column: 3 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 5 }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1, column: 8 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 10 }),
        new Expression.LiteralExpression(1),
      ),
    );

    const term2 = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1, column: 17 }),
        new Expression.UnaryExpression(
          new Token({
            type: TokenType.MINUS,
            lexeme: '-',
            line: 1,
            column: 19,
          }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1, column: 22 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 24 }),
        new Expression.LiteralExpression(1),
      ),
    );

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        term1,
        new Token({
          type: TokenType.GREATER,
          lexeme: '>',
          line: 1,
          column: 13,
        }),
        term2,
      ),
    );
  });

  test('term>=term', () => {
    const source = '1 * -1 + -1 >= 1 * -1 + -1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    const term1 = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1, column: 3 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 5 }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1, column: 8 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 10 }),
        new Expression.LiteralExpression(1),
      ),
    );

    const term2 = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1, column: 18 }),
        new Expression.UnaryExpression(
          new Token({
            type: TokenType.MINUS,
            lexeme: '-',
            line: 1,
            column: 20,
          }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1, column: 23 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 25 }),
        new Expression.LiteralExpression(1),
      ),
    );

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        term1,
        new Token({
          type: TokenType.GREATER_EQUAL,
          lexeme: '>=',
          line: 1,
          column: 13,
        }),
        term2,
      ),
    );
  });

  test('term<term', () => {
    const source = '1 * -1 + -1 < 1 * -1 + -1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    const term1 = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1, column: 3 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 5 }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1, column: 8 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 10 }),
        new Expression.LiteralExpression(1),
      ),
    );

    const term2 = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1, column: 17 }),
        new Expression.UnaryExpression(
          new Token({
            type: TokenType.MINUS,
            lexeme: '-',
            line: 1,
            column: 19,
          }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1, column: 22 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 24 }),
        new Expression.LiteralExpression(1),
      ),
    );

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        term1,
        new Token({ type: TokenType.LESS, lexeme: '<', line: 1, column: 13 }),
        term2,
      ),
    );
  });

  test('term<=term', () => {
    const source = '1 * -1 + -1 <= 1 * -1 + -1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    const term1 = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1, column: 3 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 5 }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1, column: 8 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 10 }),
        new Expression.LiteralExpression(1),
      ),
    );

    const term2 = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1, column: 18 }),
        new Expression.UnaryExpression(
          new Token({
            type: TokenType.MINUS,
            lexeme: '-',
            line: 1,
            column: 20,
          }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1, column: 23 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 25 }),
        new Expression.LiteralExpression(1),
      ),
    );

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        term1,
        new Token({
          type: TokenType.LESS_EQUAL,
          lexeme: '<=',
          line: 1,
          column: 13,
        }),
        term2,
      ),
    );
  });
});
