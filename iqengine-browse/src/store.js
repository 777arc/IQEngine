// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { configureStore } from '@reduxjs/toolkit'

import fftReducer from './features/fft/fftSlice'
import blobReducer from './features/blob/blobSlice'
import metaReducer from './features/meta/metaSlice'
import thunk from 'redux-thunk'

const store = configureStore({
    reducer: {
      // Define a top-level state field named `todos`, handled by `todosReducer`
      fft: fftReducer,
      blob: blobReducer,
      meta: metaReducer
    },
    middleware: [thunk]
  })

export default store;

