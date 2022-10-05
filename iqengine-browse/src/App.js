// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import './App.css';
import React , { Component } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import ConnectionStringInput from './Components/FileBrowser/ConnectionString';
import JsonDataDisplay from './Components/FileBrowser/JSONDataDisplay';
import SpectrogramPage from './Components/FileBrowser/SpectrogramPage';

import './Components/Spectrogram/sidebar.css';

import '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';


import {
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";

class App extends Component {
  constructor(props){
    super(props);
    this.setRecordingList.bind(this);
    this.setConnectionInfo.bind(this);
    this.state = {
      accountName: "",
      containerName: "",
      sasToken: "",
      recordingList: [] // look at the end of DataFetcher to see how this data structure works
    };
  }

  // Allows child to set state in parent component (this component)
  setRecordingList = (x) => {
    this.setState({recordingList: x});
  }

  setConnectionInfo = (x) => {
    this.setState({accountName: x.accountName});
    this.setState({containerName: x.containerName});
    this.setState({sasToken: x.sasToken});
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
                <ConnectionStringInput setRecordingList={this.setRecordingList} setConnectionInfo={this.setConnectionInfo} />
                <JsonDataDisplay data={this.state.recordingList}/>
                </>
              } />

              <Route path="/spectrogram/:recording" element={
                <SpectrogramPage accountName={this.state.accountName} containerName={this.state.containerName} sasToken={this.state.sasToken} />
              } />
            </Routes>
          </div>
      );
    }
  }

export default App;
