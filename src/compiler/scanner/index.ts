import Token, { KEYWORDS_MAP, TokenType } from './token';

class Scanner {
  source: string;
  tokens: Token[];
  start: number;
  current: number;
  line: number;
  errors: {
    line: number;
    message: string;
  }[];

  constructor(source: string) {
    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
    this.errors = [];

    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, '', '', this.line));
  }

  scanToken(): void {
    const code = this.advance();

    switch (code) {
      case '(':
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ')':
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case '{':
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case '}':
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ',':
        this.addToken(TokenType.COMMA);
        break;
      case '.':
        this.addToken(TokenType.DOT);
        break;
      case '-':
        this.addToken(TokenType.MINUS);
        break;
      case '+':
        this.addToken(TokenType.PLUS);
        break;
      case ';':
        this.addToken(TokenType.SEMICOLON);
        break;
      case '*':
        this.addToken(TokenType.STAR);
        break;
      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '>':
        this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      case '/':
        if (this.match('/')) {
          while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        break;
      case '\n':
        this.line++;
        break;
      case '"':
      case "'":
        this.handleString(code);
        break;
      default:
        if (this.isDigit(code)) {
          this.handleDigit();
        } else if (this.isAlpha(code)) {
          this.handleAlpha();
        } else {
          this.errors.push({ line: this.line, message: 'Unexpected character.' });
        }
        break;
    }
  };

  isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  advance(): string {
    return this.source[this.current++] || '';
  }

  peek(): string {
    return this.source[this.current] || '';
  }

  peekNext(): string {
    return this.source[this.current + 1] || '';
  }

  match(expected: string): boolean {
    if (this.isAtEnd()) {
      return false;
    }

    if (this.source[this.current] !== expected) {
      return false;
    }

    this.current++;
    return true;
  }

  isDigit(code: string): boolean {
    return /^[0-9]$/.test(code);
  }

  isAlpha(code: string): boolean {
    return /^[_a-zA-Z]$/.test(code);
  }

  handleString(code: '"' | "'"): void {
    while (this.peek() !== code && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      this.errors.push({ line: this.line, message: 'Unterminated string.' });
      return;
    }

    this.advance();

    const value = this.source.slice(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  handleDigit(): void {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance();

      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    const value = Number(this.source.slice(this.start, this.current));
    this.addToken(TokenType.NUMBER, value);
  }

  handleAlpha(): void {
    while (this.isAlpha(this.peek()) || this.isDigit(this.peek())) {
      this.advance();
    }

    const lexeme = this.source.slice(this.start, this.current);
    const type = lexeme in KEYWORDS_MAP ? KEYWORDS_MAP[lexeme as keyof typeof KEYWORDS_MAP] : TokenType.IDENTIFIER;

    this.addToken(type);
  }

  addToken(type: TokenType, literal?: string | number): void {
    const lexeme = this.source.slice(this.start, this.current);
    this.tokens.push(new Token(type, lexeme, literal || '', this.line));
  }
}

export {
  Scanner as default,
  Token,
  TokenType
}