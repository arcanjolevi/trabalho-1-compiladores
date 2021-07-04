/**
 * Definição das classes de token da linguagem
 */
const regularExpressions = [
  /^[i][n][t]$/,
  /^[c][h][a][r]$/,
  /^[f][l][o][a][t]$/,
  /^[v][o][i][d]$/,
  /^[i][f]$/,
  /^[e][l][s][e]$/,
  /^[w][h][i][l][e]$/,
  /^[m][a][i][n]$/,
  /^[r][e][t][u][r][n]$/,
  /^[f][o][r]$/,
  /^[(]$/,
  /^[)]$/,
  /^[{]$/,
  /^[}]$/,
  /^[+]$/,
  /^[-]$/,
  /^[*]$/,
  /^[/]$/,
  /^[;]$/,
  /^[=]$/,
  /^[&]$/,
  /^[>]$/,
  /^[<]$/,
  /^[[]$/,
  /^[\]]$/,
  /^['].[']$/,
  /^["].*["]$/,
  /^[0-9]+$/,
  /^[0-9]+[.][0-9]+$/,
  /^[_a-z][_a-z0-9]*$/,
];

/**
 * Definição de alguns tipos de erros léxicos
 */
const erTest = [
  /*identificador mal formado*/ /^[0-9]+[a-z0-9]*$/,
  /*numero mal formado*/ /^[0-9a-z]+[.]+[0-9a-z]+$/,
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
        text[i] === " "
      ) {
        if (buffer.length > 0) {
          vetor.push({
            token: buffer,
            line: j + 1,
          });
          buffer = "";
        }

        if (text[i] !== " " && text[i] !== "\n") {
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
  console.table(vetor);
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
    for (j = 0; j < regularExpressions.length; j++) {
      if (regularExpressions[j].test(_tokens[i].token)) {
        lexicalCorrect = true;
        break;
      }
    }
    if (!lexicalCorrect || _tokens[i].token.length > 31) {
      lexicalErrors.push(_tokens[i]);
    } else {
      _tokens[i].class = regularExpressions[j];
    }
  }
  return lexicalErrors;
}

/**
 * Função que determina a possivel causa do erro léxico
 * @param {string} token - Palavra a ser analisada
 * @returns {string} - Descrição do possivel erro léxico
 */
function describeLexicalError(token) {
  if (erTest[0].test(token)) {
    return "Identificador mal formatado";
  } else if (erTest[1].test(token)) {
    return "Número mal formado";
  } else if (erTest[2].test(token)) {
    return "Caracter mal formado";
  } else if (erTest[3].test(token)) {
    return "String mal formada";
  } else if (token.length > 31) {
    return "Tamanho excessivo";
  } else {
    return "Símbolo desconhecido";
  }
}
