export enum TokenType {
  // Keywords.
  AND = 'and',
  CLASS = 'class',
  ELSE = 'else',
  FALSE = 'false',
  FUN = 'fun',
  FOR = 'for',
  IF = 'if',
  NIL = 'nil',
  OR = 'or',
  PRINT = 'print',
  RETURN = 'return',
  SUPER = 'super',
  THIS = 'this',
  TRUE = 'true',
  VAR = 'var',
  WHILE = 'while',

  // Single-character tokens.
  LEFT_PARENTHESE = '(',
  RIGHT_PARENTHESE = ')',
  LEFT_BRACE = '{',
  RIGHT_BRACE = '}',
  COMMA = ',',
  DOT = '.',
  MINUS = '-',
  PLUS = '+',
  SEMICOLON = ';',
  SLASH = '/',
  STAR = '*',

  // One or two character tokens.
  BANG = '!',
  BANG_EQUAL = '!=',
  EQUAL = '=',
  EQUAL_EQUAL = '==',
  GREATER = '>',
  GREATER_EQUAL = '>=',
  LESS = '<',
  LESS_EQUAL = '<=',

  // Literals.
  IDENTIFIER = 'identifier',
  STRING = 'string',
  NUMBER = 'number',

  EOF = 'eof',
}

export const KEYWORDS_MAP = {
  [TokenType.AND]: TokenType.AND,
  [TokenType.CLASS]: TokenType.CLASS,
  [TokenType.ELSE]: TokenType.ELSE,
  [TokenType.FALSE]: TokenType.FALSE,
  [TokenType.FUN]: TokenType.FUN,
  [TokenType.FOR]: TokenType.FOR,
  [TokenType.IF]: TokenType.IF,
  [TokenType.NIL]: TokenType.NIL,
  [TokenType.OR]: TokenType.OR,
  [TokenType.PRINT]: TokenType.PRINT,
  [TokenType.RETURN]: TokenType.RETURN,
  [TokenType.SUPER]: TokenType.SUPER,
  [TokenType.THIS]: TokenType.THIS,
  [TokenType.TRUE]: TokenType.TRUE,
  [TokenType.VAR]: TokenType.VAR,
  [TokenType.WHILE]: TokenType.WHILE,
};

export type LiteralValue = number | string | boolean | null;
class Token {
  type: TokenType;
  lexeme: string;
  line: number;
  literal?: LiteralValue;

  constructor(props: {
    type: TokenType;
    lexeme: string;
    line: number;
    literal?: LiteralValue;
  }) {
    this.type = props.type;
    this.lexeme = props.lexeme;
    this.line = props.line;
    this.literal = props.literal;
  }
}

export default Token;
