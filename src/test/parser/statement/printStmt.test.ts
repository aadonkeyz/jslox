import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression, Statement } from '../../../compiler/parser';

describe('printStmt', () => {
  test('print literal', () => {
    const source = 'print 1;';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.PrintStatement(new Expression.LiteralExpression(1)),
    );
  });

  test('print variable', () => {
    const source = 'print foo;';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.PrintStatement(
        new Expression.VariableExpression(
          new Token({
            type: TokenType.IDENTIFIER,
            lexeme: 'foo',
            line: 1,
            column: 7,
          }),
        ),
      ),
    );
  });
});
