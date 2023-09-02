console.log(arguments)

const C = require('./testmodules');
const calc1 = new C();

console.log(calc1.add(2,5));

const {add,multiply} = require('./modules2');
console.log(add(2,5));

// caching
require('./modules3')();
require('./modules3')();
require('./modules3')();