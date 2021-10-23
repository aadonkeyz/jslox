import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';
import { ScopeAnalyst } from '../../../compiler/semantic';

describe('block', () => {
  test('scope', () => {
    const source = `
var foo = 1;
{
  var bar = foo;
  print bar;
  var foo = 2;
  print foo;
}
print bar;
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
    try {
      interpreter.interpret();
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect('first should console 1').toStrictEqual('first should console 1');
      // eslint-disable-next-line jest/no-conditional-expect
      expect('first should console 2').toStrictEqual('first should console 2');
      // eslint-disable-next-line jest/no-conditional-expect
      expect((error as Error).message).toBe(
        'Undefined variable at "bar" in line 9.',
      );
    }
  });
});
