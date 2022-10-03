// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react'

export default function ConnectionStringInput ({ConnStrHandleClick}){
    return (
        <div id='ConnectionStringContainer' className="form-group">
            <form onSubmit={ConnStrHandleClick}>
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
