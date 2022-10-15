// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { fftshift } from 'fftshift'

const FFT = require('fft.js');

 // Similar to MATLAB's Jet colormap
 let colMap = [[  0,   0, 128, 255], [  0,   0, 131, 255], [  0,   0, 135, 255], [  0,   0, 139, 255], 
 [  0,   0, 143, 255], [  0,   0, 147, 255], [  0,   0, 151, 255], [  0,   0, 155, 255], 
 [  0,   0, 159, 255], [  0,   0, 163, 255], [  0,   0, 167, 255], [  0,   0, 171, 255], 
 [  0,   0, 175, 255], [  0,   0, 179, 255], [  0,   0, 183, 255], [  0,   0, 187, 255], 
 [  0,   0, 191, 255], [  0,   0, 195, 255], [  0,   0, 199, 255], [  0,   0, 203, 255], 
 [  0,   0, 207, 255], [  0,   0, 211, 255], [  0,   0, 215, 255], [  0,   0, 219, 255], 
 [  0,   0, 223, 255], [  0,   0, 227, 255], [  0,   0, 231, 255], [  0,   0, 235, 255], 
 [  0,   0, 239, 255], [  0,   0, 243, 255], [  0,   0, 247, 255], [  0,   0, 251, 255], 
 [  0,   0, 255, 255], [  0,   4, 255, 255], [  0,   8, 255, 255], [  0,  12, 255, 255], 
 [  0,  16, 255, 255], [  0,  20, 255, 255], [  0,  24, 255, 255], [  0,  28, 255, 255], 
 [  0,  32, 255, 255], [  0,  36, 255, 255], [  0,  40, 255, 255], [  0,  44, 255, 255], 
 [  0,  48, 255, 255], [  0,  52, 255, 255], [  0,  56, 255, 255], [  0,  60, 255, 255], 
 [  0,  64, 255, 255], [  0,  68, 255, 255], [  0,  72, 255, 255], [  0,  76, 255, 255], 
 [  0,  80, 255, 255], [  0,  84, 255, 255], [  0,  88, 255, 255], [  0,  92, 255, 255], 
 [  0,  96, 255, 255], [  0, 100, 255, 255], [  0, 104, 255, 255], [  0, 108, 255, 255], 
 [  0, 112, 255, 255], [  0, 116, 255, 255], [  0, 120, 255, 255], [  0, 124, 255, 255], 
 [  0, 128, 255, 255], [  0, 131, 255, 255], [  0, 135, 255, 255], [  0, 139, 255, 255], 
 [  0, 143, 255, 255], [  0, 147, 255, 255], [  0, 151, 255, 255], [  0, 155, 255, 255], 
 [  0, 159, 255, 255], [  0, 163, 255, 255], [  0, 167, 255, 255], [  0, 171, 255, 255], 
 [  0, 175, 255, 255], [  0, 179, 255, 255], [  0, 183, 255, 255], [  0, 187, 255, 255], 
 [  0, 191, 255, 255], [  0, 195, 255, 255], [  0, 199, 255, 255], [  0, 203, 255, 255], 
 [  0, 207, 255, 255], [  0, 211, 255, 255], [  0, 215, 255, 255], [  0, 219, 255, 255], 
 [  0, 223, 255, 255], [  0, 227, 255, 255], [  0, 231, 255, 255], [  0, 235, 255, 255], 
 [  0, 239, 255, 255], [  0, 243, 255, 255], [  0, 247, 255, 255], [  0, 251, 255, 255], 
 [  0, 255, 255, 255], [  4, 255, 251, 255], [  8, 255, 247, 255], [ 12, 255, 243, 255], 
 [ 16, 255, 239, 255], [ 20, 255, 235, 255], [ 24, 255, 231, 255], [ 28, 255, 227, 255], 
 [ 32, 255, 223, 255], [ 36, 255, 219, 255], [ 40, 255, 215, 255], [ 44, 255, 211, 255], 
 [ 48, 255, 207, 255], [ 52, 255, 203, 255], [ 56, 255, 199, 255], [ 60, 255, 195, 255], 
 [ 64, 255, 191, 255], [ 68, 255, 187, 255], [ 72, 255, 183, 255], [ 76, 255, 179, 255], 
 [ 80, 255, 175, 255], [ 84, 255, 171, 255], [ 88, 255, 167, 255], [ 92, 255, 163, 255], 
 [ 96, 255, 159, 255], [100, 255, 155, 255], [104, 255, 151, 255], [108, 255, 147, 255], 
 [112, 255, 143, 255], [116, 255, 139, 255], [120, 255, 135, 255], [124, 255, 131, 255], 
 [128, 255, 128, 255], [131, 255, 124, 255], [135, 255, 120, 255], [139, 255, 116, 255], 
 [143, 255, 112, 255], [147, 255, 108, 255], [151, 255, 104, 255], [155, 255, 100, 255], 
 [159, 255,  96, 255], [163, 255,  92, 255], [167, 255,  88, 255], [171, 255,  84, 255], 
 [175, 255,  80, 255], [179, 255,  76, 255], [183, 255,  72, 255], [187, 255,  68, 255], 
 [191, 255,  64, 255], [195, 255,  60, 255], [199, 255,  56, 255], [203, 255,  52, 255], 
 [207, 255,  48, 255], [211, 255,  44, 255], [215, 255,  40, 255], [219, 255,  36, 255], 
 [223, 255,  32, 255], [227, 255,  28, 255], [231, 255,  24, 255], [235, 255,  20, 255], 
 [239, 255,  16, 255], [243, 255,  12, 255], [247, 255,   8, 255], [251, 255,   4, 255], 
 [255, 255,   0, 255], [255, 251,   0, 255], [255, 247,   0, 255], [255, 243,   0, 255], 
 [255, 239,   0, 255], [255, 235,   0, 255], [255, 231,   0, 255], [255, 227,   0, 255], 
 [255, 223,   0, 255], [255, 219,   0, 255], [255, 215,   0, 255], [255, 211,   0, 255], 
 [255, 207,   0, 255], [255, 203,   0, 255], [255, 199,   0, 255], [255, 195,   0, 255], 
 [255, 191,   0, 255], [255, 187,   0, 255], [255, 183,   0, 255], [255, 179,   0, 255], 
 [255, 175,   0, 255], [255, 171,   0, 255], [255, 167,   0, 255], [255, 163,   0, 255], 
 [255, 159,   0, 255], [255, 155,   0, 255], [255, 151,   0, 255], [255, 147,   0, 255], 
 [255, 143,   0, 255], [255, 139,   0, 255], [255, 135,   0, 255], [255, 131,   0, 255], 
 [255, 128,   0, 255], [255, 124,   0, 255], [255, 120,   0, 255], [255, 116,   0, 255], 
 [255, 112,   0, 255], [255, 108,   0, 255], [255, 104,   0, 255], [255, 100,   0, 255], 
 [255,  96,   0, 255], [255,  92,   0, 255], [255,  88,   0, 255], [255,  84,   0, 255], 
 [255,  80,   0, 255], [255,  76,   0, 255], [255,  72,   0, 255], [255,  68,   0, 255], 
 [255,  64,   0, 255], [255,  60,   0, 255], [255,  56,   0, 255], [255,  52,   0, 255], 
 [255,  48,   0, 255], [255,  44,   0, 255], [255,  40,   0, 255], [255,  36,   0, 255], 
 [255,  32,   0, 255], [255,  28,   0, 255], [255,  24,   0, 255], [255,  20,   0, 255], 
 [255,  16,   0, 255], [255,  12,   0, 255], [255,   8,   0, 255], [255,   4,   0, 255], 
 [255,   0,   0, 255], [251,   0,   0, 255], [247,   0,   0, 255], [243,   0,   0, 255], 
 [239,   0,   0, 255], [235,   0,   0, 255], [231,   0,   0, 255], [227,   0,   0, 255], 
 [223,   0,   0, 255], [219,   0,   0, 255], [215,   0,   0, 255], [211,   0,   0, 255], 
 [207,   0,   0, 255], [203,   0,   0, 255], [199,   0,   0, 255], [195,   0,   0, 255], 
 [191,   0,   0, 255], [187,   0,   0, 255], [183,   0,   0, 255], [179,   0,   0, 255], 
 [175,   0,   0, 255], [171,   0,   0, 255], [167,   0,   0, 255], [163,   0,   0, 255], 
 [159,   0,   0, 255], [155,   0,   0, 255], [151,   0,   0, 255], [147,   0,   0, 255], 
 [143,   0,   0, 255], [139,   0,   0, 255], [135,   0,   0, 255], [131,   0,   0, 255],
 [  0,   0,   0,   0]];

