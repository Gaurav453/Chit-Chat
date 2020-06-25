import React, { Component } from 'react'
import { FlatList ,ListView ,StyleSheet, Button ,View ,Text } from 'react-native'
import { ListItem } from 'react-native-elements'
import Zeroconf from 'react-native-zeroconf'
import { SafeAreaView} from 'react-native-safe-area-context'

import AnimatedLoader from 'react-native-animated-loader'
import AsyncStorage from '@react-native-community/async-storage'
import ActiveItem from '../components/ActiveItem'
import RNRestart from 'react-native-restart'

import { cli } from './connection'
var Net = require('react-native-tcp')

const zeroconf = new  Zeroconf()
export default class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      isScanning: false,
      selectedService: null,
      data: '',
      name: '',
      id: 0,
      me: {}
    };
  }

    componentDidMount(){
    //  console.log(this.props.route.params.name)
      this.setState({
        id:this.props.data.id,
        name:this.props.data.name
      },()=>{
        console.log(this.state.name,this.state.id)
        zeroconf.publishService('http','tcp','local.',this.state.name,8090+parseInt(this.state.id),{"foo":'bar'})
        this.scan()
        this.refreshData()
        
      })

      setTimeout(()=>{
        cli(this.state.me.port,this.state.me.host)
      },2000)
     
    
    }

    scan(){
      console.log('scan')
      zeroconf.on('start', () => {
        this.setState({ isScanning: true })
        console.log('[Start]')

        setTimeout(()=>{
          this.setState({ isScanning: false })
        },4000)
      })
  
      zeroconf.on('createConnectionstop', () => {
        this.setState({ isScanning: false })
        console.log('[Stop]')
      })
  
      zeroconf.on('resolved', service => {
        var flag = 1
        console.log('check',this.state.name,service.name)
        if(service.name === this.state.name){
          this.setState({
            me : {...service}
            
          },()=>flag=0)
        }
        else if(service.name === '_admin'){
          flag =0
          console.log(service.addresses[0])
          AsyncStorage.setItem('server_ip',`${service.addresses[0]}`)
        }
        this.state.services.forEach(element => {

          if(service.name === element.name){
            flag =0
    
          }
          
        });
        
        if(flag===1){
          this.setState({
            services: [...this.state.services,service]
            
          })
        }
        console.log('service',this.state.services)
        //this.setState({ isScanning: false })
      })
  
      zeroconf.on('error', err => {
       this.setState({ isScanning: false })
        console.log('[Error]', err)
      })
  
  }
    
  refreshData(){
      zeroconf.scan('http', 'tcp', 'local.')
  }
  clearStorage(){
    AsyncStorage.removeItem('userName')
}
  

  chat = (obj)=>{
    this.props.navigation.navigate('chat',{id:this.state.id , to:obj-8090})
  }
  
  componentWillUnmount(){
    zeroconf.stop()
    zeroconf.unpublishService(this.state.name)
  }
  render(){
      let visible = this.state.isScanning
        return (
        <SafeAreaView style={{flex:1, flexDirection:'column' ,justifyContent : 'space-between'}}>
          <AnimatedLoader
          visible={visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../assets/1972-send.json')}
          animationStyle={styles.lottie}
          speed={1.2}
        />
          <View style={{flex:0.1 , flexDirection: 'row' ,justifyContent :"center"}}>
            <View style={styles.button}>
              <Text>
                Active Users
              </Text>
            </View>
          </View>
          <View>
            <FlatList 
              data = {this.state.services}
              keyExtractor ={(item)=> `${item.port}` }
              renderItem = {({item}) => (
                <ActiveItem 
                  name = {item.name}
                  userName ={item.text} 
                  press = {()=> this.chat(item.port)}
                />
              )}
            />
          </View>
          <View style={styles.button}>
            <View style={{flex: 1}}></View>
            <Button 
            title="Refresh"
            onPress={()=> this.refreshData()}
            />
          </View>
         
        </SafeAreaView>
        )
    }
  }

  const styles = StyleSheet.create({
    lottie: {
      width: 300,
      height: 300
    },
    button :{
      flexDirection : 'row',
      margin : 20
      
    },
    heading:{
      fontSize: 20,
      marginTop: 10,
      fontWeight: 'bold'
    }

  });

   
