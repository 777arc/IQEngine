// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store'
import { fetchMoreData } from './features/blob/blobSlice'
import { fetchMeta } from './features/meta/metaSlice'
import { Provider } from 'react-redux'

store.dispatch(fetchMoreData());
store.dispatch(fetchMeta);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
