const fs = require("fs");
const path = require("path");

const inFile = path.join(__dirname, "dist/app.js");
const outFile = path.join(__dirname, "dist/app.bookmarklet.txt");

let code = fs.readFileSync(inFile, "utf8").trim();

fs.writeFileSync(outFile, "javascript:" + encodeURIComponent(code));
