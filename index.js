const mdLinks = require("./md-links.js");

const ruta = "evident/README2.md"

mdLinks(ruta, { validate: true, stats: false}).then(link => console.log(link));

module.exports = mdLinks;
