const firsts = {
  S: ["int", "float", "double", "char", "void"],
  S0: ["openBracket", "equal", "int", "float", "double", "char", "void:"],
  EXPR: [
    "int",
    "float",
    "double",
    "char",
    "void",
    "id",
    "if",
    "while",
    "for",
    "λ",
  ],
  E0: [
    "int",
    "float",
    "double",
    "char",
    "void",
    "id",
    "if",
    "while",
    "for",
    "return",
  ],
  DECLARATION: ["int", "float", "double", "char", "void"],
  D0: ["id"],
  TYPE: ["int", "float", "double", "char", "void"],
  ATR: ["id"],
  ID: ["id"],
  IF: ["if"],
  WHILE: ["while"],
  FOR: ["for"],
  DECLARATION_: ["coma", "semicolon"],
  A9: ["coma"],
  A7: ["semicolon"],
  ATR_: [
    "openBracket",
    "equal",
    "plus",
    "minus",
    "multiply",
    "div",
    "and",
    "less",
    "greater",
  ],
  W0: ["number", "id"],
  ATR__: [
    "equal",
    "plus",
    "minus",
    "multiply",
    "div",
    "and",
    "less",
    "greater",
  ],
  A8: ["equal"],
  ATR___: ["id", "number", "decimal", "string", "character"],
  CALC: ["number", "decimal", "string", "character", "id"],
  A2: ["number", "decimal", " string", "character", "id"],
  VALUE: ["number", "decimal", "string", "character"],
  FUNCTION: ["int", "float", "double", "char", "void"],
  FUNCTION_: ["openParentheses"],
  F0: ["int", "float", "double", "char", "void"],
  F1: ["coma", "openBracket", "λ"],
  F2: ["number", "λ"],
  ELSE: ["else", "λ"],
  R0: ["id", "λ"],
  R1: ["coma", "λ"],
  R2: ["number", "decimal", "string", "character", "λ"],
  A0: [
    "plus",
    "minus",
    "multiply",
    "div",
    "equal",
    "and",
    "less",
    "greater",
    "λ",
  ],
  A1: ["plus", "minus", "multiply", "div", "equal", "and", "less", "greater"],
  RETURN: ["return"],
};