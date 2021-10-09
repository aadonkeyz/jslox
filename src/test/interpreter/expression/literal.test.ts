import { Expression } from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';

describe('literal', () => {
  test('number', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.LiteralExpression(1);
    expect(interpreter.visitLiteralExpression(expression)).toStrictEqual(1);
  });

  test('string', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.LiteralExpression('string');
    expect(interpreter.visitLiteralExpression(expression)).toStrictEqual(
      'string',
    );
  });

  test('true', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.LiteralExpression(true);
    expect(interpreter.visitLiteralExpression(expression)).toStrictEqual(true);
  });

  test('false', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.LiteralExpression(false);
    expect(interpreter.visitLiteralExpression(expression)).toStrictEqual(false);
  });

  test('nil', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.LiteralExpression(null);
    expect(interpreter.visitLiteralExpression(expression)).toStrictEqual(null);
  });
});
