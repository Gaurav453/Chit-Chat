import React, { Component } from 'react'
import { } from 'react-native'


import { GiftedChat } from 'react-native-gifted-chat'


export default class Chat extends Component{
    constructor(props){
        super(props)
        this.state = {
            messages:[
 
                  // example of chat message
                  {
                    _id: 1,
                    text: 'Hello!',
                    createdAt: new Date().getTime(),
                    user: {
                      _id: 2,
                      name: 'Test User'
                    }
                  },
                  {
                    _id: 2,
                    text: 'Hey there!',
                    createdAt: new Date().getTime(),
                    user: {
                      _id: 2,
                      name: 'Test User'
                    }
                  },
                  {
                    _id: 3,
                    text: 'Hey there!',
                    createdAt: new Date().getTime(),
                    user: {
                      _id: 4,
                      name: 'gest User'
                    }
                  }
            ]

        }
    }
    onSend(messages = []) {
        console.log(messages)
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }))
      }
    render(){
        return(
            <GiftedChat
            messages={this.state.messages}
            onSend={newMessage => this.onSend(newMessage)}
            user={{ _id: 2 }} />
        )
    }
}