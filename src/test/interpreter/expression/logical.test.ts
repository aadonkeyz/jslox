import { Token, TokenType } from '../../../compiler/scanner';
import { Expression } from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';

describe('logical', () => {
  test('and: both truthy', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.LogicalExpression(
      new Expression.LiteralExpression(1),
      new Token({ type: TokenType.AND, lexeme: 'and', line: 1, column: 1 }),
      new Expression.LiteralExpression(2),
    );
    expect(interpreter.visitLogicalExpression(expression)).toStrictEqual(2);
  });

  test('and: left falsy', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.LogicalExpression(
      new Expression.LiteralExpression(0),
      new Token({ type: TokenType.AND, lexeme: 'and', line: 1, column: 1 }),
      new Expression.LiteralExpression(2),
    );
    expect(interpreter.visitLogicalExpression(expression)).toStrictEqual(0);
  });

  test('or: both truthy', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.LogicalExpression(
      new Expression.LiteralExpression(1),
      new Token({ type: TokenType.OR, lexeme: 'or', line: 1, column: 1 }),
      new Expression.LiteralExpression(2),
    );
    expect(interpreter.visitLogicalExpression(expression)).toStrictEqual(1);
  });

  test('or: left falsy', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.LogicalExpression(
      new Expression.LiteralExpression(0),
      new Token({ type: TokenType.OR, lexeme: 'or', line: 1, column: 1 }),
      new Expression.LiteralExpression(2),
    );
    expect(interpreter.visitLogicalExpression(expression)).toStrictEqual(2);
  });
});
