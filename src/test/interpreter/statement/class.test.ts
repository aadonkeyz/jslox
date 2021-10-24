import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';
import { ScopeAnalyst } from '../../../compiler/semantic';

describe('class', () => {
  test('class declaration, get, set, this', () => {
    const source = `
class Foo {
  init(name) {
    this.name = name;
  }

  sayName() {
    return this.name;
  }

  generateSayName() {
    return this.sayName;
  }
}

var a = Foo('a');
var b = Foo('b');

b.sayName = a.generateSayName();

var name = b.sayName();

b.a = a;

var nameAgain = b.a.sayName();
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
          lexeme: 'name',
          line: 21,
          column: 1,
        }),
      ),
    ).toStrictEqual('a');
    expect(
      interpreter.environment.get(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'nameAgain',
          line: 23,
          column: 1,
        }),
      ),
    ).toStrictEqual('a');
  });

  test('superclass', () => {
    const source = `
class Foo {
  sayHi() {
    return this.hi;
  }
}
class Doughnut < Foo {
  init() {
    this.name = 'Doughnut';
  }
  sayName() {
    return this.name;
  }
  sayHello() {
    return this.hello;
  }
}

class BostonCream < Doughnut {
  init() {
    this.name = 'BostonCream';
    this.hello = 'hello';
    this.hi = 'hi';
  }

  sayName() {
    return super.sayName();
  }
}

var name = BostonCream().sayName();
var hi = BostonCream().sayHi();
var hello = BostonCream().sayHello();
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
          lexeme: 'name',
          line: 31,
          column: 1,
        }),
      ),
    ).toStrictEqual('BostonCream');
    expect(
      interpreter.environment.get(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'hi',
          line: 32,
          column: 1,
        }),
      ),
    ).toStrictEqual('hi');
    expect(
      interpreter.environment.get(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'hello',
          line: 33,
          column: 1,
        }),
      ),
    ).toStrictEqual('hello');
  });
});
