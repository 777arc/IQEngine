// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  FETCH_MORE_DATA_FAILURE,
  FETCH_MORE_DATA_LOADING,
  FETCH_MORE_DATA_SUCCESS,
  RESET_BLOB_OBJ,
  UPDATE_BLOB_SIZE,
  UPDATE_BLOB_TAPS,
} from '../../Constants/BlobTypes';

window.iq_data = []; // This is GROSS!!! but it works?! We need a cleaner way to store large binary data.

const initialState = {
  size: 0,
  status: 'idle',
  taps: new Float32Array(1).fill(1),
};

export default function blobReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_BLOB_TAPS:
      return {
        ...state,
        taps: action.payload,
      };
    case UPDATE_BLOB_SIZE:
      return {
        ...state,
        size: action.payload,
      };
    case FETCH_MORE_DATA_LOADING:
      return {
        ...state,
        status: 'loading',
      };
    case FETCH_MORE_DATA_SUCCESS:
      const size = window.iq_data.length + action.payload.length; // payload is the new samples downloaded
      window.iq_data.push(...action.payload); // this replaces the code above, as long as we only grab <=100k samples at a time (call stack limit)
      console.log('window.iq_data length is now', window.iq_data.length);
      return {
        ...state,
        status: 'idle',
        size: size,
      };
    case FETCH_MORE_DATA_FAILURE:
      return {
        ...state,
        status: 'error',
      };
    case RESET_BLOB_OBJ:
      return initialState;
    default:
      return {
        ...state,
      };
  }
}
