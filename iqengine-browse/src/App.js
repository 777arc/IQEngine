// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import './App.css';
import React , { Component } from 'react';
import ConnectionStringInput from './Components/FileBrowser/ConnectionString';
import JsonDataDisplay from './Components/FileBrowser/JSONDataDisplay';
import GetFilesFromBlob from './Components/FileBrowser/DataFetcher';

import Sidebar from "./Components/Spectrogram/sidebar";
import './Components/Spectrogram/sidebar.css';
import { SpectrogramPanel } from './Components/Spectrogram/spectrogram-panel';
import {Container, Row, Col, Card, Form, Button } from "react-bootstrap";

import '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store'
import { fetchMoreData } from './features/blob/blobSlice'
import { fetchMeta } from './features/meta/metaSlice'
import { Provider } from 'react-redux'

import {
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      accountName: "",
      containerName: "",
      sasToken: "",
      data: []
    };

    this.ConnStrHandleClick = this.ConnStrHandleClick.bind(this);
  }

  ConnStrHandleClick = async (e) => {
    e.preventDefault()
    if(e.target.accountNameRef.value !== "" && e.target.containerNameRef.value !== "" && e.target.sasTokenRef.value !== ""){
      this.setState( { accountName: e.target.accountNameRef.value } );
      this.setState( { containerName: e.target.containerNameRef.value } );
      this.setState( { sasToken: e.target.sasTokenRef.value } );
      this.setState({data: await GetFilesFromBlob(e.target.accountNameRef.value, e.target.containerNameRef.value, e.target.sasTokenRef.value)});
    }
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
                <ConnectionStringInput ConnStrHandleClick={this.ConnStrHandleClick}/>
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
      <Provider store={store}>
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
        </Provider>
    )
}

export default App;
