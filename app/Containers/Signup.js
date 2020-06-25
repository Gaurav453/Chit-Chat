import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AuthLayout from '../components/AuthLayout';
import {Link, Route} from 'react-router-native';
import {useHistory} from 'react-router-dom';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import {openDatabase} from 'react-native-sqlite-storage';
import { ScrollView } from 'react-native-gesture-handler';

var db = openDatabase({name: 'local.db'});

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      pass: '',
      confirm_pass: '',
      entriesCheck: false,
<<<<<<< HEAD
      avtar: '',
      id : 0
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
      fetch("http://192.168.43.205:8080/api/upload/avtar", {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: this.createFormData(photo, { id:this.state.id },'avtar')
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
=======
    };
  }

  checkSanctity = (name, email, pass, confirm_pass) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (name !== '' && email !== '' && pass !== '' && confirm_pass !== '') {
      if (reg.test(email) === true) {
>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa
        if (this.state.pass == this.state.confirm_pass) {
          return true;
        } else {
          alert('Password does not match with ConfirmPassword');
        }
      } else {
        alert('check email format!');
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
      this.state.email,
      this.state.pass,
      this.state.consfirm_pass,
    );
    if (this.state.entriesCheck) {
<<<<<<< HEAD
      alert('Please Upload your Picture')
      fetch('http://192.168.43.205:8080/getAll?userName=',this.state.userName)
      .then(response => response.json())
      .then(json => {
        var msg = JSON.parse(json)
        console.log(msg)
        if(msg.msg === 'pass'){
          this.setState({
            id :msg.id
          },()=>{
            this.uploadImage()
          })
          
        }
      })
      
    }
  };
=======
      db.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS users(_id INTEGER,name VARCHAR(30), email VARCHAR(30), pass VARCHAR(30))',
          [],
          (tx, result) => {},
          (err) => {
            console.log('err', err);
          },
        );
      });
>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa

      fetch('http://192.168.0.104:8080', {
        method: 'POST',
        headers: {
          'Accept' : 'application/json',
          'Content-Type': 'application/json'
        },
<<<<<<< HEAD
      );
    });

    fetch('http://192.168.43.205:8080', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name:this.state.name,
        userName:this.state.userName,
        pass:this.state.pass,
        id:this.state.id,
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
            [parseInt(this.state.id),this.state.name, this.state.pass,this.state.userName,`http//192.168.43.205:8080/static/avtar/${this.state.id}.jpg`],
            (tx, result) => {
              console.log('result', result);
              alert('done')
              // this.props.navigation.navigate('main',{
                
              // })
            },
            (err) => {
              console.log('err', err);
=======
        body: JSON.stringify({
          name:this.state.name,
          email:this.state.email
        })
      })
      .then(response=> response.json())
      .then(json=>{
        console.log()
        json = JSON.parse(json)
        console.log(json.msg)
        if(json.msg === 'success'){
          console.log('new')
          db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO users (_id,name,email,pass) VALUES(?,?,?,?)',
              [parseInt(json.id),this.state.name, this.state.email, this.state.pass],
              (tx, result) => {
                console.log(this.state.email)
                console.log(this.state.name)
                console.log('result', result);
                this.props.navigation.navigate('messages',{
                  screen:'active',
                })
              },
              (err) => {
                console.log('err', err);
>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa

              },
            );
          });

        }
        else{
          alert('email already Exist')
        }
      })
    }
  };

  render() {
    return (
      <ScrollView>
      <AuthLayout title="Sign Up" showBackButton>
        <View style={styles.form}>
          <TextInput
            placeholder="Name"
            onChangeText={(txt) => {
              this.inputHandler('name', txt);
            }}
            value={this.state.name}
            icon={require('../assets/images/mail/mail.png')}
          />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={(txt) => {
              this.inputHandler('email', txt);
            }}
            value={this.state.email}
            icon={require('../assets/images/mail/mail.png')}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(txt) => {
              this.inputHandler('pass', txt);
            }}
            value={this.state.pass}
            icon={require('../assets/images/password/password.png')}
          />

          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={(txt) => {
              this.inputHandler('confirm_pass', txt);
            }}
            value={this.state.consfirm_pass}
            icon={require('../assets/images/password/password.png')}
          />

          <Button title="Sign Up" onPress={this.successHandler} />
          <Button title="Log In" onPress={() => history.push('/')} />
        </View>
      </AuthLayout>
      </ScrollView>
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
