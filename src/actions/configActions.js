import { configConstants } from '../constants';

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
      let response = await fetch(config.REMOTE_CONFIG_URL);
      if (response.ok) {
        let json = await response.json();
        console.log('configLoad loaded---------');
        console.log(config);
        console.log(json);
        console.log('configLoad loaded---------');

        return dispatch(configFetchCompleted(json));
      } else {
        return dispatch(configFetchFailed('response not ok'));
      }
    } catch(error) {
      return dispatch(configFetchFailed(error));
    }
  }
}