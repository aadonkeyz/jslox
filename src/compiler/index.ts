import Scanner from './scanner';
import Parser from './parser';
import { ScopeAnalyst } from './semantic';
import Interpreter from './interpreter';

class Compiler {
  source: string;
  scanner!: Scanner;
  parser!: Parser;
  scopeAnalyst!: ScopeAnalyst;
  interpreter!: Interpreter;

  constructor(source: string) {
    this.source = source;
  }

  analysis() {
    this.scanner = new Scanner(this.source);
    this.scanner.scan();
    this.parser = new Parser(this.scanner.tokens);
    this.parser.parse();
    this.scopeAnalyst = new ScopeAnalyst(this.parser.statements);
    this.scopeAnalyst.analysis();
    this.interpreter = new Interpreter(
      this.parser.statements,
      this.scopeAnalyst.scopeRecord,
    );
  }

  run() {
    this.interpreter.interpret();
  }
}

export default Compiler;
