// se inmporta modulo md-links 
const mdLinks = require("./md-links.js");

const rutaRelativa = "/Users/nancygonzalez/Desktop/PROYECTO_LABORATORIA/DEV008-md-links/evident/README2.md"
const rutaAbsolute = "evident/README2.md"
//llamo la funcion md-links importada , se pasa la ruta como primer argumento y un objeto de opciones como segundo argumento 
//validacion de los enlaces y que no se deben mostrar estadisticas 
mdLinks(rutaRelativa , { validate: true, stats: false})
// bloque then para manejar la promesa resultante si se cumple se imprime en cnsola, la variable link contiene los reultados, los enlaces 
.then(link => console.log(link))
//para manejar cualquier error que ocurra en la ejecucion de md-links 
.catch(error => console.log('error', error));

module.exports = mdLinks;
