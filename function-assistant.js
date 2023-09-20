const axios = require("axios");
const fs = require("fs");
//importacion del mudulo
const markdownLinkExtractor = require("markdown-link-extractor");
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

function readThisFile(filePath, validate, stats) {
  console.log('aqui readThisFile')
  //lectura de archivos
  const read = new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: "utf8" }, (err, data) => {
      if (err) {
        reject(Error(`Error reading the file: ${path}`));
      }
      //expresión regular para buscar y capturar cualquier texto que esté contenido entre corchetes 
      const regexForText = /\[([^\[]+)\]/g;
      //almacena un array con todas las coincidencias encontradas en data que cumplan con la expresión regular definida en regexForText.
      const arrayWithText = data.match(regexForText);
      const { links } = markdownLinkExtractor(data, true);
      const formatearLinks = links.map((link, i) => {
        return {
          href: link,
          text: arrayWithText[i],
          file: filePath,
        };
      });
      
      resolve(validarLinks(formatearLinks, links, validate, stats));
    });
  });
  return read;
}

const getLink = (link, validate) =>
  new Promise((resolve) => {
    let countFail = 0
    let paramsLink = {
      text: link.text,
      file: link.file,
    };
    axios(link.href)
      .then((response) => {
        paramsLink = {
          href: link.href,
          ...paramsLink,
        };
        if (validate) {
          paramsLink = {
            ...paramsLink,
            status: response.status,
            ok: "ok",
          };
        }
        resolve(paramsLink);
      })
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

const validarLinks = (formatearLinks, links, validate, stats) =>
  new Promise((resolve) => {
    const newLinks = [];
    formatearLinks.forEach((link) => newLinks.push(getLink(link, validate)));
    if(stats && !validate) {
      resolve(validateStats(links));
    }
    Promise.all(newLinks)
      .then((res) => {
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

const validateStats = function (links) {
  const dataArr = new Set(links);
  let result = [...dataArr];
  return {
    total: links.length,
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
