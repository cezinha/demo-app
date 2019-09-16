import {netConstants} from  '../constants';
import { REHYDRATE } from 'redux-persist';

const initialState = {
  netInfo: {},
  loading: false,
  error: ''
}

const netReducer = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return state;
    case netConstants.NET_STARTED:
      return { ...state, loading: true };
    case netConstants.NET_COMPLETED:
      return { ...state, loading: false, netInfo: action.netInfo };
    case netConstants.NET_ERROR:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

export default netReducer;