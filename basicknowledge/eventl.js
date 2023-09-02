
const fs = require('fs');
const crypto = require('crypto');

setTimeout(() => {
    console.log('Timer finished');
    
}, 0);

setImmediate(() => {
    console.log('immediate finished');
})

fs.readFile('tesst.txt',()=>{
    console.log('I/O finished');
})

console.log('Hello man');