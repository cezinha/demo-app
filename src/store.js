import { applyMiddleware, compose, createStore } from "redux";
import { persistCombineReducers, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import reducers from "./reducers";
import { composeWithDevTools } from 'remote-redux-devtools';
import Reactotron from './config/ReactotronConfig'

//import { globalConstants } from "./constants";

let composeEnhancers = compose;
const logger = createLogger();

if (__DEV__) {
  composeEnhancers = composeWithDevTools || compose;
}

const config = {
  key: "root",
  storage
};

const reducer = persistCombineReducers(config, reducers);

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk, logger), Reactotron.createEnhancer()));
const persistor = persistStore(store);

export { store, persistor };
