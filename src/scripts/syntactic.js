var values = [];
var symbolNumber = -1;
var symbol;
var syntErrors = [];
var semanticErrors = [];
var tree = [];
var symbolsTable = [];
var scope = 0;
var currentType;
var primaryType;

function removeAllFromCurrentScope() {
  let value = symbolsTable.filter((i) => i.scope !== scope);
  symbolsTable = value;
}

function getTypoOfSymbol(token) {
  return symbolsTable.find((i) => i.token === token.token).type;
}

function findIdentifierInSymbolTable(token) {
  for (let i = 0; i < symbolsTable.length; i++) {
    if (
      token.token === symbolsTable[i].token &&
      scope === symbolsTable[i].scope
    ) {
      return true;
    }
  }
  return false;
}

function findIdentifierInSymbolTableWithoutScope(token) {
  for (let i = 0; i < symbolsTable.length; i++) {
    if (token.token === symbolsTable[i].token) {
      return true;
    }
  }
  return false;
}

function insertSymbol(token, type) {
  symbolsTable.push({
    ...token,
    type,
    scope,
  });
}

function initSynt() {
  values = [];
  symbolNumber = -1;
  symbol;
  syntErrors = [];
  tree = [];
}

/**
 * Função que adiciona um erro sintatico
 * @param {obj} symbol
 * @param {string} text
 */
function addSyntacticError(symbol, text) {
  //console.log("Line: " + symbol.line + " " + text);
  syntErrors.push({
    token: symbol,
    description:
      "Sintático: esperado " +
      text.split("expected")[1] +
      " em '" +
      symbol.token +
      "'",
  });
}

/**
 * Função que adiciona um erro semantico
 * @param {obj} symbol
 * @param {string} text
 */
function addSemanticError(symbol, text) {
  //console.log("Line: " + symbol.line + " " + text);
  semanticErrors.push({
    token: symbol,
    description: "Semântico: " + text,
  });
}

/**
 * Função que atualiza o symbol
 */
function getNextSimbol() {
  tree.push();
  if (symbolNumber < values.length) {
    symbolNumber = symbolNumber + 1;
    symbol = values[symbolNumber];
  }
}

/**
 * Função que retorna verdadeira caso o não terminal tenha um primeiro compativel com o symbol atual
 * @param {string} notTerminal
 * @returns {boolean}
 */
function firstContainsSimbol(notTerminal) {
  if (typeof symbol === "undefined") {
    symbol = {
      line: "final do arquivo",
      token: "end of file",
      tokenClass: "End of file",
    };
  }
  for (x in firsts[notTerminal]) {
    if (firsts[notTerminal][x] === symbol.tokenClass) {
      return true;
    }
  }
  return false;
}

/**
 * Função que representa o estado inicial S da gramática
 */
