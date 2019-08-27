import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

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
    config: PropTypes.object
  }

  componentDidMount() {
    this.setState({ message: "Loading"});

    this.loadConfig();
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
          color="#841584"
        />
        <View style={{ marginBottom: 10, marginTop: 10 }}>
          <Text style={{ color: "blue", fontSize: 20 }}>{this.props.config.welcome}</Text>
        </View>
        <View style={{ marginBottom: 10, marginTop: 10 }}>
          <Text>Message: {this.state.message}</Text>
        </View>
        <View style={{ marginBottom: 10, marginTop: 10 }}>
          <Text>Config: {JSON.stringify(this.props.config)}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
});