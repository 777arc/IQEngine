// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useParams } from 'react-router-dom';

const { BlobServiceClient } = require('@azure/storage-blob');

const initialState = { annotations: [], captures: [], global: {} };

export default function metaReducer(state = initialState, action) {
  switch (action.type) {
    case 'meta/dataLoaded': {
      var new_state = {
        ...action.payload,
      };

      return new_state;
    }
    default:
      return state;
  }
}

// Thunk function
export async function FetchMeta(dispatch, getState) {
  console.log('running fetchMeta');
  let state = getState();
  let meta_string = '';
  let blobName = useParams().recording + '.sigmf-meta'; // has to go outside of condition or else react gets mad
  if (state.connection.metafilehandle === '') {
    let accountName = state.connection.accountName;
    let containerName = state.connection.containerName;
    let sasToken = state.connection.sasToken;

    if (containerName === '') {
      console.error('container name was not filled out for some reason');
    }

    // Get the blob client
    const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    const downloadBlockBlobResponse = await blobClient.download();
    const blob = await downloadBlockBlobResponse.blobBody;
    meta_string = await blob.text();
  } else {
    let fileHandle = state.connection.metafilehandle;
    const file = await fileHandle.getFile();
    meta_string = await file.text();
  }

  const meta_json = JSON.parse(meta_string);
  dispatch({ type: 'meta/dataLoaded', payload: meta_json });
}
