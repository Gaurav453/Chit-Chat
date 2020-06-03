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
      console.log('con')
    })


    client.on('data',(data) => { 
       data =  JSON.parse(data)
      if(data.too === port-8090)
      {
        db.transaction(tx =>{
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS messages (_id VARCHAR(36), createdAt VARCHAR(25), text VARCHAR(200),too INTEGER,user_id INTEGER,user_name VARCHAR(30))',
                [],
                ((tx,result)=>{
                    console.log(result)
                }
                ),
                (err =>{
                    console.log(err)
                })


            )
        })     
            db.transaction(tx =>{
            tx.executeSql(
                'INSERT INTO messages (_id,createdAt,text,too,user_id,user_name) VALUES(?,?,?,?,?,?)',
                [data._id,data.createdAt,data.text,parseInt(data.to),parseInt(data.user._id),data.user.name],
                ((tx,result)=>{
                    console.log(result)
                }
                ),
                (err =>{
                    console.log(err)
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
    return client
}