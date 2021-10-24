import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression } from '../../../compiler/parser';

describe('unary', () => {
  test('!primary', () => {
    const source = '!true';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.UnaryExpression(
        new Token({ type: TokenType.BANG, lexeme: '!', line: 1, column: 1 }),
        new Expression.LiteralExpression(true),
      ),
    );
  });

  test('-primary', () => {
    const source = '-1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 1 }),
        new Expression.LiteralExpression(1),
      ),
    );
  });

  test('!unary', () => {
    const source = '!!true';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.UnaryExpression(
        new Token({ type: TokenType.BANG, lexeme: '!', line: 1, column: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.BANG, lexeme: '!', line: 1, column: 2 }),
          new Expression.LiteralExpression(true),
        ),
      ),
    );
  });

  test('-unary', () => {
    const source = '--1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 2 }),
          new Expression.LiteralExpression(1),
        ),
      ),
    );
  });
});
