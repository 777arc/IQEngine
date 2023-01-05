import { fetchRecordingsListFailure, fetchRecordingsListLoading, fetchRecordingsListSuccess } from '../Store/Actions/RecordingsListActions';

const { BlobServiceClient } = require('@azure/storage-blob');

async function blobToString(blob) {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onloadend = (ev) => {
      resolve(ev.target.result);
    };
    fileReader.onerror = reject;
    fileReader.readAsText(blob);
  });
}

function parseMeta(json_string, baseUrl, fName) {
  const obj = JSON.parse(json_string); // string to JSON
  return {
    name: fName,
    sampleRate: obj['global']['core:sample_rate'] / 1e6, // in MHz
    dataType: obj['global']['core:datatype'],
    frequency: obj['captures'][0]['core:frequency'] / 1e6, // in MHz
    annotations: obj['annotations'],
    numberOfAnnotation: obj['annotations'].length,
    author: obj['global']['core:author'],
    type: 'file',
    thumbnailUrl: baseUrl + fName + '.png',
  };
}
export const FetchRecordingsList = (connection) => async (dispatch) => {
  dispatch(fetchRecordingsListLoading());
  const { accountName, containerName, sasToken } = connection;
  const baseUrl = `https://${accountName}.blob.core.windows.net/${containerName}/`;
  const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // List the blob(s) in the container.
  const entries = [];
  try {
    for await (const blob of containerClient.listBlobsFlat()) {
      // only process meta-data files
      if (blob.name.split('.').pop() === 'sigmf-meta') {
        const blobClient = containerClient.getBlobClient(blob.name);
        const fName = blob.name.split('.')[0];

        // Get blob content from position 0 to the end, get downloaded data by accessing downloadBlockBlobResponse.blobBody
        const downloadBlockBlobResponse = await blobClient.download();
        const json_string = await blobToString(await downloadBlockBlobResponse.blobBody);

        // entries is a list of .sigmf-meta files, including the /'s for ones inside dirs, later on we tease them out
        entries.push(parseMeta(json_string, baseUrl, fName));
      }
    }
  } catch (error) {
    dispatch(fetchRecordingsListFailure(error));
  }
  //console.log(entries);
  dispatch(fetchRecordingsListSuccess(entries));
};
