import { Token, TokenType } from '../../../compiler/scanner';
import { Expression } from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';

describe('variable', () => {
  test('foo', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.VariableExpression(
      new Token({
        type: TokenType.IDENTIFIER,
        lexeme: 'foo',
        line: 1,
        column: 1,
      }),
    );
    interpreter.environment.define('foo', 100);
    expect(interpreter.visitVariableExpression(expression)).toStrictEqual(100);
  });

  test('undefinedVariable', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.VariableExpression(
      new Token({
        type: TokenType.IDENTIFIER,
        lexeme: 'undefinedVariable',
        line: 1,
        column: 1,
      }),
    );
    try {
      interpreter.visitVariableExpression(expression);
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect((error as Error).message).toStrictEqual(
        'Undefined variable at "undefinedVariable" in line 1 column 1.',
      );
    }
  });
});
