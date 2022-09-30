// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState} from "react";

import SettingsPane from "./settings_pane";
import InfoPane from "./info_pane";
import Accordion from 'react-bootstrap/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'


export default function LeftPanel() {


  return (
    <Accordion defaultActiveKey="0">
    <Accordion.Item eventKey="0">
      <Accordion.Header>Settings</Accordion.Header>
      <Accordion.Body>
      <SettingsPane />
      </Accordion.Body>
    </Accordion.Item>
    <Accordion.Item eventKey="1">
      <Accordion.Header>Info</Accordion.Header>
      <Accordion.Body>
      <InfoPane />
      </Accordion.Body>
    </Accordion.Item>
    <Accordion.Item eventKey="2">
      <Accordion.Header>Annotations</Accordion.Header>
      <Accordion.Body>
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>


  )
}


