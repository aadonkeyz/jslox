import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';
import { ScopeAnalyst } from '../../../compiler/semantic';

describe('date', () => {
  test('Date', () => {
    const source = `
var birth = Date('1995-02-17');
var year = birth.getFullYear();
var month = birth.getMonth();
var date = birth.getDate();
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
    expect(interpreter.environment.values.year).toStrictEqual(1995);
    expect(interpreter.environment.values.month).toStrictEqual(2);
    expect(interpreter.environment.values.date).toStrictEqual(17);
  });
});
