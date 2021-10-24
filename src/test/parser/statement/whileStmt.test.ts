import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression, Statement } from '../../../compiler/parser';

describe('whileStmt', () => {
  test('nothing to say', () => {
    const source = `
while (foo) {
  print foo;
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.WhileStatement(
        new Expression.VariableExpression(
          new Token({
            type: TokenType.IDENTIFIER,
            lexeme: 'foo',
            line: 2,
            column: 8,
          }),
        ),
        new Statement.BlockStatement([
          new Statement.PrintStatement(
            new Expression.VariableExpression(
              new Token({
                type: TokenType.IDENTIFIER,
                lexeme: 'foo',
                line: 3,
                column: 9,
              }),
            ),
          ),
        ]),
      ),
    );
  });
});
