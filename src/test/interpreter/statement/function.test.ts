import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';
import { ScopeAnalyst } from '../../../compiler/semantic';

describe('function', () => {
  test('no return', () => {
    const source = `
fun test() {}
var a = test();
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
          lexeme: 'a',
          line: 3,
          column: 1,
        }),
      ),
    ).toStrictEqual(null);
  });

  test('return value', () => {
    const source = `
var a = 1;
fun test() {
  return 1;
}
var b = test();
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
          lexeme: 'b',
          line: 6,
          column: 1,
        }),
      ),
    ).toStrictEqual(1);
  });

  test('closure', () => {
    const source = `
fun makeCounter() {
  var i = 0;
  fun count() {
    i = i + 1;
    return i;
  }

  return count;
}

var counter = makeCounter();
var a = counter();
var b = counter();
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
          lexeme: 'a',
          line: 13,
          column: 1,
        }),
      ),
    ).toStrictEqual(1);

    expect(
      interpreter.environment.get(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'b',
          line: 14,
          column: 1,
        }),
      ),
    ).toStrictEqual(2);
  });

  test('fibonacci', () => {
    const source = `
fun fibonacci(n) {
  if (n == 0) return 0;
  else if (n==1) return 1;
  else return fibonacci(n-1) + fibonacci(n-2);
}
var a = fibonacci(10);
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
          lexeme: 'a',
          line: 7,
          column: 1,
        }),
      ),
    ).toStrictEqual(55);
  });

  test('static lexical', () => {
    const source = `
var a = "global";
var b;
var c;
{
  fun showA() {
    return a;
  }

  b = showA();
  var a = "block";
  c = showA();
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
          lexeme: 'b',
          line: 3,
          column: 1,
        }),
      ),
    ).toStrictEqual('global');

    expect(
      interpreter.environment.get(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'c',
          line: 4,
          column: 1,
        }),
      ),
    ).toStrictEqual('global');
  });
});
