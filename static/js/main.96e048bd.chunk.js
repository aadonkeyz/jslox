(this.webpackJsonpjslox=this.webpackJsonpjslox||[]).push([[0],{118:function(e,t,i){},121:function(e,t,i){},197:function(e,t,i){},198:function(e,t,i){"use strict";i.r(t);var n,s,a=i(0),r=i.n(a),c=i(35),o=i.n(c),u=(i(118),i(29)),h=i(203),l=i(110),v=i(107),m=i(202),f=i(204),p=i(201),d=i(206),E=i(207),y=i(99),b=i(8),k=i(9),O=i(24);!function(e){e.AND="and",e.CLASS="class",e.ELSE="else",e.FALSE="false",e.FUN="fun",e.FOR="for",e.IF="if",e.NIL="nil",e.OR="or",e.PRINT="print",e.RETURN="return",e.SUPER="super",e.THIS="this",e.TRUE="true",e.VAR="var",e.WHILE="while",e.LEFT_PARENTHESE="(",e.RIGHT_PARENTHESE=")",e.LEFT_BRACE="{",e.RIGHT_BRACE="}",e.COMMA=",",e.DOT=".",e.MINUS="-",e.PLUS="+",e.SEMICOLON=";",e.SLASH="/",e.STAR="*",e.BANG="!",e.BANG_EQUAL="!=",e.EQUAL="=",e.EQUAL_EQUAL="==",e.GREATER=">",e.GREATER_EQUAL=">=",e.LESS="<",e.LESS_EQUAL="<=",e.IDENTIFIER="identifier",e.STRING="string",e.NUMBER="number",e.EOF="eof"}(s||(s={}));var j,S,x=(n={},Object(O.a)(n,s.AND,s.AND),Object(O.a)(n,s.CLASS,s.CLASS),Object(O.a)(n,s.ELSE,s.ELSE),Object(O.a)(n,s.FALSE,s.FALSE),Object(O.a)(n,s.FUN,s.FUN),Object(O.a)(n,s.FOR,s.FOR),Object(O.a)(n,s.IF,s.IF),Object(O.a)(n,s.NIL,s.NIL),Object(O.a)(n,s.OR,s.OR),Object(O.a)(n,s.PRINT,s.PRINT),Object(O.a)(n,s.RETURN,s.RETURN),Object(O.a)(n,s.SUPER,s.SUPER),Object(O.a)(n,s.THIS,s.THIS),Object(O.a)(n,s.TRUE,s.TRUE),Object(O.a)(n,s.VAR,s.VAR),Object(O.a)(n,s.WHILE,s.WHILE),n),T=function e(t){Object(b.a)(this,e),this.type=void 0,this.lexeme=void 0,this.line=void 0,this.column=void 0,this.literal=void 0,this.type=t.type,this.lexeme=t.lexeme,this.line=t.line,this.column=t.column,this.literal=t.literal},I=function(){function e(t){Object(b.a)(this,e),this.source=void 0,this.tokens=void 0,this.start=void 0,this.current=void 0,this.line=void 0,this.errors=void 0,this.source=t,this.tokens=[],this.start=0,this.current=0,this.line=1,this.errors=[]}return Object(k.a)(e,[{key:"scan",value:function(){for(;!this.isAtEnd();)this.start=this.current,this.scanToken();this.tokens.push(new T({type:s.EOF,lexeme:"",line:this.line,column:this.calculateColumn(this.source.length-1)}))}},{key:"scanToken",value:function(){var e=this.advance();switch(e){case"(":this.addToken(s.LEFT_PARENTHESE);break;case")":this.addToken(s.RIGHT_PARENTHESE);break;case"{":this.addToken(s.LEFT_BRACE);break;case"}":this.addToken(s.RIGHT_BRACE);break;case",":this.addToken(s.COMMA);break;case".":this.addToken(s.DOT);break;case"-":this.addToken(s.MINUS);break;case"+":this.addToken(s.PLUS);break;case";":this.addToken(s.SEMICOLON);break;case"*":this.addToken(s.STAR);break;case"!":this.addToken(this.match("=")?s.BANG_EQUAL:s.BANG);break;case"=":this.addToken(this.match("=")?s.EQUAL_EQUAL:s.EQUAL);break;case"<":this.addToken(this.match("=")?s.LESS_EQUAL:s.LESS);break;case">":this.addToken(this.match("=")?s.GREATER_EQUAL:s.GREATER);break;case"/":if(this.match("/"))for(;"\n"!==this.peek()&&!this.isAtEnd();)this.advance();else this.addToken(s.SLASH);break;case" ":case"\r":case"\t":break;case"\n":this.line++;break;case'"':case"'":this.handleString(e);break;default:this.isDigit(e)?this.handleDigit():this.isAlpha(e)?this.handleAlpha():this.errors.push({line:this.line,column:this.calculateColumn(this.current-1),message:"Unexpected character"})}}},{key:"isAtEnd",value:function(){return this.current>=this.source.length}},{key:"advance",value:function(){return this.source[this.current++]||""}},{key:"peek",value:function(){return this.source[this.current]||""}},{key:"peekNext",value:function(){return this.source[this.current+1]||""}},{key:"match",value:function(e){return!this.isAtEnd()&&(this.source[this.current]===e&&(this.current++,!0))}},{key:"isDigit",value:function(e){return/^[0-9]$/.test(e)}},{key:"isAlpha",value:function(e){return/^[_a-zA-Z]$/.test(e)}},{key:"handleString",value:function(e){for(;this.peek()!==e&&!this.isAtEnd();)"\n"===this.peek()&&this.line++,this.advance();if(this.isAtEnd())this.errors.push({line:this.line,column:this.calculateColumn(this.current-1),message:"Unterminated string"});else{this.advance();var t=this.source.slice(this.start+1,this.current-1);this.addToken(s.STRING,t)}}},{key:"handleDigit",value:function(){for(;this.isDigit(this.peek());)this.advance();if("."===this.peek()&&this.isDigit(this.peekNext()))for(this.advance();this.isDigit(this.peek());)this.advance();var e=Number(this.source.slice(this.start,this.current));this.addToken(s.NUMBER,e)}},{key:"handleAlpha",value:function(){for(;this.isAlpha(this.peek())||this.isDigit(this.peek());)this.advance();var e=this.source.slice(this.start,this.current),t=e in x?x[e]:s.IDENTIFIER;this.addToken(t)}},{key:"addToken",value:function(e,t){var i=this.source.slice(this.start,this.current);this.tokens.push(new T({type:e,lexeme:i,line:this.line,column:this.calculateColumn(this.start),literal:t}))}},{key:"calculateColumn",value:function(e){return e-this.source.slice(0,e).lastIndexOf("\n")}}]),e}(),A=i(23),R=i(22),g=function(){function e(){Object(b.a)(this,e)}return Object(k.a)(e,[{key:"accept",value:function(e){}}]),e}(),w=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e,n,s){var a;return Object(b.a)(this,i),(a=t.call(this)).left=void 0,a.operator=void 0,a.right=void 0,a.left=e,a.operator=n,a.right=s,a}return Object(k.a)(i,[{key:"accept",value:function(e){return e.visitBinaryExpression(this)}}]),i}(g),N=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e,n,s){var a;return Object(b.a)(this,i),(a=t.call(this)).left=void 0,a.operator=void 0,a.right=void 0,a.left=e,a.operator=n,a.right=s,a}return Object(k.a)(i,[{key:"accept",value:function(e){return e.visitLogicalExpression(this)}}]),i}(g),L=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e){var n;return Object(b.a)(this,i),(n=t.call(this)).expression=void 0,n.expression=e,n}return Object(k.a)(i,[{key:"accept",value:function(e){return e.visitGroupingExpression(this)}}]),i}(g),C=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e){var n;return Object(b.a)(this,i),(n=t.call(this)).value=void 0,n.value=e,n}return Object(k.a)(i,[{key:"accept",value:function(e){return e.visitLiteralExpression(this)}}]),i}(g),U=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e,n){var s;return Object(b.a)(this,i),(s=t.call(this)).operator=void 0,s.expression=void 0,s.operator=e,s.expression=n,s}return Object(k.a)(i,[{key:"accept",value:function(e){return e.visitUnaryExpression(this)}}]),i}(g),F=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e){var n;return Object(b.a)(this,i),(n=t.call(this)).name=void 0,n.name=e,n}return Object(k.a)(i,[{key:"accept",value:function(e){return e.visitVariableExpression(this)}}]),i}(g),H=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e,n){var s;return Object(b.a)(this,i),(s=t.call(this)).name=void 0,s.value=void 0,s.name=e,s.value=n,s}return Object(k.a)(i,[{key:"accept",value:function(e){return e.visitAssignmentExpression(this)}}]),i}(g),B=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e,n,s){var a;return Object(b.a)(this,i),(a=t.call(this)).callee=void 0,a.args=void 0,a.endParenthese=void 0,a.callee=e,a.args=n,a.endParenthese=s,a}return Object(k.a)(i,[{key:"accept",value:function(e){return e.visitCallExpression(this)}}]),i}(g),_=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e,n){var s;return Object(b.a)(this,i),(s=t.call(this)).object=void 0,s.name=void 0,s.object=e,s.name=n,s}return Object(k.a)(i,[{key:"accept",value:function(e){return e.visitGetExpression(this)}}]),i}(g),G=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e,n,s){var a;return Object(b.a)(this,i),(a=t.call(this)).object=void 0,a.name=void 0,a.value=void 0,a.object=e,a.name=n,a.value=s,a}return Object(k.a)(i,[{key:"accept",value:function(e){return e.visitSetExpression(this)}}]),i}(g),P=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e){var n;return Object(b.a)(this,i),(n=t.call(this)).keyword=void 0,n.keyword=e,n}return Object(k.a)(i,[{key:"accept",value:function(e){return e.visitThisExpression(this)}}]),i}(g),D=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e,n){var s;return Object(b.a)(this,i),(s=t.call(this)).keyword=void 0,s.method=void 0,s.keyword=e,s.method=n,s}return Object(k.a)(i,[{key:"accept",value:function(e){return e.visitSuperExpression(this)}}]),i}(g),M=function(){function e(){Object(b.a)(this,e)}return Object(k.a)(e,[{key:"accept",value:function(e){}}]),e}(),z=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e){var n;return Object(b.a)(this,i),(n=t.call(this)).expression=void 0,n.expression=e,n}return Object(k.a)(i,[{key:"accept",value:function(e){e.visitExpressionStatement(this)}}]),i}(M),Q=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e,n,s){var a;return Object(b.a)(this,i),(a=t.call(this)).condition=void 0,a.thenBranch=void 0,a.elseBranch=void 0,a.condition=e,a.thenBranch=n,a.elseBranch=s,a}return Object(k.a)(i,[{key:"accept",value:function(e){e.visitIfStatement(this)}}]),i}(M),V=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e){var n;return Object(b.a)(this,i),(n=t.call(this)).expression=void 0,n.expression=e,n}return Object(k.a)(i,[{key:"accept",value:function(e){e.visitPrintStatement(this)}}]),i}(M),W=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e,n){var s;return Object(b.a)(this,i),(s=t.call(this)).condition=void 0,s.body=void 0,s.condition=e,s.body=n,s}return Object(k.a)(i,[{key:"accept",value:function(e){e.visitWhileStatement(this)}}]),i}(M),Z=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e){var n;return Object(b.a)(this,i),(n=t.call(this)).initializer=void 0,n.condition=void 0,n.updator=void 0,n.body=void 0,n.initializer=e.initializer,n.condition=e.condition,n.updator=e.updator,n.body=e.body,n}return Object(k.a)(i,[{key:"accept",value:function(e){e.visitForStatement(this)}}]),i}(M),q=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e,n){var s;return Object(b.a)(this,i),(s=t.call(this)).name=void 0,s.initializer=void 0,s.name=e,s.initializer=n,s}return Object(k.a)(i,[{key:"accept",value:function(e){e.visitVarStatement(this)}}]),i}(M),J=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e){var n;return Object(b.a)(this,i),(n=t.call(this)).statements=void 0,n.statements=e,n}return Object(k.a)(i,[{key:"accept",value:function(e){e.visitBlockStatement(this)}}]),i}(M),K=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e,n,s){var a;return Object(b.a)(this,i),(a=t.call(this)).name=void 0,a.params=void 0,a.body=void 0,a.name=e,a.params=n,a.body=s,a}return Object(k.a)(i,[{key:"accept",value:function(e){e.visitFunctionStatement(this)}}]),i}(M),Y=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e,n){var s;return Object(b.a)(this,i),(s=t.call(this)).keyword=void 0,s.value=void 0,s.keyword=e,s.value=n,s}return Object(k.a)(i,[{key:"accept",value:function(e){e.visitReturnStatement(this)}}]),i}(M),$=function(e){Object(A.a)(i,e);var t=Object(R.a)(i);function i(e,n,s){var a;return Object(b.a)(this,i),(a=t.call(this)).name=void 0,a.superclass=void 0,a.methods=void 0,a.name=e,a.superclass=n,a.methods=s,a}return Object(k.a)(i,[{key:"accept",value:function(e){e.visitClassStatement(this)}}]),i}(M),X=function(){function e(t){Object(b.a)(this,e),this.tokens=void 0,this.current=void 0,this.statements=void 0,this.errors=void 0,this.tokens=t,this.current=0,this.statements=[],this.errors=[]}return Object(k.a)(e,[{key:"parse",value:function(){for(;!this.isAtEnd();){var e=this.declaration();e&&this.statements.push(e)}}},{key:"declaration",value:function(){try{return this.match([s.FUN])?this.funDecl("function"):this.match([s.CLASS])?this.classDecl():this.match([s.VAR])?this.varDecl():this.statement()}catch(e){this.synchronize()}}},{key:"funDecl",value:function(e){var t=this.consume(s.IDENTIFIER,"Expect ".concat(e," name"));this.consume(s.LEFT_PARENTHESE,'Expect "(" after '.concat(e," name"));var i=[];if(!this.check(s.RIGHT_PARENTHESE))do{i.push(this.consume(s.IDENTIFIER,"Expect parameter name"))}while(this.match([s.COMMA]));this.consume(s.RIGHT_PARENTHESE,'Expect ")" after parameters'),this.consume(s.LEFT_BRACE,'Expect "{" before '.concat(e," body"));var n=new J(this.block());return new K(t,i,n)}},{key:"classDecl",value:function(){var e=this.consume(s.IDENTIFIER,"Expect class name"),t=null;this.match([s.LESS])&&(this.consume(s.IDENTIFIER,"Expect superclass name"),t=new F(this.previous())),this.consume(s.LEFT_BRACE,'Expect "{" before class body');for(var i=[];!this.check(s.RIGHT_BRACE)&&!this.isAtEnd();)i.push(this.funDecl("method"));return this.consume(s.RIGHT_BRACE,'Expect "}" after class body'),new $(e,t,i)}},{key:"varDecl",value:function(){var e,t=this.consume(s.IDENTIFIER,"Expect variable name");return this.match([s.EQUAL])&&(e=this.expression()),this.consume(s.SEMICOLON,'Expect ";" after variable declaration'),new q(t,e)}},{key:"statement",value:function(){return this.match([s.IF])?this.ifStmt():this.match([s.PRINT])?this.printStmt():this.match([s.RETURN])?this.returnStmt():this.match([s.WHILE])?this.whileStmt():this.match([s.FOR])?this.forStmt():this.match([s.LEFT_BRACE])?new J(this.block()):this.exprStmt()}},{key:"ifStmt",value:function(){this.consume(s.LEFT_PARENTHESE,'Expect "(" after "if"');var e=this.expression();this.consume(s.RIGHT_PARENTHESE,'Expect ")" after if condition');var t=this.statement(),i=this.match([s.ELSE])?this.statement():void 0;return new Q(e,t,i)}},{key:"block",value:function(){for(var e=[];!this.check(s.RIGHT_BRACE)&&!this.isAtEnd();){var t=this.declaration();t&&e.push(t)}return this.consume(s.RIGHT_BRACE,'Expect "}" after block'),e}},{key:"exprStmt",value:function(){var e=this.expression();return this.consume(s.SEMICOLON,'Expect ";" after expression'),new z(e)}},{key:"printStmt",value:function(){var e=this.expression();return this.consume(s.SEMICOLON,'Expect ";" after value'),new V(e)}},{key:"returnStmt",value:function(){var e=this.previous(),t=this.check(s.SEMICOLON)?new C(null):this.expression();return this.consume(s.SEMICOLON,'Expect ";" after return value'),new Y(e,t)}},{key:"whileStmt",value:function(){this.consume(s.LEFT_PARENTHESE,'Expect "(" after "while"');var e=this.expression();this.consume(s.RIGHT_PARENTHESE,'Expect ")" after condition');var t=this.statement();return new W(e,t)}},{key:"forStmt",value:function(){if(this.consume(s.LEFT_PARENTHESE,'Expect "(" after "for"'),this.check(s.RIGHT_PARENTHESE))throw this.errors.push({line:this.peek().line,column:this.peek().column,message:'There is nothing exist in the parenthese of "for"'}),new Error;var e,t,i;this.check(s.SEMICOLON)?this.advance():e=this.declaration(),this.match([s.SEMICOLON])||(t=this.expression(),this.consume(s.SEMICOLON,'Expect ";" after the condition of "for"')),this.match([s.RIGHT_PARENTHESE])||(i=this.expression(),this.consume(s.RIGHT_PARENTHESE,'Expect ")" after the parenthese of "for"'));var n=this.statement();return new Z({initializer:e,condition:t,updator:i,body:n})}},{key:"expression",value:function(){return this.assignment()}},{key:"assignment",value:function(){var e=this.logicOr();if(this.match([s.EQUAL])){var t=this.previous(),i=this.assignment();if(e instanceof F){var n=e.name;return new H(n,i)}if(e instanceof _)return new G(e.object,e.name,i);throw this.errors.push({line:t.line,column:t.column,message:"Invalid assignment target"}),new Error}return e}},{key:"logicOr",value:function(){for(var e=this.logicAnd();this.match([s.OR]);){var t=this.previous(),i=this.logicAnd();e=new N(e,t,i)}return e}},{key:"logicAnd",value:function(){for(var e=this.equality();this.match([s.AND]);){var t=this.previous(),i=this.equality();e=new N(e,t,i)}return e}},{key:"equality",value:function(){for(var e=this.comparison();this.match([s.BANG_EQUAL,s.EQUAL_EQUAL]);){var t=this.previous(),i=this.comparison();e=new w(e,t,i)}return e}},{key:"comparison",value:function(){for(var e=this.term();this.match([s.GREATER,s.GREATER_EQUAL,s.LESS,s.LESS_EQUAL]);){var t=this.previous(),i=this.term();e=new w(e,t,i)}return e}},{key:"term",value:function(){for(var e=this.factor();this.match([s.MINUS,s.PLUS]);){var t=this.previous(),i=this.factor();e=new w(e,t,i)}return e}},{key:"factor",value:function(){for(var e=this.unary();this.match([s.SLASH,s.STAR]);){var t=this.previous(),i=this.unary();e=new w(e,t,i)}return e}},{key:"unary",value:function(){if(this.match([s.BANG,s.MINUS])){var e=this.previous(),t=this.unary();return new U(e,t)}return this.call()}},{key:"call",value:function(){for(var e=this.primary();this.match([s.LEFT_PARENTHESE,s.DOT]);){var t=this.previous().type;if(t===s.LEFT_PARENTHESE)e=this.finishCall(e);else if(t===s.DOT){var i=this.consume(s.IDENTIFIER,'Expect property name after "."');e=new _(e,i)}}return e}},{key:"finishCall",value:function(e){var t=[];if(!this.check(s.RIGHT_PARENTHESE))do{t.push(this.expression())}while(this.match([s.COMMA]));var i=this.consume(s.RIGHT_PARENTHESE,'Expect ")" after arguments');return new B(e,t,i)}},{key:"primary",value:function(){if(this.match([s.NUMBER,s.STRING]))return new C(this.previous().literal);if(this.match([s.TRUE]))return new C(!0);if(this.match([s.FALSE]))return new C(!1);if(this.match([s.NIL]))return new C(null);if(this.match([s.THIS]))return new P(this.previous());if(this.match([s.SUPER])){var e=this.previous();return this.consume(s.DOT,'Expect "." after "super"'),this.consume(s.IDENTIFIER,"Expect superclass method name"),new D(e,this.previous())}if(this.match([s.IDENTIFIER]))return new F(this.previous());if(this.match([s.LEFT_PARENTHESE])){var t=new L(this.expression());return this.consume(s.RIGHT_PARENTHESE,'Expect ")" after expression'),t}throw this.errors.push({line:this.peek().line,column:this.peek().column,message:'Unexpected token "'.concat(this.peek().lexeme,'"')}),new Error}},{key:"match",value:function(e){for(var t=0;t<e.length;t++)if(this.check(e[t]))return this.advance(),!0;return!1}},{key:"consume",value:function(e,t){if(this.check(e))return this.advance();throw this.errors.push({line:this.peek().line,column:this.peek().column,message:t}),new Error}},{key:"check",value:function(e){return!this.isAtEnd()&&e===this.peek().type}},{key:"advance",value:function(){return this.isAtEnd()||this.current++,this.previous()}},{key:"peek",value:function(){return this.tokens[this.current]}},{key:"previous",value:function(){return this.tokens[this.current-1]}},{key:"isAtEnd",value:function(){return this.peek().type===s.EOF}},{key:"synchronize",value:function(){for(;!this.isAtEnd();){if(this.previous().type===s.SEMICOLON)return;switch(this.peek().type){case s.CLASS:case s.FUN:case s.VAR:case s.FOR:case s.IF:case s.WHILE:case s.PRINT:case s.RETURN:case s.RIGHT_BRACE:return}this.advance()}}}]),e}();!function(e){e[e.NONE=0]="NONE",e[e.FUNCTION=1]="FUNCTION",e[e.METHOD=2]="METHOD",e[e.INITIALIZER=3]="INITIALIZER"}(j||(j={})),function(e){e[e.NONE=0]="NONE",e[e.CLASS=1]="CLASS",e[e.SUBCLASS=2]="SUBCLASS"}(S||(S={}));var ee=function(){function e(t){Object(b.a)(this,e),this.statements=void 0,this.scopes=void 0,this.scopeRecord=void 0,this.functionType=void 0,this.classType=void 0,this.errors=void 0,this.statements=t,this.scopes=[],this.scopeRecord=new Map,this.functionType=j.NONE,this.classType=S.NONE,this.errors=[]}return Object(k.a)(e,[{key:"analysis",value:function(){this.evaluateList(this.statements)}},{key:"evaluateList",value:function(e){for(var t=0;t<e.length;t++)this.evaluateItem(e[t])}},{key:"evaluateItem",value:function(e){e.accept(this)}},{key:"evaluateFunction",value:function(e,t){var i=this,n=this.functionType;this.functionType=t,this.scopes.push({}),e.params.forEach((function(e){i.declare(e),i.define(e)})),this.evaluateList(e.body.statements),this.scopes.pop(),this.functionType=n}},{key:"declare",value:function(e){0!==this.scopes.length&&(this.scopes[this.scopes.length-1][e.lexeme]=!1)}},{key:"define",value:function(e){0!==this.scopes.length&&(this.scopes[this.scopes.length-1][e.lexeme]=!0)}},{key:"calculate",value:function(e,t){for(var i=this.scopes.length-1;i>=0;i--)if(t.lexeme in this.scopes[i])return void this.scopeRecord.set(e,this.scopes.length-1-i)}},{key:"visitExpressionStatement",value:function(e){this.evaluateItem(e.expression)}},{key:"visitIfStatement",value:function(e){this.evaluateItem(e.condition),this.evaluateItem(e.thenBranch),e.elseBranch&&this.evaluateItem(e.elseBranch)}},{key:"visitPrintStatement",value:function(e){this.evaluateItem(e.expression)}},{key:"visitWhileStatement",value:function(e){this.evaluateItem(e.condition),this.evaluateItem(e.body)}},{key:"visitForStatement",value:function(e){this.scopes.push({}),e.initializer&&this.evaluateItem(e.initializer),e.condition&&this.evaluateItem(e.condition),e.updator&&this.evaluateItem(e.updator),this.evaluateItem(e.body),this.scopes.pop()}},{key:"visitVarStatement",value:function(e){this.declare(e.name),e.initializer&&this.evaluateItem(e.initializer),this.define(e.name)}},{key:"visitBlockStatement",value:function(e){this.scopes.push({}),this.evaluateList(e.statements),this.scopes.pop()}},{key:"visitFunctionStatement",value:function(e){this.declare(e.name),this.define(e.name),this.evaluateFunction(e,j.FUNCTION)}},{key:"visitReturnStatement",value:function(e){this.functionType===j.NONE&&this.errors.push({line:e.keyword.line,column:e.keyword.column,message:"Can't return from top-level code"}),e.value&&(this.functionType===j.INITIALIZER&&this.errors.push({line:e.keyword.line,column:e.keyword.column,message:"Can't use return a value from an initializer"}),this.evaluateItem(e.value))}},{key:"visitClassStatement",value:function(e){var t=this,i=this.classType;this.classType=S.CLASS,this.declare(e.name),e.superclass&&(e.name.lexeme===e.superclass.name.lexeme&&this.errors.push({line:e.name.line,column:e.name.column,message:"A class can't inherit from itself(\"".concat(e.name.lexeme,'")')}),this.evaluateItem(e.superclass),this.scopes.push({super:!0}),this.classType=S.SUBCLASS),this.scopes.push({this:!0}),e.methods.forEach((function(e){t.evaluateFunction(e,"init"===e.name.lexeme?j.INITIALIZER:j.METHOD)})),this.scopes.pop(),e.superclass&&this.scopes.pop(),this.define(e.name),this.classType=i}},{key:"visitBinaryExpression",value:function(e){this.evaluateItem(e.left),this.evaluateItem(e.right)}},{key:"visitLogicalExpression",value:function(e){this.evaluateItem(e.left),this.evaluateItem(e.right)}},{key:"visitGroupingExpression",value:function(e){this.evaluateItem(e.expression)}},{key:"visitLiteralExpression",value:function(e){}},{key:"visitUnaryExpression",value:function(e){this.evaluateItem(e.expression)}},{key:"visitVariableExpression",value:function(e){0!==this.scopes.length&&!1===this.scopes[this.scopes.length-1][e.name.lexeme]&&this.errors.push({line:e.name.line,column:e.name.column,message:"Can't read local variable in its own initializer(\"".concat(e.name.lexeme,'")')}),this.calculate(e,e.name)}},{key:"visitAssignmentExpression",value:function(e){this.evaluateItem(e.value),this.calculate(e,e.name)}},{key:"visitCallExpression",value:function(e){this.evaluateItem(e.callee),this.evaluateList(e.args)}},{key:"visitGetExpression",value:function(e){this.evaluateItem(e.object)}},{key:"visitSetExpression",value:function(e){this.evaluateItem(e.value),this.evaluateItem(e.object)}},{key:"visitThisExpression",value:function(e){this.classType===S.NONE&&this.errors.push({line:e.keyword.line,column:e.keyword.column,message:'Can\'t use "this" outside of a class'}),this.calculate(e,e.keyword)}},{key:"visitSuperExpression",value:function(e){this.classType===S.NONE?this.errors.push({line:e.keyword.line,column:e.keyword.column,message:'Can\'t use "super" outside of a class'}):this.classType===S.CLASS&&this.errors.push({line:e.keyword.line,column:e.keyword.column,message:'Can\'t use "super" in a class with no superclass'}),this.calculate(e,e.keyword)}}]),e}(),te=ee,ie=i(31);var ne=function(e,t,i){return new Error("".concat(i," in line ").concat(e," column ").concat(t,"."))},se=function(){function e(t){Object(b.a)(this,e),this.values=void 0,this.enclosing=void 0,this.values={},this.enclosing=t}return Object(k.a)(e,[{key:"define",value:function(e,t){this.values[e]=t}},{key:"get",value:function(e){if(e.lexeme in this.values)return this.values[e.lexeme];if(this.enclosing)return this.enclosing.get(e);throw ne(e.line,e.column,'Undefined variable at "'.concat(e.lexeme,'"'))}},{key:"getEnvironmentByDistance",value:function(e){for(var t=this;e>0&&t.enclosing;)t=t.enclosing,e-=1;return t}},{key:"assign",value:function(e,t){if(e.lexeme in this.values)this.values[e.lexeme]=t;else{if(!this.enclosing)throw ne(e.line,e.column,'Undefined variable at "'.concat(e.lexeme,'"'));this.enclosing.assign(e,t)}}}]),e}(),ae=function(){function e(t){Object(b.a)(this,e),this.belongClass=void 0,this.fields=void 0,this.belongClass=t,this.fields={}}return Object(k.a)(e,[{key:"get",value:function(e){if(e.lexeme in this.fields)return this.fields[e.lexeme];var t=this.belongClass.findMethod(e.lexeme);if(t)return t.bind(this);throw ne(e.line,e.column,'Undefined property "'.concat(e.lexeme,'"'))}},{key:"set",value:function(e,t){this.fields[e.lexeme]=t}}]),e}(),re=function(){function e(t,i,n){Object(b.a)(this,e),this.name=void 0,this.superclass=void 0,this.methods=void 0,this.name=t,this.superclass=i,this.methods=n}return Object(k.a)(e,[{key:"arity",value:function(){var e=this.methods.init;return e?e.arity():0}},{key:"findMethod",value:function(e){return e in this.methods?this.methods[e]:this.superclass?this.superclass.findMethod(e):null}},{key:"call",value:function(e,t){var i=new ae(this),n=this.methods.init;return n&&n.bind(i).call(e,t),i}}]),e}(),ce=function e(t){Object(b.a)(this,e),this.value=void 0,this.value=t},oe=function(){function e(t,i,n){Object(b.a)(this,e),this.declaration=void 0,this.closure=void 0,this.isInitializer=void 0,this.declaration=t,this.closure=i,this.isInitializer=!!n}return Object(k.a)(e,[{key:"arity",value:function(){return this.declaration.params.length}},{key:"call",value:function(e,t){for(var i=new se(this.closure),n=0;n<this.declaration.params.length;n++)i.define(this.declaration.params[n].lexeme,t[n]);var s=null;try{e.visitBlockStatement(this.declaration.body,i)}catch(a){if(!(a instanceof ce))throw a;s=a.value}return this.isInitializer?this.closure.values.this:s}},{key:"bind",value:function(t){var i=new se(this.closure);return i.define("this",t),new e(this.declaration,i,this.isInitializer)}}]),e}(),ue=function(){function e(t,i){Object(b.a)(this,e),this.global=void 0,this.environment=void 0,this.statements=void 0,this.scopeRecord=void 0,this.global=new se,this.environment=this.global,this.statements=t,this.scopeRecord=i||new Map}return Object(k.a)(e,[{key:"interpret",value:function(){for(var e=0;e<this.statements.length;e++)this.execute(this.statements[e])}},{key:"evaluate",value:function(e){return e.accept(this)}},{key:"execute",value:function(e){e.accept(this)}},{key:"visitFunctionStatement",value:function(e){var t=new oe(e,this.environment);this.environment.define(e.name.lexeme,t)}},{key:"visitClassStatement",value:function(e){var t=this;this.environment.define(e.name.lexeme,null);var i=null,n=null;if(e.superclass){if(!((i=this.evaluate(e.superclass))instanceof re))throw ne(e.superclass.name.line,e.superclass.name.column,'Superclass must be a class at "'.concat(e.superclass.name.lexeme,'"'));n=this.environment,this.environment=new se(n),this.environment.define("super",i)}var s=e.methods.reduce((function(e,i){var n=new oe(i,t.environment,"init"===i.name.lexeme);return Object(ie.a)(Object(ie.a)({},e),{},Object(O.a)({},i.name.lexeme,n))}),{}),a=new re(e.name.lexeme,i,s);n&&(this.environment=n),this.environment.assign(e.name,a)}},{key:"visitReturnStatement",value:function(e){throw new ce(this.evaluate(e.value))}},{key:"visitExpressionStatement",value:function(e){this.evaluate(e.expression)}},{key:"visitIfStatement",value:function(e){this.evaluate(e.condition)?this.execute(e.thenBranch):e.elseBranch&&this.execute(e.elseBranch)}},{key:"visitWhileStatement",value:function(e){for(;this.evaluate(e.condition);)this.execute(e.body)}},{key:"visitForStatement",value:function(e){var t=this.environment;for(this.environment=new se(t),e.initializer&&this.evaluate(e.initializer);e.condition&&this.evaluate(e.condition);)this.execute(e.body),e.updator&&this.evaluate(e.updator);this.environment=t}},{key:"visitPrintStatement",value:function(e){var t=this.evaluate(e.expression);console.log(t)}},{key:"visitVarStatement",value:function(e){var t=e.initializer?this.evaluate(e.initializer):null;this.environment.define(e.name.lexeme,t)}},{key:"visitBlockStatement",value:function(e,t){var i=this.environment;this.environment=t||new se(this.environment);try{for(var n=0;n<e.statements.length;n++)this.execute(e.statements[n])}catch(s){throw this.environment=i,s}this.environment=i}},{key:"visitLiteralExpression",value:function(e){return e.value}},{key:"visitGroupingExpression",value:function(e){return this.evaluate(e.expression)}},{key:"visitUnaryExpression",value:function(e){var t=this.evaluate(e.expression);if(e.operator.type===s.MINUS){if("number"!==typeof t)throw ne(e.operator.line,e.operator.column,'Operand must be a number at "'.concat(e.operator.lexeme,'"'));return-t}if(e.operator.type===s.BANG)return!t;throw ne(e.operator.line,e.operator.column,"Should not happen")}},{key:"visitBinaryExpression",value:function(e){var t=this.evaluate(e.left),i=this.evaluate(e.right);switch(e.operator.type){case s.PLUS:if("number"===typeof t&&"number"===typeof i)return t+i;if("string"===typeof t&&"string"===typeof i)return t+i;throw ne(e.operator.line,e.operator.column,'Operands must be two numbers or two strings "'.concat(e.operator.lexeme,'"'));case s.MINUS:case s.SLASH:case s.STAR:case s.GREATER:case s.GREATER_EQUAL:case s.LESS:case s.LESS_EQUAL:return this.numberBinaryCalculate(e.operator,t,i);case s.BANG_EQUAL:return t!==i;case s.EQUAL_EQUAL:return t===i;default:throw ne(e.operator.line,e.operator.column,"Should not happen")}}},{key:"numberBinaryCalculate",value:function(e,t,i){if("number"!==typeof t||"number"!==typeof i)throw ne(e.line,e.column,'Operands must be numbers at "'.concat(e.lexeme,'"'));switch(e.type){case s.MINUS:return t-i;case s.SLASH:return t/i;case s.STAR:return t*i;case s.GREATER:return t>i;case s.GREATER_EQUAL:return t>=i;case s.LESS:return t<i;case s.LESS_EQUAL:return t<=i;default:throw ne(e.line,e.column,"Should not happen")}}},{key:"visitLogicalExpression",value:function(e){var t=this.evaluate(e.left);if(e.operator.type===s.OR)return t||this.evaluate(e.right);if(e.operator.type===s.AND)return t?this.evaluate(e.right):t;throw ne(e.operator.line,e.operator.column,"Should not happen")}},{key:"visitAssignmentExpression",value:function(e){var t=this.evaluate(e.value);if(!this.scopeRecord.has(e))return this.global.assign(e.name,t),t;var i=this.scopeRecord.get(e);return this.environment.getEnvironmentByDistance(i).assign(e.name,t),t}},{key:"visitVariableExpression",value:function(e){if(!this.scopeRecord.has(e))return this.global.get(e.name);var t=this.scopeRecord.get(e);return this.environment.getEnvironmentByDistance(t).get(e.name)}},{key:"visitCallExpression",value:function(e){var t=this,i=this.evaluate(e.callee),n=e.args.map((function(e){return t.evaluate(e)}));if(!(i instanceof oe||i instanceof re))throw ne(e.endParenthese.line,e.endParenthese.column,'Can only call functions and classes at "'.concat(e.endParenthese.lexeme,'"'));if(n.length!==i.arity())throw ne(e.endParenthese.line,e.endParenthese.column,"Expect ".concat(i.arity()," arguments but got ").concat(n.length,' at ")"'));return i.call(this,n)}},{key:"visitGetExpression",value:function(e){var t=this.evaluate(e.object);if(t instanceof ae)return t.get(e.name);throw ne(e.name.line,e.name.column,'Only instances have properties at "'.concat(e.name.lexeme,'"'))}},{key:"visitSetExpression",value:function(e){var t=this.evaluate(e.object);if(t instanceof ae){var i=this.evaluate(e.value);return t.set(e.name,i),i}throw ne(e.name.line,e.name.column,'Only instances have properties at "'.concat(e.name.lexeme,'"'))}},{key:"visitThisExpression",value:function(e){var t=this.scopeRecord.get(e);return this.environment.getEnvironmentByDistance(t).get(e.keyword)}},{key:"visitSuperExpression",value:function(e){var t=this.scopeRecord.get(e),i=this.environment.getEnvironmentByDistance(t).get(e.keyword),n=this.environment.getEnvironmentByDistance(t-1).values.this,s=i.findMethod(e.method.lexeme);if(s)return s.bind(n);throw ne(e.keyword.line,e.keyword.column,"Undefined property ".concat(e.method.lexeme))}}]),e}(),he=function(){function e(t){Object(b.a)(this,e),this.source=void 0,this.scanner=void 0,this.parser=void 0,this.scopeAnalyst=void 0,this.interpreter=void 0,this.source=t}return Object(k.a)(e,[{key:"analysis",value:function(){this.scanner=new I(this.source),this.scanner.scan(),this.parser=new X(this.scanner.tokens),this.parser.parse(),this.scopeAnalyst=new te(this.parser.statements),this.scopeAnalyst.analysis(),this.interpreter=new ue(this.parser.statements,this.scopeAnalyst.scopeRecord)}},{key:"run",value:function(){this.interpreter.interpret()}}]),e}(),le=(i(121),i(16)),ve="Problems",me="Console",fe=[{key:ve,label:ve},{key:me,label:me}];var pe=function(e){var t=e.show,i=Object(a.useState)(fe[0].key),n=Object(u.a)(i,2),s=n[0],r=n[1],c=Object(a.useState)([]),o=Object(u.a)(c,2),h=o[0],b=o[1],k=Object(a.useState)([]),O=Object(u.a)(k,2),j=O[0],S=O[1],x=Object(a.useRef)(),T=Object(a.useCallback)(Object(y.debounce)((function(e){var t=new he(e);x.current=t,t.analysis(),window.zzz=t;var i=t.scanner.errors.concat(t.parser.errors,t.scopeAnalyst.errors).map((function(e){return"".concat(e.message," in line ").concat(e.line," column ").concat(e.column,".")}));b(i)}),500),[]);return Object(a.useEffect)((function(){var e=console.log;console.log=function(){for(var t=arguments.length,i=new Array(t),n=0;n<t;n++)i[n]=arguments[n];S((function(e){return[].concat(Object(l.a)(e),i)})),e.apply(void 0,i)}}),[]),Object(le.jsxs)("div",{className:"playground",style:{display:t?"":"none"},children:[Object(le.jsx)(v.a,{height:"65%",defaultLanguage:"plaintext",onChange:function(e){T(e||"")}}),Object(le.jsx)("div",{className:"terminal",children:Object(le.jsx)(m.a,{activeKey:s,onChange:r,tabBarExtraContent:Object(le.jsxs)(le.Fragment,{children:[Object(le.jsx)(f.a,{danger:!0,icon:Object(le.jsx)(d.a,{}),style:{marginRight:16},onClick:function(){return S([])},children:Object(le.jsx)("span",{style:{transform:"translateY(-1px)"},children:"Clear"})}),Object(le.jsx)(f.a,{style:{background:"#52c41a"},icon:Object(le.jsx)(E.a,{}),disabled:!x.current||h.length>0,onClick:function(){if(x.current)try{x.current.run()}catch(e){S([e.message])}},children:Object(le.jsx)("span",{style:{transform:"translateY(-1px)"},children:"Run"})})]}),children:fe.map((function(e){var t=null;e.key===ve?t=Object(le.jsx)(p.b,{header:null,footer:null,bordered:!0,dataSource:h,renderItem:function(e){return Object(le.jsx)(p.b.Item,{children:e})}}):e.key===me&&(t=Object(le.jsx)(p.b,{header:null,footer:null,bordered:!0,dataSource:j,renderItem:function(e){return Object(le.jsx)(p.b.Item,{children:e})}}));var i=e.key;return e.key===ve&&h.length>0&&(i+="(".concat(h.length,")")),Object(le.jsx)(m.a.TabPane,{tab:i,children:t},e.key)}))})})]})},de=(i(197),"Playground"),Ee="Grammer";var ye=function(){var e=Object(a.useState)(de),t=Object(u.a)(e,2),i=t[0],n=t[1];return Object(le.jsxs)("div",{className:"App",children:[Object(le.jsxs)(h.a,{mode:"inline",theme:"dark",selectedKeys:[i],onClick:function(e){return n(e.key)},children:[Object(le.jsx)(h.a.Item,{children:de},de),Object(le.jsx)(h.a.Item,{children:Ee},Ee)]}),Object(le.jsx)(pe,{show:i===de})]})};o.a.render(Object(le.jsx)(r.a.StrictMode,{children:Object(le.jsx)(ye,{})}),document.getElementById("root"))}},[[198,1,2]]]);
//# sourceMappingURL=main.96e048bd.chunk.js.map