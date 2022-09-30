// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState} from "react";
import { useDispatch, useSelector } from 'react-redux'
import { updateMagnitudeDivider } from '../features/fft/fftSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight} from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

export default function MagnitudeDividerSetting() {
  const magnitudeDivider = useSelector((state) => state.fft.magnitudeDivider)
  const dispatch = useDispatch()
  const [value, setValue] = useState(magnitudeDivider);
  const onChange = (event) => {
    setValue(event.target.value);
  };
  const onSubmit = () => {
    dispatch(updateMagnitudeDivider(value))
  }

  return (
    <>
    <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Magnitude Max</Form.Label>
        <InputGroup className="mb-3">
        <Form.Control type="text"  value={value} onChange={onChange} size="sm"  />
        <Button className="btn btn-secondary" onClick={onSubmit}>
              <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Magnitude Min</Form.Label>
      <InputGroup className="mb-3">
      <Form.Control type="text"  value={10} onChange={onChange} size="sm"  />
      <Button className="btn btn-secondary" onClick={onSubmit}>
            <FontAwesomeIcon icon={faArrowRight} />
      </Button>
      </InputGroup>
      </Form.Group>

      <DropdownButton
      title="Data Type"
      id="dropdown-menu-align-right"
      onSelect
        >
              <Dropdown.Item eventKey="cf32_le">complex float32</Dropdown.Item>
              <Dropdown.Item eventKey="ci16_le">complex int16</Dropdown.Item>
      </DropdownButton>
      <p></p>
      <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>FFT Size</Form.Label>
      <InputGroup className="mb-3">
      <Form.Control type="text"  value={1024} onChange={onChange} size="sm"  />
      <Button className="btn btn-secondary" onClick={onSubmit}>
            <FontAwesomeIcon icon={faArrowRight} />
      </Button>
      </InputGroup>
      </Form.Group>

      </>
  )
}

