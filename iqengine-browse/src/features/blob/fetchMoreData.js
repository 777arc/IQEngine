// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createAsyncThunk} from "@reduxjs/toolkit";

const FetchMoreData = createAsyncThunk("blob/FetchMoreData",  async (arg,{ getState}) => {
    console.log("running FetchMoreData")
    let state = getState();
    let accountName = state.connection.accountName;
    let containerName = state.connection.containerName;
    let sasToken = state.connection.sasToken;

    while (state.connection.recording === "")
    {
        console.log("waiting"); // hopefully this doesn't happen, and if it does it should be pretty quick because its the time it takes for the state to set
    }
    let blobName = state.connection.recording + '.sigmf-data';

    // Get the blob client TODO: REFACTOR SO WE DONT HAVE TO REMAKE THE CLIENT EVERY TIME!
    const { BlobServiceClient } = require("@azure/storage-blob");
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

export default FetchMoreData;