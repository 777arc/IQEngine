import { SpectrogramPanel } from '../Spectrogram/spectrogram-panel';
import {Container, Row, Col } from "react-bootstrap";
import { fetchMoreData } from '../../features/blob/blobSlice'
import { fetchMeta } from '../../features/meta/metaSlice'
import store from '../../store'
import { useSelector, useDispatch } from 'react-redux'
import Sidebar from "../Spectrogram/sidebar";
import {
    Routes,
    Route,
    Link,
    useParams
  } from "react-router-dom";

function SpectrogramPage({accountName, containerName, sasToken}) {
    let { recording } = useParams(); // so we know which recording was clicked on

    console.log("GOT HERE");
    console.log(accountName)

    store.dispatch(fetchMoreData());
    store.dispatch(fetchMeta);


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