import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression, Statement } from '../../../compiler/parser';

describe('block', () => {
  test('single layer block', () => {
    const source = `
{
  1;
  2;
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.BlockStatement([
        new Statement.ExpressionStatement(new Expression.LiteralExpression(1)),
        new Statement.ExpressionStatement(new Expression.LiteralExpression(2)),
      ]),
    );
  });

  test('multiple layers block', () => {
    const source = `
{
  1;
  {
    2 + 2;
  }
  3;
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.BlockStatement([
        new Statement.ExpressionStatement(new Expression.LiteralExpression(1)),
        new Statement.BlockStatement([
          new Statement.ExpressionStatement(
            new Expression.BinaryExpression(
              new Expression.LiteralExpression(2),
              new Token({
                type: TokenType.PLUS,
                lexeme: '+',
                line: 5,
                column: 7,
              }),
              new Expression.LiteralExpression(2),
            ),
          ),
        ]),
        new Statement.ExpressionStatement(new Expression.LiteralExpression(3)),
      ]),
    );
  });
});
