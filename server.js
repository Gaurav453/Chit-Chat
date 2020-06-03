var express = require('express')
const app = express()
const net = require('net')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')



const Schema = mongoose.Schema

const user = new Schema({
    Name:{    // const name =  req.body.name
        // const email = req.body.email
        type:String
    },
    Email:{
        type:String
    },
    id:{
        type:Number
    }
})
const User = mongoose.model('user', user,'user');

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());



////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////CHAT SERVER////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////


const server = net.createServer(socket=>{
    socket.on('error',(eror)=>{
        console.log('ok;',eror);
        
    })
})

server.listen(9090,'192.168.43.230')

server.on('connection',(socket)=>{
    console.log('helo clint')   




    socket.on('data',(data)=>{
        console.log(JSON.parse(data))
        socket.write(data)
    })
})
server.on('error',()=>{
    console.log('err')
})

server.on('data',(data)=>{
    console.log(data)
})









app.get('/getUser',(req,res)=>{
    console.log(req.query)
    User.find({id:parseInt(req.query.id)},(err,result)=>{
        res.json(JSON.stringify(result[0]))
    })
})

app.post('/',(req,res)=>{
     const name =  req.body.name
     const email = req.body.email
    console.log(req.body)

    User.find({Email:email},(err,result)=>{
        if(result.length !== 0){
            res.json(JSON.stringify({msg:"fail"}))

        }
        else{
            User.find({},(err,result)=>{
                var id = result.length+1
                const obj = new User({Name:name,Email:email,id:id})
                obj.save((err)=>{
                    if(err) throw err
                    res.json(JSON.stringify({id:id,msg:"success"}))
                })
            })
        }
    })
    

})






mongoose.connect('mongodb://localhost:27017/Global',{useNewUrlParser: true})
.then(()=>{
    app.listen(8080,'192.168.43.230')
    console.log("ok")
})