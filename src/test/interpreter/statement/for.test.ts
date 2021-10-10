import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';

describe('for', () => {
  test('normal', () => {
    const source = `
var foo = 3;
for (; foo > 0; foo = foo - 1) {

}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();
    const interpreter = new Interpreter(parser.statements);
    interpreter.interpret();

    expect(
      interpreter.environment.get(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 2 }),
      ),
    ).toStrictEqual(0);
  });

  test('scope', () => {
    const source = `
var foo = 3;
var bar = 1;
for (; foo > 0; foo = foo - 1) {
  var bar = 100;
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();
    const interpreter = new Interpreter(parser.statements);
    interpreter.interpret();

    expect(
      interpreter.environment.get(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'bar', line: 3 }),
      ),
    ).toStrictEqual(1);
  });
});
