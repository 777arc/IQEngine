import { useNavigate } from 'react-router-dom';
import React from 'react';
import { updateMetaFileHandle, updateDataFileHandle } from '../../reducers/connectionSlice';
import { useDispatch } from 'react-redux';

export default function LocalFileChooser() {
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

  // Need to clear these states whenever we go to the main page, because we use them to figure out if we loaded a local file later on
  dispatch(updateMetaFileHandle(''));
  dispatch(updateDataFileHandle(''));

  return (
    <div className="container-fluid">
      <button onClick={OpenFile}>Open Local .sigmf-data File</button>
      <br></br>
    </div>
  );
}
