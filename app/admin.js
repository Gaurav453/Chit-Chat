import React,{ Component} from 'react';
import { StyleSheet } from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import AnimatedLoader from "react-native-animated-loader";


var db = openDatabase({name: 'local.db'});

export default class Admin extends Component {

  constructor(props){
    super(props)
    this.state= {
      visible :false,
    }
  }
  // componentDidMount() {
  // //  console.log('db', db);
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       'CREATE TABLE test( id integer, age integer)',
  //       [],
  //       (tx, result) => {},
  //       (err) => {
  //         console.log('err', err);
  //       },
  //     );
  //   });

  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       'INSERT INTO TEST (id,age) VALUES(?,?)',
  //       [1, 2],
  //       (tx, result) => {
  //         //console.log('result', result);
  //         const rows = result.rows;
  //         for (i = 0; i < rows.length; i++) console.log(rows.item(i));
  //       },
  //       (err) => {
  //         console.log('err', err);
  //       },
  //     );
  //   });
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       'SELECT * FROM TEST',
  //       [],

  //       (tx, result) => {
  //         //console.log('result', result);
  //         const rows = result.rows;
  //         for (i = 0; i < rows.length; i++) {
  //           console.log('k',rows.item(i));
  //         }
  //       },
  //       (err) => {
  //         console.log('err', err);
  //       },

  //     );
  //   });

  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       'UPDATE TEST SET age=age+?,id=id+?',
  //       [-1,+2*1993292],
  //       (tx, result) => {
  //         console.log('remmsult', result);
  //         const rows = result.rows;
  //         console.log(result.rows.raw())
  //         for (i = 0; i < rows.length; i++) {
  //           console.log(rows.item(i));
  //         }
  //       },
  //       (err) => {
  //         console.log('err', err);
  //       },
  //     );
  //   });
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       'SELECT * FROM TEST',
  //       [],

  //       (tx, result) => {
  //         //console.log('result', result);
  //         const rows = result.rows;
  //         for (i = 0; i < rows.length; i++) {
  //           console.log('k',rows.item(i));
  //         }
  //       },
  //       (err) => {
  //         console.log('err', err);
  //       },

  //     );
  //   });

  // }
  componentDidMount(){

    //alert('hey')
    // console.log(this.props)
    // var dict = {}
    // id=2
    // db.transaction(tx=>{
    //   tx.executeSql(
    //     'SELECT * FROM messages ORDER BY createdAt DESC',
    //     [],
    //     (tx,result)=>{ 
    //       //console.log(result.rows.raw())
    //       data = result.rows.raw()
    //       data.forEach(element => {
    //         var r = (element.user_id===id) ? element.too : element.user_id
    //         if(!dict[`${r}`]){
    //           dict[`${r}`] = { messge : element.text , count: 0 , user_id : element.user_id }
    //         }
    //         if(element.read === 1){
    //           dict[`${r}`].count = dict[`${r}`].count+1
    //         }

    //       });
    //       console.log(dict)
    //     },
    //     err=>console.log(err)
    //   )
    // })
  }
  render() {
    const { visible } = this.state;
    return (
      <AnimatedLoader
        visible={visible}
        overlayColor="rgba(255,255,255,0.75)"
        source={require('./assets/1972-send.json')}
        animationStyle={styles.lottie}
        speed={1.2}
      />
    )
  }
}

const styles = StyleSheet.create({
  lottie: {
    width: 300,
    height: 300
  }
});