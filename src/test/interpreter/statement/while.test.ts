import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';
import { ScopeAnalyst } from '../../../compiler/semantic';

describe('while', () => {
  test('avoid infinite loop', () => {
    const source = `
var foo = 3;
while (foo) {
  foo = foo - 1;
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
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'foo',
          line: 2,
          column: 1,
        }),
      ),
    ).toStrictEqual(0);
  });

  test('scope', () => {
    const source = `
var foo = 3;
var bar = 1;
while (foo) {
  foo = foo - 1;
  var bar = 100;
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
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'bar',
          line: 3,
          column: 1,
        }),
      ),
    ).toStrictEqual(1);
  });
});
