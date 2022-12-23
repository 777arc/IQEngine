import { SpectrogramPanel } from './spectrogram-panel';
import { Container, Row, Col } from 'react-bootstrap';
import FetchMoreData from '../../features/blob/fetchMoreData';
import { FetchMeta } from '../../features/meta/metaSlice';
import { useDispatch } from 'react-redux';
import Sidebar from './sidebar';
import { updateRecording } from '../../features/connection/connectionSlice';
import { useParams } from 'react-router-dom';
import { updateSize } from '../../features/blob/blobSlice';
import { setScrollOffset } from '../../features/blob/blobSlice';
import { clear_fft_data } from '../../selector';

function SpectrogramPage() {
  const dispatch = useDispatch();

  dispatch(updateRecording(useParams().recording)); // the route is /spectrogram/:recording

  dispatch(updateSize(0)); // reset the number of samples downloaded when this page loads
  dispatch(setScrollOffset(0));
  clear_fft_data();

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
            <SpectrogramPanel />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SpectrogramPage;
