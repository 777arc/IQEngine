import { SpectrogramPanel } from './spectrogram-panel';
import { Container, Row, Col } from 'react-bootstrap';
import LocalFetchMoreData from '../../reducers/localfetchMoreData';
import { FetchMeta } from '../../reducers/metaSlice';
import { useDispatch } from 'react-redux';
import Sidebar from './sidebar';
import { updateRecording } from '../../reducers/connectionSlice';
import { useParams } from 'react-router-dom';
import { updateSize } from '../../reducers/blobSlice';
import { clear_fft_data } from '../../selector';

async function LocalSpectrogramPage() {
  const dispatch = useDispatch();

  dispatch(updateSize(0)); // reset the number of samples downloaded when this page loads
  clear_fft_data();

  dispatch(LocalFetchMoreData()); // fetch IQ for the first time
  dispatch(FetchMeta); // fetch the metadata

  return (
    <div>
      <Container fluid>
        <Row className="flex-nowrap">
          <Col className="col-3">
            <Sidebar />
          </Col>
          <Col>
            <SpectrogramPanel />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LocalSpectrogramPage;
