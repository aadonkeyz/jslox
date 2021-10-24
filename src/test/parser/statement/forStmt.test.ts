import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression, Statement } from '../../../compiler/parser';

describe('forStmt', () => {
  test('normal', () => {
    const source = `
for (var foo = 3; foo > 0; foo = foo - 1) {
  print foo;
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.ForStatement({
        initializer: new Statement.VarStatement(
          new Token({
            type: TokenType.IDENTIFIER,
            lexeme: 'foo',
            line: 2,
            column: 10,
          }),
          new Expression.LiteralExpression(3),
        ),
        condition: new Expression.BinaryExpression(
          new Expression.VariableExpression(
            new Token({
              type: TokenType.IDENTIFIER,
              lexeme: 'foo',
              line: 2,
              column: 19,
            }),
          ),
          new Token({
            type: TokenType.GREATER,
            lexeme: '>',
            line: 2,
            column: 23,
          }),
          new Expression.LiteralExpression(0),
        ),
        updator: new Expression.AssignmentExpression(
          new Token({
            type: TokenType.IDENTIFIER,
            lexeme: 'foo',
            line: 2,
            column: 28,
          }),
          new Expression.BinaryExpression(
            new Expression.VariableExpression(
              new Token({
                type: TokenType.IDENTIFIER,
                lexeme: 'foo',
                line: 2,
                column: 34,
              }),
            ),
            new Token({
              type: TokenType.MINUS,
              lexeme: '-',
              line: 2,
              column: 38,
            }),
            new Expression.LiteralExpression(1),
          ),
        ),
        body: new Statement.BlockStatement([
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
      }),
    );
  });
});
