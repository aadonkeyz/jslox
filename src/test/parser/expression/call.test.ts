import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression } from '../../../compiler/parser';

describe('call', () => {
  test('no args', () => {
    const source = `
test();
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.CallExpression(
        new Expression.VariableExpression(
          new Token({ type: TokenType.IDENTIFIER, lexeme: 'test', line: 2 }),
        ),
        [],
        new Token({ type: TokenType.RIGHT_PARENTHESE, lexeme: ')', line: 2 }),
      ),
    );
  });

  test('with args', () => {
    const source = `
test(a);
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.CallExpression(
        new Expression.VariableExpression(
          new Token({ type: TokenType.IDENTIFIER, lexeme: 'test', line: 2 }),
        ),
        [
          new Expression.VariableExpression(
            new Token({ type: TokenType.IDENTIFIER, lexeme: 'a', line: 2 }),
          ),
        ],
        new Token({ type: TokenType.RIGHT_PARENTHESE, lexeme: ')', line: 2 }),
      ),
    );
  });

  test('property access', () => {
    const source = `
test(a).b().c;
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.GetExpression(
        new Expression.CallExpression(
          new Expression.GetExpression(
            new Expression.CallExpression(
              new Expression.VariableExpression(
                new Token({
                  type: TokenType.IDENTIFIER,
                  lexeme: 'test',
                  line: 2,
                }),
              ),
              [
                new Expression.VariableExpression(
                  new Token({
                    type: TokenType.IDENTIFIER,
                    lexeme: 'a',
                    line: 2,
                  }),
                ),
              ],
              new Token({
                type: TokenType.RIGHT_PARENTHESE,
                lexeme: ')',
                line: 2,
              }),
            ),
            new Token({ type: TokenType.IDENTIFIER, lexeme: 'b', line: 2 }),
          ),
          [],
          new Token({ type: TokenType.RIGHT_PARENTHESE, lexeme: ')', line: 2 }),
        ),
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'c', line: 2 }),
      ),
    );
  });
});
