// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import './App.css';
import React , { Component } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import ConnectionStringInput from './Components/FileBrowser/ConnectionString';
import JsonDataDisplay from './Components/FileBrowser/JSONDataDisplay';

import Sidebar from "./Components/Spectrogram/sidebar";
import './Components/Spectrogram/sidebar.css';
import { SpectrogramPanel } from './Components/Spectrogram/spectrogram-panel';
import {Container, Row, Col } from "react-bootstrap";

import '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store'
import { fetchMoreData } from './features/blob/blobSlice'
import { fetchMeta } from './features/meta/metaSlice'

import {
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";

class App extends Component {
  constructor(props){
    super(props);
    this.setData.bind(this);
    this.setConnectionInfo.bind(this);
    this.state = {
      accountName: "",
      containerName: "",
      sasToken: "",
      data: []
    };
  }

  // Allows child to set state in parent component (this component)
  setData = (x) => {
    this.setState({data: x});
  }

  setConnectionInfo = (x) => {
    this.setState({accountName: x.accountName});
    this.setState({accountName: x.containerName});
    this.setState({accountName: x.sasToken});
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
                <ConnectionStringInput setData = {this.setData} setConnectionInfo = {this.setConnectionInfo} />
                <JsonDataDisplay data={this.state.data}/>
                </>
              } />

              <Route path="/spectrogram/:recording" element={<FlightList data={this.state.data} />} />
            </Routes>
          </div>
      );
    }
  }

export function FlightList(props) {
    let { recording } = useParams(); // so we know which recording was clicked on

    store.dispatch(fetchMoreData());
    store.dispatch(fetchMeta);

    return (
        <div>
            {recording}

          <Container fluid>
           <Row>
               <Col xs={2} id="sidebar-wrapper">      
                 <Sidebar />
               </Col>
               <Col  xs={10} id="page-content-wrapper">
                <SpectrogramPanel/>
               </Col> 
           </Row>
       </Container>

        </div>
    )
}

export default App;
