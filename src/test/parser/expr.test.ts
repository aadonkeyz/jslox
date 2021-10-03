import Scanner, { Token, TokenType } from '../../compiler/scanner';
import Parser, { Binary, Grouping, Unary, Literal } from '../../compiler/parser';

describe('primary', () => {
  test('number', () => {
    const source = '1';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    expect(parser.ast).toStrictEqual(
      new Literal(1)
    );
  });

  test('string', () => {
    const source = '"string"';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    expect(parser.ast).toStrictEqual(
      new Literal('string')
    );
  });

  test('true', () => {
    const source = 'true';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    expect(parser.ast).toStrictEqual(
      new Literal(true)
    );
  });

  test('false', () => {
    const source = 'false';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    expect(parser.ast).toStrictEqual(
      new Literal(false)
    );
  });

  test('nil', () => {
    const source = 'nil';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    expect(parser.ast).toStrictEqual(
      new Literal(null)
    );
  });

  test('grouping', () => {
    const source = '(1)';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    expect(parser.ast).toStrictEqual(
      new Grouping(new Literal(1))
    );
  });
})

describe('unary', () => {
  test('!primary', () => {
    const source = '!true';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    expect(parser.ast).toStrictEqual(
      new Unary(
        new Token({ type: TokenType.BANG, lexeme: '!', line: 1 }),
        new Literal(true),
      )
    );
  });

  test('-primary', () => {
    const source = '-1';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    expect(parser.ast).toStrictEqual(
      new Unary(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Literal(1),
      )
    );
  });
})

describe('factor', () => {
  test('unary/unary', () => {
    const source = '-1/!true';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    expect(parser.ast).toStrictEqual(
      new Binary(
        new Unary(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Literal(1),
        ),
        new Token({ type: TokenType.SLASH, lexeme: '/', line: 1 }),
        new Unary(
          new Token({ type: TokenType.BANG, lexeme: '!', line: 1 }),
          new Literal(true),
        ),
      )
    );
  });

  test('unary*unary', () => {
    const source = '1*-1';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    expect(parser.ast).toStrictEqual(
      new Binary(
        new Literal(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Unary(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Literal(1),
        ),
      )
    );
  });
})

describe('term', () => {
  test('factor+factor', () => {
    const source = '1 * -1 + -1';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    expect(parser.ast).toStrictEqual(
      new Binary(
        new Binary(
          new Literal(1),
          new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
          new Unary(
            new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
            new Literal(1),
          ),
        ),
        new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
        new Unary(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Literal(1),
        ),
      )
    );
  });

  test('factor-factor', () => {
    const source = '1 * -1 - -1';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    expect(parser.ast).toStrictEqual(
      new Binary(
        new Binary(
          new Literal(1),
          new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
          new Unary(
            new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
            new Literal(1),
          ),
        ),
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Unary(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Literal(1),
        ),
      )
    );
  });
})

describe('comparison', () => {
  test('term>term', () => {
    const source = '1 * -1 + -1 > 1 * -1 + -1';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    const term = new Binary(
      new Binary(
        new Literal(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Unary(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Literal(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
      new Unary(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Literal(1),
      ),
    )
    expect(parser.ast).toStrictEqual(
      new Binary(
        term,
        new Token({ type: TokenType.GREATER, lexeme: '>', line: 1 }),
        term,
      )
    );
  });

  test('term>=term', () => {
    const source = '1 * -1 + -1 >= 1 * -1 + -1';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    const term = new Binary(
      new Binary(
        new Literal(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Unary(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Literal(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
      new Unary(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Literal(1),
      ),
    )
    expect(parser.ast).toStrictEqual(
      new Binary(
        term,
        new Token({ type: TokenType.GREATER_EQUAL, lexeme: '>=', line: 1 }),
        term,
      )
    );
  });

  test('term<term', () => {
    const source = '1 * -1 + -1 < 1 * -1 + -1';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    const term = new Binary(
      new Binary(
        new Literal(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Unary(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Literal(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
      new Unary(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Literal(1),
      ),
    )
    expect(parser.ast).toStrictEqual(
      new Binary(
        term,
        new Token({ type: TokenType.LESS, lexeme: '<', line: 1 }),
        term,
      )
    );
  });

  test('term<=term', () => {
    const source = '1 * -1 + -1 <= 1 * -1 + -1';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    const term = new Binary(
      new Binary(
        new Literal(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Unary(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Literal(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
      new Unary(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Literal(1),
      ),
    )
    expect(parser.ast).toStrictEqual(
      new Binary(
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
    const parser = new Parser(scanner.tokens);

    const term = new Binary(
      new Binary(
        new Literal(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Unary(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Literal(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
      new Unary(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Literal(1),
      ),
    )
    const comparison = new Binary(
      term,
      new Token({ type: TokenType.GREATER, lexeme: '>', line: 1 }),
      term,
    )
    expect(parser.ast).toStrictEqual(
      new Binary(
        comparison,
        new Token({ type: TokenType.EQUAL_EQUAL, lexeme: '==', line: 1 }),
        comparison,
      )
    );
  });

  test('comparison != comparison', () => {
    const source = '1 * -1 + -1 > 1 * -1 + -1 != 1 * -1 + -1 > 1 * -1 + -1';
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.tokens);

    const term = new Binary(
      new Binary(
        new Literal(1),
        new Token({ type: TokenType.STAR, lexeme: '*', line: 1 }),
        new Unary(
          new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
          new Literal(1),
        ),
      ),
      new Token({ type: TokenType.PLUS, lexeme: '+', line: 1 }),
      new Unary(
        new Token({ type: TokenType.MINUS, lexeme: '-', line: 1 }),
        new Literal(1),
      ),
    )
    const comparison = new Binary(
      term,
      new Token({ type: TokenType.GREATER, lexeme: '>', line: 1 }),
      term,
    )
    expect(parser.ast).toStrictEqual(
      new Binary(
        comparison,
        new Token({ type: TokenType.BANG_EQUAL, lexeme: '!=', line: 1 }),
        comparison,
      )
    );
  });
})