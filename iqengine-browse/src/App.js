// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { Component } from 'react';
import ConnectionStringInput from './Components/FileBrowser/ConnectionString';
import JsonDataDisplay from './Components/FileBrowser/JSONDataDisplay';
import NavBar from './Components/FileBrowser/NavBar';
import SpectrogramPage from './Components/Spectrogram/SpectrogramPage';
import '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.setRecordingList.bind(this);
    this.state = {
      recordingList: [], // look at the end of DataFetcher to see how this data structure works
    };
  }

  // Allows child to set state in parent component (this component)
  setRecordingList = (x) => {
    this.setState({ recordingList: x });
  };

  render() {
    return (
      <div>
        <NavBar />

        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <ConnectionStringInput setRecordingList={this.setRecordingList} />
                <JsonDataDisplay data={this.state.recordingList} />
              </>
            }
          />

          <Route path="/spectrogram/:recording" element={this.state.recordingList.length !== 0 ? <SpectrogramPage /> : <Navigate to="/" />} />
        </Routes>
      </div>
    );
  }
}

export default App;
