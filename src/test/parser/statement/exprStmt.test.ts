import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression, Statement } from '../../../compiler/parser';

describe('exprStmt', () => {
  test('expression', () => {
    const source = '1 + 2;';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.ExpressionStatement(
        new Expression.BinaryExpression(
          new Expression.LiteralExpression(1),
          new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
          new Expression.LiteralExpression(2),
        ),
      ),
    );
  });
});
