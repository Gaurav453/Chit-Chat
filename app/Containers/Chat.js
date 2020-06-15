import React, { Component } from 'react'
import { BackHandler, View, Button } from 'react-native'

import { GiftedChat,InputToolbar,Actions,} from 'react-native-gifted-chat'
//import { renderActions,renderInputToolbar,renderComposer} from './custom'

import Icon from 'react-native-ionicons'

import {openDatabase, deleteDatabase } from 'react-native-sqlite-storage'

import ImagePicker from 'react-native-image-picker'
import UUIDGenerator from 'react-native-uuid-generator';
import DocumentPicker from 'react-native-document-picker'


import { getClient } from './connection'
import { Socket } from 'react-native-tcp'
import AsynStorage from '@react-native-community/async-storage'
import AsyncStorage from '@react-native-community/async-storage'

let userID;
const db = openDatabase({name:'local.db'})
let client



// var renderBubble = props => {
//   return (
//     <Bubble
//       {...props}
//       wrapperStyle={{
//         left: {
//           backgroundColor: '#f0f0f0',
//         },
//       }}
//     />
//   )
//   }
const chooseDocument = async ()=>{
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf,DocumentPicker.types.plainText],
    });
        console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );
      handleDocumentUpload(res);
    
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else {
      throw err;
    }
  }
  
}
var handleDocumentUpload = (document) => {
  fetch("http://192.168.43.230:8080/api/upload/document", {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data'
    },
    body: createFormData(document, { id:userID },'document')
  })
    .then(response => response.json())
    .then(response => {
      console.log("upload  this.setState({ photo: null });succes", response);
      alert("Upload success!");
    })
    .catch(error => {
      console.log("upload error", error);
      alert("Upload failed!");
    });
};


const createFormData = (file, body,type) => {
  const data = new FormData();

  data.append(type, {
    name: type==='photo' ? file.fileName : file.name,
    type: file.type,
    uri: file.uri 
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};


var handleUploadPhoto = (photo) => {
  fetch("http://192.168.43.230:8080/api/upload", {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data'
    },
    body: createFormData(photo, { id:userID },'photo')
  })
    .then(response => response.json())
    .then(response => {
      console.log("upload  this.setState({ photo: null });succes", response);
      alert("Upload success!");
    })
    .catch(error => {
      console.log("upload error", error);
      alert("Upload failed!");
    });
};




var chooseFile = () => {
  var options = {
    title: 'Select Image',
    customButtons: [
      { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
    ],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  ImagePicker.showImagePicker(options, response => {
    //console.log('Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      //console.log('User tapped custom button: ', response.customButton)
      console.log('choose document')
    
      //alert(response.customButton);
    } else {
      let source = response;
      console.log(response.uri)
      handleUploadPhoto(response)
      // You can also display the image using data:
      // let source = { uri: 'data:image/jpeg;base64,' + response.data };
    }
  });
};


const renderActions = (props) => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => (
      <Icon style={{ margin : 2}} name={'md-photos'} color={'blue'}></Icon>
    )}
    options={{
      'Send Image': () => {
        chooseFile()
        console.log('Choose From Library');
      },
      'Send file':()=>{
          chooseDocument()
      },
      Cancel: () => {
        console.log('Cancel');
      },
    }}
    optionTintColor="#222B45"
  />
);



