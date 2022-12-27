import React from 'react';
import { useNavigate } from 'react-router-dom';
import { updateMetaFileHandle, updateDataFileHandle } from '../../reducers/connectionSlice';
import { useDispatch } from 'react-redux';
//import parseMeta from './DataFetcher';
import Button from 'react-bootstrap/Button';

export default function LocalFileChooser(props) {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  async function OpenFile() {
    const [handle1, handle2] = await window.showOpenFilePicker({ multiple: true });
    const file1 = await handle1.getFile();
    const file2 = await handle2.getFile();
    if (file1.name.includes('.sigmf-meta')) {
      dispatch(updateMetaFileHandle(handle1)); // store it in redux
      dispatch(updateDataFileHandle(handle2)); // assume other file is data
      navigate('/spectrogram/' + file2.name); // data file
    } else {
      dispatch(updateMetaFileHandle(handle2));
      dispatch(updateDataFileHandle(handle1));
      navigate('/spectrogram/' + file1.name); // data file
    }
  }

  // this is duplicate of the code in ConnectionString.jsx but when i tried to stick it in a separate js file i would get browser errors
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

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  async function handleDirectoryEntry(handle, out, dir) {
    for await (const entry of handle.values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile();
        //let filerreader = new FileReader();
        //const json_string = filerreader.readAsText(file);
        if (file.name.split('.').pop() === 'sigmf-meta') {
          const json_string = await readFileAsync(file);
          out.push(parseMeta(json_string, 'local/', dir + file.name));
        }
      }
      if (entry.kind === 'directory') {
        const newHandle = await handle.getDirectoryHandle(entry.name, { create: false });
        await handleDirectoryEntry(newHandle, out, dir + entry.name + '/');
      }
    }
    return out;
  }

  async function getFilesFromLocalDir(dirHandle) {
    const entries = await handleDirectoryEntry(dirHandle, [], '');
    console.log(entries);
    return entries;
  }

  const OpenDir = async () => {
    const dirHandle = await window.showDirectoryPicker();
    let tempout = await getFilesFromLocalDir(dirHandle);
    props.setRecordingList(tempout); // updates the parent (App.js) state with the RecordingList
  };

  // Need to clear these states whenever we go to the main page, because we use them to figure out if we loaded a local file later on
  dispatch(updateMetaFileHandle(''));
  dispatch(updateDataFileHandle(''));

  return (
    <div className="container-fluid">
      <Button onClick={OpenFile}>Open Local .sigmf-data File</Button>
      <br /> <br />
      <Button onClick={OpenDir}>Open Local Directory</Button>
      <br />
    </div>
  );
}
