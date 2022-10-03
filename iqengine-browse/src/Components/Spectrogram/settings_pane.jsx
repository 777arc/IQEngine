// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

import Form from 'react-bootstrap/Form';
import MagnitudeDividerSetting from "./magnitude_divider_setting"

export default function SettingsPane() {


  return (
    
    <Form>
        <MagnitudeDividerSetting/>
    </Form>
  )
}

