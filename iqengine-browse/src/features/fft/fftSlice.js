// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSlice } from '@reduxjs/toolkit'

export const fftSlice = createSlice({
  name: 'fft',
  initialState: {
    size: 1024, 
    magnitudeMax: 230,
    magnitudeMin: 50
  },
  reducers: {
    updateSize: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.size = action.payload
    },
    updateMagnitudeMax: (state,action) => {state.magnitudeMax = action.payload},
    updateMagnitudeMin: (state,action) => {state.magnitudeMin = action.payload},
  },
})

// Action creators are generated for each case reducer function
export const { updateSize, updateMagnitudeMax, updateMagnitudeMin } = fftSlice.actions

export default fftSlice.reducer


