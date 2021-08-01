/**
 * Definição das classes de token da linguagem
 */
const tokenClasses = [
  { re: /^[i][n][t]$/, tokenClass: "int" },
  { re: /^[c][h][a][r]$/, tokenClass: "char" },
  { re: /^[f][l][o][a][t]$/, tokenClass: "float" },
  { re: /^[v][o][i][d]$/, tokenClass: "void" },
  { re: /^[i][f]$/, tokenClass: "if" },
  { re: /^[e][l][s][e]$/, tokenClass: "else" },
  { re: /^[w][h][i][l][e]$/, tokenClass: "while" },
  { re: /^[r][e][t][u][r][n]$/, tokenClass: "return" },
  { re: /^[f][o][r]$/, tokenClass: "for" },
  { re: /^[(]$/, tokenClass: "openParentheses" },
  { re: /^[)]$/, tokenClass: "closeParentheses" },
  { re: /^[{]$/, tokenClass: "openBrace" },
  { re: /^[}]$/, tokenClass: "closeBrace" },
  { re: /^[+]$/, tokenClass: "plus" },
  { re: /^[-]$/, tokenClass: "minus" },
  { re: /^[*]$/, tokenClass: "multiply" },
  { re: /^[/]$/, tokenClass: "div" },
  { re: /^[;]$/, tokenClass: "semicolon" },
  { re: /^[,]$/, tokenClass: "coma" },
  { re: /^[=]$/, tokenClass: "equal" },
  { re: /^[&]$/, tokenClass: "andBinary" },
  { re: /^[>]$/, tokenClass: "greater" },
  { re: /^[<]$/, tokenClass: "less" },
  { re: /^[[]$/, tokenClass: "openBracket" },
  { re: /^[\]]$/, tokenClass: "closeBracket" },
  { re: /^['].[']$/, tokenClass: "character" },
  { re: /^["].*["]$/, tokenClass: "string" },
  { re: /^[0-9]+$/, tokenClass: "number" },
  { re: /^[0-9]+[.][0-9]+$/, tokenClass: "decimal" },
  { re: /^[_a-zA-Z][_a-zA-Z0-9]*$/, tokenClass: "id" },
];

/**
 * Definição de alguns tipos de erros léxicos
 */
const erTest = [
  /*identificador mal formado*/ /^[0-9a-zA-Z.]+$/,
  /*numero mal formado*/ /^[0-9.]*[.]+[0-9.]*$/,
  /*Caracter mal formada*/ /^[']+.*$|^.*[']+$/,
  /*String mal formada*/ /^["]+.*$|^.*["]+$/,
];
/**
 * Função que separa tokens e armazena todos eles em um vetor
 * @param {string} text
 * @returns {array} - Vetor com todos os tokens encontrados
 */
function separateTokens(text) {
  let lines = text.split("\n");
  let vetor = [];

  for (let j = 0; j < lines.length; j++) {
    text = lines[j];
    let buffer = "";
    for (let i = 0; i < text.length; i++) {
      if (
        text[i] === "(" ||
        text[i] === ")" ||
        text[i] === "{" ||
        text[i] === "}" ||
        text[i] === ";" ||
        text[i] === "," ||
        text[i] === "+" ||
        text[i] === "-" ||
        text[i] === "*" ||
        text[i] === "/" ||
        text[i] === ">" ||
        text[i] === "<" ||
        text[i] === "=" ||
        text[i] === "|" ||
        text[i] === "&" ||
        text[i] === "[" ||
        text[i] === "]" ||
        text[i] === "\n" ||
        text[i] === " " ||
        text[i] === "\r"
      ) {
        if (buffer.length > 0) {
          vetor.push({
            token: buffer,
            line: j + 1,
          });
          buffer = "";
        }

        if (text[i] !== " " && text[i] !== "\n" && text[i] !== "\r") {
          vetor.push({
            token: text[i],
            line: j + 1,
          });
        }
      } else {
        buffer = buffer + text[i];
        if (i == text.length - 1) {
          vetor.push({
            token: buffer,
            line: j + 1,
          });
        }
      }
    }
  }

  return vetor;
}

/**
 * Função que analiza tokens de acordo com as classes definidas da linguagem
 * @param {token} _tokens
 * @returns
 */
function lexicalAnalysis(_tokens) {
  var lexicalErrors = [];
  var simbolsTable = [];
  for (let i = 0; i < _tokens.length; i++) {
    var lexicalCorrect = false;
    let j;
    for (j = 0; j < tokenClasses.length; j++) {
      if (tokenClasses[j].re.test(_tokens[i].token)) {
        lexicalCorrect = true;
        break;
      }
    }
    if (!lexicalCorrect || _tokens[i].token.length > 31) {
      lexicalErrors.push(_tokens[i]);
    } else {
      _tokens[i].tokenClass = tokenClasses[j].tokenClass;
    }
  }
  return { lexicalErrors, tokenList: _tokens };
}

/**
 * Função que determina a possivel causa do erro léxico
 * @param {string} token - Palavra a ser analisada
 * @returns {string} - Descrição do possivel erro léxico
 */
function describeLexicalError(token) {
  if (token.length > 31) {
    return "Tamanho excessivo";
  } else if (erTest[1].test(token)) {
    return "Número mal formado";
  } else if (erTest[0].test(token)) {
    return "Identificador mal formado";
  } else if (erTest[2].test(token)) {
    return "Caracter mal formado";
  } else if (erTest[3].test(token)) {
    return "String mal formada";
  } else {
    return "Símbolo desconhecido";
  }
}
