// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSlice } from '@reduxjs/toolkit'
export const selectFftSize = state => state.fft.size;
export const selectMagnitudeDivider = state => state.fft.magnitudeDivider;

export const fftSlice = createSlice({
  name: 'fft',
  initialState: {
    size: 1024, 
    magnitudeDivider: 230
  },
  reducers: {
    updateSize: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.size = action.payload
    },
    updateMagnitudeDivider: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.magnitudeDivider = action.payload
    },

  },
})

// Action creators are generated for each case reducer function
export const { updateSize, updateMagnitudeDivider } = fftSlice.actions

export default fftSlice.reducer


