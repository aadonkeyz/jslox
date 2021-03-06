import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';
import { ScopeAnalyst } from '../../../compiler/semantic';

describe('expression', () => {
  test('assignment expression', () => {
    const source = `
var foo = 1;
foo = 2;
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
    ).toStrictEqual(2);
  });

  test('variable expression', () => {
    const source = `
var foo = 1;
foo = 2;
var bar;
bar = foo;
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
          line: 4,
          column: 1,
        }),
      ),
    ).toStrictEqual(2);
  });
});
