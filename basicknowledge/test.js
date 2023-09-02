
const fs = require('fs');

const textin = fs.readFileSync('tesst.txt','utf-8');
console.log(textin)

const textOut = `Thiss is what you know about avocado: ${textin}.\nCreate on ${Date.now()}`;
fs.writeFileSync('tesst.txt',textOut)

console.log('file written')