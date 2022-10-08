// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useParams } from "react-router-dom";

const { BlobServiceClient } = require("@azure/storage-blob");

const initialState = {annotations: [],
                      captures: [],
                      global: {}};

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
export async function FetchMeta(dispatch, getState) {
    console.log("running fetchMeta")
    let state = getState();
    let accountName = state.connection.accountName;
    let containerName = state.connection.containerName;
    let sasToken = state.connection.sasToken;

    let blobName = useParams().recording + '.sigmf-meta'; // so we know which recording was clicked on
    console.log(blobName);
    
    if (containerName === "") {
        console.error("container name was not filled out for some reason");
    }

    // Get the blob client
    const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    const downloadBlockBlobResponse = await blobClient.download();
    const blob = await downloadBlockBlobResponse.blobBody;
    const meta_string = await blob.text();
    const meta_json = JSON.parse(meta_string);
    console.log("Finished parsing the meta file");

    dispatch({ type: 'meta/dataLoaded', payload: meta_json });

}