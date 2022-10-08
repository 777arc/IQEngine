// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react'
// import { Modal, ModalHeader, ModalBody} from 'reactstrap';
import GroupByFolder from '../../GroupByFolder';
import Directory from './Directory';

 function JsonDataDisplay({data}){
    const gfiles = data.map(data => data.name);
    let dataTree = [];

    if (gfiles.length > 0){
        dataTree = GroupByFolder(data, '');
    }

    console.log(dataTree);
    const DisplayData=dataTree.map(
        (info,i)=>{
            return(
                <Directory key={i} files={info} />
            )
        }
    )

    return(
        <div>
            <table className="table">
                <thead>
                    <tr>
                    <th>Spectrogram</th>
                    <th>Recording Name</th>
                    <th>Data Type</th>
                    <th>Freq [MHz]</th>
                    <th>Sample Rate [MHz]</th>
                    <th># of Annotations</th>
                    <th>Author</th>
                    </tr>
                </thead>
                <tbody>
                    {DisplayData}
                </tbody>
            </table>

        </div>
    )
 }

//  function TableRow({i, info}) {
//     const [modal, setModal] = useState(false)
//     const toggle = () => {
//     setModal(!modal)

//     };
//     return (
//         <tr key={i}>
//             <td><div className="zoom"><img src={info.name.includes('/') ? "https://media.istockphoto.com/vectors/missing-rubber-stamp-vector-vector-id1213374148?k=20&m=1213374148&s=612x612&w=0&h=A3_Ku27Jf_XRfsWCZYvwJWQGNR2hbHDh9ViLLaAdJ5w=" : info.thumbnailUrl} alt="Spectrogram Thumbnail" style={{width:"200px", height:"100px"}} /></div></td>
//             <td class="align-middle"><a href="https://http://localhost:3000/#" target="_blank">{info.name}</a></td>
//             <td class="align-middle">{info.dataType}</td>
//             <td class="align-middle">{info.frequency}</td>
//             <td class="align-middle">{info.sampleRate}</td>
//             <td class="align-middle">
//                 <div>
//                     <p onClick={toggle} ><a href="#">{info.numberOfAnnotation}</a></p>
//                     <Modal isOpen={modal} toggle={toggle} size='lg'>
//                         <ModalHeader toggle={toggle}>{info.name}</ModalHeader>
//                         <ModalBody>
//                             {info.annotations.map((item, index) => {
//                                 return (
//                                     <div key={index}>
//                                         <p>{JSON.stringify(item, null, '\t')}</p>
//                                     </div>
//                                 )
//                             })
//                             }
//                         </ModalBody>
//                     </Modal>
//                 </div>
//             </td>
//             <td class="align-middle">{info.author}</td>
//         </tr>
//     )
//  }


 export default JsonDataDisplay;