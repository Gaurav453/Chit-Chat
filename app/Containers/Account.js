import React, { Component } from 'react';
import { Backdrop } from "react-native-backdrop";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AuthLayout from '../components/AuthLayout';
import { TextInput } from 'react-native-gesture-handler';
import {openDatabase} from 'react-native-sqlite-storage';
//import {useHistory} from 'react-router-dom';

var db = openDatabase({name: 'local.db'});

export default class Account extends Component  {
  constructor(props){
    super(props)
    this.state = {
        data:{},
        name:'',
        email:'',
        visible:false,
        newName:'',
        newEmail:'',
        newPass:'',
        entriesCheck:false
     }
    }
  onpress=()=>{
    this.setState({visible:true});
  }

  handleOpen =()=>{
    this.setState({visible:true});
  };
  
  handleClose=()=>{
    this.setState({visible:false});
  };

  inputHandler =(name,value)=> {
    this.setState(() => ({[name]: value}));
  }

  checkSanctity = (name, email, pass) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (name !== '' && email !== '' && pass !== '') {
      if (reg.test(email) === true) {
          return true;
        } 
       else {
        alert('check email format!');
      }
    } else {
      alert('please complete the details');
    }
  };

  updateChangesHandler=()=> {

    this.state.entriesCheck=this.checkSanctity(this.state.newName,this.state.newEmail,this.state.newPass);
    if(this.state.entriesCheck){
    db.transaction((tx)=> {
      tx.executeSql(
        'UPDATE users set name=?, email=? , pass=? where _id=?',
        [this.state.newName, this.state.newEmail, this.state.newPass, 4],
        (tx, results) => {
          console.log('Results',results.rowsAffected);
          if(results.rowsAffected>0){
            alert("updation success");
          }else{
            alert('Updation Failed');
          }
        }
      );
    });
  }
  
  }
  componentDidMount(){
    //let history = useHistory();
    fetch(`http://192.168.0.104:8080/getUser?id=4`)
        .then((response) => response.json())
        .then(json => {
          this.setState({
            data:{...JSON.parse(json)}
            
          },()=>{
            console.log("hhhhhere")
            console.log(this.state.data)
          })
        })
        console.log("reeeeeeeee")
        console.log(this.state.data)
        // .then(()=>{
        //   //console.log(this.state.id)
        //   db.transaction(tx =>{
        //     tx.executeSql(
        //       "SELECT name,email FROM sqlite_master WHERE type='table' AND name='users'",
        //       [],
        //         (tx,result)=> {
        //           console.log(result)
        //         },
        //         (err =>console.log(err))
        //     )
        //   })
        // })
  }
  render(){
    return (
      <ScrollView>
      <AuthLayout title="Account" showBackButton>
        <View style={{marginTop:100}}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../assets/images/user.jpg')}
              style={styles.profileImage}
            />
            <TouchableOpacity>
              <View style={styles.smallIconContainer}>
                <Image
                  source={require('../assets/images/edit_small/edit_small.png')}
                  style={styles.smallIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 65}}>
            <Text style={styles.name}>{this.state.data.Name}</Text>
            <Text style={styles.description}>{this.state.data.Email}</Text>
            <ScrollView style={styles.menuContainer}>
              <View style={{marginTop:50}}>
                <TouchableOpacity onPress={this.onpress}>
                  <Text style={styles.name}>Update Profile</Text>
                  <Image
                     source={require('../assets/images/edit/edit.png')}
                     style={{alignSelf:"flex-end"}}
                  />
                </TouchableOpacity>
                </View>
                </ScrollView>
          </View>
        </View>
                {/* Backdropppppp */}
                <Backdrop
                    visible={this.state.visible}
                    handleOpen={this.handleOpen}
                    handleClose={this.handleClose}
                    onClose={() => {}}
                    swipeConfig={{
                      velocityThreshold: 0.3,
                      directionalOffsetThreshold: 80,
                    }}
                    animationConfig={{
                      speed: 14,
                      bounciness: 4,
                    }}
                    overlayColor="rgba(0,0,0,0.32)"
                    backdropStyle={{
                      backgroundColor: '#fff',
                    }}>
                <View  style={styles.inputs}>
                    <TextInput
                      placeholder={'Enter your Name'}
                      value={this.state.newName}
                      onChangeText={(txt) => {
                        this.inputHandler('newName', txt);
                      }}/>
                </View>
                <View  style={styles.inputs}>
                    <TextInput
                      placeholder={'Enter your Email'}
                      value={this.state.newEmail}
                      onChangeText={(txt) => {
                        this.inputHandler('newEmail', txt);
                      }}/>
                </View>
                <View  style={styles.inputs}>
                    <TextInput
                      placeholder={'Enter your Password'}
                      value={this.state.newPass}
                      onChangeText={(txt) => {
                        this.inputHandler('newPass', txt);
                      }}/>
                </View>
                <Button title="Save" onPress={this.updateChangesHandler}/>
                
                </Backdrop>
      {/* ------------ */}
              
              <View style={{marginTop:20}}>
                <Text style={styles.description}>from</Text>
                <Text style={styles.lname}>GAURAV</Text>
                <Text style={styles.lname}>AMRIT</Text>
                <Text style={styles.lname}>SHWETA</Text>
                <Text style={styles.lname}>SAKSHI</Text>
              </View>
            
      </AuthLayout>
      </ScrollView>
    );

  }
 
};
const styles = StyleSheet.create({
  profileImageContainer: {
    position: 'absolute',
    top: -65,
    alignSelf: 'center',
    
  },
  inputs:{
    backgroundColor:'#f26d8e',
    color:'white',
    padding:15,
    marginBottom:15,
    
    
  },
  profileImage: {
    height: 130,
    width: 130,
    borderRadius: 65,
    borderColor: '#fff',
    borderWidth: 6,
  },
  smallIconContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#8CC33F',
    width: 24,
    height: 24,
    borderRadius: 12,
    right: 5,
    bottom: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Poppins-Semibold',
    fontSize: 20,
    letterSpacing: 0,
    color: '#262626',
    alignSelf: 'center',
  },
  lname: {
    fontFamily: 'Poppins-Semibold',
    fontSize: 20,
    letterSpacing: 0,
    color: '#262626',
    alignSelf: 'center',
    fontWeight : 'bold'
  },
  description: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    letterSpacing: 0,
    color: '#808080',
    alignSelf: 'center',
  },
  menuContainer: {
    marginTop: 25,
  },
});
