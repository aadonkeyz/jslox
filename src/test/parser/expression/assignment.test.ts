import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression } from '../../../compiler/parser';

describe('assigment', () => {
  test('foo = 1', () => {
    const source = 'foo = 1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.AssignmentExpression(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'foo',
          line: 1,
          column: 1,
        }),
        new Expression.LiteralExpression(1),
      ),
    );
  });

  test('foo = bar', () => {
    const source = 'foo = bar';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.AssignmentExpression(
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'foo',
          line: 1,
          column: 1,
        }),
        new Expression.VariableExpression(
          new Token({
            type: TokenType.IDENTIFIER,
            lexeme: 'bar',
            line: 1,
            column: 7,
          }),
        ),
      ),
    );
  });

  test('instance property assignment', () => {
    const source = 'foo().bar = 1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.SetExpression(
        new Expression.CallExpression(
          new Expression.VariableExpression(
            new Token({
              type: TokenType.IDENTIFIER,
              lexeme: 'foo',
              line: 1,
              column: 1,
            }),
          ),
          [],
          new Token({
            type: TokenType.RIGHT_PARENTHESE,
            lexeme: ')',
            line: 1,
            column: 5,
          }),
        ),
        new Token({
          type: TokenType.IDENTIFIER,
          lexeme: 'bar',
          line: 1,
          column: 7,
        }),
        new Expression.LiteralExpression(1),
      ),
    );
  });
});
