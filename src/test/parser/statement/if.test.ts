import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression, Statement } from '../../../compiler/parser';

describe('if', () => {
  test('no else', () => {
    const source = `
if (true) {
  var foo = 1;
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.IfStatement(
        new Expression.LiteralExpression(true),
        new Statement.BlockStatement([
          new Statement.VarStatement(
            new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 3 }),
            new Expression.LiteralExpression(1),
          ),
        ]),
      ),
    );
  });

  test('if else', () => {
    const source = `
if (true) {
  var foo = 1;
} else {
  var foo = 2;
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.IfStatement(
        new Expression.LiteralExpression(true),
        new Statement.BlockStatement([
          new Statement.VarStatement(
            new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 3 }),
            new Expression.LiteralExpression(1),
          ),
        ]),
        new Statement.BlockStatement([
          new Statement.VarStatement(
            new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 5 }),
            new Expression.LiteralExpression(2),
          ),
        ]),
      ),
    );
  });
});
