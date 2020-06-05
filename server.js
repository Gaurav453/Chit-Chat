var express = require('express')
const app = express()
const net = require('net')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

var socket_array={}


var
    address
    ,os = require('os')
    ,ifaces = os.networkInterfaces();


// Iterate over interfaces ...
for (var dev in ifaces) {

    // ... and find the one that matches the criteria
    var iface = ifaces[dev].filter(function(details) {
        return details.family === 'IPv4' && details.internal === false;
    });

    if(iface.length > 0) address = iface[0].address;
}

// Print the result
console.log(address);


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

server.listen(9090,address)

server.on('connection',(socket)=>{
   // console.log('helo clint',socket.localPort,socket.localAddress,socket.remotePort,socket.address())
   console.log('connected')
    
    socket.on('data',(data)=>{
        var message = JSON.parse(data)
        console.log(message)

        socket.on('end',()=> { console.log('socket closed with id no',message.id)
        // socket_array[message.id] = null
        // console.log('arr rem',socket_array)
            console.log('end')
         })
    
        //console.log(message)
        //console.log(socket,typeof(socket))
        //console.log('arr',socket_array)
        var ids = `${message.id}`
        console.log(ids,typeof(ids))
        if(message.msg==='connected'){
            console.log('connection')
            socket_array[ids] = socket
            //console.log('put arr',socket_array)
        }
        else{
            idm = `${message.to}`
            console.log(idm)
            console.log(socket_array)
            socket_array[idm].write(JSON.stringify(message))
        }
    })

})


server.on('error',()=>{
    console.messagelog('err')
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
    app.listen(8080,address)
    console.log("ok")
})