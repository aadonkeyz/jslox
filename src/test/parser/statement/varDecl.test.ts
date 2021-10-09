import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression, Statement } from '../../../compiler/parser';

describe('varDecl', () => {
  test('only declare', () => {
    const source = `var foo;`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.VarStatement(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 1 }),
      ),
    );
  });

  test('declare with initial value', () => {
    const source = `var foo = 1;`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.VarStatement(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 1 }),
        new Expression.LiteralExpression(1),
      ),
    );
  });
});
