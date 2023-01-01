import { connect } from 'react-redux';
import SpectrogramPage from '../Components/Spectrogram/SpectrogramPage';
import {
  updateConnectionAccountName,
  updateConnectionContainerName,
  updateConnectionSasToken,
  updateConnectionMetaFileHandle,
  updateConnectionDataFileHandle,
  updateConnectionRecording,
  resetConnection,
} from '../Store/Actions/ConnectionActions';
import { initFetchMoreBlob, resetBlob, updateBlobTaps } from '../Store/Actions/BlobActions';
import { updateFFTMagnitudeMax, updateFFTMagnitudeMin, updateFFTSize } from '../Store/Actions/FFTActions';
import { fetchMetaDataBlob, resetMeta } from '../Store/Actions/FetchMetaActions';
import { resetFFT } from '../Store/Actions/FFTActions';

function mapStateToProps(state) {
  const { connectionReducer, blobReducer, fetchMetaReducer, fftReducer } = state;
  return {
    connection: { ...connectionReducer },
    blob: { ...blobReducer },
    meta: { ...fetchMetaReducer },
    fft: { ...fftReducer },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // I don't think the order of these matter, it's not actually calling the functions here, right?
    updateConnectionAccountName: (accountName) => dispatch(updateConnectionAccountName(accountName)),
    updateConnectionContainerName: (containerName) => dispatch(updateConnectionContainerName(containerName)),
    updateConnectionSasToken: (token) => dispatch(updateConnectionSasToken(token)),
    updateConnectionMetaFileHandle: (handle) => dispatch(updateConnectionMetaFileHandle(handle)),
    updateConnectionDataFileHandle: (handle) => dispatch(updateConnectionDataFileHandle(handle)),
    updateConnectionRecording: (recording) => dispatch(updateConnectionRecording(recording)),
    updateBlobTaps: (taps) => dispatch(updateBlobTaps(taps)),
    updateMagnitudeMax: (x) => dispatch(updateFFTMagnitudeMax(x)),
    updateMagnitudeMin: (x) => dispatch(updateFFTMagnitudeMin(x)),
    updateFftsize: (x) => dispatch(updateFFTSize(x)),
    initFetchMoreBlob: (args) => dispatch(initFetchMoreBlob(args)),
    fetchMetaDataBlob: (connection) => dispatch(fetchMetaDataBlob(connection)),
    resetConnection: () => dispatch(resetConnection()),
    resetMeta: () => dispatch(resetMeta()),
    resetBlob: () => dispatch(resetBlob()),
    resetFFT: () => dispatch(resetFFT()),
  };
}

const SpectrogramContainer = connect(mapStateToProps, mapDispatchToProps)(SpectrogramPage);

export default SpectrogramContainer;
