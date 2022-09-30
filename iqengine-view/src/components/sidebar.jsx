// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from "react";
import {Nav} from "react-bootstrap";
import LeftPanel from './left_panel';
import './sidebar.css'

const Sidebar = () => {
   //from: https://stackoverflow.com/questions/60482018/make-a-sidebar-from-react-bootstrap

    return (

    
            <Nav  className="col-md-2 d-none d-md-block bg-light sidebar">
                <div className="sidebar-sticky"></div>
                <Nav.Item>
                <LeftPanel/>
            </Nav.Item>
            </Nav>
          

        );
  };

  export default Sidebar