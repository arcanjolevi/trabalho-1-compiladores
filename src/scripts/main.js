import {
  fileSelector,
  fileStatus,
  fileBtn,
  selectOtherFileBtn,
  startBtn,
} from "./objects.js";
import {
  separateTokens,
  lexicalAnalysis,
  describeLexicalError,
} from "./lexical.js";
import {
  ShowErrorsList,
  toggleAcceptOtherFiles,
  suspendMain,
  changeErrorsListTitle,
  addLexicalError,
  clearLexicalErros,
} from "./graphical.js";
import { readFile } from "./file.js";

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
  clearLexicalErros();
  fileStatus.innerHTML = "Nenhum arquivo selecionado";
});

/**
 * Determinação de ações quando o botão de fazer análise Lexica for ativado
 */
startBtn.addEventListener("click", (evt) => {
  suspendMain(true);
  clearLexicalErros();
  var errors = lexicalAnalysis(tokens);
  changeErrorsListTitle(`${errors.length} Erros léxicos encontrados:`);

  ShowErrorsList(true);
  for (let i = 0; i < errors.length; i++) {
    addLexicalError(
      errors[i].line,
      errors[i].token,
      describeLexicalError(errors[i].token)
    );
  }
});
