import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression } from '../../../compiler/parser';

describe('logicOr', () => {
  test('or', () => {
    const source = '1 or 2 and 3';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.LogicalExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.OR, lexeme: 'or', line: 1, column: 3 }),
        new Expression.LogicalExpression(
          new Expression.LiteralExpression(2),
          new Token({ type: TokenType.AND, lexeme: 'and', line: 1, column: 8 }),
          new Expression.LiteralExpression(3),
        ),
      ),
    );
  });
});
