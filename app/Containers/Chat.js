import React, { Component } from 'react'
import { } from 'react-native'

import { GiftedChat } from 'react-native-gifted-chat'
import {openDatabase, deleteDatabase } from 'react-native-sqlite-storage'


import { getClient } from './connection'


const db = openDatabase({name:'local.db'})
let client
<<<<<<< HEAD



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
  fetch("http://192.168.43.205:8080/api/upload/document", {
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
  fetch("http://192.168.43.205:8080/api/upload", {
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



=======
>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa
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
<<<<<<< HEAD
        fetch(`http://192.168.43.205:8080/getUser?id=${this.state.id}`)
=======
        fetch(`http://192.168.0.104:8080/getUser?id=${this.state.id}`)
>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa
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
<<<<<<< HEAD
              //console.log('; first',all_messages)
              var t = new Date(JSON.parse(element.createdAt))
=======
              console.log(element,typeof(element))
              
              t = new Date(JSON.parse(element.createdAt))
>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa
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
      console.log('ok',data.userName)
      db.transaction((tx) => {
        tx.executeSql(
<<<<<<< HEAD
          'INSERT INTO messages (_id,createdAt,text,too,user_id,user_name,user_userName,image,read,avtar) VALUES (?,?,?,?,?,?,?,?,?,?)',
          [data._id,JSON.stringify(data.createdAt),data.text,data.to,data.user._id,data.user.name,data.user.userName,data.image,0,data.user.avatar],
=======
          'INSERT INTO messages (_id,createdAt,text,too,user_id,user_name) VALUES (?,?,?,?,?,?)',
          [data._id,JSON.stringify(data.createdAt),data.text,data.to,data.user._id,data.user.name],
>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa
          (tx, result) => {
            console.log('result 125 chat', result);
          },
          (err) => {
            console.log('err 128 chat', err);
          },
        );
      });
    }

<<<<<<< HEAD
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
          console.log(`http://192.168.43.205:8080/static/images/${data.data}`);
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
              image:`http://192.168.43.205:8080/static/images/${data.data}`

            }
            let arr =[]
            arr.push(Image_message)
            this.onSend(arr)
          })

        }

=======
    onReceive(){
      client.on('data',data=>{
        var message = JSON.parse(data)
        console.log('chat listner activated')
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message),
        }))
>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa
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
<<<<<<< HEAD
            user={{ _id: this.state.id,name:this.state.data.Name , userName:this.state.data.userName ,avatar : `http://192.168.43.205:8080/static/avtar/${this.state.data.userName}.jpg`}} 
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
=======
            user={{ _id: this.state.id,name:this.state.data.Name}} />
        )
>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa
    }
}
