import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression } from '../../../compiler/parser';

describe('equality', () => {
  test('comparison == comparison', () => {
    const source = '1 * -1 + -1 > 1 * -1 + -1 == 1 * -1 + -1 > 1 * -1 + -1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    const term = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Expression.LiteralExpression(1),
      ),
    );
    const comparison = new Expression.BinaryExpression(
      term,
      new Token({ type: TokenType.GREATER, lexeme: '>', line: 1 }),
      term,
    );

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        comparison,
        new Token({ type: TokenType.EQUAL_EQUAL, lexeme: '==', line: 1 }),
        comparison,
      ),
    );
  });

  test('comparison != comparison', () => {
    const source = '1 * -1 + -1 > 1 * -1 + -1 != 1 * -1 + -1 > 1 * -1 + -1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    const term = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Expression.LiteralExpression(1),
      ),
    );
    const comparison = new Expression.BinaryExpression(
      term,
      new Token({ type: TokenType.GREATER, lexeme: '>', line: 1 }),
      term,
    );

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        comparison,
        new Token({ type: TokenType.BANG_EQUAL, lexeme: '!=', line: 1 }),
        comparison,
      ),
    );
  });
});
