import { SpectrogramPanel } from '../Spectrogram/spectrogram-panel';
import {Container, Row, Col } from "react-bootstrap";
import { FetchMoreData } from '../../features/blob/blobSlice'
import { FetchMeta } from '../../features/meta/metaSlice'

import { useSelector, useDispatch } from 'react-redux'
import Sidebar from "../Spectrogram/sidebar";
import { useParams } from "react-router-dom";

function SpectrogramPage() {
    let { recording } = useParams(); // so we know which recording was clicked on

    const accountName = useSelector((state) => state.connection.accountName);
    const containerName = useSelector((state) => state.connection.containerName);
    const sasToken = useSelector((state) => state.connection.sasToken);
    console.log("Using account and container:", accountName, containerName);

    const dispatch = useDispatch();

    dispatch(FetchMoreData()); // fetch IQ for the first time
    dispatch(FetchMeta); // fetch the metadata

    return (
        <div>
            {recording}

          <Container fluid>
           <Row>
               <Col xs={2} id="sidebar-wrapper">      
                 <Sidebar />
               </Col>
               <Col  xs={10} id="page-content-wrapper">
                <SpectrogramPanel/>
               </Col> 
           </Row>
       </Container>

        </div>
    )
}

export default SpectrogramPage;