import { configConstants } from  '../constants';
import { REHYDRATE } from 'redux-persist';
import initConfig from '../config/config.env';

const initialState = {
  config: initConfig,
  loading: false,
  error: ''
}

const configReducer = (state = initialState, action) => {
  let config;
  switch (action.type) {
    case REHYDRATE:
      if (initialState.updated > state.config.updated) {
        return { ...state, config: initConfig };
      }
      return state;
    case configConstants.STARTED:
        if (initConfig.updated > state.config.updated) {
          return { ...state, loading: false, config: initConfig, error: null };
        }
      return { ...state, loading: true };
    case configConstants.COMPLETED:
        if (state.config.updated > action.config.updated) {
          return { ...state, loading: false, error: null };
        }
        config = {};
        Object.assign(config, state.config);
        Object.assign(config, action.config);
      return { ...state, loading: false, config: config, error: null };
    case configConstants.ERROR:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

export default configReducer;