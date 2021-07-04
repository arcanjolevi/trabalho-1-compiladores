/**
 * Função que lê os dados de um arquivo
 * @param {File} Arquivo que será lido
 * @param {function} callback que será chamada com o conteúdo do arquivo
 */
export function readFile(file, callback) {
  var reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = function (evt) {
    callback(evt.target.result);
  };
}
