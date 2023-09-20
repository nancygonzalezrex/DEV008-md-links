const mdLinks = require("./md-links.js");

const rutaRelativa = "/Users/nancygonzalez/Desktop/PROYECTO_LABORATORIA/DEV008-md-links/evident/README2.md"
const rutaAbsolute = "evident/README2.md"

mdLinks(rutaRelativa, { validate: true, stats: false})
.then(link => console.log(link))
.catch(error => console.log('error', error));

module.exports = mdLinks;
