import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';
import { ScopeAnalyst } from '../../../compiler/semantic';

describe('String', () => {
  test('String', () => {
    const source = `
var number = 1;
var string = String(number);
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
    expect(interpreter.environment.values.number).toStrictEqual(1);
    expect(interpreter.environment.values.string).toStrictEqual('1');
  });
});
