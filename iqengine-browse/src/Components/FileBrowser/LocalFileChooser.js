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
    if (file1.name.includes('.sigmf-meta')) {
      dispatch(updateMetaFileHandle(handle1)); // store it in redux
      dispatch(updateDataFileHandle(handle2)); // assume other file is data
    } else {
      dispatch(updateMetaFileHandle(handle2));
      dispatch(updateDataFileHandle(handle1));
    }
    navigate('/localspectrogram/');
  }

  return (
    <div className="container-fluid">
      <button onClick={OpenFile}>Open Local .sigmf-data File</button>
      <br></br>
    </div>
  );
}
