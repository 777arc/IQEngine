// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSlice} from "@reduxjs/toolkit";
import FetchMoreData from "./fetchMoreData";

window.iq_data = [];   // This is GROSS!!! but it works?! I need a global way to store large binary variables.

const blobSlice = createSlice({
    name: "blob",
    initialState: {
        size: 0,
        status: "idle",
        scrollOffset: 0,
        taps: new Float32Array(1).fill(1),
    },
    reducers: {
        setScrollOffset: (state,action) => { state.scrollOffset = action.payload; },
        updateTaps: (state,action) => {state.taps = action.payload},
    },
    extraReducers: (builder) => {
        builder.addCase(FetchMoreData.pending, (state, action) => {
            state.status = "loading";
        }).addCase(FetchMoreData.fulfilled, (state, action) => {
            
            let size = window.iq_data.length + action.payload.length;  // Don't use byte length because the new array has to be specified by the num of elements not bytes
            state.status = "idle";
            state.size = size;

            let new_iq_data;
            if (window.data_type === 'ci16_le') {
                new_iq_data = new Int16Array(size);
            } else if (window.data_type === 'cf32_le') {
                new_iq_data = new Float32Array(size);
            } else {
                console.error("unsupported data_type");
                new_iq_data = new Int16Array(size);
            }

            new_iq_data.set(window.iq_data, 0);
            new_iq_data.set(action.payload, window.iq_data.length);  // again this is elements, not bytes
            window.iq_data = new_iq_data;
        }).addCase(FetchMoreData.rejected, (state, action) => {
            state.status = "error";
        })
    }
});

// Action creators are generated for each case reducer function
export const { updateTaps } = blobSlice.actions

export default blobSlice.reducer;