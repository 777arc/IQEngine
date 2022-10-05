// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React , { Component } from 'react';
import GetFilesFromBlob from './DataFetcher';
import { useSelector, useDispatch } from 'react-redux'

class ConnectionStringInput extends Component {
    constructor(props) {
        super(props);
        this.ConnStrHandleClick.bind(this);
      }
    
    ConnStrHandleClick = async (e) => {
        e.preventDefault()

        if(e.target.accountNameRef.value !== "" && e.target.containerNameRef.value !== "" && e.target.sasTokenRef.value !== ""){
            let newState = {}
            newState.accountName = e.target.accountNameRef.value;
            newState.containerName = e.target.containerNameRef.value;
            newState.sasToken = e.target.sasTokenRef.value;
            this.props.setConnectionInfo(newState);
            this.props.setData(await GetFilesFromBlob(e.target.accountNameRef.value, e.target.containerNameRef.value, e.target.sasTokenRef.value));
        }
    }

    render() {  
        return (
            <div id='ConnectionStringContainer' className="form-group">
                <form onSubmit={this.ConnStrHandleClick}>
                    <div className="form-group">
                        <label htmlFor="AccountNameInput">Storage Account Name: </label>
                        <input name='accountNameRef' type='text' className="form-control" id='AccountNameInput' defaultValue='sigmffilerecordings'></input>
                        <label htmlFor="ContainerNameInput">Container Name: </label>
                        <input name='containerNameRef' type='text' className="form-control" id='ContainerNameInput' defaultValue='testsigmfrecordings'></input>
                        <label htmlFor="SASTokenInput">Container's SAS Token: </label>
                        <input name='sasTokenRef' type='text' className="form-control" id='SASTokenInput' defaultValue={process.env.REACT_APP_AZURE_BLOB_SAS_TOKEN}></input>
                    </div>
                    <div className="form-group">
                        <button type='submit' className="btn btn-primary">Browse</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default ConnectionStringInput;
