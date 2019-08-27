import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'

// then add it to the plugin list
const reactotron = Reactotron
  .configure({
    name: 'React Native Demo',
    host: '192.168.1.67'
  })
  .use(reactotronRedux()) //  <- here i am!
  .connect(); //Don't forget about me!

reactotron.log('Reactotron Configured');

export default reactotron;
