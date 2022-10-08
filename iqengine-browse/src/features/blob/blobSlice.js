// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from "react-router-dom";

const { BlobServiceClient } = require("@azure/storage-blob");

const initialState = {size: 0, status: "idle", scrollOffset: 0};
window.iq_data = [];   // This is GROSS!!! but it works?! I need a global way to store large binary variables.

export const FetchMoreData = createAsyncThunk("blob/FetchMoreData",  async (arg,{ getState}) => {
    console.log("running FetchMoreData")
    let state = getState();
    let accountName = state.connection.accountName;
    let containerName = state.connection.containerName;
    let sasToken = state.connection.sasToken;

    let blobName = useParams().recording + '.sigmf-data'; // so we know which recording was clicked on
    console.log('xxx', blobName);

    // Get the blob client TODO: REFACTOR SO WE DONT HAVE TO REMAKE THE CLIENT EVERY TIME!
    const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    try {
        var startTime = performance.now()
        let num_samples = 2000;
        let offset = state.blob.size;

        let bytes_per_sample = 2;
        if (window.data_type === 'ci16_le') {
            bytes_per_sample = 2;
        } else if (window.data_type === 'cf32_le') {
            bytes_per_sample = 4;
        } else {
            bytes_per_sample = 2;
        }

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