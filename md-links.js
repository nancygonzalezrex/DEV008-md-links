const {
  validateFile,
  isAbsolute,
  converAbsolute,
  isFile,
  readThisFile,
} = require("./function-assistant.js");
// funcion madre md-link que retorna una promesa 
const mdLinks = (path, option = false) =>
  new Promise((resolve, reject) => {
    const {validate, stats} = option;
    const exist = validateFile(path);
    let conver = path;
    if (exist) {
      const absolute = isAbsolute(path);
      console.log('Es una ruta absoluta', absolute)
      if (!absolute) {
        console.log('Convertir a una ruta absolute')
        conver = converAbsolute(conver);
      }
      const file = isFile(conver);
      if (file) {
        const links = readThisFile(conver, validate, stats);
        resolve(links);
      } else {
        reject("Es una carpeta");
      }
    } else {
      reject("No existe ruta");
    }
  });

module.exports = mdLinks;
