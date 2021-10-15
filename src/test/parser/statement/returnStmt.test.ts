import Scanner, { Token, TokenType } from '../../../compiler/scanner';
import Parser, { Expression, Statement } from '../../../compiler/parser';

describe('returnStmt', () => {
  test('return nothing', () => {
    const source = 'return;';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.ReturnStatement(
        new Token({ type: TokenType.RETURN, lexeme: 'return', line: 1 }),
        new Expression.LiteralExpression(null),
      ),
    );
  });

  test('return value', () => {
    const source = 'return 1;';
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();

    expect(parser.statements[0]).toStrictEqual(
      new Statement.ReturnStatement(
        new Token({ type: TokenType.RETURN, lexeme: 'return', line: 1 }),
        new Expression.LiteralExpression(1),
      ),
    );
  });
});
