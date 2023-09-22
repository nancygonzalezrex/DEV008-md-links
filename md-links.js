const {
  validateFile,
  isAbsolute,
  converAbsolute,
  isFile,
  readThisFile,
} = require("./function-assistant.js");
// funcion madre md-link devuelve una promesa que resuelve o rechaza con enlaces encontrados en el archivo o mensajes de error
//toma 2 argumentos path (una cadena que representa la ruta del archivo) 
// option (un objeto que contiene opciones de configuración, por defecto se establece como false si no se proporciona
const mdLinks = (path, option = false) =>
  new Promise((resolve, reject) => {
    //Se desestructura el objeto option para obtener las propiedades validate y stats. 
    const {validate, stats} = option;
    //Aquí se llama a la función validateFile para verificar si la ruta especificada en path es válida 
    //Si la ruta no existe, se rechaza la promesa con el mensaje "No existe ruta".
    const exist = validateFile(path);
    let conver = path;
    if (exist) {
      //Si la ruta no es absoluta, se llama a la función converAbsolute para convertirla en una ruta absoluta
      const absolute = isAbsolute(path);
      console.log('Es una ruta absoluta', absolute)
      if (!absolute) {
        console.log('Convertir a una ruta absolute')
        conver = converAbsolute(conver);
      }
      //Se llama a la función isFile para verificar si la ruta (ya sea absoluta o convertida) corresponde a un archivo. 
      //Si es un archivo, se procede a la lectura de los enlaces en ese archivo; de lo contrario, se rechaza la promesa con el mensaje "Es una carpeta".
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
