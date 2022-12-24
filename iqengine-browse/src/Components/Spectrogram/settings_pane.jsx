// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { updateSize, updateMagnitudeMax, updateMagnitudeMin } from '../../reducers/fftSlice';
import { updateTaps } from '../../reducers/blobSlice';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

export default function SettingsPane() {
  const dispatch = useDispatch();

  const [magnitudeMax, setValueMagnitudeMax] = useState(useSelector((state) => state.fft.magnitudeMax));
  const onChangeMagnitudeMax = (event) => {
    setValueMagnitudeMax(event.target.value);
  };
  const onSubmitMagnitudeMax = () => {
    dispatch(updateMagnitudeMax(magnitudeMax));
  };

  const [magnitudeMin, setValueMagnitudeMin] = useState(useSelector((state) => state.fft.magnitudeMin));
  const onChangeMagnitudeMin = (event) => {
    setValueMagnitudeMin(event.target.value);
  };
  const onSubmitMagnitudeMin = () => {
    dispatch(updateMagnitudeMin(magnitudeMin));
  };

  const [fftsize, setFftsize] = useState(useSelector((state) => state.fft.size));
  const onChangeFftsize = (event) => {
    setFftsize(event.target.value);
  };
  const onSubmitFftsize = () => {
    dispatch(updateSize(fftsize));
  };

  const [taps_string, setTaps] = useState(useSelector((state) => '[' + state.blob.taps.toString() + ']'));
  const onChangeTaps = (event) => {
    setTaps(event.target.value);
  }; // only updates the displayed string
  const onSubmitTaps = () => {
    let taps = new Array(1).fill(1);
    // make sure the string is a valid array
    if (taps_string[0] === '[' && taps_string.slice(-1) === ']') {
      taps = taps_string.slice(1, -1).split(',');
      taps = taps.map((x) => parseFloat(x));
      taps = Float32Array.from(taps);
      dispatch(updateTaps(taps));
      console.log('valid taps, found', taps.length, 'taps');
    } else {
      console.error('invalid taps');
    }
    dispatch(updateTaps(taps));
  };

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Magnitude Max</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control type="text" value={magnitudeMax} onChange={onChangeMagnitudeMax} size="sm" />
          <Button className="btn btn-secondary" onClick={onSubmitMagnitudeMax}>
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Magnitude Min</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control type="text" value={magnitudeMin} onChange={onChangeMagnitudeMin} size="sm" />
          <Button className="btn btn-secondary" onClick={onSubmitMagnitudeMin}>
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>FFT Size</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control type="text" value={fftsize} onChange={onChangeFftsize} size="sm" />
          <Button className="btn btn-secondary" onClick={onSubmitFftsize}>
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>FIR Filter Taps</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control type="text" value={taps_string} onChange={onChangeTaps} size="sm" />
          <Button className="btn btn-secondary" onClick={onSubmitTaps}>
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </InputGroup>
      </Form.Group>

      <DropdownButton title="Data Type" id="dropdown-menu-align-right" onSelect>
        <Dropdown.Item eventKey="cf32_le">complex float32</Dropdown.Item>
        <Dropdown.Item eventKey="ci16_le">complex int16</Dropdown.Item>
      </DropdownButton>
      <p></p>
    </Form>
  );
}
