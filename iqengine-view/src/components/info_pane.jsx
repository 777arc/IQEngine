// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import ListGroup from 'react-bootstrap/ListGroup';
import React from 'react';


export default function InfoPane() {
    const metaGlobal = useSelector((state) => state.meta.global)

  
    return (
        <ListGroup variant="flush">
            {metaGlobal["core:description"] && <ListGroup.Item><div className="fw-bold">{metaGlobal["core:description"] }</div></ListGroup.Item> }
            {metaGlobal["core:author"] && <ListGroup.Item>{metaGlobal["core:author"] }</ListGroup.Item> }
            {metaGlobal["core:version"] && <ListGroup.Item>ver {metaGlobal["core:version"] }</ListGroup.Item> }
            {metaGlobal["core:sample_rate"] && <ListGroup.Item>{metaGlobal["core:sample_rate"] } Hz</ListGroup.Item> }
            {metaGlobal["core:recorder"] && <ListGroup.Item>{metaGlobal["core:recorder"] }</ListGroup.Item> }
            {metaGlobal["core:hw"] && <ListGroup.Item>{metaGlobal["core:hw"] }</ListGroup.Item> }
            {metaGlobal["antenna:gain"] && <ListGroup.Item>{metaGlobal["antenna:gain"] }db Ant. Gain</ListGroup.Item> }
            {metaGlobal["antenna:type"] && <ListGroup.Item>{metaGlobal["antenna:type"] }</ListGroup.Item> }
      </ListGroup>
  
    )
  }
  