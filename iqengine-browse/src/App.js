// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { Component } from 'react';
import ConnectionStringInput from './Components/FileBrowser/ConnectionString';
import RecordingsBrowser from './Components/FileBrowser/RecordingsBrowser';
import LocalFileChooser from './Components/FileBrowser/LocalFileChooser';
import SpectrogramPage from './Components/Spectrogram/SpectrogramPage';
import '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
                <Container>
                  <Row>
                    <Col>
                      <LocalFileChooser setRecordingList={this.setRecordingList} />
                    </Col>
                    <Col md="auto">
                      <br />
                      <div class="vr" style={{ opacity: 0.6, minHeight: 250 }}></div>
                    </Col>
                    <Col>
                      <ConnectionStringInput setRecordingList={this.setRecordingList} />
                    </Col>
                  </Row>
                </Container>

                <RecordingsBrowser data={this.state.recordingList} />
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
