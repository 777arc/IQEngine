// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const { BlobServiceClient } = require("@azure/storage-blob");
// Blob service SAS URL string of the storage account, not the container
const blobSasUrl = process.env.REACT_APP_AZURE_BLOB_SAS_URL;
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const containerName = "testsigmfrecordings"
const containerClient = blobServiceClient.getContainerClient(containerName);
let blobName = "cellular_downlink_880MHz.sigmf-meta"
const blobClient = containerClient.getBlobClient(blobName);


const initialState = {annotations: [],
        captures: [],
        global: {}};


export const selectMetaAnnotations = state => state.meta.annotations;
export const selectMetaCaptures = state => state.meta.captures;
export const selectMetaGlobal = state => state.meta.global;

export default function metaReducer(state = initialState, action) {
    switch (action.type) {
    case 'meta/dataLoaded': {
        var new_state =  {
            ...action.payload 
        };

        return new_state
      }
      default:
        return state
    }
}

// Thunk function
export async function fetchMeta(dispatch, getState) {
    console.log("running fetchMeta")

    const downloadBlockBlobResponse = await blobClient.download();
    const blob = await downloadBlockBlobResponse.blobBody;
    const meta_string = await blob.text();
    const meta_json = JSON.parse(meta_string);
    console.log("Finished parsing the meta file");

    dispatch({ type: 'meta/dataLoaded', payload: meta_json });

}