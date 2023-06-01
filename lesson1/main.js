

function get()
{
    return new Promise(function(resolve,reject)
    {
        resolve('hi')
    })
}
get()
 .then(function(value)
 {
    return new Promise(function(resolve,reject)
    {
        resolve(value);
    })
 })
