// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

//import './App.css';
import Sidebar from "./components/sidebar";
import './components/sidebar.css';
import React, { Component } from "react";
import { SpectrogramPanel } from './components/spectrogram-panel';
import {Container, Row, Col, Card, Form, Button } from "react-bootstrap";


const App = () => {

  return (

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
  

  );
  
}

export default App;
