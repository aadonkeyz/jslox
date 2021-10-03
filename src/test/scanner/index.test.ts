import Scanner, { TokenType } from '../../compiler/scanner';

describe('scanner', () => {
  test('keywords', () => {
    const keywords = [
      TokenType.AND,
      TokenType.CLASS,
      TokenType.ELSE,
      TokenType.FALSE,
      TokenType.FUN,
      TokenType.FOR,
      TokenType.IF,
      TokenType.NIL,
      TokenType.OR,
      TokenType.PRINT,
      TokenType.RETURN,
      TokenType.SUPER,
      TokenType.THIS,
      TokenType.TRUE,
      TokenType.VAR,
      TokenType.WHILE,
    ];
    const source = keywords.join(' ');
    const scanner = new Scanner(source);

    scanner.tokens.slice(0, keywords.length).forEach((token) => {
      expect(token.type).toBe(token.lexeme);
    });
    expect(scanner.tokens[keywords.length].type).toBe(TokenType.EOF);
    expect(scanner.tokens[keywords.length].lexeme).toBe('');
  })

  test('symbols', () => {
    const symbols = [
      TokenType.LEFT_PAREN,
      TokenType.RIGHT_PAREN,
      TokenType.LEFT_BRACE,
      TokenType.RIGHT_BRACE,
      TokenType.COMMA,
      TokenType.DOT,
      TokenType.MINUS,
      TokenType.PLUS,
      TokenType.SEMICOLON,
      TokenType.SLASH,
      TokenType.STAR,
      TokenType.BANG,
      TokenType.BANG_EQUAL,
      TokenType.EQUAL,
      TokenType.EQUAL_EQUAL,
      TokenType.GREATER,
      TokenType.GREATER_EQUAL,
      TokenType.LESS,
      TokenType.LESS_EQUAL,
    ]
    const source = symbols.join(' ');
    const scanner = new Scanner(source);

    scanner.tokens.slice(0, symbols.length).forEach((token) => {
      expect(token.type).toBe(token.lexeme);
    });
    expect(scanner.tokens[symbols.length].type).toBe(TokenType.EOF);
    expect(scanner.tokens[symbols.length].lexeme).toBe('');
  })

  test('literals', () => {
    const source = 'identifier "string" 1';
    const scanner = new Scanner(source);

    expect(scanner.tokens[0].type).toBe(TokenType.IDENTIFIER);
    expect(scanner.tokens[0].lexeme).toBe('identifier');

    expect(scanner.tokens[1].type).toBe(TokenType.STRING);
    expect(scanner.tokens[1].lexeme).toBe('"string"');
    expect(scanner.tokens[1].literal).toBe('string');

    expect(scanner.tokens[2].type).toBe(TokenType.NUMBER);
    expect(scanner.tokens[2].lexeme).toBe('1');
    expect(scanner.tokens[2].literal).toBe(1);

    expect(scanner.tokens[3].type).toBe(TokenType.EOF);
    expect(scanner.tokens[3].lexeme).toBe('');
  })

  test('multiline text', () => {
    const source = `"a
    b"`;
    const scanner = new Scanner(source);

    expect(scanner.line).toBe(2);
    expect(scanner.tokens[0].literal).toBe('a\n    b');

    expect(scanner.tokens[1].type).toBe(TokenType.EOF);
    expect(scanner.tokens[1].lexeme).toBe('');
  })

  test('errors', () => {
    const source = '@ 1 "asdfas';
    const scanner = new Scanner(source);

    expect(scanner.errors.length).toBe(2);

    expect(scanner.errors[0].line).toBe(1);
    expect(scanner.errors[0].message).toBe('Unexpected character.');

    expect(scanner.errors[1].line).toBe(1);
    expect(scanner.errors[1].message).toBe('Unterminated string.');

    expect(scanner.tokens[0].type).toBe(TokenType.NUMBER);
    expect(scanner.tokens[0].lexeme).toBe('1');
    expect(scanner.tokens[0].literal).toBe(1);

    expect(scanner.tokens[1].type).toBe(TokenType.EOF);
    expect(scanner.tokens[1].lexeme).toBe('');
  })
})