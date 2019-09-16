import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View, Button, Alert, AsyncStorage } from 'react-native';
import styles from "./style.scss";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import config from '../../config/config.env';

BackgroundFetch.setMinimumIntervalAsync(15);
const TASK_NAME = 'test-background-fetch';
TaskManager.defineTask(TASK_NAME, async() => {
  try {
    let response = await fetch(`${config.BG_URL}`);
    let data = await response.json();
    await AsyncStorage.setItem('CONFIG_ASYNC', JSON.stringify(data));
  } catch(error) {
    Alert.alert(`Error ${String(error)}`);
  }
});

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ""
    };
  }

  async loadConfig() {
    await this.props.configLoad(this.props.config);

    this.setState({ message: "Loaded" });
  }

  static propTypes = {
    configLoad: PropTypes.func.isRequired,
    config: PropTypes.object,
    netInfo: PropTypes.object,
    getInfo: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.setState({ message: "Loading"});
    this.registerTaskAsync();

    this.loadConfig();
    this.props.getInfo();
  }

  async getItem() {
    try {
      const data = await AsyncStorage.getItem("CONFIG_ASYNC");

      Alert.alert(data);
    } catch (error) {
      Alert.alert('no data');
    }
  }

  async registerTaskAsync() {
    await BackgroundFetch.registerTaskAsync(TASK_NAME);
    const status = await BackgroundFetch.getStatusAsync();
    let tasks;

    switch(status) {
      case BackgroundFetch.Status.Restricted:
        //Alert.alert('Restrict');
        break;
      case BackgroundFetch.Status.Denied:
        //Alert.alert('Background execution is disabled');
        break;
      default:
        //Alert.alert('Background execution allowed');

        tasks = await TaskManager.getRegisteredTasksAsync();
        if (tasks.find(f => f.taskName === TASK_NAME) == null) {
          //Alert.alert('Registering task');
          await BackgroundFetch.registerTaskAsync(TASK_NAME);

          tasks = await TaskManager.getRegisteredTasksAsync();
          //Alert.alert('Checking ', tasks);
        }// else {
          //Alert.alert(`Task ${TASK_NAME} already registered, skipping`);
        //}

        await BackgroundFetch.setMinimumIntervalAsync(15);

        break;
    }
  }
  render() {
    const onPressLoadConfig = () => {
      this.setState({ message: "Loading"});

      this.loadConfig();
    }
    return (
      <View style={styles.container}>
        <Button
          onPress={onPressLoadConfig}
          title="Load Config"
          color={styles.welcome.color}
        />
        <View style={styles.textContainer}>
          <Text style={styles.welcome}>{this.props.config.welcome}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text>Message: {this.state.message}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text>Config: {JSON.stringify(this.props.config)}</Text>
        </View>
      </View>
    );
  }
}