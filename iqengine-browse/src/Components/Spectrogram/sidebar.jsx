// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from "react";
import {Nav} from "react-bootstrap";
import LeftPanel from './left_panel';

const Sidebar = () => {
   //from: https://stackoverflow.com/questions/60482018/make-a-sidebar-from-react-bootstrap

    return (
            <Nav className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
                <Nav.Item>
                    <LeftPanel/>
                </Nav.Item>
            </Nav>
        );
  };

  export default Sidebar