// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { useSelector, useDispatch } from 'react-redux'

const { BlobServiceClient } = require("@azure/storage-blob");

// Blob service SAS URL string of the storage account, not the container
console.log("got here");
const blobSasUrl = process.env.REACT_APP_AZURE_BLOB_SAS_URL;
console.log(blobSasUrl);
const blobServiceClient = new BlobServiceClient(blobSasUrl);

const containerName = "testsigmfrecordings"
const containerClient = blobServiceClient.getContainerClient(containerName);
let blobName = "cellular_downlink_880MHz.sigmf-data"
const blobClient = containerClient.getBlobClient(blobName);

const initialState = {size: 0, status: "idle", scrollOffset: 0};
window.iq_data = [];   // This is GROSS!!! but it works?! I need a global way to store large binary variables.

export const FetchMoreData = createAsyncThunk("blob/FetchMoreData",  async (arg,{ getState}) => {

    try {
    var startTime = performance.now()
    const state = getState();
    let num_samples = 2000;
    let offset = state.blob.size;
    const bytes_per_sample = 2; // for int16s
    let count = 1024*num_samples*bytes_per_sample; // must be a power of 2, FFT currently doesnt support anything else. 
    /*let blobProps = await blobClient.getProperties();
    let content_length = parseInt(blobProps["contentLength"]);
    console.log("Blob length: " + content_length + " Requesting a total of: " + parseInt(offset + count));
    if ((offset + count) > content_length) {
        console.log("Requesting more than is in the file!");
    }*/
    const downloadBlockBlobResponse = await blobClient.download(offset, count);
    const blob = await downloadBlockBlobResponse.blobBody;
    const buffer = await blob.arrayBuffer();
    var endTime = performance.now()
    console.log("Fetching more data took", endTime - startTime, "milliseconds");
    if (window.data_type === 'ci16_le') {
        return new Int16Array(buffer);
    } else if (window.data_type === 'cf32_le') {
        return new Float32Array(buffer);
    } else {
        console.error("unsupported data_type");
        return new Int16Array(buffer);
    }
        //const signal = new Int16Array(buffer);
         //dispatch({ type: 'blob/dataLoaded', payload: signal });    
    } catch (error) {
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
      }
    
})


const blobSlice = createSlice({
    name: "blob",
    initialState,
    reducers: {
        setScrollOffset: (state,action) => { state.scrollOffset = action.payload; }
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

export default blobSlice.reducer;
/*
export const selectBlobSize = state => state.blob.size;

export default function blobReducer(state = initialState, action) {
    switch (action.type) {
    case 'blob/dataLoaded': {
        // Replace the existing state entirely by returning the new value
        let size = window.iq_data.length + action.payload.length;  // Don't use byte length because the new array has to be specified by the num of elements not bytes
        let new_state = {
            size: size,
            status: "idle"
        }
        let new_iq_data = new Int16Array(size);

        new_iq_data.set(window.iq_data,0);
        new_iq_data.set(action.payload,window.iq_data.length);  // again this is elements, not bytes
        window.iq_data = new_iq_data;
        return new_state
      }
    case 'blob/dataLoading' :{
        let new_state = {
            ...state,
            status: "loading"
        };

        return new_state;
    }
      default:
        return state
    }
}

// Thunk function
//    The word "thunk" is a programming term that means "a piece of code that does some delayed work".
//    For Redux specifically, "thunks" are a pattern of writing functions with logic inside that can interact with a Redux store's dispatch and getState methods.
//    Thunks are the standard approach for writing async logic in Redux apps, and are commonly used for data fetching

export const fetchMoreDatas = () => async dispatch => {

    console.log("running fetchMoreData")
    dispatch({ type: 'blob/dataLoading'});
    var startTime = performance.now()
    const state = getState();
    let num_samples = 2000;
    let offset = state.blob.size;
    const bytes_per_sample = 2; // for int16s
    let count = 1024*num_samples*bytes_per_sample; // must be a power of 2, FFT currently doesnt support anything else. */
    /*let blobProps = await blobClient.getProperties();
    let content_length = parseInt(blobProps["contentLength"]);
    console.log("Blob length: " + content_length + " Requesting a total of: " + parseInt(offset + count));
    if ((offset + count) > content_length) {
        console.log("Requesting more than is in the file!");
    }*/ /*
    const downloadBlockBlobResponse = await blobClient.download(offset, count);
    const blob = await downloadBlockBlobResponse.blobBody;
    blob.arrayBuffer().then(buffer => {
        const signal = new Int16Array(buffer);
        dispatch({ type: 'blob/dataLoaded', payload: signal });
    });
    var endTime = performance.now()
    console.log("Fetching more data took", endTime - startTime, "milliseconds");
 }*/
