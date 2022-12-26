// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { Component } from 'react';
import ConnectionStringInput from './Components/FileBrowser/ConnectionString';
import JsonDataDisplay from './Components/FileBrowser/RecordingsBrowser';
import LocalFileChooser from './Components/FileBrowser/LocalFileChooser';
import SpectrogramPage from './Components/Spectrogram/SpectrogramPage';
import '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
        <h1 className="display-1">
          <Link to="/">
            <center>IQEngine</center>
          </Link>
        </h1>

        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <LocalFileChooser />
                <p></p>
                <ConnectionStringInput setRecordingList={this.setRecordingList} />

                <JsonDataDisplay data={this.state.recordingList} />
              </>
            }
          />

          <Route path="/spectrogram/:recording" element={<SpectrogramPage />} />
        </Routes>
      </div>
    );
  }
}

export default App;
