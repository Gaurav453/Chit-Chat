import React, { Component } from "react";
import AppLayout from './components/AppLayout'
import { ThemeContextProvider } from './core/themeProvider';
import { NavigationContainer, StackActions } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import  Login  from './Containers/Login'
import Admin from './admin'
import Messages from './Containers/Messages'
import Active from './Containers/Active'
import Account from './Containers/Account'
import Chat from './Containers/Chat'
import Signup from './Containers/Signup'

import Icon from 'react-native-ionicons';
import AsyncStorage from '@react-native-community/async-storage'


const stack = createStackNavigator();
const bottomTab = createBottomTabNavigator();

export default class App extends Component {

  constructor(props){
    super(props)
    
    this.state = {
      userName : null,
      id : null,
      name :null,
      isLoading:true
    }
    
  }
  componentDidMount(){
    this.getUsername()
  }
 
  getUsername = async() => {
    try{
      const userName = await AsyncStorage.getItem('userName')
      const name = await AsyncStorage.getItem('name')
      const id = await AsyncStorage.getItem('id')
      console.log('asycn;',userName,id,name)
        this.setState({
          userName:userName,
          id:id,
          name :name,
          isLoading:false
        },() => console.log('jkjk',this.state))
      
    }
    catch (err) {
      console.log('okok',err)
    }
 
  }

  tabNavigator = ({ route, navigation }) => {
   // console.log('neq',route)
    return (
      <bottomTab.Navigator
        initialRouteName="active"
        backBehavior="history"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'active') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'messages') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            } else if (route.name === 'profile') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            }
            // You can return any component that you like here!
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <bottomTab.Screen name="active">
        {props => <Active {...props} data={{id:this.state.id,name:this.state.name }} />}
        </bottomTab.Screen>

        <bottomTab.Screen name="messages">
        {props => <Messages {...props} data={{id:this.state.id,name:this.state.name }} />}
        </bottomTab.Screen>

        <bottomTab.Screen name="profile" component={Admin} />
      </bottomTab.Navigator>
    );
  };

  render() {
    console.log("oskks",this.state)
    if(this.state.isLoading){
      return null
    }
    return (
      <NavigationContainer>
        <ThemeContextProvider>
          <AppLayout>
              {this.state.userName === null ? (
                <stack.Navigator initialRouteName="login"> 
                  <stack.Screen
                  name="login"
                  component={Login}
                  options={{headerShown: false}}
                />
                <stack.Screen
                  name="Signup"
                  component={Signup}
                  options={{headerShown: false}}
                  
                />
                </stack.Navigator>
               
                ): (
                  <stack.Navigator initialRouteName="main">
                  <stack.Screen
                  name="main"
                  children={this.tabNavigator}
                  options={{headerShown: false}}
                />
                  <stack.Screen
                  name="chat"
                  component={Chat}
                  options={{headerShown: false}}
                  />                



                </stack.Navigator>
    
                )
              }
          </AppLayout>
        </ThemeContextProvider>
      </NavigationContainer>
    );
  }

}