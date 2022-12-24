// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { configureStore } from '@reduxjs/toolkit';

import fftReducer from './reducers/fftSlice';
import blobReducer from './reducers/blobSlice';
import metaReducer from './reducers/metaSlice';
import connectionReducer from './reducers/connectionSlice';
import thunk from 'redux-thunk';

const store = configureStore({
  reducer: {
    // Define a top-level state field named `todos`, handled by `todosReducer`
    fft: fftReducer,
    blob: blobReducer,
    meta: metaReducer,
    connection: connectionReducer,
  },
  middleware: [thunk],
});

export default store;
