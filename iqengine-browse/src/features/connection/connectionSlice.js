// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSlice } from '@reduxjs/toolkit'

export const selectAccountName = state => state.connection.accountName;
export const selectContainerName = state => state.connection.containerName;
export const selectSasToken = state => state.connection.sasToken;

export const connectionSlice = createSlice({
  name: 'connection',
  initialState: {
    accountName: "",
    containerName: "",
    sasToken: ""},
  reducers: {
    updateAccountName: (state,action) => {
      state.accountName = action.payload
    },
    updateContainerName: (state,action) => {
      state.containerName = action.payload
    },
    updateSasToken: (state,action) => {
      state.sasToken = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateAccountName, updateContainerName, updateSasToken } = connectionSlice.actions

export default connectionSlice.reducer










