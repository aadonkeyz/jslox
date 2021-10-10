import { Token, TokenType } from '../../../compiler/scanner';
import { Expression } from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';

describe('assignment', () => {
  test('foo = 1', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.AssignmentExpression(
      new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 1 }),
      new Expression.LiteralExpression(100),
    );
    interpreter.environment.define('foo', 100);
    expect(interpreter.visitAssignmentExpression(expression)).toStrictEqual(
      100,
    );
  });
});
