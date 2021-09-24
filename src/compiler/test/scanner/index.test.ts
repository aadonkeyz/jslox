import Scanner, { TokenType } from '../../scanner';

describe('scanner', () => {
  test('keyword and identifier', () => {
    const source = 'if else hello';
    const scanner = new Scanner(source);

    expect(scanner.tokens[0].lexeme).toBe('if');
    expect(scanner.tokens[0].type).toBe(TokenType.IF);

    expect(scanner.tokens[1].lexeme).toBe('else');
    expect(scanner.tokens[1].type).toBe(TokenType.ELSE);

    expect(scanner.tokens[2].lexeme).toBe('hello');
    expect(scanner.tokens[2].type).toBe(TokenType.IDENTIFIER);
  })

  test('special symbol', () => {
    const source = '"asd"\n(';
    const scanner = new Scanner(source);

    expect(scanner.tokens[0].lexeme).toBe('"asd"');
    expect(scanner.tokens[0].type).toBe(TokenType.STRING);
    expect(scanner.tokens[0].literal).toBe('asd');

    expect(scanner.line).toBe(2);

    expect(scanner.tokens[1].lexeme).toBe('(');
    expect(scanner.tokens[1].type).toBe(TokenType.LEFT_PAREN);
  })

  test('errors', () => {
    const source = '@"asdfas@';
    const scanner = new Scanner(source);

    expect(scanner.errors.length).toBe(2);

    expect(scanner.errors[0].line).toBe(1);
    expect(scanner.errors[0].tips).toBe('Unexpected character.');

    expect(scanner.errors[1].line).toBe(1);
    expect(scanner.errors[1].tips).toBe('Unterminated string.');
  })
})