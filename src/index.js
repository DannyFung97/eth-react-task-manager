import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configStore } from './store'
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import './index.css';
import App from './App.js';

const store = configStore()
const persistor = persistStore(store)

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor} loading = {<div>Loading...</div>}>
            <App />
        </PersistGate>
    </Provider>
, document.getElementById('root'));