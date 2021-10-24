import { Token, TokenType } from '../../../compiler/scanner';
import { Expression } from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';

describe('unary', () => {
  test('-number', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.UnaryExpression(
      new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 1 }),
      new Expression.LiteralExpression(1),
    );
    expect(interpreter.visitUnaryExpression(expression)).toStrictEqual(-1);
  });

  test('-expression', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.UnaryExpression(
      new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 1 }),
      new Expression.GroupingExpression(
        new Expression.BinaryExpression(
          new Expression.LiteralExpression(1),
          new Token({ type: TokenType.PLUS, lexeme: '+', line: 1, column: 1 }),
          new Expression.LiteralExpression(1),
        ),
      ),
    );
    expect(interpreter.visitUnaryExpression(expression)).toStrictEqual(-2);
  });

  test('-notNumber', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.UnaryExpression(
      new Token({ type: TokenType.MINUS, lexeme: '-', line: 1, column: 1 }),
      new Expression.LiteralExpression(true),
    );

    try {
      interpreter.visitUnaryExpression(expression);
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect((error as Error).message).toStrictEqual(
        'Operand must be a number at "-" in line 1 column 1.',
      );
    }
  });

  test('!expression', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.UnaryExpression(
      new Token({ type: TokenType.BANG, lexeme: '!', line: 1, column: 1 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.BANG, lexeme: '!', line: 1, column: 1 }),
        new Expression.LiteralExpression(true),
      ),
    );
    expect(interpreter.visitUnaryExpression(expression)).toBe(true);
  });
});