function S() {
  if (firstContainsSimbol("S")) {
    tree.push("S ::= <TYPE> <ID> <S0>");

    TYPE();

    if (findIdentifierInSymbolTable(symbol)) {
      addSemanticError(symbol, "Identificador já existente");
    } else {
      insertSymbol(symbol, currentType);
    }

    IDENTIFIER();
    S0();
    S();
  } else {
    tree.push("S ::= λ");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function S0() {
  if (symbol.tokenClass === "coma") {
    tree.push("<S0> ::= ; <S0_>");
    getNextSimbol();
    S0_();
  } else if (firstContainsSimbol("FUNCTION_")) {
    tree.push("<S0> ::= <FUNCTION_>");
    FUNCTION_();
  } else {
    addSyntacticError(symbol, "[S0] Erro sintatico - expected ',', ';' ou '('");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function DECLARATION() {
  tree.push("<DECLARATION> ::= <TYPE> <IDENTIFIER> <DECLARATION_>");

  TYPE();

  if (findIdentifierInSymbolTable(symbol)) {
    addSemanticError(symbol, "Identificador já existente");
  } else {
    insertSymbol(symbol, currentType);
  }

  IDENTIFIER();
  DECLARATION_();
}

/**
 * Função que representa uma regra gramatical
 */
function DECLARATION_() {
  if (symbol.tokenClass === "semicolon") {
    tree.push("<DECLARATION_> ::= ;");
    getNextSimbol();
  } else if (symbol.tokenClass === "coma") {
    tree.push("<DECLARATION_> ::= , <IDENTIFIER> <DECLARATION_>");
    getNextSimbol();

    if (findIdentifierInSymbolTable(symbol)) {
      addSemanticError(symbol, "Identificador já existente");
    } else {
      insertSymbol(symbol, currentType);
    }

    IDENTIFIER();
    DECLARATION_();
  } else {
    addSyntacticError(
      symbol,
      "[DECLARATION_] Erro sintático expected um ',' ou ';'"
    );
  }
}

/**
 * Função que representa uma regra gramatical
 */
function IDENTIFIER() {
  if (symbol.tokenClass === "id") {
    tree.push("<IDENTIFIER> ::= id");
    let returnType = getTypoOfSymbol(symbol);
    getNextSimbol();
    return returnType;
  } else {
    addSyntacticError(
      symbol,
      "[IDENTIFIER] Erro sintático + expected um identificador"
    );
  }
}

/**
 * Função que representa uma regra gramatical
 */
function TYPE() {
  if (
    symbol.tokenClass === "int" ||
    symbol.tokenClass === "float" ||
    symbol.tokenClass === "char" ||
    symbol.tokenClass === "void"
  ) {
    tree.push("<TYPE> ::= " + symbol.tokenClass);
    currentType = symbol.tokenClass;
    getNextSimbol();
  } else {
    addSyntacticError(
      symbol,
      "[TYPE] Erro sintático + expected uma declaração de tipo"
    );
  }
}

/**
 * Função que representa uma regra gramatical
 */
function VALUE() {
  if (
    symbol.tokenClass === "number" ||
    symbol.tokenClass === "decimal" ||
    symbol.tokenClass === "string" ||
    symbol.tokenClass === "character"
  ) {
    tree.push("VALUE ::= " + symbol.tokenClass);
    let returnType;

    if (symbol.tokenClass === "number") {
      returnType = "int";
    } else if (symbol.tokenClass === "decimal") {
      returnType = "float";
    } else if (symbol.tokenClass === "string") {
      returnType = "char";
    } else {
      returnType = "char";
    }
    getNextSimbol();
    return returnType;
  } else {
    addSyntacticError(symbol, "[VALUE] Erro sintático + expected um valor");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function FUNCTION() {
  tree.push("<FUNCTION> ::= <TYPE> <IDENTIFIER> <FUNCTION_>");
  TYPE();
  IDENTIFIER();
  FUNCTION_();
}

/**
 * Função que representa uma regra gramatical
 */
function FUNCTION_() {
  if (symbol.tokenClass === "openParentheses") {
    tree.push("FUNCTION_ ::= ( <F0> ) <STATEMENT>");
    getNextSimbol();
  } else {
    addSyntacticError(symbol, "[FUNCTION_ 0] Erro sintático + expected um '('");
  }

  scope++;

  F0();

  if (symbol.tokenClass === "closeParentheses") {
    getNextSimbol();
  } else {
    addSyntacticError(symbol, "[FUNCTION_ 1] Erro sintático + expected um ')'");
  }

  STATEMENT();
}

/**
 * Função que representa uma regra gramatical
 */
function F0() {
  if (firstContainsSimbol("TYPE")) {
    tree.push("<F0> ::= <TYPE> <IDENTIFIER> <F1>");
    TYPE();

    if (findIdentifierInSymbolTable(symbol)) {
      addSemanticError(symbol, "Identificador já existente");
    } else {
      insertSymbol(symbol, currentType);
    }

    IDENTIFIER();
    F1();
  } else {
    tree.push("F0 ::= λ");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function F1() {
  if (symbol.tokenClass === "coma") {
    getNextSimbol();
    tree.push("<F1> ::= , <F0> ");
    F0();
  } else if (symbol.tokenClass === "openBracket") {
    tree.push("<F1> ::= [ <F2> ]");
    getNextSimbol();
    F2();
    if (symbol.tokenClass === "closeBracket") {
      getNextSimbol();
    } else {
      addSyntacticError(symbol, "[F1] Erro sintático + expected um ']'");
    }
  } else {
    tree.push("<F1> ::= λ");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function F2() {
  if (symbol.tokenClass === "number") {
    tree.push("<F2> ::= number");
    getNextSimbol();
  } else {
    tree.push("<F2> ::= λ");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function ITERATION() {
  if (symbol.tokenClass === "while") {
    tree.push("<ITERATION> ::= while ( <EXPRESION> ) <STATETMENT>");
    getNextSimbol();

    if (symbol.tokenClass === "openParentheses") {
      getNextSimbol();
    } else {
      addSyntacticError(
        symbol,
        "[ITERATION 0] Erro sintático + expected um '('"
      );
    }

    EXPRESION();

    if (symbol.tokenClass === "closeParentheses") {
      getNextSimbol();
    } else {
      addSyntacticError(
        symbol,
        "[ITARATION 1] Erro sintático + expected um ')'"
      );
    }

    scope++;

    STATEMENT();
  } else if (symbol.tokenClass === "for") {
    tree.push(
      "<ITERATION> ::= for ( <ITERATION_>  ; <ITERATION_>  ; <ITERATION_> ) <STATEMENT>"
    );
    getNextSimbol();

    scope++;

    if (symbol.tokenClass === "openParentheses") {
      getNextSimbol();
    } else {
      addSyntacticError(
        symbol,
        "[ITERATOR 2] Erro sintático + expected um '('"
      );
    }

    ITERATION_();

    if (symbol.tokenClass === "semicolon") {
      getNextSimbol();
    } else {
      addSyntacticError(
        symbol,
        "[ITERATOR 3] Erro sintático + expected um ';'"
      );
    }

    ITERATION_();

    if (symbol.tokenClass === "semicolon") {
      getNextSimbol();
    } else {
      addSyntacticError(
        symbol,
        "[ITERATOR 3] Erro sintático + expected um ';'"
      );
    }

    ITERATION_();

    if (symbol.tokenClass === "closeParentheses") {
      getNextSimbol();
    } else {
      addSyntacticError(
        symbol,
        "[ITARATION 4] Erro sintático + expected um ')'"
      );
    }

    STATEMENT();
  }
}

/**
 * Função que representa uma regra gramatical
 */
function SELECTION() {
  if (symbol.tokenClass === "if") {
    tree.push("<SELECTION> ::= if ( <EXPRESION> ) <STATEMENT> <ELSE>");
    getNextSimbol();

    scope++;

    if (symbol.tokenClass === "openParentheses") {
      getNextSimbol();
    } else {
      addSyntacticError(
        symbol,
        "[SELECTION 0] Erro sintático + expected um '('"
      );
    }

    EXPRESION();

    if (symbol.tokenClass === "closeParentheses") {
      getNextSimbol();
    } else {
      addSyntacticError(
        symbol,
        "[SECLETION 1] Erro sintático + expected um ')'"
      );
    }

    STATEMENT();

    ELSE();
  }
}

/**
 * Função que representa uma regra gramatical
 */
function ELSE() {
  if (symbol.tokenClass === "else") {
    tree.push("<ELSE> ::= else <STATEMENT>");
    getNextSimbol();

    scope++;
    STATEMENT();
  } else {
    tree.push("<ELSE> ::= λ");
  }
}
/**
 * Função que representa uma regra gramatical
 */
function OPERATOR() {
  if (
    symbol.tokenClass === "plus" ||
    symbol.tokenClass === "minus" ||
    symbol.tokenClass === "multiply" ||
    symbol.tokenClass === "div" ||
    symbol.tokenClass === "less" ||
    symbol.tokenClass === "greater" ||
    symbol.tokenClass === "equal" ||
    symbol.tokenClass === "and"
  ) {
    tree.push("<OPERATOR> ::= " + symbol.tokenClass);
    getNextSimbol();
  } else {
    addSyntacticError(
      symbol,
      "[OPERATOR] Erro sintático + expected um operador(+, - ,* , ...)"
    );
  }
}

/**
 * Função que representa uma regra gramatical
 */
function STATEMENT__() {
  if (firstContainsSimbol("SELECTION")) {
    tree.push("<STATEMENT__> ::= <SELECTION>");
    SELECTION();
  } else if (firstContainsSimbol("ITERATION")) {
    tree.push("<STATEMENT__> ::= <ITERATION>");
    ITERATION();
  } else if (firstContainsSimbol("EXPRESION")) {
    tree.push("<STATEMENT__> ::= <EXPRESION> ;");
    EXPRESION();
    if (symbol.tokenClass === "semicolon") {
      getNextSimbol();
    } else {
      addSyntacticError(
        symbol,
        "[STATEMENT__] Erro sintático + expected um ';'"
      );
    }
  } else {
    tree.push("<STATEMENT__> ::= <RETURN>");
    RETURN();
  }
}

/**
 * Função que representa uma regra gramatical
 */
function RETURN() {
  if (symbol.tokenClass === "return") {
    tree.push("<RETURN> ::= return <ITERATION_> ;");
    getNextSimbol();
    ITERATION_();

    if (symbol.tokenClass === "semicolon") {
      getNextSimbol();
    } else {
      addSyntacticError(symbol, "[RETURN] Erro sintático + expected um ';'");
    }
  }
}

/**
 * Função que representa uma regra gramatical
 */
function S0_() {
  if (firstContainsSimbol("S")) {
    tree.push("<S0_> ::= <S>");
    S();
  } else {
    tree.push("<S0_> ::= λ");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function ASSIGNMENT() {
  tree.push("<ASSIGNMENT>  ::= <PRIMARY> <ASSIGNMENT_>");

  let symbolAux = symbol;
  let type1 = PRIMARY();
  let type2 = ASSIGNMENT_();

  if (type2 === "λ") {
    return type1;
  }

  if (type1 !== type2) {
    addSemanticError(
      symbolAux,
      "Divergência de tipos entre " + type1 + " e " + type2
    );
  } else {
    return type1;
  }
}

/**
 * Função que representa uma regra gramatical
 */
function ASSIGNMENT_() {
  if (firstContainsSimbol("OPERATOR")) {
    tree.push("<ASSIGNMENT_> ::= <OPERATOR> <ASSIGNMENT>");
    OPERATOR();
    return ASSIGNMENT();
  } else {
    tree.push("<ASSIGNMENT_> ::= λ");
    return "λ";
  }
}

/**
 * Função que representa uma regra gramatical
 */
function PRIMARY() {
  let typeReturn;

  if (firstContainsSimbol("IDENTIFIER")) {
    tree.push("<PRIMARY> ::= <IDENTIFIER> ");

    if (!findIdentifierInSymbolTableWithoutScope(symbol)) {
      addSemanticError(symbol, "Identificador Inexistente");
    }

    typeReturn = IDENTIFIER();
  } else if (firstContainsSimbol("VALUE")) {
    tree.push("<PRIMARY> ::= <VALUE>");
    typeReturn = VALUE();
  } else {
    addSyntacticError(
      symbol,
      "[PRIMARY] Erro sintático + expected um 'identificador' ou 'valor'"
    );
  }

  return typeReturn;
}

/**
 * Função que representa uma regra gramatical
 */
function EXPRESION() {
  tree.push("<EXPRESION> ::= <ASSIGNMENT> <EXPRESION_>");
  ASSIGNMENT();
  EXPRESION_();
}

/**
 * Função que representa uma regra gramatical
 */
function EXPRESION_() {
  if (symbol.tokenClass === "coma") {
    tree.push("<EXPRESION_> ::= , <ASSIGNMENT> <EXPRESION_>");

    getNextSimbol();

    ASSIGNMENT();
    EXPRESION_();
  } else {
    tree.push("<EXPRESION_> ::= λ");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function STATEMENT() {
  tree.push("<STATEMENT> ::= { <STATEMENT_> }");
  if (symbol.tokenClass === "openBrace") {
    getNextSimbol();
  } else {
    addSyntacticError(symbol, "[STATEMENT 0] Erro sintático + expected um '{'");
  }

  STATEMENT_();

  if (symbol.tokenClass === "closeBrace") {
    getNextSimbol();
  } else {
    addSyntacticError(symbol, "[STATEMENT 0] Erro sintático + expected um '}'");
  }

  removeAllFromCurrentScope();

  scope--;
}

/**
 * Função que representa uma regra gramatical
 */
function STATEMENT_() {
  if (firstContainsSimbol("STATEMENT__")) {
    tree.push("<STATEMENT_> ::= <STATEMENT__> <STATEMENT_>");

    STATEMENT__();
    STATEMENT_();
  }
  if (firstContainsSimbol("DECLARATION")) {
    tree.push("<STATEMENT_> ::= <DECLARATION> <STATEMENT_>");
    DECLARATION();
    STATEMENT_();
  } else {
    tree.push("<STATEMENT_> ::= λ");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function ITERATION_() {
  if (firstContainsSimbol("EXPRESION")) {
    tree.push("<ITERATION_> ::= <EXPRESION> ");
    EXPRESION();
  } else {
    tree.push("<ITERATION_> ::= λ");
  }
}

/**
 * Função que representa o inicio da analise sintática
 */
function parser(tokenList) {
  initSynt();
  values = tokenList;
  getNextSimbol("");
  S();
  return { syntErrors, syntTree: tree, semanticErrors };
}
