import {
  fileSelector,
  fileStatus,
  fileBtn,
  selectOtherFileBtn,
  startBtn,
} from "./objects.js";
import { separateTokens, lexicalAnalysis } from "./lexical.js";
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

fileBtn.addEventListener("click", (evt) => {
  fileSelector.click();
});

selectOtherFileBtn.addEventListener("click", (evt) => {
  fileSelector.click();
  toggleAcceptOtherFiles();
  ShowErrorsList(false);
  suspendMain(false);
  clearLexicalErros();
  fileStatus.innerHTML = "Nenhum arquivo selecionado";
});

startBtn.addEventListener("click", (evt) => {
  suspendMain(true);
  clearLexicalErros();
  var errors = lexicalAnalysis(tokens);
  changeErrorsListTitle(`${errors.length} Erros léxicos encontrados:`);

  ShowErrorsList(true);
  for (let i = 0; i < errors.length; i++) {
    addLexicalError(errors[i].line, errors[i].token, "description");
  }
});
