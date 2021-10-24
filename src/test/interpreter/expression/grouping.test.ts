import { Token, TokenType } from '../../../compiler/scanner';
import { Expression } from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';

describe('grouping', () => {
  test('(expression)', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.GroupingExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(100),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1, column: 1 }),
        new Expression.LiteralExpression(100),
      ),
    );
    expect(interpreter.visitGroupingExpression(expression)).toStrictEqual(
      10000,
    );
  });
});
