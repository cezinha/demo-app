import React from 'react';
import { AppLoading } from 'expo';
import { Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Home from './Home';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { SQLite } from 'expo-sqlite';

const db = SQLite.openDatabase("demo.db");

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default class AppContainer extends React.Component {
  state = {
    isReady: false,
  };

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      require('../../assets/splash.png'),
    ]);

    const fontAssets = cacheFonts([FontAwesome.font]);

    await Promise.all([...imageAssets, ...fontAssets]);
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists config (id integer primary key not null, param text, value text);"
      );
    });
  }

  update() {
    db.transaction(tx => {
      tx.executeSql(
        `select * from config`,
        [],
        (_, { rows: { _array }}) => {
          this.setState({ config: _array });
        }
      );
    });
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return (
      <Home />
    );
  }
}