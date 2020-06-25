import React from 'react';
import {Text, StyleSheet, TouchableOpacity, Image, View} from 'react-native';
import {withTheme} from '../core/themeProvider';

const ActiveItem = (props) => {

  return (
    <TouchableOpacity style={styles.wrapper} activeOpacity={0.7} onPress={props.press}>
      <Image style={styles.image} source={{uri:`http://192.168.43.205:8080/static/avtar/${props.port}.jpg`}} />
      <View style={styles.content}>
      <Text style={styles.name}>
          {props.name}
      </Text>
        <Text style={styles.message}>Gaurav</Text>
      </View>
    </TouchableOpacity>
  );
};
export default withTheme(ActiveItem);
const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    //borderBottomWidth: 1,
    borderColor: '#CBCBCB',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  image: {
    height: 50,
    width: 50,
    margin:10,
    borderRadius: 25,
  },
  content: {
    justifyContent: 'center',
    marginLeft:5
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
  }
});
