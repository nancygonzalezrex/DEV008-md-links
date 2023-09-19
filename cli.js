#!/usr/bin/env node

const mdLinks = require("./md-links.js");

const getOptionsFromArgs = () => {
    // aqui validamos si validate y stats se enviaron como argumentos desde la linea de comandos
    const validate = process.argv.includes('--validate');
    const stats = process.argv.includes('--stats');
    return {
      validate,
      stats,
    };
  };
  // esta funcion es para llamar a mdlink con lo que tiene la consola
const cli = () => {
    // aqui se almacena las rutas enviadas por la linea de comando
    const path = process.argv[2];
    console.log('path', path);
    const options = getOptionsFromArgs();
    mdLinks(path, options).then((result) => {
      console.log(result);
    })
    .catch(console.error);
  };
  
  cli();