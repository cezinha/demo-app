import {netConstants} from '../constants';
import * as NetInfo from "@react-native-community/netinfo"

export const configNetInfoStarted = () => ({
  type: netConstants.NET_STARTED
});

export const configNetInfoCompleted = netInfo =>  ({
  type: netConstants.NET_COMPLETED,
  netInfo
});

export const configNetInfoFailed = error => ({
  type: netConstants.NET_ERROR,
  error
});

export const getInfo = () => {
  return async dispatch => {
    dispatch(configNetInfoStarted());
    try {
      let netInfo = await NetInfo.getConnectionInfo();
      if (netInfo.type) {
        netInfo.isConnected = (netInfo.type != 'none');
        return dispatch(configNetInfoCompleted(netInfo));
      }
      return dispatch(configNetInfoFailed("connection has no info"));
    } catch(error) {
      return dispatch(configNetInfoFailed(error));
    }
  }
}