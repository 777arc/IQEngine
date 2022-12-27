import { SpectrogramPanel } from './spectrogram-panel';
import { Container, Row, Col } from 'react-bootstrap';
import FetchMoreData from '../../reducers/fetchMoreData';
import { FetchMeta } from '../../reducers/metaSlice';
import { useDispatch } from 'react-redux';
import Sidebar from './sidebar';
import { updateRecording } from '../../reducers/connectionSlice';
import { useParams, useLocation } from 'react-router-dom';
import { updateSize } from '../../reducers/blobSlice';
import { clear_fft_data } from '../../selector';
import { updateMetaFileHandle, updateDataFileHandle } from '../../reducers/connectionSlice';

function SpectrogramPage() {
  const dispatch = useDispatch();

  const { state } = useLocation();
  // if we entered here from clicking a local file on the list, set the filehandlers
  if (state) {
    if (state.metaFileHandle) {
      console.log('setting meta and data file handlers');
      dispatch(updateMetaFileHandle(state.metaFileHandle)); // store it in redux
      dispatch(updateDataFileHandle(state.dataFileHandle)); // assume other file is data
    }
  }

  dispatch(updateRecording(useParams().recording.replaceAll('(slash)', '/'))); // the route is /spectrogram/:recording.  we had to use a hack to allow for slashes in the name

  dispatch(updateSize(0)); // reset the number of samples downloaded when this page loads
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
