// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { Link } from "react-router-dom";

export default function FileRow({ i, info }) {
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  return (
    <tr key={i}>
      <td>
        <div className="zoom">
          <img src={info.thumbnailUrl} alt="Spectrogram Thumbnail" style={{ width: "200px", height: "100px" }} />
        </div>
      </td>
      <td className="align-middle">
        <Link to={"spectrogram/" + info.name}>{info.name}</Link>
      </td>
      <td className="align-middle">{info.dataType}</td>
      <td className="align-middle">{info.frequency}</td>
      <td className="align-middle">{info.sampleRate}</td>
      <td className="align-middle">
        <div>
          <button type="button" onClick={toggle}>
            {info.numberOfAnnotation}
          </button>

          <Modal isOpen={modal} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>{info.name}</ModalHeader>
            <ModalBody>
              {info.annotations.map((item, index) => {
                return (
                  <div key={index}>
                    <p>{JSON.stringify(item, null, "\t")}</p>
                  </div>
                );
              })}
            </ModalBody>
          </Modal>
        </div>
      </td>
      <td className="align-middle">{info.author}</td>
    </tr>
  );
}
