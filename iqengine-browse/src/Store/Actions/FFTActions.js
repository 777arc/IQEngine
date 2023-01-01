import { UPDATE_FFT_MAGNITUDE_MAX, UPDATE_FFT_MAGNITUDE_MIN, UPDATE_FFT_SIZE } from '../../Constants/FFTTypes';

export const updateFFTSize = (payload) => ({
  type: UPDATE_FFT_SIZE,
  payload,
});

export function updateFFTMagnitudeMax(payload) {
  return {
    type: UPDATE_FFT_MAGNITUDE_MAX,
    payload,
  };
}

export const updateFFTMagnitudeMin = (payload) => ({
  type: UPDATE_FFT_MAGNITUDE_MIN,
  payload,
});
