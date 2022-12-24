// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export default async function getFilesFromBlob(accountName, containerName, sasToken) {
  const { BlobServiceClient } = require('@azure/storage-blob');

  const baseUrl = `https://${accountName}.blob.core.windows.net/${containerName}/`;
  const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // List the blob(s) in the container.
  const entries = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    // only process meta-data files
    if (blob.name.split('.').pop() === 'sigmf-meta') {
      const blobClient = containerClient.getBlobClient(blob.name);
      const fName = blob.name.split('.')[0];

      // Get blob content from position 0 to the end
      // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
      const downloadBlockBlobResponse = await blobClient.download();
      const downloaded = await blobToString(await downloadBlockBlobResponse.blobBody);
      //console.log('Downloaded blob content:', downloaded.toString());

      // string to JSON
      const obj = JSON.parse(downloaded);
      // Parameters to display
      // console.log(obj['global']['core:sample_rate']);
      // console.log(obj['captures'][0]['core:frequency']);
      // console.log(obj['annotations'].length);

      entries.push({
        name: fName,
        sampleRate: obj['global']['core:sample_rate'] / 1e6, // in MHz
        dataType: obj['global']['core:datatype'],
        frequency: obj['captures'][0]['core:frequency'] / 1e6, // in MHz
        annotations: obj['annotations'],
        numberOfAnnotation: obj['annotations'].length,
        author: obj['global']['core:author'],
        type: 'file',
        thumbnailUrl: baseUrl + fName + '.png',
      });
    }
  }

  // [Browsers only] A helper method used to convert a browser Blob into string.
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

  // console.log(entries);
  return entries;
}
