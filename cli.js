#!/usr/bin/env node

const mdLinks = require("./md-links.js");
// esta funcion no toma ningun argumento 
const getOptionsFromArgs = () => {
    // aqui validamos si validate y stats se enviaron como argumentos desde la linea de comandos
    // Esta línea verifica si el argumento --validate está presente en el array process.argv
    const validate = process.argv.includes('--validate');
    const stats = process.argv.includes('--stats');
    //devuelve dos objetos 
    return {
      //Esta propiedad tiene el valor true si --validate se pasó como argumento en la línea de comandos y false en caso contrario.
      validate,
      //Esta propiedad tiene el valor true si --stats se pasó como argumento en la línea de comandos y false en caso contrario.
      stats,
    };
  };
  // esta funcion es para llamar a mdlink con lo que tiene la consola
const cli = () => {
    // aqui se almacena las rutas enviadas por la linea de comando
    const path = process.argv[2];
    //imprime en la consola el valor de path para verificar qué ruta se proporcionó desde la línea de comandos
    console.log('path', path);
    //Llama a la función getOptionsFromArgs para obtener las opciones de validación y estadísticas (si se han proporcionado) desde la línea de comandos. 
   // Estas opciones se almacenan en la variable options.
    const options = getOptionsFromArgs();
    //Aquí se invoca una función llamada mdLinks con la ruta y las opciones obtenidas de la línea de comando
    mdLinks(path, options).then((result) => {
      console.log(result);
    })
    .catch(console.error);
  };
  
  cli();