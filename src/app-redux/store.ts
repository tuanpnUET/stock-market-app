import AsyncStorage from '@react-native-community/async-storage';
import { applyMiddleware, compose, createStore } from 'redux';
import logger from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import rootReducer from 'app-redux/rootReducer';

// persistInit
const persistConfig = {
    blacklist: ['AlertReducer'],
    key: 'stock-market',
    debug: __DEV__,
    storage: AsyncStorage,
};

const middleware: any = [];

if (__DEV__) {
    middleware.push(logger);
}

const reducer = persistReducer(persistConfig, rootReducer);

const store = createStore(reducer, compose(applyMiddleware(...middleware)));

const persistor = persistStore(store);

export { store, persistor };
