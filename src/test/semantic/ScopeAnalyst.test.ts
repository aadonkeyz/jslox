import Scanner, { Token, TokenType } from '../../compiler/scanner';
import Parser, { Expression } from '../../compiler/parser';
import { ScopeAnalyst } from '../../compiler/semantic';

describe('ScopeAnalyst', () => {
  test('top-level return', () => {
    const source = `
return 1;
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();
    const scopeAnalyst = new ScopeAnalyst(parser.statements);
    scopeAnalyst.analysis();

    expect(scopeAnalyst.errors.length).toStrictEqual(1);
    expect(scopeAnalyst.errors[0]).toStrictEqual({
      line: 2,
      column: 1,
      message: "Can't return from top-level code",
    });
  });

  test('scopeRecord', () => {
    const source = `
var foo = 4;

fun fn1(a, b) {
  for (var i = 0; i < foo; i = i + 1) {
    print i;    
  }

  while (foo > 0) {
    print foo;
  }

  if (a > 0) {
    return a;
  } else {
    return b;
  }
}

var bar = fn1(1,2);
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();
    const scopeAnalyst = new ScopeAnalyst(parser.statements);
    scopeAnalyst.analysis();

    const list: { expression: Expression.BaseExpression; number: number }[] =
      [];
    scopeAnalyst.scopeRecord.forEach((value, key) => {
      list.push({
        expression: key,
        number: value,
      });
    });

    expect(list.length).toStrictEqual(7);

    expect(list[0].expression).toStrictEqual(
      new Expression.VariableExpression(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'i',
          line: 5,
          column: 19,
        }),
      ),
    );
    expect(list[0].number).toStrictEqual(0);

    expect(list[1].expression).toStrictEqual(
      new Expression.VariableExpression(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'i',
          line: 5,
          column: 32,
        }),
      ),
    );
    expect(list[1].number).toStrictEqual(0);

    expect(list[2].expression).toStrictEqual(
      new Expression.AssignmentExpression(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'i',
          line: 5,
          column: 28,
        }),
        new Expression.BinaryExpression(
          new Expression.VariableExpression(
            new Token({
              type: TokenType.IDENTIFIER,
              lexeme: 'i',
              line: 5,
              column: 32,
            }),
          ),
          new Token({ type: TokenType.PLUS, lexeme: '+', line: 5, column: 34 }),
          new Expression.LiteralExpression(1),
        ),
      ),
    );
    expect(list[2].number).toStrictEqual(0);

    expect(list[3].expression).toStrictEqual(
      new Expression.VariableExpression(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'i',
          line: 6,
          column: 11,
        }),
      ),
    );
    expect(list[3].number).toStrictEqual(1);

    expect(list[4].expression).toStrictEqual(
      new Expression.VariableExpression(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'a',
          line: 13,
          column: 7,
        }),
      ),
    );
    expect(list[4].number).toStrictEqual(0);

    expect(list[5].expression).toStrictEqual(
      new Expression.VariableExpression(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'a',
          line: 14,
          column: 12,
        }),
      ),
    );
    expect(list[5].number).toStrictEqual(1);

    expect(list[6].expression).toStrictEqual(
      new Expression.VariableExpression(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'b',
          line: 16,
          column: 12,
        }),
      ),
    );
    expect(list[6].number).toStrictEqual(1);
  });

  test('return value in init method', () => {
    const source = `
class Foo {
  init() {
    return 1;
  }
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();
    const scopeAnalyst = new ScopeAnalyst(parser.statements);
    scopeAnalyst.analysis();

    expect(scopeAnalyst.errors.length).toStrictEqual(1);
    expect(scopeAnalyst.errors[0]).toStrictEqual({
      line: 4,
      column: 5,
      message: "Can't use return a value from an initializer",
    });
  });

  test('use this outside method', () => {
    const source = `
fun foo() {
  print this;
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();
    const scopeAnalyst = new ScopeAnalyst(parser.statements);
    scopeAnalyst.analysis();

    expect(scopeAnalyst.errors.length).toStrictEqual(1);
    expect(scopeAnalyst.errors[0]).toStrictEqual({
      line: 3,
      column: 9,
      message: 'Can\'t use "this" outside of a class',
    });
  });

  test('inherite itself', () => {
    const source = `
class foo < foo {}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();
    const scopeAnalyst = new ScopeAnalyst(parser.statements);
    scopeAnalyst.analysis();

    expect(scopeAnalyst.errors.length).toStrictEqual(1);
    expect(scopeAnalyst.errors[0]).toStrictEqual({
      line: 2,
      column: 7,
      message: 'A class can\'t inherit from itself("foo")',
    });
  });

  test('misuse super', () => {
    const source = `
fun foo() {
  print super.a;
}

class bar {
  init() {
    print super.a;
  }
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();
    const scopeAnalyst = new ScopeAnalyst(parser.statements);
    scopeAnalyst.analysis();

    expect(scopeAnalyst.errors.length).toStrictEqual(2);
    expect(scopeAnalyst.errors[0]).toStrictEqual({
      line: 3,
      column: 9,
      message: 'Can\'t use "super" outside of a class',
    });
    expect(scopeAnalyst.errors[1]).toStrictEqual({
      line: 8,
      column: 11,
      message: 'Can\'t use "super" in a class with no superclass',
    });
  });
});
