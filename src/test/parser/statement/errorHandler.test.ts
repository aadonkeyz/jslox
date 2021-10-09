import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression, Statement } from '../../../compiler/parser';

describe('errorHandler', () => {
  test('any error', () => {
    const source = `
var a = 1;
var b = 2;
a > = b;
var c = 3;
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.errors[0]).toStrictEqual({
      line: 4,
      where: '=',
      message: 'Unexpected token "=".',
    });
    expect(parser.statements[0]).toStrictEqual(
      new Statement.VarStatement(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'a', line: 2 }),
        new Expression.LiteralExpression(1),
      ),
    );
    expect(parser.statements[1]).toStrictEqual(
      new Statement.VarStatement(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'b', line: 3 }),
        new Expression.LiteralExpression(2),
      ),
    );
    expect(parser.statements[2]).toStrictEqual(
      new Statement.VarStatement(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'c', line: 5 }),
        new Expression.LiteralExpression(3),
      ),
    );
  });
});
