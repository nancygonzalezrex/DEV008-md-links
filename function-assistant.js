//importo la funcion readFile del modulo fs/promises
const { readFile } = require("fs/promises");
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

function readThisFile(filePath, validate) {
  //lectura de archivos
  const readMd = fs.readFileSync(filePath, { encoding: "utf8" });
  const { links } = markdownLinkExtractor(readMd);
  return validarLinks(links, validate);
}

const getLink = (link, validate) =>
  new Promise((resolve) => {
    let paramLink;
    axios(link)
      .then((response) => {
        paramLink = {
          href: link,
        };
        if (validate) {
          paramLink = {
            ...paramLink,
            status: response.status,
            ok: "ok",
          };
        }
        resolve(paramLink);
      })
      .catch(() => {
        paramLink = {
          href: link,
        };
        if (validate) {
          paramLink = {
            ...paramLink,
            status: 404,
            ok: "fail",
          };
        }
        resolve(paramLink);
      });
  });

const validarLinks = (links, validate) =>
  new Promise((resolve) => {
    const newLinks = [];
    links.forEach((link) => newLinks.push(getLink(link, validate)));
    Promise.all(newLinks)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => err);
  });

module.exports = {
  validateFile,
  isAbsolute,
  converAbsolute,
  isFile,
  readThisFile,
};
