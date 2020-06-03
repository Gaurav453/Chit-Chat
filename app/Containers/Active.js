import React, { Component } from 'react'
import { FlatList ,ListView} from 'react-native'
import { ListItem } from 'react-native-elements'
import Zeroconf from 'react-native-zeroconf'
import { SafeAreaView } from 'react-native-safe-area-context'

import { cli } from './connection'

var Net = require('react-native-tcp')

const zeroconf = new  Zeroconf()
export default class Active extends Component {
  constructor(props) {
    super(props);const list = [ {
      name:'new',
      age:4
    },{
      name:'first',
      age:10
    }]
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
      console.log(this.props.route.params.name)
      this.setState({
        id:this.props.route.params.id,
        name:this.props.route.params.name
      },()=>{
        console.log(this.state.name,this.state.id)
        zeroconf.publishService('http','tcp','local.',this.state.name,8090+parseInt(this.state.id),{"foo":'bar'})
        this.refreshData()
        this.scan()
      })

      setTimeout(()=>{
        cli(this.state.me.port,this.state.me.host)
      },5000)
     
    
    }

    scan(){
      zeroconf.on('start', () => {
        this.setState({ isScanning: true })
        console.log('[Start]')
      })
  
      zeroconf.on('createConnectionstop', () => {
        this.setState({ isScanning: false })
        console.log('[Stop]')
      })
  
      zeroconf.on('resolved', service => {
        var flag = 1
        this.state.services.forEach(element => {
          if(service.name === this.state.name){
            this.setState({
              me : {...service}
              
            })
          }
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
        
      })
  
      zeroconf.on('error', err => {
       this.setState({ isScanning: false })
        console.log('[Error]', err)
      })
  
    }
    
    refreshData(){
        const { isScanning } = this.state
        if (isScanning) {
          return
        }
        
          zeroconf.scan('http', 'tcp', 'local.')

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      zeroconf.stop();
    }, 5000);
  }

  

    chat = (obj)=>{
        this.props.navigation.navigate('chat',{id:this.state.id , to:obj-8090})
    }

    render(){
        return (
        <SafeAreaView>
          {
            this.state.services.map((l,i)=>(
              <ListItem
        key={i}
        title={l.name}
        subtitle={l.text}
        onPress={()=>this.chat(l.port)}
        bottomDivider
        chevron
      />
            ))
          }
        </SafeAreaView>
        )
    }

  }

   

