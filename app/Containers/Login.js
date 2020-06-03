import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AuthLayout from '../components/AuthLayout';
import {Link, Route} from 'react-router-native';
import {useHistory} from 'react-router-dom';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'local.db'});

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navToMessages: false,
      email: '',
      pass: '',
    };
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
      console.log(this.state.email)
      tx.executeSql(
        'SELECT * FROM users WHERE email = ?',
        [this.state.email],
        (tx,result)=>{
          console.log(result.rows.item(0).pass)
          if(this.state.pass === result.rows.item(0).pass){
            this.props.navigation.navigate('messages',{
              screen:'active',
              params:{
                id:result.rows.item(0)._id,
                name:result.rows.item(0).name
              }
            })
          }
          else{
            alert('Wrong password')
          }
        },
        (err)=>{
          console.log(err)
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
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={(txt) => {
              this.inputHandler('email', txt);
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
