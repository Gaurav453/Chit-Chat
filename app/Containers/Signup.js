import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AuthLayout from '../components/AuthLayout';
import {Link, Route} from 'react-router-native';
import {useHistory} from 'react-router-dom';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'signup.db'});

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      pass: '',
      confirm_pass: '',
      entriesCheck: false,
    };
  }

  checkSanctity = (name, email, pass, confirm_pass) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (name !== '' && email !== '' && pass !== '' && confirm_pass !== '') {
      if (reg.test(email) === true) {
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
      db.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS users( name VARCHAR(30), email VARCHAR(30), pass VARCHAR(30))',
          [],
          (tx, result) => {},
          (err) => {
            console.log('err', err);
          },
        );
      });

      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO users (name,email,pass) VALUES(?,?,?)',
          [this.state.name, this.state.email, this.state.pass],
          (tx, result) => {
            console.log('result', result);
            const rows = result.rows;
            for (i = 0; i < rows.length; i++) console.log(rows.item(i));
          },
          (err) => {
            console.log('err', err);
          },
        );
      });

      alert('Success');
    }
  };
  componentDidMount() {}

  render() {
    return (
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
