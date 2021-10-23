import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression } from '../../../compiler/parser';

describe('primary', () => {
  test('number', () => {
    const source = '1';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(new Expression.LiteralExpression(1));
  });

  test('string', () => {
    const source = '"string"';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(new Expression.LiteralExpression('string'));
  });

  test('true', () => {
    const source = 'true';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(new Expression.LiteralExpression(true));
  });

  test('false', () => {
    const source = 'false';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(new Expression.LiteralExpression(false));
  });

  test('nil', () => {
    const source = 'nil';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(new Expression.LiteralExpression(null));
  });

  test('this', () => {
    const source = 'this';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.ThisExpression(
        new Token({ type: TokenType.THIS, lexeme: 'this', line: 1 }),
      ),
    );
  });

  test('super', () => {
    const source = 'super.foo';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.SuperExpression(
        new Token({ type: TokenType.SUPER, lexeme: 'super', line: 1 }),
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 1 }),
      ),
    );
  });

  test('identifier', () => {
    const source = 'foo';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.VariableExpression(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 1 }),
      ),
    );
  });

  test('grouping', () => {
    const source = '(1 + 2)';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.GroupingExpression(
        new Expression.BinaryExpression(
          new Expression.LiteralExpression(1),
          new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
          new Expression.LiteralExpression(2),
        ),
      ),
    );
  });
});
