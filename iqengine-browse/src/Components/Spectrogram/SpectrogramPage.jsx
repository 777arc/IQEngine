import { SpectrogramPanel } from './spectrogram-panel';
import {Container, Row, Col } from "react-bootstrap";
import { FetchMoreData } from '../../features/blob/blobSlice'
import { FetchMeta } from '../../features/meta/metaSlice'
import { useDispatch } from 'react-redux'
import Sidebar from "./sidebar";
import { updateRecording } from '../../features/connection/connectionSlice'
import { useParams } from "react-router-dom";

function SpectrogramPage() {
    const dispatch = useDispatch();

    dispatch(updateRecording(useParams().recording));

    dispatch(FetchMoreData()); // fetch IQ for the first time
    dispatch(FetchMeta); // fetch the metadata

    return (
        <div>
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