import { Token, TokenType } from '../../../compiler/scanner';
import { Expression } from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';

describe('binary', () => {
  test('100 * 100', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.BinaryExpression(
      new Expression.LiteralExpression(100),
      new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
      new Expression.LiteralExpression(100),
    );
    expect(interpreter.visitBinaryExpression(expression)).toStrictEqual(10000);
  });
});
