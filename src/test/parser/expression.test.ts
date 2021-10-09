import Scanner, { Token, TokenType } from '../../compiler/scanner';
import Parser, { Expression } from '../../compiler/parser';

describe('primary', () => {
  test('number', () => {
    const source = '1';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.LiteralExpression(1)
    );
  });

  test('string', () => {
    const source = '"string"';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.LiteralExpression('string')
    );
  });

  test('true', () => {
    const source = 'true';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.LiteralExpression(true)
    );
  });

  test('false', () => {
    const source = 'false';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.LiteralExpression(false)
    );
  });

  test('nil', () => {
    const source = 'nil';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.LiteralExpression(null)
    );
  });

  test('grouping', () => {
    const source = '(1)';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.GroupingExpression(new Expression.LiteralExpression(1))
    );
  });

  test('identifier', () => {
    const source = 'foo';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.VariableExpression(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 1 })
      )
    );
  });
})

describe('unary', () => {
  test('!primary', () => {
    const source = '!true';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.UnaryExpression(
        new Token({ type: TokenType.BANG, lexeme: '!', line: 1 }),
        new Expression.LiteralExpression(true),
      )
    );
  });

  test('-primary', () => {
    const source = '-1';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Expression.LiteralExpression(1),
      )
    );
  });
})

describe('factor', () => {
  test('unary/unary', () => {
    const source = '-1/!true';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Expression.LiteralExpression(1),
        ),
        new Token({ type: TokenType.SLASH, lexeme: '/', line: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.BANG, lexeme: '!', line: 1 }),
          new Expression.LiteralExpression(true),
        ),
      )
    );
  });

  test('unary*unary', () => {
    const source = '1*-1';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Expression.LiteralExpression(1),
        ),
      )
    );
  });
})

describe('term', () => {
  test('factor+factor', () => {
    const source = '1 * -1 + -1';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        new Expression.BinaryExpression(
          new Expression.LiteralExpression(1),
          new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
          new Expression.UnaryExpression(
            new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
            new Expression.LiteralExpression(1),
          ),
        ),
        new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Expression.LiteralExpression(1),
        ),
      )
    );
  });

  test('factor-factor', () => {
    const source = '1 * -1 - -1';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        new Expression.BinaryExpression(
          new Expression.LiteralExpression(1),
          new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
          new Expression.UnaryExpression(
            new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
            new Expression.LiteralExpression(1),
          ),
        ),
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Expression.LiteralExpression(1),
        ),
      )
    );
  });
})

describe('comparison', () => {
  test('term>term', () => {
    const source = '1 * -1 + -1 > 1 * -1 + -1';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    const term = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Expression.LiteralExpression(1),
      ),
    )
    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        term,
        new Token({ type: TokenType.GREATER, lexeme: '>', line: 1 }),
        term,
      )
    );
  });

  test('term>=term', () => {
    const source = '1 * -1 + -1 >= 1 * -1 + -1';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    const term = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Expression.LiteralExpression(1),
      ),
    )
    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        term,
        new Token({ type: TokenType.GREATER_EQUAL, lexeme: '>=', line: 1 }),
        term,
      )
    );
  });

  test('term<term', () => {
    const source = '1 * -1 + -1 < 1 * -1 + -1';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    const term = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Expression.LiteralExpression(1),
      ),
    )
    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        term,
        new Token({ type: TokenType.LESS, lexeme: '<', line: 1 }),
        term,
      )
    );
  });

  test('term<=term', () => {
    const source = '1 * -1 + -1 <= 1 * -1 + -1';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    const term = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Expression.LiteralExpression(1),
      ),
    )
    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        term,
        new Token({ type: TokenType.LESS_EQUAL, lexeme: '<=', line: 1 }),
        term,
      )
    );
  });
})

describe('equality', () => {
  test('comparison == comparison', () => {
    const source = '1 * -1 + -1 > 1 * -1 + -1 == 1 * -1 + -1 > 1 * -1 + -1';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    const term = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Expression.LiteralExpression(1),
      ),
    )
    const comparison = new Expression.BinaryExpression(
      term,
      new Token({ type: TokenType.GREATER, lexeme: '>', line: 1 }),
      term,
    )
    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        comparison,
        new Token({ type: TokenType.EQUAL_EQUAL, lexeme: '==', line: 1 }),
        comparison,
      )
    );
  });

  test('comparison != comparison', () => {
    const source = '1 * -1 + -1 > 1 * -1 + -1 != 1 * -1 + -1 > 1 * -1 + -1';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    const term = new Expression.BinaryExpression(
      new Expression.BinaryExpression(
        new Expression.LiteralExpression(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Expression.UnaryExpression(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Expression.LiteralExpression(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
      new Expression.UnaryExpression(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Expression.LiteralExpression(1),
      ),
    )
    const comparison = new Expression.BinaryExpression(
      term,
      new Token({ type: TokenType.GREATER, lexeme: '>', line: 1 }),
      term,
    )
    expect(root).toStrictEqual(
      new Expression.BinaryExpression(
        comparison,
        new Token({ type: TokenType.BANG_EQUAL, lexeme: '!=', line: 1 }),
        comparison,
      )
    );
  });
})

describe('assigment', () => {
  test('foo = 1', () => {
    const source = 'foo = 1';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.AssignExpression(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 1 }),
        new Expression.LiteralExpression(1),
      )
    )
  })

  test('foo = bar', () => {
    const source = 'foo = bar';
    const scanner = new Scanner(source);
    scanner.scan()
    const parser = new Parser(scanner.tokens);
    const root = parser.expression();

    expect(root).toStrictEqual(
      new Expression.AssignExpression(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'foo', line: 1 }),
        new Expression.VariableExpression(
          new Token({ type: TokenType.IDENTIFIER, lexeme: 'bar', line: 1 })
        )
      )
    )
  })
})