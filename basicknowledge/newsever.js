
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');


console.log(slugify('HI',{lower:true}));

const server = http.createServer((req,res)=>{

    const path = req.url;
    if ( path === '/overview')
    {
        res.end('This is OVERVIEW');

    }else if ( path === '/product')
    {
        res.end('This is PRODUCT');

    }else if (path === '/api') 
    {

        fs.readFile(`${__dirname}/myapi.json`,'utf-8',(err,data)=>{
            const product = JSON.parse(data);
            res.writeHead(200,{
                 'Content-type':'application/json'
            })
            res.end(data)
        })
        
    }
    else {
        res.writeHead(404,{
            'Content-type' : 'text/html',
            'my-own-header':'Hello world'
        })
        res.end('<h1>Page is not found !</h1>');
    }
    
})

server.listen(8000,'127.0.0.1',()=>{
    console.log('Lisening to request on port 8000')
})