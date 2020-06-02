import react, {Component} from 'react';
import {FlatList, ListView} from 'react-native';
import Zeroconf from 'react-native-zeroconf';

const zeroconf = new Zeroconf();
export default class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: {},
      isScanning: false,
      selectedService: null,
      data: '',
    };
  }
  componentDidMount() {
    zeroconf.publishService('http', 'tcp', 'local.', 'Gaurav', 8080, {});
    this.refreshData();
    zeroconf.on('start', () => {
      this.setState({isScanning: true});
      console.log('[Start]');
    });

    zeroconf.on('stop', () => {
      this.setState({isScanning: false});
      console.log('[Stop]');
    });

    zeroconf.on('resolved', (service) => {
      console.log('[Resolve]', JSON.stringify(service, null, 2));

      this.setState({
        services: {
          ...this.state.services,
          [service.host]: service,
        },
      });
    });

    zeroconf.on('error', (err) => {
      this.setState({isScanning: false});
      console.log('[Error]', err);
    });
  }

  refreshData() {
    const {isScanning} = this.state;
    if (isScanning) {
      return;
    }

    this.setState({services: []});

    zeroconf.scan('http', 'tcp', 'local.');

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      zeroconf.stop();
    }, 5000);
  }

  render() {
    return null;
  }
}
