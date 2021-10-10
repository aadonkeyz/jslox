import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';

describe('print', () => {
  test('print binary expression', () => {
    const source = `print 1 + 2 * 3 / 4 - 5;`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();
    const interpreter = new Interpreter(parser.statements);
    interpreter.interpret();
    expect('should console -2.5').toStrictEqual('should console -2.5');
  });
});
