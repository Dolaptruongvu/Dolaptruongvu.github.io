const fs = require('fs')
const express = require('express')
const app = express()
const router = express.Router()


// middleware
app.use(express.json())
app.use('/api/vers/users',router) // register for router with link

router.use((req,res,next)=>{
    console.log('hello from middleware')
    console.log(req.body)
    next()
})

router.param('id',(req,res,next,val)=>{
    console.log(val);
    next()
})


const getf = (req,res) =>{
    res
    .status(200)
    .json({
        status :"success",
        data:null
    })
}

router
 .route('/')
 .get(getf)

 router
 .route('/:id')
 .get(getf)

 app.listen(2000,(err)=>{
    console.log('server is running')
 })
