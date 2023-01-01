import { SpectrogramPanel } from './SpectrogramPanel';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { clear_fft_data } from '../../Utils/selector';
import { Component } from 'react';

class SpectrogramPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connection: props.connection,
      blob: props.blob,
      meta: props.meta,
      fft: props.fft,
    };
  }

  componentDidMount() {
    let { fetchMetaDataBlob, connection } = this.props;
    window.iq_data = [];
    clear_fft_data();

    fetchMetaDataBlob(connection); // fetch the metadata
  }

  componentWillUnmount() {
    this.props.resetConnection();
    this.props.resetMeta();
    window.iq_data = [];
    this.props.resetBlob();
    this.props.resetFFT();
  }

  // Not sure why we can do fft but not blob (we have to do blob.size)?
  static getDerivedStateFromProps(props, state) {
    let newState = state;
    if (JSON.stringify(props.meta) !== JSON.stringify(state.meta)) {
      newState.meta = props.meta;
    }
    if (props.blob.size !== state.blob.size) {
      newState.blob.size = props.blob.size;
    }
    if (props.fft !== state.fft) {
      newState.fft = props.fft;
    }
    return { ...newState };
  }

  render() {
    const { blob, meta, fft } = this.state;

    return (
      <div>
        <Container fluid>
          <Row className="flex-nowrap">
            <Col className="col-3">
              <Sidebar
                updateBlobTaps={this.props.updateBlobTaps}
                updateMagnitudeMax={this.props.updateMagnitudeMax}
                updateMagnitudeMin={this.props.updateMagnitudeMin}
                updateFftsize={this.props.updateFftsize}
                fft={fft}
                blob={blob}
                meta={meta}
              />
            </Col>
            <Col>
              <SpectrogramPanel
                initFetchMoreBlob={this.props.initFetchMoreBlob}
                connection={this.state.connection}
                fft={fft}
                blob={blob}
                meta={meta}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default SpectrogramPage;
