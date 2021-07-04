import {
  mainDiv,
  selectOtherFileBtn,
  errorList,
  errorListContainer,
  fileBtn,
  startBtn,
  errorListTitle,
} from "./objects.js";

/**
 * Função que muda o título da lista de erros na tela
 * @param {string} text - Será utlizado como novo título
 */
export function changeErrorsListTitle(text) {
  errorListTitle.innerText = text;
}

/**
 * Função que suspende o conteúdo na tela
 * @param {boolean} condition - Determina se o conteúdo estará suspenso ou não suspenso
 */
export function suspendMain(condition) {
  mainDiv.classList.remove("not-suspended");
  mainDiv.classList.remove("suspended");
  if (condition) {
    mainDiv.classList.add("suspended");
  } else {
    mainDiv.classList.add("not-suspended");
  }
}

/**
 * Funcção que habilita ao usuários entrar com outro arquivo na interface
 */
export function toggleAcceptOtherFiles() {
  if (
    !selectOtherFileBtn.style.display ||
    selectOtherFileBtn.style.display == "none"
  ) {
    selectOtherFileBtn.style.display = "block";
    fileBtn.style.display = "none";
    startBtn.style.display = "block";
  } else {
    selectOtherFileBtn.style.display = "none";
    fileBtn.style.display = "block";
    startBtn.style.display = "none";
  }
}

/**
 * Função que adiciona um erro léxico na tela
 * @param {string} line - Linha na qual o Erro ocorreu
 * @param {string} text - Token
 * @param {string} description - Descrição do erro
 */
export function addLexicalError(line, text, description) {
  var newElement = document.createElement("li");
  newElement.innerHTML = `<h3>Erro na linha ${line}: "  ${text}  "</h3><p>${description}</p>`;
  errorList.appendChild(newElement);
}

/**
 * Função que limpa todos os erros léxicos na tela
 */
export function clearLexicalErros() {
  var first = errorList.firstElementChild;
  while (first) {
    first.remove();
    first = errorList.firstElementChild;
  }
}

/**
 * Função que mostra ou oculta a lista de erros na tela
 * @param {boolean} condition - Determina se a lista aparece ou não na tela
 */
export function ShowErrorsList(condition) {
  if (condition) {
    errorListContainer.style.display = "block";
  } else {
    errorListContainer.style.display = "none";
  }
}
