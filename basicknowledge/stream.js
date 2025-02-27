const { error } = require('console');
const fs = require('fs')
const server =  require('http').createServer();

server.on('request',(req,res)=>{
    // Solution 1 
    // fs.readFile('tesst.txt',(err,data)=>{
    //     if(err) console.log(err);
    //     res.end(data);

    // })
    //Solution 2
    // const readable = fs.createReadStream('tesst.txt')
    // readable.on('data',chunk=>{
    //     res.write(chunk)
    // })
    // readable.on('end',()=>{
    //     res.end();
    // })
    // readable.on('error',err =>{
    //     console.log(err)
    //     res.statusCode =500;
    //     res.end('file not found')
    // })
    // Solution 3
        const readable = fs.createReadStream('tesst.txt')
        readable.pipe(res);
})

server.listen(8000,'127.0.0.1')
{
    console.log('listening...')
}