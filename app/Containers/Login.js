import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AuthLayout from '../components/AuthLayout';
import {Link, Route} from 'react-router-native';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import {openDatabase} from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage'


var db = openDatabase({name: 'local.db'});

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navToMessages: false,
      userName: '',
      pass: '',
    };
  }

  async store(id,name,userName){
      console.log('wait')
      await AsyncStorage.setItem('userName',userName);
      await AsyncStorage.setItem('name',name);
      await AsyncStorage.setItem('id',id);
      AsyncStorage.getAllKeys((err,keys) =>{
        console.log(keys)
      })

  }


  checkSanctity = (email) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.email) === true) {
      return true;
    } else {
      return false;
    }
  };
  navigationHandler = () => {
    // this.state.navToMessages = this.checkSanctity(this.state.email);
    // if (this.state.navToMessages) {
    //   this.props.navigation.navigate('messages');
    // } else {
    //   alert('please complete the details !');
    // }

    db.transaction((tx) =>{
      console.log('lldlld',this.state)
      tx.executeSql(
        'SELECT * FROM users WHERE userName = ?',
        [this.state.userName],
        (tx,result)=>{
          console.log(result.rows.item(0).pass)
          if(this.state.pass === result.rows.item(0).pass){
            console.log('right',result.rows.item(0))
            this.store(`${result.rows.item(0)._id}`,result.rows.item(0).name,result.rows.item(0).userName)
            //this.props.navigation.navigate('chat',{id:1,to:2})is
          }
          else{
            alert('Wrong password')
          }
        },
        (err)=>{
          console.log('err',err)
        }
      )
    })
  };

  inputHandler = (name, value) => {
    this.setState(() => ({[name]: value}));


  };

  render() {
    return (
      <AuthLayout title="Log In">
        <View style={styles.form}>
          <TextInput
            placeholder="User Name"
            keyboardType="email-address"
            onChangeText={(txt) => {
              this.inputHandler('userName', txt);
            }}
            value={this.state.email}
            icon={require('../assets/images/mail/mail.png')}
          />
          <Text>{this.state.email}</Text>
          <TextInput
            placeholder="Password"
            onChangeText={(txt) => {
              this.inputHandler('pass', txt);
            }}
            value={this.state.pass}
            secureTextEntry={true}
            icon={require('../assets/images/password/password.png')}
          />
          <Text>{this.state.pass}</Text>
          <Link
            to="/forgotpassword"
            underlayColor="#f0f4f7"
            style={styles.navItemContainer}>
            <Text style={styles.navItemText}>Forgot password ?</Text>
          </Link>
          <Button title="Log In" onPress={this.navigationHandler} />
          <Button
            title="Sign Up"
            onPress={() => this.props.navigation.navigate('Signup')}
          />

          
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
    alignSelf: 'center',
  },
  navItemText: {
    fontSize: 18,
    color: '#696969',
    fontFamily: 'Poppins-Medium',
  },
});
