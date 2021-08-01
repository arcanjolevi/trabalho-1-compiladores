/**
 * Função que lê os dados de um arquivo
 * @param {File} Arquivo que será lido
 * @param {function} callback que será chamada com o conteúdo do arquivo
 */
function readFile(file, callback) {
  var reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = function (evt) {
    callback(evt.target.result);
  };
}

/**
 * Função que guarda um arquivo na máquina
 * @param {string} fileName
 * @param {string} text
 */
function writeFile(fileName, text) {
  var blob = new Blob([text], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, fileName);
}
