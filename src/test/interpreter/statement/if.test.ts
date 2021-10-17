import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';
import ScopeAnalyst from '../../../compiler/semantic/ScopeAnalyst';

describe('if', () => {
  test('if else', () => {
    const source = `
var foo = true;
var bar = 1;
if (foo) {
  bar = 2;
} else {
  bar = 3;
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();
    const scopeAnalyst = new ScopeAnalyst(parser.statements);
    scopeAnalyst.analysis();
    const interpreter = new Interpreter(
      parser.statements,
      scopeAnalyst.scopeRecord,
    );
    interpreter.interpret();

    expect(
      interpreter.environment.get(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'bar', line: 3 }),
      ),
    ).toStrictEqual(2);
  });
});
