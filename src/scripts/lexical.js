const regularExpressions = [
  /^[i][n][t]$/,
  /^[c][h][a][r]$/,
  /^[f][l][o][a][t]$/,
  /^[v][o][i][d]$/,
  /^[(]$/,
  /^[)]$/,
  /^[{]$/,
  /^[}]$/,
  /^[i][f]$/,
  /^[e][l][s][e]$/,
  /^[w][h][i][l][e]$/,
  /^[m][a][i][n]$/,
  /^[r][e][t][u][r][n]$/,
  /^[+]$/,
  /^[-]$/,
  /^[*]$/,
  /^[/]$/,
  /^[;]$/,
  /^[;]$/,
  /^[=]$/,
  /^[&]$/,
  /^[>]$/,
  /^[<]$/,
  /^[0-9]+$/,
  /^[0-9]+[.][0-9]+$/,
  /^[_a-z][_a-z0-9]*$/,
];

export function separateTokens(text) {
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

  return vetor;
}

export function lexicalAnalysis(_tokens) {
  var lexicalErrors = [];
  for (let i = 0; i < _tokens.length; i++) {
    var lexicalCorrect = false;
    for (let j = 0; j < regularExpressions.length; j++) {
      if (regularExpressions[j].test(_tokens[i].token)) {
        lexicalCorrect = true;
        break;
      }
    }
    if (!lexicalCorrect) {
      lexicalErrors.push(_tokens[i]);
      console.table(
        "Lexical Error\n" +
          "'" +
          _tokens[i].token +
          "'" +
          "\nLine: " +
          _tokens[i].line
      );
    }
  }
  return lexicalErrors;
}
