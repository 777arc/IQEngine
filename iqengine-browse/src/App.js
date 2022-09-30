// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import './App.css';
import ConnectionStringInput from './Components/ConnectionString';
import JsonDataDisplay from './Components/JSONDataDisplay';
import React , { Component } from 'react';
import GetFilesFromBlob from './Components/DataFetcher';


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
        <>
        <div><center><h1 class="display-1"><b>IQEngine</b></h1></center></div>
        <ConnectionStringInput ConnStrHandleClick={this.ConnStrHandleClick}/>
        <JsonDataDisplay data={this.state.data}/>
        </>
      );
    }
  }

export default App;
