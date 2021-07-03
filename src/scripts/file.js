export function readFile(file, callback) {
  var reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = function (evt) {
    callback(evt.target.result);
  };
}
