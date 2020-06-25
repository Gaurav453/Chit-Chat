import React, { Component } from 'react'
import { } from 'react-native'

import { GiftedChat } from 'react-native-gifted-chat'
import {openDatabase, deleteDatabase } from 'react-native-sqlite-storage'


import { getClient } from './connection'


const db = openDatabase({name:'local.db'})
let client
export default class Chat extends Component{
    constructor(props){
        super(props)
        this.state = {
            messages:[],
            id:0,
            data:{},
            to: 0,

        }
    }
    
    componentDidMount(){
      this.setState({
        id:this.props.route.params.id,
        to:this.props.route.params.to

      },()=>{
        fetch(`http://192.168.0.104:8080/getUser?id=${this.state.id}`)
        .then((response) => response.json())
        .then(json => {
          this.setState({
            data:{...JSON.parse(json)}
            
          },()=>{
            //console.log(this.state.data)
          })
        })
        .then(()=>{
          //console.log(this.state.id)
          db.transaction(tx =>{
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS messages (_id VARCHAR(36), createdAt VARCHAR(25), text VARCHAR(200),too INTEGER,user_id INTEGER,user_name VARCHAR(30))',
                [],
                (tx=> {}),
                (err =>console.log('errr line no 50 chat',err))
            )
          })
          client = this.getSocket()
          //console.log('ok' ,client)
          this.updateState()
          this.onReceive()
        })
      })
    }

    getSocket(){

       return getClient()
    }

    updateState(){
      //console.log('I recieved a message and line no 64')
      db.transaction(tx =>{
        tx.executeSql(
          'SELECT * FROM messages',
          [],
          (tx,result)=>{
            var row = result.rows
            var data = row.raw()
            console.log(data)
            data.forEach(element=> {
              console.log(element,typeof(element))
              
              t = new Date(JSON.parse(element.createdAt))
              console.log(t)
              var message = {
                _id: element._id,
                createdAt: t,
                text:element.text,
                to:element.too,
                user: {
                  _id : element.user_id,
                  name:element.user_name
                }
              }
              
              console.log(message)
              //console.log('mess line no 100 chat',message)
              this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, message),
              }))

              
            });

            //console.log('oppp',row.item(0).createdAt,typeof(row.item(0).createdAt))
            //console.log('type',s,typeof(s))
            // var mail = new Date(s)
            // //console.log("okkkk",mail,typeof(mail))
            // //console.log(row.length)
            // for(let i=0;i<row.length;i++){
            //   //console.log('in')
            //   // console.log(row)
            //   data = row.item(i)
            //   t = new Date(JSON.parse(data.createdAt))
            //   //console.log(t)
            //   //console.log(data._id,data.text,data.too,data.user_id)
            //   var message = {
            //     _id: data._id,
            //     createdAt: t,
            //     text:data.text,
            //     to:data.too,
            //     user: {
            //       _id : data.user_id,
            //       name:data.user_name
            //     }
            //   }

            // }
            // //console.log('in')
          },
          (err =>{ 
            console.log('lien no 108 chat',err)
          })
        )
      })
    }



    update(data) {
      console.log('my message inserted to db 117 chat ')
      //console.log(JSON.stringify(data.createdAt),typeof(JSON.stringify(data.createdAt)))
      //console.log('ok',typeOf(data.createdAt)
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO messages (_id,createdAt,text,too,user_id,user_name) VALUES (?,?,?,?,?,?)',
          [data._id,JSON.stringify(data.createdAt),data.text,data.to,data.user._id,data.user.name],
          (tx, result) => {
            console.log('result 125 chat', result);
          },
          (err) => {
            console.log('err 128 chat', err);
          },
        );
      });
    }

    onReceive(){
      client.on('data',data=>{
        var message = JSON.parse(data)
        console.log('chat listner activated')
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message),
        }))
        //this.update(message)
        
      })
    }
    
    onSend(messages = []) {
        messages[0].to = this.state.to
        client.write(JSON.stringify(messages[0]))
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages[0]),
        }))
        this.update(messages[0])
      }
    render(){
        return(
            <GiftedChat
            messages={this.state.messages}
            onSend={newMessage => this.onSend(newMessage)}
            user={{ _id: this.state.id,name:this.state.data.Name}} />
        )
    }
}
