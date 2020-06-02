import React, { Component } from 'react'
import { FlatList ,ListView} from 'react-native'
import { ListItem } from 'react-native-elements'
import Zeroconf from 'react-native-zeroconf'
import { SafeAreaView } from 'react-native-safe-area-context'

const list = [ {
  name:'new',
  age:4
},{
  name:'first',
  age:10
}]
const zeroconf = new  Zeroconf()
export default class Active extends Component {


    constructor(props) {
        super(props)
        this.state = {
            services : [],
            isScanning : false,
            selectedService :null,
            data : ''


        }

    }
    Interval
    componentDidMount(){
      zeroconf.publishService('http','tcp','local.','server',8080,{"foo":'bar'})
      this.refreshData()
      this.scan()
    
    }

    scan(){
      zeroconf.on('start', () => {
        this.setState({ isScanning: true })
        console.log('[Start]')
      })
  
      zeroconf.on('stop', () => {
        this.setState({ isScanning: false })
        console.log('[Stop]')
      })
  
      zeroconf.on('resolved', service => {
        var flag = 1
        this.state.services.forEach(element => {
          console.log('check',service.name,element.name)
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

       

    }

    chat = (obj)=>{
        this.props.navigatipon.navigate('chat')
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
        onPress={()=>this.chat(l.text)}
        bottomDivider
        chevron
      />
            ))
          }
        </SafeAreaView>
        )
    }
}