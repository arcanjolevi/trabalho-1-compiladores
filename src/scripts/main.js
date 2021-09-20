var tokens = [];

/**
 * Determinação de ações quando o file selector for ativado
 */
fileSelector.addEventListener("change", (event) => {
  const fileList = event.target.files;

  if (fileList[0]) {
    fileStatus.innerHTML = fileList[0].name;
    toggleAcceptOtherFiles();
    readFile(fileList[0], (fileText) => {
      tokens = separateTokens(fileText);
    });
  }
});

/**
 * Determinação de ações quando o fileBtn for ativado
 */
fileBtn.addEventListener("click", (evt) => {
  fileSelector.click();
});

/**
 * Determinação de ações quando o botão selectOtherFile for ativado
 */
selectOtherFileBtn.addEventListener("click", (evt) => {
  fileSelector.click();
  toggleAcceptOtherFiles();
  ShowErrorsList(false);
  suspendMain(false);
  clearErros();
  fileStatus.innerHTML = "Nenhum arquivo selecionado";
});

/**
 * Determinação de ações quando o botão de fazer análise for ativado
 */
startBtn.addEventListener("click", (evt) => {
  suspendMain(true);
  clearErros();
  const result = lexicalAnalysis(tokens);
  var errorsLex = result.lexicalErrors;

  changeErrorsListTitle(`${errorsLex.length} Erros encontrados:`);

  ShowErrorsList(true);

  clearErros();

  for (let i = 0; i < errorsLex.length; i++) {
    addError(
      errorsLex[i].line,
      errorsLex[i].token,
      describeLexicalError(errorsLex[i].token)
    );
  }

  const { syntErrors, syntTree } = parser(result.tokenList);

  var aux = "";

  for (let j = 0; j < syntTree.length; j++) {
    aux = aux + syntTree[j] + "\n";
  }

  // writeFile("arvore", aux);

  changeErrorsListTitle(`${syntErrors.length} Erros encontrados:`);
  for (let i = 0; i < syntErrors.length; i++) {
    addError(
      syntErrors[i].token.line,
      syntErrors[i].token.token,
      syntErrors[i].description
    );
  }

  changeErrorsListTitle(
    `${errorsLex.length + syntErrors.length} Erros encontrados:`
  );
});
