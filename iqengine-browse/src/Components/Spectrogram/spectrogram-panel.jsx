// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SpectrogramViewer } from './spectrogram-viewer';
import { AnnotationViewer } from './annotation-viewer';
import { RulerTop } from './ruler-top';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FetchMoreData from '../../reducers/fetchMoreData';

const SpectrogramPanel = () => {
  const [isBottom, setIsBottom] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });
  const dispatch = useDispatch();

  const timescale_width = 20;
  const text_width = 30;
  const upper_tick_height = 30;

  var spectrogram_width = dimensions.width - text_width - timescale_width;

  const checkSize = () => {
    const panel = document.getElementById('spectrogram-panel');
    setDimensions({
      width: panel.offsetWidth,
      height: panel.offsetHeight,
    });
  };

  const { size, status } = useSelector((state) => state.blob);

  useEffect(() => {
    // function has to be defined inside of the useEffect or else it throws a warning
    function handleScroll() {
      const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;

      if (!isBottom && scrollTop + window.innerHeight + 50 >= scrollHeight) {
        setIsBottom(true);
        console.log('Setting Scroll Bottom! Current Blobsize: ' + size);
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBottom, size]);

  useEffect(() => {
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    if (isBottom) {
      console.log('Fetching more Data! Current Blobsize: ' + size);
      dispatch(FetchMoreData());
    }
  }, [isBottom, size, dispatch]);

  useEffect(() => {
    if (isBottom && status === 'idle') {
      console.log('Finished loading more DATA! - unsetting bottom - Current Blobsize: ' + size);
      setIsBottom(false);
    }
  }, [isBottom, status, size]);
  return (
    <div>
      <div id="spectrogram-panel" style={{ display: 'grid', position: 'relative' }}>
        <SpectrogramViewer timescale_width={timescale_width} text_width={text_width} upper_tick_height={upper_tick_height} spectrogram_width={spectrogram_width} />
        <AnnotationViewer timescale_width={timescale_width} text_width={text_width} upper_tick_height={upper_tick_height} spectrogram_width={spectrogram_width} />
        <RulerTop timescale_width={timescale_width} text_width={text_width} upper_tick_height={upper_tick_height} spectrogram_width={spectrogram_width} />
      </div>
    </div>
  );
};

export { SpectrogramPanel };
