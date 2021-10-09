import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression } from '../../../compiler/parser';

describe('factor', () => {
  test('unary/unary', () => {
    const source = '-1/!true';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Expression.LiteralExpression(1),
        ),
        new Token({ type: TokenType.SLASH, lexeme: '/', line: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.BANG, lexeme: '!', line: 1 }),
          new Expression.LiteralExpression(true),
        ),
      ),
    );
  });

  test('unary*unary', () => {
    const source = '1*-1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Expression.LiteralExpression(1),
        ),
      ),
    );
  });
});
