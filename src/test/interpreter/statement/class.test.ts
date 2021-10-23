import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';
import { ScopeAnalyst } from '../../../compiler/semantic';

describe('class', () => {
  test('all class features', () => {
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
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'name', line: 21 }),
      ),
    ).toStrictEqual('a');
  });
});
