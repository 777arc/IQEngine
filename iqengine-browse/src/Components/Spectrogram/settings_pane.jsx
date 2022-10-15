// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import { updateMagnitudeMax, updateMagnitudeMin } from '../../features/fft/fftSlice'
import { faArrowRight} from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

export default function SettingsPane() {
  const dispatch = useDispatch()

  const [magnitudeMax, setValueMagnitudeMax] = useState(useSelector((state) => state.fft.magnitudeMax));
  const onChangeMagnitudeMax = (event) => {setValueMagnitudeMax(event.target.value);};
  const onSubmitMagnitudeMax = () => {dispatch(updateMagnitudeMax(magnitudeMax))}

  const [magnitudeMin, setValueMagnitudeMin] = useState(useSelector((state) => state.fft.magnitudeMin));
  const onChangeMagnitudeMin = (event) => {setValueMagnitudeMin(event.target.value);};
  const onSubmitMagnitudeMin = () => {dispatch(updateMagnitudeMin(magnitudeMin))}

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Magnitude Max</Form.Label>
        <InputGroup className="mb-3">
        <Form.Control type="text"  value={magnitudeMax} onChange={onChangeMagnitudeMax} size="sm"  />
        <Button className="btn btn-secondary" onClick={onSubmitMagnitudeMax}>
              <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Magnitude Min</Form.Label>
        <InputGroup className="mb-3">
        <Form.Control type="text"  value={magnitudeMin} onChange={onChangeMagnitudeMin} size="sm"  />
        <Button className="btn btn-secondary" onClick={onSubmitMagnitudeMin}>
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




    </Form>
  )
}

