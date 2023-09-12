const mdLinks = require("./md-links.js");

mdLinks("evident/README2.md", { validate: true }).then(link => console.log(link));

module.exports = mdLinks;
