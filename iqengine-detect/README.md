## To write your own detection function

### Function Input:

A JSON payload with the following fields (will appear as a dict in Python)
- `samples`: IQ samples (they will show up either as floats or ints)
- `sample_rate`: sample rate of the IQ samples in Hz
- `center_freq`: (default = 0) optional center (RF) frequency of the signal in Hz
- `detector_settings`: a JSON/dict containing key/value pairs of detector settings which will be passed into the detector as a dict

### Function Output:

A JSON payload with the following fields (will be a dict in python returned from your function)

- `annotations`: A list of SigMF annotations, where each one has the following fields.  Only sample_start and sample_count are required.  If your detector is able to detect the frequency range of each emission, we suggest also populating freq_lower_edge and freq_upper_edge.  If your detector does any sort of classification or SNR detection, you can use the label field and it will show up on the spectrogram as text, so it is recommended to keep it short.  The comment field and generator is for additional info that won't show up on the spectrogram. 
  - `core:sample_start` (required) [int] the sample index of the detection
  - `core:sample_count` (required) [int] the number of samples of the detection
  - `core:freq_lower_edge` [float] the frequency (Hz) of the lower edge of the feature
  - `core:freq_upper_edge` [float] the frequency (Hz) of the upper edge of the feature
  - `core:label` [string] short form human/machine-readable label
  - `core:comment` [string] human-readable comment
  - `core:generator`	[string] human-readable name of the entity that created this annotation, such as the name of your detector

### Adding your function to the backend service

