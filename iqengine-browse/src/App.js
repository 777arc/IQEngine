// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React , { Component } from 'react';
import ConnectionStringInput from './Components/FileBrowser/ConnectionString';
import JsonDataDisplay from './Components/FileBrowser/JSONDataDisplay';
import SpectrogramPage from './Components/Spectrogram/SpectrogramPage';
import './Components/Spectrogram/sidebar.css';
import '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";


class App extends Component {
  constructor(props){
    super(props);
    this.setRecordingList.bind(this);
    this.state = {
      recordingList: [] // look at the end of DataFetcher to see how this data structure works
    };
  }

  // Allows child to set state in parent component (this component)
  setRecordingList = (x) => {
    this.setState({recordingList: x});
  }

  render() {
    return (
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/spectrogram/testttt">About</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
          <hr />
          
          <Routes>
            <Route exact path="/" element={ 
              <>
              <div><center><h1 className="display-1"><b>IQEngine</b></h1></center></div>
              <ConnectionStringInput setRecordingList={this.setRecordingList} />
              <JsonDataDisplay data={this.state.recordingList}/>
              </>
            } />

            <Route path="/spectrogram/:recording" element={
              this.state.recordingList.length !== 0 ? <SpectrogramPage /> : <Navigate to="/" />
            } />
          </Routes>
        </div>
    );
  }
}

export default App;