export default class Chat extends Component{
    constructor(props){
        super(props)
        //this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
          messsages:[
            
          ],
            id:0,
            data:{},
            to: 0,
            userName: ''

        }
    }
    
    componentDidMount(){
     // alert(this.props.route.params.to)
      //BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      userID = this.props.route.params.id
      this.setState({
        id: parseInt(this.props.route.params.id),
        to: parseInt(this.props.route.params.to)
        

      },()=>{
        fetch(`http://192.168.43.230:8080/getUser?id=${this.state.id}`)
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
          client = this.getSocket()
          //console.log('ok' ,client)
          client.on('data',this.onReceive);
          this.updateState()
          
        })
      })
    }
    async getUserName() {
      const value = await AsyncStorage.getItem('userName')
      this.setState({
        userName : value
      })
    }
    getSocket(){

       return getClient()
    }

    updateState(){
      console.log('alert is',this.state.id,this.state.to)
      //console.log('I recieved a message and line no 64')
      db.transaction(tx =>{
        tx.executeSql(
          'SELECT * FROM messages where user_id=? AND too=? OR user_id=? AND too=? ORDER BY createdAt DESC',
          [this.state.id,this.state.to,this.state.to,this.state.id],
          (tx,result)=>{
            //console.log(row)
            var row = result.rows
            var data = row.raw()
            console.log(data)
            var all_messages = []
            var flag = 0
            data.forEach(element=> {
              console.log('; first',all_messages)
              var t = new Date(JSON.parse(element.createdAt))
              console.log(t)
              var message = {
                _id: element._id,
                createdAt: t,
                text:element.text,
                to:element.too,
                user: {
                  _id : element.user_id,
                  name:element.user_name,
                  avatar: element.avtar
                },
                image:element.image
              }
              if(element.read === 1){
                console.log('ok')
                flag = flag + 1;
                this.readMessage(element._id)

              }
              all_messages.push(message) 
            });

            UUIDGenerator.getRandomUUID()
          .then(uuid => {
              var n
              n  =  {
              _id: uuid,
              text: 'You got new a message',
              createdAt: new Date(),
              system: true,
              // Any additional custom parameters are passed through
            }

            if(flag>0){
            var temp_1 = all_messages.slice(0,flag)
            var temp_2 = all_messages.slice(flag,)

            all_messages = temp_1.concat(n,temp_2)
            }

            console.log('fina;',all_messages)
            this.setState({
              messages:all_messages
            })

        })
    .catch(err => console.log(err)) 
          },
          (err =>{ 
            console.log('lien no 108 chat',err)
          })
        )
      })
    }

    


    readMessage(id){
      db.transaction(tx=>{
        tx.executeSql(
          'UPDATE messages SET read=? WHERE _id=? ',
          [0,id],
          (tx,result)=> //console.log('Read recipt updated',result),
          (err)=>console.log(err)
        )
      })
    }



    update(data) {
      console.log('my message inserted to db 117 chat ')
      //console.log(JSON.stringify(data.createdAt),typeof(JSON.stringify(data.createdAt)))
      //console.log('ok',typeOf(data.createdAt)
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO messages (_id,createdAt,text,too,user_id,user_name,image,read,avtar) VALUES (?,?,?,?,?,?,?,?,?)',
          [data._id,JSON.stringify(data.createdAt),data.text,data.to,data.user._id,data.user.name,data.image,0,data.user.avatar],
          (tx, result) => {
            console.log('result 125 chat', result);
          },
          (err) => {
            console.log('err 128 chat', err);
          },
        );
      });
    }

    componentWillUnmount(){
      client.removeListener('data',this.onReceive)
      //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick());

    }

    onReceive = (buffer) =>{

        var data = JSON.parse(buffer)
        console.log('chat listner activated',data)
        if(data.msg==="message"){
          var message = data.data
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
          }))
          this.readMessage(message._id)
        }
        else if(data.msg==='Image_link'){
          console.log(`http://192.168.43.230:8080/static/images/${data.data}`);
          UUIDGenerator.getRandomUUID()
          .then(uuid => {
            console.log(uuid)
            var Image_message = {
              _id:uuid,
              to:this.state.to,
              text: '',
              createdAt: new Date(),
              user:{
                _id : this.state.id,
                name : this.state.data.Name
              },
              image:`http://192.168.43.230:8080/static/images/${data.data}`

            }
            let arr =[]
            arr.push(Image_message)
            this.onSend(arr)
          })

        }

        //this.update(message)
        
      
    }
    
    onSend(messages = []) {
        messages[0].to = this.state.to
        if(!messages[0].image) messages[0].image = null
        client.write(JSON.stringify(messages[0]))
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages[0]),
        }))
        this.update(messages[0])
      }
    render(){
      console.log('skksk',this.state.data)
        return(
            <GiftedChat
            messages={this.state.messages}
            isAnimated
            onSend={newMessage => this.onSend(newMessage)}
            user={{ _id: this.state.id,name:this.state.data.Name , avatar : `http://192.168.43.230:8080/static/avtar/${this.state.data.userName}.jpg`}} 
            renderActions={renderActions}
            parsePatterns={(linkStyle) => [
              {
                pattern: /#(\w+)/,
                style: linkStyle,
                onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
              },
            ]}
          
            />

       )
    }
}
