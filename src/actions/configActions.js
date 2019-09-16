import {configConstants} from '../constants';
//import { SQLite } from 'expo-sqlite';
import reactotron from "../config/ReactotronConfig";

//const db = SQLite.openDatabase("demo.db");

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
      //const netInfo = useNetInfo();
      //if (netInfo.isConnected) {
        let response = await fetch(config.REMOTE_CONFIG_URL);
        if (response.ok) {
          let json = await response.json();
          reactotron.log('configLoad loaded---------');
          reactotron.log(config);
          reactotron.log(json);
          reactotron.log('configLoad loaded---------');

           // update DB
          updateDB(json);

          return dispatch(configFetchCompleted(json));
        } else {
          return dispatch(configFetchFailed('config response not ok'));
        }
      /*} else {
      // lê do DB Local
        db.transaction(tx => {
          tx.executeSql(
            `select * from config`,
            [],
            (_, { rows: { _array }}) => {
              return { config: _array };
            }
          );
        });
      }*/

      // update DB
    } catch(error) {
      return dispatch(configFetchFailed(error));
    }
  }
}

function updateDB(json) {
  reactotron.log('updateDB');
  reactotron.log(json);
}