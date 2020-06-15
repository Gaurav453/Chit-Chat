var Net = require('react-native-tcp')
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({ name:'local.db'})

var client;
exports.cli = (port,host) => {
     client = Net.createConnection({
      port:9090,
      host: '192.168.43.230',
      localHost: host,
      localPort: port

    },()=>{
      client.write(JSON.stringify({msg:'connected',id:port-8090}))
    })

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
            'CREATE TABLE IF NOT EXISTS messages (_id VARCHAR(36), createdAt VARCHAR(25), text VARCHAR(200),too INTEGER,user_id INTEGER,user_name VARCHAR(30),image VARCHAR,read INTEGER,avtar VARCHAR)',
            [],
            ((tx,result)=>{
               console.log('connection line no 31',result)
            }
            ),
            (err =>{
                console.log('connection line no 31',err)
            })


        )
    })  
 

    
    client.on('data',(buffer) => { 
       var data =  JSON.parse(buffer)
       console.log('data listner of connection registerd')
       console.log(data)

      if(data.msg==="message")
      {
        var message = data.data
        console.log('message for from',message.to,message.user._id)
            // Insert new messages in new messages.
            db.transaction(tx =>{
            tx.executeSql(
                'INSERT INTO messages (_id,createdAt,text,too,user_id,user_name,image,read,avtar) VALUES(?,?,?,?,?,?,?,?,?)',
                [message._id,JSON.stringify(message.createdAt),message.text,parseInt(message.to),parseInt(message.user._id),message.user.name,message.image,1,message.user.avatar],
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
      console.log('err',err)

    })

  }

exports.getClient = () => {
    //console.log(client)
    return client
}