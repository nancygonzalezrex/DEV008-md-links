const {
  validateFile,
  isAbsolute,
  converAbsolute,
  isFile,
  readThisFile,
} = require("./function-assistant.js");

const mdLinks = (path, option = false) =>
  new Promise((resolve, reject) => {
    const {validate} = option;
    const exist = validateFile(path);
    let conver;
    if (exist) {
      const absolute = isAbsolute(path);
      if (absolute) {
        console.log("es abosluta");
      } else {
        console.log("no es absoluta");
        conver = converAbsolute(path);
        console.log(conver);
      }
      const file = isFile(conver);
      if (file) {
        const links = readThisFile(conver, validate);
        resolve(links);
      } else {
        console.log("es una carpeta");
      }
    } else {
      console.log("no existe path");
    }
  });

module.exports = mdLinks;
