import React, {useState, Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActionSheetIOS,
} from 'react-native';

import AppLayout from '../components/AppLayout';
import ChatItem from '../components/ChatItem';
import {openDatabase} from 'react-native-sqlite-storage' 

const db = openDatabase({name:'local.db'})
class Messages extends Component  {
  
  constructor(props){
    super(props)

    this.state= {
      activeTab : 1,
      messages : []
    }
  }
  id;
  componentDidMount(){
   // alert('in messag')
    console.log('refrshed')
    var dict = {}
    this.id  = parseInt(this.props.data.id)
    console.log('kkkk',this.id)
    db.transaction(tx=>{
      tx.executeSql(
        'SELECT * FROM messages ORDER BY createdAt DESC',
        [],
        (tx,result)=>{ 
          //console.log(result.rows.raw())
          data = result.rows.raw()
          data.forEach(element => {
            var r = (element.user_id===id) ? element.too : element.user_id
            element.count=0
            if(!dict[`${r}`]){
              dict[`${r}`] = { message : element}
            }
            if(element.read === 1){
              dict[`${r}`].message.count = dict[`${r}`].message.count+1
            }
           // console.log('in',dict)

          });
          console.log('oj',dict)
          var arr =[]

          for(let d in dict) {
           // console.log(d)
            arr.push(dict[d].message)
          }
          
          console.log('slls',arr)
          this.setState({
            messages : arr

          },()=>console.log('arr',this.state.messages))
        },
        err=>console.log(err)
      )
    })
    
  }
  updateState(){
  
  }

  onActive = (activeTab) => {
    this.setState = {
      activeTab : activeTab
    }
  };

  

  onPressMenu = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Settings'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
        //  history.push('/settings');
        } else if (buttonIndex === 2) {
          setResult('🔮');
        }
      },
    );
    
  render(){
    return (
      <AppLayout>
        <View style={[styles.header]}>
          <Text style={styles.title}>Messages</Text>
          <View style={styles.iconGroup}>
            <TouchableOpacity>
              <Image
                source={require('../assets/images/searchIcon/searchIcon.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreIcon} onPress={this.onPressMenu}>
              <Image source={require('../assets/images/more/more.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          <FlatList
            data={this.state.messages}
            keyExtractor={(item,index) => `${index}` }
            renderItem={({item}) => (
              <ChatItem
                firstName={item.user_name}
                lastName= {'kataria'}
                image={'kakka'}
                message={item.text}
                time={new Date(JSON.parse(item.createdAt))}
                count={item.count}
                press = {()=> {

                  this.props.navigation.navigate('chat',{id:this.id , to:item.user_id===this.id ?item.too : item.user_id})
                  setTimeout(()=>{
                    alert('oek')
                    this.componentDidMount()
                  },2000)

                }
              }
              />
            )}
            
          />
        </View>

      </AppLayout>
    );
  }

};

export default (Messages);

const styles = StyleSheet.create({
  header: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontFamily: 'Poppins-Semibold',
    fontSize: 20,
    marginLeft: 15,
  },
  iconGroup: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    marginLeft: 15,
    paddingLeft: 10,
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tab: {
    backgroundColor: '#8CC33F',
    padding: 20,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabTitle: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Poppins-Semibold',
    fontSize: 20,
    marginLeft: 10,
  },
  active: {
    backgroundColor: '#79AD2F',
  },
});
