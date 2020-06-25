var Net = require('react-native-tcp')
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({ name:'local.db'})

var client;
exports.cli = (port,host) => {
     client = Net.createConnection({
      port:9090,
<<<<<<< HEAD
      host: '192.168.43.205',
=======
      host: '192.168.0.104',
>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa
      localHost: host,
      localPort: port

    },()=>{
      client.write(JSON.stringify({msg:'connected',id:port-8090}))
    })

<<<<<<< HEAD
    // db.transaction(tx => {
    //     tx.executeSql(
    //         'DROP TABLE messages',
    //         [],
    //         ()=>{},
    //         (err)=>{console.log(err)}
    //     )
    // })
    db.transaction(tx =>{
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS messages (_id VARCHAR(36), createdAt VARCHAR(25), text VARCHAR(200),too INTEGER,user_id INTEGER,user_name VARCHAR(30),user_userName,image VARCHAR,read INTEGER,avtar VARCHAR)',
            [],
            ((tx,result)=>{
               console.log('connection line no 31',result)
            }
            ),
            (err =>{
                console.log('connection line no 31',err)
            })
=======
>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa

    client.on('data',(dat) => { 
       data =  JSON.parse(dat)
       console.log('data listner of connection registerd')
       console.log(data)
       console.log('message for from',data.to,data.user._id)
      if(true)
      {
        db.transaction(tx =>{
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS messages (_id VARCHAR(36), createdAt VARCHAR(25), text VARCHAR(200),too INTEGER,user_id INTEGER,user_name VARCHAR(30))',
                [],
                ((tx,result)=>{
                   // console.log('connection line no 31',result)
                }
                ),
                (err =>{
                    console.log('connection line no 31',err)
                })


            )
        })     
            db.transaction(tx =>{
            tx.executeSql(
<<<<<<< HEAD
                'INSERT INTO messages (_id,createdAt,text,too,user_id,user_name,user_userName,image,read,avtar) VALUES(?,?,?,?,?,?,?,?,?,?)',
                [message._id,JSON.stringify(message.createdAt),message.text,parseInt(message.to),parseInt(message.user._id),message.user.name,message.user.userName,smessage.image,1,message.user.avatar],
=======
                'INSERT INTO messages (_id,createdAt,text,too,user_id,user_name) VALUES(?,?,?,?,?,?)',
                [data._id,JSON.stringify(data.createdAt),data.text,parseInt(data.to),parseInt(data.user._id),data.user.name],
>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa
                ((tx,result)=>{
                    console.log('connection line no 46',result)
                }
                ),
                (err =>{
                    console.log('connection line no 50',err)
                })


            )
        })
    }
    })


    client.on('error',(err) =>{
      console.log(err)

    })

  }

exports.getClient = () => {
    //console.log(client)
    return client
}