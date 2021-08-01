var values = [];
var symbolNumber = -1;
var symbol;
var syntErrors = [];
var tree = [];

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
      " após '" +
      symbol.token +
      "'",
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
 * Funcção que retorna verdadeira casoo não terminal tenha um primeiro compativel com o symbol atual
 * @param {string} notTerminal
 * @returns {boolean}
 */
function firstContainsSimbol(notTerminal) {
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
  tree.push("S");
  tree.push("S -> TYPE ID S0");
  TYPE();
  ID();
  S0();
}

/**
 * Função que representa uma regra gramatical
 */
function S0() {
  if (firstContainsSimbol("ATR_")) {
    tree.push("S0 -> ATR'");
    ATR_();
  } else if (firstContainsSimbol("FUNCTION_")) {
    tree.push("S0 -> FUNCTION'");
    FUNCTION_();
  } else {
    addSyntacticError(
      symbol,
      "[0] Erro sintático expected um atribuição ou função"
    );
  }
}

/**
 * Função que representa uma regra gramatical
 */
function W0() {
  if (symbol.tokenClass === "number") {
    tree.push("W0 -> number");
    const r = getNextSimbol();
  } else if (firstContainsSimbol("ID")) {
    tree.push("W0 -> id");
    ID();
  } else {
    addSyntacticError(symbol, "[34] Erro lexico - expected um número ou id");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function DECLARATION() {
  tree.push("DECLARATION -> TYPE ATR DECLARATION'");
  TYPE();
  ATR();
  DECLARATION_();
}

/**
 * Função que representa uma regra gramatical
 */
function DECLARATION_() {
  if (firstContainsSimbol("A9")) {
    tree.push("DECLARATION' -> A9 D0");
    A9();
    D0();
  } else if (firstContainsSimbol("A7")) {
    tree.push("DECLARATION' -> A7");
    A7();
  } else {
    addSyntacticError(symbol, "[1] Erro sintático expected um ',' ou ';'");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function D0() {
  tree.push("D0 -> ATR DECLARATION'");
  ATR();
  DECLARATION_();
}

/**
 * Função que representa uma regra gramatical
 */
function ATR() {
  tree.push("ATR -> ID ATR_");
  ID();
  ATR_();
}

/**
 * Função que representa uma regra gramatical
 */
function ATR_() {
  if (symbol.tokenClass === "openBracket") {
    tree.push("ATR' -> [ W0 ] ATR''");
    getNextSimbol();
    W0();
    if (symbol.tokenClass === "closeBracket") {
      getNextSimbol();
      ATR__();
    } else {
      addSyntacticError(symbol, "[2] Erro sintático " + " expected um ']'");
    }
  } else if (firstContainsSimbol("ATR__")) {
    tree.push("ATR' -> ATR''");
    ATR__();
  }
}

/**
 * Função que representa uma regra gramatical
 */
function ATR__() {
  if (firstContainsSimbol("A8")) {
    tree.push("ATR'' -> A8 ATR'''");
    A8();
    ATR___();
  } else if (firstContainsSimbol("A1")) {
    tree.push("ATR'' -> A1 ATR'''");
    A1();
    ATR___();
  }
}

/**
 * Função que representa uma regra gramatical
 */
function ATR___() {
  if (firstContainsSimbol("ATR")) {
    tree.push("ATR''' -> ATR");
    ATR();
  } else if (firstContainsSimbol("VALUE")) {
    tree.push("ATR''' -> VALUE");
    VALUE();
  } else {
    addSyntacticError(
      symbol,
      "[4] Erro sintatico expected uma atribuição ou valor"
    );
  }
}

/**
 * Função que representa uma regra gramatical
 */
function A7() {
  if (symbol.tokenClass === "semicolon") {
    tree.push("A7 -> ;");
    getNextSimbol();
  } else {
    addSyntacticError(symbol, "[5] Erro sintático + expected um ';'");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function A8() {
  if (symbol.tokenClass === "equal") {
    tree.push("A8 -> equal");
    getNextSimbol();
  } else {
    addSyntacticError(symbol, "[6] Erro sintático + expected um '='");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function A9() {
  if (symbol.tokenClass === "coma") {
    tree.push("A9 -> coma");
    getNextSimbol();
  } else {
    addSyntacticError(symbol, "[7] Erro sintático + expected um ','");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function ID() {
  if (symbol.tokenClass === "id") {
    tree.push("ID -> id");
    getNextSimbol();
  } else {
    addSyntacticError(symbol, "[8] Erro sintático + expected um identificador");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function TYPE() {
  if (
    symbol.tokenClass === "int" ||
    symbol.tokenClass === "float" ||
    symbol.tokenClass === "double" ||
    symbol.tokenClass === "char" ||
    symbol.tokenClass === "void"
  ) {
    tree.push("TYPE -> " + symbol.tokenClass);
    getNextSimbol();
  } else {
    addSyntacticError(
      symbol,
      "[9] Erro sintático + expected uma declaração de tipo"
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
    tree.push("VALUE -> " + symbol.tokenClass);
    getNextSimbol();
  } else {
    addSyntacticError(symbol, "[10] Erro sintático + expected um valor");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function FUNCTION() {
  tree.push("FUNCTION -> TYPE ID FUNTION'");
  TYPE();
  ID();
  FUNCTION_();
}

/**
 * Função que representa uma regra gramatical
 */
function FUNCTION_() {
  if (symbol.tokenClass === "openParentheses") {
    tree.push("FUNCTION' -> ( F0 ) { EXPR }");
    getNextSimbol();
    F0();
    if (symbol.tokenClass === "closeParentheses") {
      getNextSimbol();
      if (symbol.tokenClass === "openBrace") {
        getNextSimbol();
        EXPR();
        if (symbol.tokenClass === "closeBrace") {
          getNextSimbol();
        } else {
          addSyntacticError(symbol, "[11] Erro sintático + expected um '{'");
        }
      } else {
        addSyntacticError(symbol, "[12] Erro sintático + expected um '{'");
      }
    } else {
      addSyntacticError(symbol, "[13] Erro sintático + expected um ')'");
    }
  } else {
    addSyntacticError(symbol, "[14] Erro sintático + expected um '('");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function F0() {
  if (firstContainsSimbol("TYPE")) {
    tree.push("F0 -> TYPE ID F1");
    TYPE();
    ID();
    F1();
  } else {
    tree.push("F0 -> λ");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function F1() {
  if (firstContainsSimbol("A9")) {
    tree.push("F1 -> A9 F0");
    A9();
    F0();
  } else if (symbol.tokenClass === "openBracket") {
    tree.push("F1 -> [ F2 ]");
    getNextSimbol();
    F2();
    if (symbol.tokenClass === "closeBracket") {
      getNextSimbol();
      addSyntacticError(symbol, "ok");
    } else {
      addSyntacticError(symbol, "[15] Erro sintático + expected um ']'");
    }
  } else {
    tree.push("F1 -> λ");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function F2() {
  if (symbol.tokenClass === "number") {
    tree.push("F2 -> number");
    getNextSimbol();
  } else {
    tree.push("F2 -> λ");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function WHILE() {
  if (symbol.tokenClass === "while") {
    getNextSimbol();
    if (symbol.tokenClass === "openParentheses") {
      getNextSimbol();
      tree.push("WHILE -> while ( CALC ) { EXPRE }");
      CALC();
      if (symbol.tokenClass === "closeParentheses") {
        getNextSimbol();
        if (symbol.tokenClass === "openBrace") {
          getNextSimbol();
          EXPR();
          if (symbol.tokenClass === "closeBrace") {
            getNextSimbol();
          } else {
            addSyntacticError(symbol, "[16] Erro sintático + expected um '}'");
          }
        } else {
          addSyntacticError(symbol, "[17] Erro sintático + expected um '{'");
        }
      } else {
        addSyntacticError(symbol, "[18] Erro sintático + expected um ')'");
      }
    } else {
      addSyntacticError(symbol, "[19] Erro sintático + expected um '('");
    }
  }
}

/**
 * Função que representa uma regra gramatical
 */
function IF() {
  if (symbol.tokenClass === "if") {
    getNextSimbol();
    if (symbol.tokenClass === "openParentheses") {
      tree.push("IF -> if ( CALC ) { EXPRE }");
      getNextSimbol();
      CALC();
      if (symbol.tokenClass === "closeParentheses") {
        getNextSimbol();
        if (symbol.tokenClass === "openBrace") {
          getNextSimbol();
          EXPR();
          if (symbol.tokenClass === "closeBrace") {
            getNextSimbol();
          } else {
            addSyntacticError(symbol, symbol);
            addSyntacticError(symbol, "[20] Erro sintático + expected um '}'");
          }
        } else {
          addSyntacticError(symbol, "[21] Erro sintático + expected um '{'");
        }
      } else {
        addSyntacticError(symbol, "[22] Erro sintático + expected um ')'");
      }
    } else {
      addSyntacticError(symbol, "[23] Erro sintático + expected um '('");
    }
  }
}

/**
 * Função que representa uma regra gramatical
 */
function ELSE() {
  if (symbol.tokenClass === "else") {
    getNextSimbol();
    if (symbol.tokenClass === "openBrace") {
      getNextSimbol();
      tree.push("ELSE -> else { EXPR }");
      EXPR();
      if (symbol.tokenClass === "closeBrace") {
        getNextSimbol();
      } else {
        addSyntacticError(symbol, "[24] Erro sintático + expected um '}'");
      }
    } else {
      addSyntacticError(symbol, "[25] Erro sintático + expected um '{'");
    }
  }
}

/**
 * Função que representa uma regra gramatical
 */
function FOR() {
  if (symbol.tokenClass === "for") {
    getNextSimbol();
    if (symbol.tokenClass === "openParentheses") {
      tree.push("FOR -> for ( R0 ; R2 ; R0 ) { EXPRE }");
      getNextSimbol();
      R0();
      if (symbol.tokenClass === "semicolon") {
        getNextSimbol();
        R2();
        if (symbol.tokenClass === "semicolon") {
          getNextSimbol();
          R0();
          if (symbol.tokenClass === "closeParentheses") {
            getNextSimbol();
            if (symbol.tokenClass === "openBrace") {
              getNextSimbol();
              EXPR();
              if (symbol.tokenClass === "closeBrace") {
                getNextSimbol();
              } else {
                addSyntacticError(
                  symbol,
                  "[26] Erro sintático + expected um '}'"
                );
              }
            } else {
              addSyntacticError(
                symbol,
                "[27] Erro sintático + expected um '{'"
              );
            }
          } else {
            addSyntacticError(symbol, "[28] Erro sintático + expected um ')'");
          }
        } else {
          addSyntacticError(symbol, "[29] Erro sintático + expected um ';'");
        }
      } else {
        addSyntacticError(symbol, "[30] Erro sintático + expected um ';'");
      }
    } else {
      addSyntacticError(symbol, "[31] Erro sintático + expected um '('");
    }
  }
}

/**
 * Função que representa uma regra gramatical
 */
function R0() {
  if (firstContainsSimbol("ATR")) {
    tree.push("R0 -> ATR R1");
    ATR();
    R1();
  } else {
    tree.push("R0 -> λ");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function R1() {
  if (firstContainsSimbol("A9")) {
    tree.push("R1 -> A9 R0");
    A9();
    R0();
  } else {
    tree.push("R1 -> λ");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function R2() {
  if (firstContainsSimbol("CALC")) {
    tree.push("R2 -> CALC");
    CALC();
  } else {
    tree.push("λ");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function CALC() {
  tree.push("CALC -> A2 A0");
  A2();
  A0();
}

/**
 * Função que representa uma regra gramatical
 */
function A0() {
  if (firstContainsSimbol("A1")) {
    tree.push("A0 -> A1 A2 A0");
    A1();
    A2();
    A0();
  }
}

/**
 * Função que representa uma regra gramatical
 */
function A1() {
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
    tree.push("A1 -> " + symbol.tokenClass);
    getNextSimbol();
  } else {
    addSyntacticError(
      symbol,
      "[32] Erro sintático + expected um operador(+, - ,* , ...)"
    );
  }
}

/**
 * Função que representa uma regra gramatical
 */
function A2() {
  if (firstContainsSimbol("VALUE")) {
    tree.push("A2 -> VALUE");
    VALUE();
  } else if (firstContainsSimbol("ID")) {
    tree.push("A2 -> ID");
    ID();
  }
}

/**
 * Função que representa uma regra gramatical
 */
function EXPR() {
  if (firstContainsSimbol("E0")) {
    tree.push("EXPR -> E0 EXPR");
    E0();
    EXPR();
  } else {
    tree.push("EXPR -> λ");
  }
}

/**
 * Função que representa uma regra gramatical
 */
function E0() {
  if (firstContainsSimbol("DECLARATION")) {
    tree.push("E0 -> DECLARATION");
    DECLARATION();
  } else if (firstContainsSimbol("ATR")) {
    tree.push("E0 -> ATR ;");
    ATR();
    if (symbol.tokenClass === "semicolon") {
      getNextSimbol();
    } else {
      addSyntacticError(symbol, "[33] Erro sintatico expected uma ','");
    }
  } else if (firstContainsSimbol("IF")) {
    tree.push("E0 -> IF");
    IF();
  } else if (firstContainsSimbol("WHILE")) {
    tree.push("E0 -> WHILE");
    WHILE();
  } else if (firstContainsSimbol("FOR")) {
    tree.push("E0 -> FOR");
    FOR();
  } else if (firstContainsSimbol("RETURN")) {
    tree.push("E0 -> RETURN");
    RETURN();
  } else {
  }
}

/**
 * Função que representa uma regra gramatical
 */
function RETURN() {
  if (symbol.tokenClass === "return") {
    tree.push("RETURN -> return CALC A7");
    getNextSimbol();
    CALC();
    A7();
  } else {
    tree.push("RETURN -> λ");
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
  return { syntErrors, syntTree: tree };
}
