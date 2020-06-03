import React, { Component } from 'react'
import { } from 'react-native'

import { GiftedChat } from 'react-native-gifted-chat'
import {openDatabase, deleteDatabase } from 'react-native-sqlite-storage'

import { getClient } from './connection'

const db = openDatabase({name:'local.db'})
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
        fetch(`http://192.168.43.230:8080/getUser?id=${this.state.id}`)
        .then((response) => response.json())
        .then(json => {
          this.setState({
            data:{...JSON.parse(json)}
            
          },()=>{
            console.log(this.state.data)
          })
        }).then(()=>{

          console.log(this.state.id)
          db.transaction(tx =>{
            
            tx.executeSql(
              'SELECT * FROM messages WHERE too=? OR user_id=?',
              [this.state.id,this.state.id],
              ((tx,result)=>{
                var rows = result.rows
                for(i=0;i<rows.length;i++){
                  data = rows.item(0)
                  console.log(data)
                  message = {
                    _id:data._id,
                    createdAt:data.createdAt,
                    text:data.text,
                    to:data.too,
                    user:{
                      _id:data.user_id,
                      name:data.user_name
                    }
                  }
                  console.log(message)
                  this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, message),
                  }))
                }
              }),
              (err =>{ 
                console.log(err)
              })
            )
          })

        })

      })
  
      

    }
    update(data) {
      console.log('ok',data._id,data.createdAt,data.text,data.to,data.user._id,data.user.name)
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO messages (_id,createdAt,text,too,user_id,user_name) VALUES(?,?,?,?,?,?)',
          [data._id,data.createdAt,data.text,data.to,data.user._id,data.user.name],
          (tx, result) => {
            console.log('result', result,tx);
          },
          (err) => {
            console.log('err', err);

          },
        );
      });
    }
    
    onSend(messages = []) {
        const socket =getClient()
        messages[0].to = 2
        //socket.write(JSON.stringify(messages[0]))
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
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
