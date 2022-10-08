import { SpectrogramPanel } from './spectrogram-panel';
import {Container, Row, Col } from "react-bootstrap";
import FetchMoreData from '../../features/blob/fetchMoreData'
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
            <Row className="flex-nowrap">
              <Col className="col-3">      
                <Sidebar />
              </Col>
              <Col>
                <SpectrogramPanel/>
              </Col> 
            </Row>
          </Container>
        </div>
    )
}

export default SpectrogramPage;