// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, {useState} from 'react'
import { Modal, ModalHeader, ModalBody} from 'reactstrap';

export default function FileRow({i, info}) {
    const [modal, setModal] = useState(false)
    const toggle = () => {
    setModal(!modal)

    };
    return (
        <tr key={i}>
            <td><div className="zoom"><img src={info.thumbnailUrl} alt="Spectrogram Thumbnail" style={{width:"200px", height:"100px"}} /></div></td>
            <td className="align-middle"><a href="#" target="_blank">{info.name}</a></td>
            <td className="align-middle">{info.dataType}</td>
            <td className="align-middle">{info.frequency}</td>
            <td className="align-middle">{info.sampleRate}</td>
            <td className="align-middle">
                <div>
                    <p onClick={toggle} ><a href="#">{info.numberOfAnnotation}</a></p>
                    <Modal isOpen={modal} toggle={toggle} size='lg'>
                        <ModalHeader toggle={toggle}>{info.name}</ModalHeader>
                        <ModalBody>
                            {info.annotations.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <p>{JSON.stringify(item, null, '\t')}</p>
                                    </div>
                                )
                            })
                            }
                        </ModalBody>
                    </Modal>
                </div>
            </td>
            <td className="align-middle">{info.author}</td>
        </tr>
    )
 }