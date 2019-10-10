import {configConstants} from '../constants';
import { SQLite } from 'expo-sqlite';
import * as NetInfo from "@react-native-community/netinfo"
import reactotron from "../config/ReactotronConfig";

const db = SQLite.openDatabase("demo.db");

export const configFetchStarted = () => ({
  type: configConstants.STARTED
});

export const configFetchCompleted = config =>  ({
  type: configConstants.COMPLETED,
  config
});

export const configFetchFailed = error => ({
  type: configConstants.ERROR,
  error
});

export const configLoad = (config) => {
  return async dispatch => {
    dispatch(configFetchStarted());
    try {
      let netInfo = await NetInfo.getConnectionInfo();
      if (netInfo.type) {
        netInfo.isConnected = (netInfo.type != 'none');
        if (netInfo.isConnected) {
          let response = await fetch(config.REMOTE_CONFIG_URL);
          if (response.ok) {
            let json = await response.json();
            reactotron.log('configLoad loaded---------');
            reactotron.log(config);
            reactotron.log(json);
            reactotron.log('configLoad loaded---------');

            // update DB
            let result = await updateDB(json);
            reactotron.log(result);

            return dispatch(configFetchCompleted(json));
          }
        } else { // not connected*/
          db.transaction(tx => {
            tx.executeSql(
              'select param, value from config',
              [],
              (tx, results) => {
                reactotron.log(results);
                if (results && results.rows && results.rows._array.length > 0) {
                  let json = JSON.parse(results.rows._array[0].value);
                  reactotron.log('json from database');
                  reactotron.log(json);
                  return dispatch(configFetchCompleted(json));
                }
                return dispatch(configFetchFailed('config database'));
              },
              error => {
                reactotron.log(`error! ${error}`);
                return dispatch(configFetchFailed('cannot connect and cannot read from local'));
              }
            )
          });
        }
      } else {
        return dispatch(configFetchFailed('config response not ok'));
      }
    } catch(error) {
      return dispatch(configFetchFailed(error));
    }
  }
}

const insert = (p, v) => {
  v = (typeof(v) == "string") ? v :
      (typeof(v) == "object") ? JSON.stringify(v) : String(v);
  db.transaction(tx => {
    tx.executeSql(
      'insert into config (param, value) values (?,?)',
      [p, v],
      (tx, results) => {
        reactotron.log('results insert');
        reactotron.log(results);
      },
      error => {
        reactotron.log(`error! ${error}`);
      })
  });
}
const updateDB  = (json) => {
  reactotron.log('updateDB');
  reactotron.log(json);
  db.transaction(tx => {
    tx.executeSql(
      'delete from config where param = ?',
      ['config'],
      (tx, results) => {
        reactotron.log('delete results');
        reactotron.log(results);
      },
      error => {
        reactotron.log(`error! ${error}`);
      }
    );
  });

  insert("config", JSON.stringify(json));
}