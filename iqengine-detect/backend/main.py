# Copyright (c) Microsoft Corporation.
# Licensed under the MIT License.

from subprocess import call
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

import matplotlib.pyplot as plt
import numpy as np
from fastapi.responses import FileResponse

from detection import *
import numpy as np
from matplotlib import pyplot as plt
from matplotlib.patches import Rectangle
import sigmf
from collections import deque
import time
import cv2 as cv
app = FastAPI()
 
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/signals")
def get_signals(fileName: str, timeWindow: int, powerThreshold: int, timeMargin: float, minBW:int):
    """
       Number of signals found
    """
    call_params = {'fname': fileName, 'time_window_size': timeWindow, 'power_threshold_db': powerThreshold, 'time_margin_seconds': timeMargin, 'min_bw': minBW}
    # call_params = {'fname':'synthetic_int16', 'time_window_size':10, 'power_threshold_db': 20, 'time_margin_seconds': 0.001, 'min_bw':10e3}

    return sig_detection(call_params)

def sig_detection(call_params):
    handle = sigmf.sigmffile.fromfile(call_params['fname'])
    sample_rate = handle.get_global_field(sigmf.SigMFFile.SAMPLE_RATE_KEY)
    cap = handle.get_captures()[0]
    center_freq = handle.get_captures()[0]['core:frequency']
    start_time = handle.get_captures()[0]["core:sample_start"]
    samps = handle.read_samples()

    noise_params = get_noise_floor(samps, sample_rate, n_floor_window_bins=call_params['time_window_size'])
    start = time.time()
    anots = highlight_energy(samples=samps, samp_rate=sample_rate, fft_size=1024, window_size=call_params['time_window_size'], noise_power=noise_params['min_pwr'],
                             pwr_thresh_db=call_params['power_threshold_db'], time_margin=call_params['time_margin_seconds'], center_freq=center_freq,
                             min_bw=call_params['min_bw'])
    end = time.time()
    print(f"that took {end - start} seconds")
    process_annotiations(handle, samps, anots, sample_rate, center_freq)
    
    return len(anots)