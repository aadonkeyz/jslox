import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression, Statement } from '../../../compiler/parser';

describe('function', () => {
  test('no args', () => {
    const source = `
fun test() {
  print 1;
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.FunctionStatement(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'test', line: 2 }),
        [],
        new Statement.BlockStatement([
          new Statement.PrintStatement(new Expression.LiteralExpression(1)),
        ]),
      ),
    );
  });

  test('with args', () => {
    const source = `
fun test(a) {
  print a;
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.FunctionStatement(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'test', line: 2 }),
        [new Token({ type: TokenType.IDENTIFIER, lexeme: 'a', line: 2 })],
        new Statement.BlockStatement([
          new Statement.PrintStatement(
            new Expression.VariableExpression(
              new Token({ type: TokenType.IDENTIFIER, lexeme: 'a', line: 3 }),
            ),
          ),
        ]),
      ),
    );
  });
});
