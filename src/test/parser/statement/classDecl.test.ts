import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression, Statement } from '../../../compiler/parser';

describe('classDecl', () => {
  test('normal', () => {
    const source = `
class Test {
  foo() {}
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.ClassStatement(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'Test',
          line: 2,
          column: 7,
        }),
        null,
        [
          new Statement.FunctionStatement(
            new Token({
              type: TokenType.IDENTIFIER,
              lexeme: 'foo',
              line: 3,
              column: 3,
            }),
            [],
            new Statement.BlockStatement([]),
          ),
        ],
      ),
    );
  });

  test('superclass', () => {
    const source = `
class Test {
  foo() {}
}

class Demo < Test {
  foo() {}
}
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.ClassStatement(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'Test',
          line: 2,
          column: 7,
        }),
        null,
        [
          new Statement.FunctionStatement(
            new Token({
              type: TokenType.IDENTIFIER,
              lexeme: 'foo',
              line: 3,
              column: 3,
            }),
            [],
            new Statement.BlockStatement([]),
          ),
        ],
      ),
    );

    expect(parser.statements[1]).toStrictEqual(
      new Statement.ClassStatement(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'Demo',
          line: 6,
          column: 7,
        }),
        new Expression.VariableExpression(
          new Token({
            type: TokenType.IDENTIFIER,
            lexeme: 'Test',
            line: 6,
            column: 14,
          }),
        ),
        [
          new Statement.FunctionStatement(
            new Token({
              type: TokenType.IDENTIFIER,
              lexeme: 'foo',
              line: 7,
              column: 3,
            }),
            [],
            new Statement.BlockStatement([]),
          ),
        ],
      ),
    );
  });
});