/* hmmm.... one problem with only incrementally generating the FFT is that if the FFT Size or Magnitude Divider chagne, you need to re-create the whole thing
if the blob size changes, you only need to add on the new stuff. I think the solution is to build my own fancy selector with built in memoization stuff. */


var previous_blob_size = 0;
var previous_fft_size = 0;
var previous_magnitude_max = 0;
var previous_magnitude_min = 0;
window.fft_data = new Uint8ClampedArray();
window.annotations = []; // gets filled in before return
window.sample_rate = 1; // will get filled in
window.fft_size = 1; // will get filled in
window.data_type = 'not defined yet';

export const select_fft = (state) => {
    window.data_type = state.meta.global["core:datatype"]; // there might be a race condition here, but this line sets it, and it gets read in blobslice.js
    var blob_size = state.blob.size; // this is actually the number of int16's that have been downloaded so far
    var fft_size = state.fft.size;
    window.fft_size = fft_size;
    var magnitude_max = state.fft.magnitudeMax;
    var magnitude_min = state.fft.magnitudeMin;
    const num_ffts = Math.floor(window.iq_data.length/fft_size);      
    var startTime = performance.now()
    const pxPerLine = fft_size/2;
    const lines = num_ffts;
    const w = pxPerLine;
    const h = lines;

    // has there been any changes since we last rendered the FFT?  if not just return the existing fft_data
    if (!((blob_size !== previous_blob_size) ||
          (fft_size !== previous_fft_size) ||
          (magnitude_min !== previous_magnitude_min) ||
          (magnitude_max !== previous_magnitude_max))) {
        let select_fft_return = {image_data: new ImageData(window.fft_data, w, h),
                                 annotations: window.annotations,
                                 sample_rate: window.sample_rate,
                                 fft_size: window.fft_size};
        return select_fft_return;
    }
    
    // ...otherwise render the new portion
    var starting_row = 0;
    if (num_ffts === 0 ) {
        return null;
    }
    const clearBuf = new ArrayBuffer(pxPerLine * lines * 4);  // fills with 0s ie. rgba 0,0,0,0 = transparent
    var new_fft_data = new Uint8ClampedArray(clearBuf);
    let startOfs = 0;

    // make a full canvas of the color map 0 values
    for (let i=0; i<pxPerLine*lines*4; i+=4) 
    {
      // byte reverse so number aa bb gg rr
      new_fft_data[i] = colMap[0][0];   // red
      new_fft_data[i+1] = colMap[0][1]; // green
      new_fft_data[i+2] = colMap[0][2]; // blue
      new_fft_data[i+3] = colMap[0][3]; // alpha
    }
    // initialize the direction and first line position
    if ((fft_size === previous_fft_size) && 
        (magnitude_min === previous_magnitude_min) &&
        (magnitude_max === previous_magnitude_max)) {
        starting_row = Math.floor(previous_blob_size/fft_size);  
        new_fft_data.set(window.fft_data, 0);
    } 

      for (var i = starting_row; i < num_ffts; i++){
  
          const x = window.iq_data.slice(i*fft_size, (i+1)*fft_size)
          const f = new FFT(x.length/2); // you tell it fft size, not the input array size, which will be twice the fft size
          const out = f.createComplexArray(); // creates an empty array the length of fft.size*2
          f.transform(out, x); // assumes input (2nc arg) is in form IQIQIQIQ and twice the length of fft.size
          var magnitudes = new Array(out.length/2);
          for (var j = 0; j < out.length/2; j++) {
              magnitudes[j] = Math.sqrt(Math.pow(out[j*2],2) + Math.pow(out[j*2+1],2)) // take magnitude
          }
          fftshift(magnitudes); // in-place  
  
          // convert to dB
          magnitudes = magnitudes.map(x => 10.0*Math.log10(x));

          // convert to 0 - 255
          let minimum_val = Math.min(...magnitudes); // the ... tell it that its an array I guess
          magnitudes = magnitudes.map(x => x - minimum_val); // lowest value is now 0
          let maximum_val = Math.max(...magnitudes); 
          magnitudes = magnitudes.map(x => x / maximum_val); // highest value is now 1
          magnitudes = magnitudes.map(x => x * 255); // now from 0 to 255

          // apply magnitude min and max
          magnitudes = magnitudes.map(x => x / ((magnitude_max - magnitude_min)/255));
          magnitudes = magnitudes.map(x => x - magnitude_min)
          
          
          //const magnitude = ((magnitudeDivider || 10000) < 0 ? 10000 : (magnitudeDivider || 10000));
          //magnitudes = magnitudes.map(x => x / magnitude);  
  
          // Clip from 0 to 255 and convert to ints
          magnitudes = magnitudes.map(x => x > 255 ? 255 : x); // clip above 255
          magnitudes = magnitudes.map(x => x < 0 ? 0 : x); // clip below 0
          let ipBuf8 = Uint8ClampedArray.from(magnitudes); // anything over 255 or below 0 at this point will become a random number
          let line_offset = i * pxPerLine * 4;
          for (let sigVal, rgba, opIdx = 0, ipIdx = startOfs; ipIdx < pxPerLine+startOfs; opIdx += 4, ipIdx++) 
          {
            sigVal = ipBuf8[ipIdx] || 0;    // if input line too short add zeros
            rgba = colMap[sigVal];  // array of rgba values
            // byte reverse so number aa bb gg rr
            new_fft_data[line_offset + opIdx] = rgba[0];   // red
            new_fft_data[line_offset + opIdx+1] = rgba[1]; // green
            new_fft_data[line_offset + opIdx+2] = rgba[2]; // blue
            new_fft_data[line_offset + opIdx+3] = rgba[3]; // alpha
          }
      }
      var endTime = performance.now()
      console.log("Rendering spectrogram took", endTime - startTime, "milliseconds"); // first cut of our code processed+rendered 0.5M samples in 760ms on marcs computer

      // Annotation portion
      let annotations_list = window.annotations;
      for (let i = 0; i < state.meta.annotations.length; i++) {
        let freq_lower_edge = state.meta.annotations[i]['core:freq_lower_edge'];
        let freq_upper_edge = state.meta.annotations[i]['core:freq_upper_edge'];
        let sample_start = state.meta.annotations[i]['core:sample_start'];
        let sample_count = state.meta.annotations[i]['core:sample_count'];
        let description = state.meta.annotations[i]['core:description'];
        //console.log(freq_lower_edge, freq_upper_edge, sample_start, sample_count, description);

        // Calc the sample index of the first FFT being displayed
        let start_sample_index = previous_blob_size/2; // blob size is in units of ints/floats that have been downloaded, and its two per sample
        //console.log("start_sample_index:", start_sample_index);
        let samples_in_window = (blob_size - previous_blob_size)/2;
        //console.log("samples_in_window:", samples_in_window);
        let stop_sample_index = start_sample_index + samples_in_window;
        let center_frequency = state.meta.captures[0]['core:frequency'];
        let sample_rate = state.meta.global['core:sample_rate'];
        window.sample_rate = sample_rate;
        //console.log("center_frequency:", center_frequency, "sample_rate:", sample_rate)
        let lower_freq = center_frequency - sample_rate/2;
        let upper_freq = center_frequency + sample_rate/2;
        let delta_f = (sample_rate/fft_size)*2; // hz per bin
        //console.log("lower_freq:", lower_freq, "upper_freq:", upper_freq, "delta_f:", delta_f);

        if ((sample_start >= start_sample_index) && (sample_start < stop_sample_index)) {
          annotations_list.push({"x": (freq_lower_edge - lower_freq)/delta_f, // number of freq bins
                                 "y": sample_start/fft_size, // fft index
                                 "width": (freq_upper_edge - freq_lower_edge)/delta_f, // number of freq bins
                                 "height": sample_count/fft_size, // fft index
                                 "description": description
                                 }); 
        }
      }
      window.annotations = annotations_list;

      previous_blob_size = blob_size;
      previous_fft_size = fft_size;
      previous_magnitude_max = magnitude_max;
      previous_magnitude_min = magnitude_min;
      window.fft_data = new_fft_data;   

      let select_fft_return = {image_data: new ImageData(window.fft_data, w, h),
                               annotations: window.annotations,
                               sample_rate: window.sample_rate};
      return select_fft_return;
    }
