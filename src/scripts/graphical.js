import {
  mainDiv,
  selectOtherFileBtn,
  errorList,
  errorListContainer,
  fileBtn,
  startBtn,
  errorListTitle,
} from "./objects.js";

export function changeErrorsListTitle(text) {
  errorListTitle.innerText = text;
}

export function suspendMain(condition) {
  if (mainDiv.classList.contains(condition)) {
    mainDiv.classList.remove("not-suspended");
    mainDiv.classList.add("suspended");
  } else {
    mainDiv.classList.remove("suspended");
    mainDiv.classList.add("not-suspended");
  }
}

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

export function addLexicalError(line, text, description) {
  var newElement = document.createElement("li");
  newElement.innerHTML = `<h3>Erro linha ${line}: "${text}"</h3><p>${description}</p>`;
  errorList.appendChild(newElement);
}

export function clearLexicalErros() {
  var first = errorList.firstElementChild;
  while (first) {
    first.remove();
    first = errorList.firstElementChild;
  }
}

export function ShowErrorsList(condition) {
  if (condition) {
    errorListContainer.style.display = "block";
  } else {
    errorListContainer.style.display = "none";
  }
}
