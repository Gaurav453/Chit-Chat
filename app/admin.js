import {react, Component} from 'react';
import {} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'test123.db'});

export default class Admin extends Component {
  componentDidMount() {
    console.log('db', db);
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE test( id integer, age integer)',
        [],
        (tx, result) => {},
        (err) => {
          console.log('err', err);
        },
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO TEST (id,age) VALUES(?,?)',
        [1, 2],
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
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM TEST',
        [],
        (tx, result) => {
          console.log('result', result);
          const rows = result.rows;
          for (i = 0; i < rows.length; i++) {
            console.log(rows.item(i));
          }
        },
        (err) => {
          console.log('err', err);
        },
      );
    });
  }
  render() {
    return null;
  }
}
