import { Token, TokenType } from '../../../compiler/scanner';
import { Expression, Statement } from '../../../compiler/parser';
import Interpreter from '../../../compiler/interpreter';
import LoxFunction from '../../../compiler/interpreter/LoxFunction';

describe('call', () => {
  test('no args', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.CallExpression(
      new Expression.VariableExpression(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 1 }),
      ),
      [],
      new Token({ type: TokenType.RIGHT_PARENTHESE, lexeme: ')', line: 1 }),
    );
    const callee = new LoxFunction(
      new Statement.FunctionStatement(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 1 }),
        [],
        new Statement.BlockStatement([
          new Statement.ReturnStatement(
            new Token({ type: TokenType.RETURN, lexeme: 'return', line: 1 }),
            new Expression.LiteralExpression(1),
          ),
        ]),
      ),
      interpreter.environment,
    );
    interpreter.environment.define('foo', callee);
    expect(interpreter.visitCallExpression(expression)).toStrictEqual(1);
  });

  test('with args', () => {
    const argBarNode = new Expression.VariableExpression(
      new Token({ type: TokenType.IDENTIFIER, lexeme: 'bar', line: 1 }),
    );
    const interpreter = new Interpreter([], new Map([[argBarNode, 0]]));
    const expression = new Expression.CallExpression(
      new Expression.VariableExpression(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 1 }),
      ),
      [new Expression.LiteralExpression(100)],
      new Token({ type: TokenType.RIGHT_PARENTHESE, lexeme: ')', line: 1 }),
    );
    const functionNode = new Statement.FunctionStatement(
      new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 1 }),
      [new Token({ type: TokenType.IDENTIFIER, lexeme: 'bar', line: 1 })],
      new Statement.BlockStatement([
        new Statement.ReturnStatement(
          new Token({ type: TokenType.RETURN, lexeme: 'return', line: 1 }),
          argBarNode,
        ),
      ]),
    );
    const callee = new LoxFunction(functionNode, interpreter.environment);
    interpreter.environment.define('foo', callee);

    interpreter.visitFunctionStatement(functionNode);
    expect(interpreter.visitCallExpression(expression)).toStrictEqual(100);
  });

  test('args number not right', () => {
    const interpreter = new Interpreter([]);
    const expression = new Expression.CallExpression(
      new Expression.VariableExpression(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 1 }),
      ),
      [new Expression.LiteralExpression(1)],
      new Token({ type: TokenType.RIGHT_PARENTHESE, lexeme: ')', line: 1 }),
    );
    const callee = new LoxFunction(
      new Statement.FunctionStatement(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 1 }),
        [],
        new Statement.BlockStatement([
          new Statement.ReturnStatement(
            new Token({ type: TokenType.RETURN, lexeme: 'return', line: 1 }),
            new Expression.LiteralExpression(1),
          ),
        ]),
      ),
      interpreter.environment,
    );
    interpreter.environment.define('foo', callee);
    try {
      interpreter.visitCallExpression(expression);
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect((error as Error).message).toBe(
        'Expect 0 arguments but got 1. at ")" in line 1.',
      );
    }
  });
});
