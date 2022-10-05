// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React , { useState } from 'react';
import GetFilesFromBlob from './DataFetcher';
import { useDispatch } from 'react-redux'
import { updateAccountName, updateContainerName, updateSasToken } from '../../features/connection/connectionSlice'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight} from '@fortawesome/free-solid-svg-icons'

function ConnectionStringInput (props) {
    const dispatch = useDispatch()
    const [accountName, setAccountName] = useState('sigmffilerecordings'); // makes a new state within the component (not redux)
    const [containerName, setContainerName] = useState('testsigmfrecordings');
    const [sasToken, setSasToken] = useState(process.env.REACT_APP_AZURE_BLOB_SAS_TOKEN);

    const onAccountNameChange = (event) => { setAccountName(event.target.value); }; // updates it visually
    const onContainerNameChange = (event) => { setContainerName(event.target.value); };
    const onSasTokenChange = (event) => { setSasToken(event.target.value); };
    const onSubmit = async () => {
      // updates it in the store
      dispatch(updateAccountName(accountName)) 
      dispatch(updateContainerName(containerName))
      dispatch(updateSasToken(sasToken))

      props.setRecordingList(await GetFilesFromBlob(accountName, containerName, sasToken)); // updates the parent (App.js) state with the RecordingList
    }

    return (
      <div id='ConnectionStringContainer'>
        <div className="form-group">

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Storage Account Name:</Form.Label>
            <Form.Control type="text"  value={accountName} onChange={onAccountNameChange} size="sm"  />

            <Form.Label>Container Name:</Form.Label>
            <Form.Control type="text"  value={containerName} onChange={onContainerNameChange} size="sm"  />
            
            <Form.Label>SAS Token for Container:</Form.Label>
            <Form.Control type="text"  value={sasToken} onChange={onSasTokenChange} size="sm"  />
          </Form.Group>

          <Button className="btn btn-secondary" onClick={onSubmit}>
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>

        </div>
      </div>
    )
}

export default ConnectionStringInput;
