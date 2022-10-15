// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSlice } from '@reduxjs/toolkit'

export const fftSlice = createSlice({
  name: 'fft',
  initialState: {
    size: 1024, 
    magnitudeMax: 255,
    magnitudeMin: 30
  },
  reducers: {
    updateSize: (state,action) => {state.size = action.payload},
    updateMagnitudeMax: (state,action) => {state.magnitudeMax = action.payload},
    updateMagnitudeMin: (state,action) => {state.magnitudeMin = action.payload},
  },
})

// Action creators are generated for each case reducer function
export const { updateSize, updateMagnitudeMax, updateMagnitudeMin } = fftSlice.actions

export default fftSlice.reducer


