import React from 'react';
import {Text, StyleSheet, TouchableOpacity, Image, View} from 'react-native';
import {withTheme} from '../core/themeProvider';

const ChatItem = (props) => {
  const {theme} = props;
<<<<<<< HEAD
  var time = props.time.toLocaleTimeString()
  console.log(typeof time)
  var data = time.split(':')
  console.log(props.image)

  if(parseInt(data[0]) < 12){
    data[3] = "am"
  }
  else{
    data[0] = data[0] - 12
    data[3] = "pm"
  }
  var final = `${data[0]}:${data[1]} ${data[2]}`
  console.log()  

  return (
    <TouchableOpacity style={styles.wrapper} activeOpacity={0.7} onPress={props.press}>
      <Image style={styles.image} source={{uri:props.image}} />
=======

  return (
    <TouchableOpacity style={styles.wrapper} activeOpacity={0.7}>
      <Image style={styles.image} source={props.image} />
>>>>>>> 647effda79b20380a28ebe57741f1424abc61dfa
      <View style={styles.content}>
        <Text style={styles.name}>
          {props.firstName + ' ' + props.lastName}
        </Text>
        <Text style={styles.message}>How was your last tour?</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.time}>03.00 AM</Text>
        {props.count ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{props.count}</Text>
          </View>
        ) : (
          <View style={styles.tick}>
            <Image source={require('../assets/images/tick/tick.png')} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
export default withTheme(ChatItem);
const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#CBCBCB',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  content: {
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#262626',
  },
  message: {
    fontSize: 'Poppins-Medium',
    fontSize: 14,
    color: '#808080',
  },
  details: {
    alignSelf: 'center',
  },
  time: {
    fontFamily: 'Poppins-Medium',
    color: '#808080',
  },
  badge: {
    backgroundColor: '#8CC33F',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  badgeText: {
    color: '#fff',
  },
  tick: {
    marginTop: 8,
  },
});
