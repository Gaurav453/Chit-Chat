import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

import ImagePickert from 'react-native-image-picker'
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'local.db'});
const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      userName: '',
      pass: '',
      confirm_pass: '',
      entriesCheck: false,
      avtar: ''
    };
  }

  uploadImage(){
    ImagePickert.launchCamera(options,  response =>{
      console.log(response.uri)
      this.handleUploadPhoto(response)

    })  }

  createFormData = (file, body,type) => {
    const data = new FormData();
  
    data.append(type, {
      name:file.fileName ,
      type: file.type,
      uri: file.uri 
    });
  
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
  
    return data;
  };

  handleUploadPhoto = (photo) => {
      fetch("http://192.168.43.230:8080/api/upload/avtar", {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: this.createFormData(photo, { userName:this.state.userName },'avtar')
      })
        .then(response => response.json())
        .then(response => {
          //console.log("upload  this.setState({ photo: null });succes", response);
          alert("Upload success!");
          this.register()
        })
        .catch(error => {
          console.log("upload error", error);
          alert("Upload failed!");
        });
    };
    
  checkSanctity = (name, userName, pass, confirm_pass) => {
    //const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (name !== '' && userName !== '' && pass !== '' && confirm_pass !== '') {
        if (this.state.pass == this.state.confirm_pass) {
          return true;
        } else {
          alert('Password does not match with ConfirmPassword');
        }
 
    } else {
      alert('please complete the details');
    }
  };

  inputHandler = (name, value) => {
    this.setState(() => ({[name]: value}));
  };

  successHandler = () => {
    this.state.entriesCheck = this.checkSanctity(
      this.state.name,
      this.state.userName,
      this.state.pass,
      this.state.consfirm_pass,
    );
    //console.log(this.state.entriesCheck)
    if (this.state.entriesCheck) {
      alert('Please Upload your Picture')
      fetch('http://192.168.43.230:8080/getAll?userName=',this.state.userName)
      .then(response => response.json())
      .then(json => {
        var msg = JSON.parse(json)
        console.log(msg)
        if(msg.msg === 'pass'){
          this.uploadImage()
        }
      })
      
    }
  };

  register(){
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users(_id INTEGER,name VARCHAR(30), userName VARCHAR(30), pass VARCHAR(30),avtar VARCHAR)',
        [],
        (tx, result) => {console.log(result)},
        (err) => {
          console.log('err', err);
        },
      );
    });

    fetch('http://192.168.43.230:8080', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name:this.state.name,
        userName:this.state.userName,
        pass:this.state.pass
      })
    })
    .then(response=> response.json())
    .then(json=>{
      //console.log()
      json = JSON.parse(json)
      console.log(json.msg)
      if(json.msg === 'success'){
        console.log('new')
        db.transaction((tx) => {
          tx.executeSql(
            'INSERT INTO users (_id,name,pass,userName,avtar) VALUES(?,?,?,?,?)',
            [parseInt(json.id),this.state.name, this.state.pass,this.state.userName,`http//192.168.43.230:8080/static/avtar/${this.state.userName}`],
            (tx, result) => {
              console.log('result', result);
              alert('done')
              // this.props.navigation.navigate('main',{
                
              // })
            },
            (err) => {
              console.log('err', err);

            },
          );
        });

      }
    })
    .catch(err => console.log(err))
  }
  render() {
    return (
      <AuthLayout title="Sign Up" showBackButton>
        <View style={styles.form}>
          <TextInput
            placeholder="Name"
            onChangeText={(txt) => {
              this.inputHandler('name', txt);
            }}
            //value={this.state.name}
            icon={require('../assets/images/mail/mail.png')}
          />
          <TextInput
            placeholder="user Name"
            //keyboardType="email-address"
            onChangeText={(txt) => {
              this.inputHandler('userName', txt);
            }}
            //value={this.state.email}
            icon={require('../assets/images/mail/mail.png')}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(txt) => {
              this.inputHandler('pass', txt);
            }}
            //value={this.state.pass}
            icon={require('../assets/images/password/password.png')}
          />

          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={(txt) => {
              this.inputHandler('confirm_pass', txt);
            }}
            //value={this.state.consfirm_pass}
            icon={require('../assets/images/password/password.png')}
          />

          <Button title="Sign Up" onPress={this.successHandler} />
          <Button title="Log In" onPress={() => history.push('/')} />
        </View>
      </AuthLayout>
    );
  }
}
const styles = StyleSheet.create({
  form: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 25,
  },
  navItemContainer: {
    marginTop: 35,
    marginBottom: 35,
    alignSelf: 'center',
  },
  navItemText: {
    fontSize: 18,
    color: '#696969',
    fontFamily: 'Poppins-Medium',
  },
});
