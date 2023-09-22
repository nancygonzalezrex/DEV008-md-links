// importacion de librerias para peticiones http
const axios = require("axios");
const fs = require("fs");
//importacion del mudulo para poder extraer los archivos mardown 
const markdownLinkExtractor = require("markdown-link-extractor");
//nodepath es una parte del modulo nativo de path de Node js, para trabajar con rutas 
const pathNode = require("node:path");

//nos verifica si la ruta existe o no existe
const validateFile = function (ruta) {
  return fs.existsSync(ruta);
};
//si la ruta es absoluta
const isAbsolute = function (ruta) {
  return pathNode.isAbsolute(ruta);
};
//si no es absoluta la convierte a absoluta
const converAbsolute = function (ruta) {
  return pathNode.resolve(ruta);
};
// verifica si es archivo o carpeta
const isFile = function (ruta) {
  return fs.statSync(ruta).isFile();
};
//esta funcion toma 3 argumentos 
function readThisFile(filePath, validate, stats) {
  const read = new Promise((resolve, reject) => {
    //para las lecturas de los archivos 
    fs.readFile(filePath, { encoding: "utf8" }, (err, data) => {
      //dentro del calback fs.readfile se manejan errores 
      if (err) {
        reject(Error(`Error reading the file: ${path}`));
      }
      //expresión regular para buscar y capturar cualquier texto que esté contenido entre corchetes 
      const regexForText = /\[([^\[]+)\]/g;
      //almacena un array con todas las coincidencias encontradas en data que cumplan con la expresión regular definida en regexForText.
      const arrayWithText = data.match(regexForText);
      // markdownLinkExtractor extrae todos los link de un archivo markdown 
      //Los enlaces extraídos se almacenan en el objeto links.
      const { links } = markdownLinkExtractor(data, true);
      // formatea los link para obtener una estructura y se mapean los enlaces extraidos + el texto asociado y la ruta del archivo 
      const formatearLinks = links.map((link, i) => {
        // cada objeto resultante debe contener 3 propiedades 
        return {
          href: link,
          text: arrayWithText[i],
          file: filePath,
        };
      });
      //  al validar todos los links, enlaces y devuelva una promesa resuelta con los resultados de la validacion 
      resolve(validarLinks(formatearLinks, links, validate, stats));
    });
  });
  //finalmente la promesa read se devuelve como resultado de la función readThisFile, 
  return read;
}
// getLink verefica si estan OK o fail
const getLink = (link, validate) =>
  new Promise((resolve) => {
    //con el valor 0. Esta variable se utilizará para llevar un registro del número de veces que la solicitud HTTP al enlace ha fallado.
    let countFail = 0
    //Se crea un objeto llamado paramsLink con las propiedades text y file
    // extraídas del objeto link. Esto se hace para preparar los datos que se incluirán en el resultado final.
    let paramsLink = {
      text: link.text,
      file: link.file,
    };
    //se realiza una solicitud http a los enlaces especificados en link y href 
    axios(link.href)
    // se realiza una llamada then y se actualiza el objeto paramsLink con la porpiedad href 
      .then((response) => {
        paramsLink = {
          href: link.href,
          ...paramsLink,
        };
        // si se valida se agrega la propiedad status con el codigo de estado de la respuesta http
        if (validate) {
          paramsLink = {
            ...paramsLink,
            status: response.status,
            ok: "ok",
          };
        }
        // se resuelve la promesa con el objeto paramsLink actualizado 
        resolve(paramsLink);
      })
      // llamada catch en caso de que no ocurra todo lo anterior 
      .catch(() => {
        countFail += 1
        paramsLink = {
          href: link.href,
          ...paramsLink,
        };
        if (validate) {
          paramsLink = {
            ...paramsLink,
            status: 404,
            ok: "fail",
          };
        }
        resolve(paramsLink);
      });
  });
// validarLinks recibe 4 argumentos
const validarLinks = (formatearLinks, links, validate, stats) =>
  new Promise((resolve) => {
    //Se inicializa un array vacío llamado newLinks
    //que se utilizará para almacenar las promesas resultantes de la validación de los enlaces.
    const newLinks = [];
    //recorre el array utilizando un ciclo bucle para saber si estan OK o fail con la function getLink
    formatearLinks.forEach((link) => newLinks.push(getLink(link, validate)));
    // Si la variable stats es true y validate es false, se resuelve la promesa llamando a la función validateStats(links)
    if(stats && !validate) {
      resolve(validateStats(links));
    }
    // Llama a todos los link con promise all 
    //para esperar a que todas las promesas de validación de enlaces se completen. 
    //Promise.all devuelve una nueva promesa que se resuelve cuando todas las promesas en el array newLinks se han resuelto.
    Promise.all(newLinks)
      .then((res) => {
        // se filtran los estados de validacion, para encontrar enlaces rotos, estos se almacenen en un array llamado urlBroken
        const urlBroken = res.filter(iten => iten.status === 404);
        if(stats && validate){
          resolve({
            ...validateStats(links),
            broken: urlBroken.length
          })
        }
        resolve(res);
      })
      .catch((err) => err);
  });
// esta funcion toma como argumento links que es un array de enlaces (url)
const validateStats = function (links) {
  // Se crea un nuevo objeto de tipo Set llamado dataArr a partir del array links
  const dataArr = new Set(links);
  // contiene una copia de los elementos únicos del conjunto dataArr.
  // para convertir el conjunto nuevamente en un array.
  let result = [...dataArr];
  //se devuelve un objeto que tiene dos propiedades 
  return {
    //numero total de enlaces en el arry original incluyendo los duplicados 
    total: links.length,
    // El número de enlaces únicos en el array result, que es la longitud del array result. 
    //Esta propiedad representa la cantidad de enlaces distintos, sin duplicados.
    unique: result.length,
  };
};

module.exports = {
  validateFile,
  isAbsolute,
  converAbsolute,
  isFile,
  readThisFile,
};
