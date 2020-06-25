import React, { Component } from "react";
import AppLayout from './components/AppLayout'
import Router from './Router'
import { ThemeContextProvider } from './core/themeProvider';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import  Login  from './Containers/Login'
import Admin from './admin'
import Messages from './Containers/Messages'
import Active from './Containers/Active'
import Account from './Containers/Account'
import Chat from './Containers/Chat'
import Signup from './Containers/Signup'

///import Account from './Containers/Account'

import Icon from 'react-native-ionicons';

const stack = createStackNavigator();
const bottomTab = createBottomTabNavigator();

export default class App extends Component {
  componentDidMount() {}
  tabNavigator = () => {
    return (
      <bottomTab.Navigator
        initialRouteName="messages"
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
        <bottomTab.Screen name="active" component={Active} />
        <bottomTab.Screen name="messages" component={Messages} />
        <bottomTab.Screen name="profile" component={Account} />
      </bottomTab.Navigator>
    );
  };

  render() {
    return (
      <NavigationContainer>
        <ThemeContextProvider>
          <AppLayout>
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
                <stack.Screen
                name="chat"
                component={Chat}
                options={{headerShown: false}}
              />
              <stack.Screen
                name="messages"
                children={this.tabNavigator}
                options={{headerShown: false}}
              />
            </stack.Navigator>
          </AppLayout>
        </ThemeContextProvider>
      </NavigationContainer>
    );
  }

}


