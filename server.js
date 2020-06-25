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
<<<<<<< HEAD
app.use('/static', express.static('public'));
    



//////////////////////////////////////////////UPLOADING ///////////////////////////////////////////////////

const Storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, './public/images')
    },
    filename(req, file, callback) {
      callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
    },
  })

const Storage2 = multer.diskStorage({
destination(req, file, callback) {
    callback(null, './public/document')
},
filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
},
})

const Storage3 = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './public/avtar')
    },
    filename(req, file, callback) {
        callback(null, `${file.fieldname}`)
    },
    })
  


const upload = multer({ storage: Storage })
const upload2 = multer({ storage: Storage2 })
const upload3 = multer({ storage: Storage3 })

  
  app.post('/api/upload', upload.single('photo'), (req, res) => {
    //console.log('file', req.file)
    //console.log('body', req.body)
    var i = parseInt(req.body.id)
    var id =  `${i}`

    var obj = {msg:'Image_link',data:req.file.filename}
    var m = JSON.stringify(obj)
    console.log('socket is',socket_array[id])
    socket_array[id].write(m)
    res.status(200).json({
      message: 'success!',
    })
  })
  
  app.post('/api/upload/document', upload2.single('document'), (req, res) => {
    console.log('file', req.file)
    //console.log('body', req.body)
    var i = parseInt(req.body.id)
    var id =  `${i}`

    var obj = {msg:'Document_link',data:req.file.filename}
    var m = JSON.stringify(obj)
    socket_array[id].write(m)
    res.status(200).json({
      message: 'success!',
    })
  })

  var fs = require('fs')
  app.post('/api/upload/avtar', upload3.single('avtar'), (req, res) => {
    console.log('file', req.file)
    //console.log('body', req.body)
    var id = req.body.id
    console.log(req.body.id)
    fs.rename(`public/avtar/avtar`,`public/avtar/${id}.jpg`,err => {
        if(err) throw err
        console.log('renamed')
    })

    res.status(200).json({
      message: 'success!',
    })
  })

/////////// 

  const dnssd = require('dnssd2');
 
  // advertise a http server on port 4321
  const ad = new dnssd.Advertisement(dnssd.tcp('http'),4321,{
      name:'_admin'
  });
  ad.start();


/////////








=======
>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa



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
<<<<<<< HEAD
        User.find({},(err,result)=>{
            console.log(result)
            var id = result.length===0 ? 1 : result[result.length-1].id +1
            res.json(JSON.stringify({msg:"pass",id:id}))
        
        })
            
        }
    })
})

app.post('/',(req,res)=>{
     const name =  req.body.name;
     const userName = req.body.userName;
     const pass = req.body.pass;
     const id = req.body.id;

    const obj = new User({Name:name,userName:userName,id:id,pass:pass})
    obj.save((err)=>{
        if(err) throw err
        res.json(JSON.stringify({msg:"success"}))
    })
=======
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
    

>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa
})






mongoose.connect('mongodb://localhost:27017/Global',{useNewUrlParser: true})
.then(()=>{
    app.listen(8080,address)
    console.log("ok")
})