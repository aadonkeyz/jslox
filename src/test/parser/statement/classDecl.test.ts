import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Statement } from '../../../compiler/parser';

describe('classDecl', () => {
  test('normal', () => {
    const source = `
class Test {
  foo() {}
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.ClassStatement(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'Test', line: 2 }),
        [
          new Statement.FunctionStatement(
            new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 3 }),
            [],
            new Statement.BlockStatement([]),
          ),
        ],
      ),
    );
  });
});
