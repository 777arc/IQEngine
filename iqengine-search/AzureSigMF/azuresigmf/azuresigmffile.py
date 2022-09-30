# This file based heavily on https://github.com/gnuradio/SigMF/tree/sigmf-v1.x/sigmf/sigmffile.py
# It has been updated to interact with metadata files in a mongo database and data files in blob storage
'''AzureSigMFFile Object'''

from collections import OrderedDict
import codecs
import io
import json
import tarfile
import tempfile
from os import path
import warnings
import numpy as np

from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient

from . import __version__
from sigmf import schema, sigmf_hash, validate
from sigmf.sigmffile import SigMFFile, get_default_metadata, dtype_info
from sigmf.error import SigMFFileError, SigMFAccessError

class AzureSigMFFile(SigMFFile):

    def __init__(self, metadata=None, data_uri=None, global_info=None, skip_checksum=False,
                 skip_blob_sample_recount=False, blob_credential=None):
        '''
        API for SigMF I/O

        Parameters
        ----------
        metadata: str or dict, optional
            Metadata for associated dataset.
        data_uri: str, optional
            Path to associated dataset.
        global_info: dict, optional
            Set global field shortcut if creating new object.
        skip_checksum: bool, default False
            When True will skip calculating hash on data_uri (if present) to check against metadata.
        skip_blob_sample_recount: bool, default False
            When True will skip recalculating the sample count using calls to blob API, will compute samples based
            on the latest annotation instead.
        blob_credential: DefaultAzureCredential, optional
            Which blob credentials to use
        '''
        self.version = None
        self.schema = None
        self.data_uri = None
        self.sample_count = 0

        self._data_blob_client = None
        self._blob_credential = blob_credential

        if metadata is None:
            self._metadata = get_default_metadata(self.get_schema())  # TODO: What do I want to do about get_schema?
            if not self._metadata[self.GLOBAL_KEY][self.VERSION_KEY]:
                self._metadata[self.GLOBAL_KEY][self.VERSION_KEY] = __version__
        elif isinstance(metadata, dict):
            self._metadata = metadata
        else:
            self._metadata = json.loads(metadata)
        if global_info is not None:
            self.set_global_info(global_info)
        if data_uri is not None:
            self.set_data_uri(data_uri, skip_checksum=skip_checksum, skip_blob_sample_recount=skip_blob_sample_recount)

    def __len__(self):
        return self.shape[0]


    def set_data_uri(self, data_uri, skip_checksum=False, skip_blob_sample_recount=False):
        """
        Set the datafile URI, then recalculate sample count. If not skipped,
        update the hash and return the hash string.

        Parameters
        ----------
        data_uri: str, optional
            Path to associated dataset
        blob_service_client: BlobServiceClient, optional
            Authenticated client for the blob service account associated with the data_uri
        skip_checksum: bool, optional
            Toggle checksum calcs
        """
        if self.get_global_field(self.DATATYPE_KEY) is None:
            raise SigMFFileError("Error setting data file, the DATATYPE_KEY must be set in the global metadata first.")

        self.data_uri = data_uri

        self._data_blob_client = initialize_blob_client(credential=self._blob_credential, uri=data_uri)

        self._count_samples(skip_blob_sample_recount)

        dtype = dtype_info(self.get_global_field(self.DATATYPE_KEY))
        num_channels = self.get_num_channels()
        self.ndim = 1 if (num_channels < 2) else 2
        is_complex_data = dtype['is_complex']
        is_fixedpoint_data = dtype['is_fixedpoint']

        memmap_shape = (-1,)
        if num_channels > 1:
            memmap_shape = memmap_shape + (num_channels,)
        if is_complex_data and is_fixedpoint_data:
            # There is no corresponding numpy type, so we'll have to add another axis, length of 2
            memmap_shape = memmap_shape + (2,)
        self._return_type = dtype['memmap_convert_type']

        # TODO: Come back and implement memory mapped interface and update the line below accordingly
        self.shape = memmap_shape
        # #print('memmap()ing', self.get_global_field(self.DATATYPE_KEY), 'with', dtype['memmap_map_type'])
        # try:
        #     self._memmap = np.memmap(self.data_file, offset=0, dtype=dtype['memmap_map_type']).reshape(memmap_shape)
        # except:  # TODO include likely exceptions here
        #     warnings.warn('Failed to memory-map array from file')
        #     self._memmap = None
        #     self.shape = None
        # else:
        #     self.shape = self._memmap.shape if (self._return_type is None) else self._memmap.shape[:-1]

        if skip_checksum:
            return None
        return self.calculate_hash()


    # TODO: Implement when adding memory-mapped interface
    def __getitem__(self, sli):
        raise NotImplementedError


    def _is_conforming_dataset(self):
        """
        Returns `True` if the dataset is conforming to SigMF, `False` otherwise

        The dataset is non-conforming if the datafile contains non-sample bytes
        which means global trailing_bytes field is zero or not set, all captures
        `header_bytes` fields are zero or not set. Because we do not necessarily
        know the filename no means of verifying the meta/data filename roots
        match, but this will also check that a data file exists.
        """
        if self.get_global_field(self.TRAILING_BYTES_KEY, 0):
            return False
        for capture in self.get_captures():
            # check for any non-zero `header_bytes` fields in captures segments
            if capture.get(self.HEADER_BYTES_KEY, 0):
                return False
        if self._data_blob_client is None:
            return False
        else:
            if not self._data_blob_client.exists():
                return False

        # if we get here, the file exists and is conforming
        return True

    # TODO: allow schema retrieval from database
    def get_schema(self):
        """
        Return a schema object valid for the current metadata
        """
        current_metadata_version = self.get_global_info().get(self.VERSION_KEY)
        if self.version != current_metadata_version or self.schema is None:
            self.version = current_metadata_version
            self.schema = schema.get_schema(self.version)
        assert isinstance(self.schema, dict)
        return self.schema

    def get_data_blob_size(self):

        blob_properties = self._data_blob_client.get_blob_properties()
        return blob_properties.size

    def get_capture_byte_boundarys(self, index):
        """
        Returns a tuple of the file byte range in a dataset of a given SigMF
        capture of the form [start, stop). This function works on either
        compliant or noncompliant SigMF Recordings.
        """
        if index >= len(self.get_captures()):
            raise SigMFAccessError("Invalid captures index {} (only {} captures in Recording)".format(index, len(self.get_captures())))

        start_byte = 0
        prev_start_sample = 0
        for ii, capture in enumerate(self.get_captures()):
            start_byte += capture.get(self.HEADER_BYTES_KEY, 0)
            start_byte += (self.get_capture_start(ii) - prev_start_sample) * self.get_sample_size() * self.get_num_channels()
            prev_start_sample = self.get_capture_start(ii)
            if ii >= index:
                break

        end_byte = start_byte
        if index == len(self.get_captures())-1:  # last captures...data is the rest of the file
            end_byte = self.get_data_blob_size() - self.get_global_field(self.TRAILING_BYTES_KEY, 0)
        else:
            end_byte += (self.get_capture_start(index+1) - self.get_capture_start(index)) * self.get_sample_size() * self.get_num_channels()
        return (start_byte, end_byte)

    def _count_samples(self, skip_blob_sample_recount):
        """
        Count, set, and return the total number of samples at the data URI.
        If there is no data URI but there are annotations, use the end index
        of the final annotation instead. If there are no annotations, use 0.
        For complex data, a 'sample' includes both the real and imaginary part.
        """
        annotations = self.get_annotations()
        if self.data_uri is None or skip_blob_sample_recount:
            if len(annotations) > 0:
                sample_count = annotations[-1][self.START_INDEX_KEY] + annotations[-1][self.LENGTH_INDEX_KEY]
            else:
                sample_count = 0
        else:
            header_bytes = sum([c.get(self.HEADER_BYTES_KEY, 0) for c in self.get_captures()])
            file_size = self.get_data_blob_size() - self.get_global_field(self.TRAILING_BYTES_KEY, 0) - header_bytes  # bytes
            sample_size = self.get_sample_size() # size of a sample in bytes
            num_channels = self.get_num_channels()
            sample_count = file_size // sample_size // num_channels
            if file_size % (sample_size * num_channels) != 0:
                warnings.warn(f'File `{self.data_uri}` does not contain an integer '
                    'number of samples across channels. It may be invalid data.')
            if len(annotations) > 0 and annotations[-1][self.START_INDEX_KEY] + annotations[-1][self.LENGTH_INDEX_KEY] > sample_count:
                warnings.warn(f'File `{self.data_uri}` ends before the final annotation '
                    'in the corresponding SigMF metadata.')
        self.sample_count = sample_count
        return sample_count

    # TODO: figure out how to implement this efficiently
    def calculate_hash(self):
        raise NotImplementedError

    def read_samples(self, start_index=0, count=-1, autoscale=True, raw_components=False):
        '''
        Reads the specified number of samples starting at the specified index from the associated data file.

        Parameters
        ----------
        start_index : int, default 0
            Starting sample index from which to read.
        count : int, default -1
            Number of samples to read. -1 will read whole file.
        autoscale : bool, default True
            If dataset is in a fixed-point representation, scale samples from (min, max) to (-1.0, 1.0)
        raw_components : bool, default False
            If True read and return the sample components (individual I & Q for complex, samples for real)
            with no conversions or interleaved channels.

        Returns
        -------
        data : ndarray
            Samples are returned as an array of float or complex, with number of dimensions equal to NUM_CHANNELS_KEY.
        '''
        if count == 0:
            raise IOError('Number of samples must be greater than zero, or -1 for all samples.')
        elif start_index + count > self.sample_count:
            raise IOError("Cannot read beyond EOF.")
        if self.data_uri is None:
            if self.get_global_field(self.METADATA_ONLY_KEY, False):
                # only if data_file is `None` allows access to dynamically generated datsets
                raise SigMFFileError("Cannot read samples from a metadata only distribution.")
            else:
                raise SigMFFileError("No signal data file has bfeen associated with the metadata.")
        first_byte = start_index * self.get_sample_size() * self.get_num_channels()

        if not self._is_conforming_dataset():
            warnings.warn(f'Recording dataset appears non-compliant, resulting data may be erroneous')
        return self._read_datafile(first_byte, count * self.get_num_channels(), autoscale, False)


    def read_annotation_samples(self, annotation, autoscale=True, raw_components=False, baseband_spec=None):
        '''
        Reads the samples associated with the specified annotation from the associated data file.

        Parameters
        ----------
        annotation : dict
            dict that describes a sigmf annotation with at least the following keys: core:freq_lower_edge, core:freq_upper_edge, core:sample_count, and core:sample_start
        autoscale : bool, default True
            If dataset is in a fixed-point representation, scale samples from (min, max) to (-1.0, 1.0)
        raw_components : bool, default False
            If True read and return the sample components (individual I & Q for complex, samples for real)
            with no conversions or interleaved channels.
        baseband_spec : TBD
            If not None, filter, frequency shift, and decimate the result according to the baseband operation specification

        Returns
        -------
        data : ndarray
            Samples are returned as an array of float or complex, with number of dimensions equal to NUM_CHANNELS_KEY.
        '''

        count = annotation['core:sample_count']
        start_index = annotation['core:sample_start']

        if count == 0:
            raise IOError('Number of samples must be greater than zero, or -1 for all samples.')
        elif start_index + count > self.sample_count:
            raise IOError("Cannot read beyond EOF.")
        if self.data_uri is None:
            if self.get_global_field(self.METADATA_ONLY_KEY, False):
                # only if data_file is `None` allows access to dynamically generated datsets
                raise SigMFFileError("Cannot read samples from a metadata only distribution.")
            else:
                raise SigMFFileError("No signal data file has bfeen associated with the metadata.")
        first_byte = start_index * self.get_sample_size() * self.get_num_channels()

        if not self._is_conforming_dataset():
            warnings.warn(f'Recording dataset appears non-compliant, resulting data may be erroneous')
        return self._read_datafile(first_byte, count * self.get_num_channels(), autoscale, False)


    def _read_datafile(self, first_byte, nitems, autoscale, raw_components):
        '''
        internal function for reading samples from datafile
        '''
        dtype = dtype_info(self.get_global_field(self.DATATYPE_KEY))
        is_complex_data = dtype['is_complex']
        is_fixedpoint_data = dtype['is_fixedpoint']
        is_unsigned_data = dtype['is_unsigned']
        data_type_in = dtype['sample_dtype']
        sample_size = dtype['sample_size']
        component_type_in = dtype['component_dtype']
        component_size = dtype['component_size']

        data_type_out = np.dtype("f4") if not is_complex_data else np.dtype("f4, f4")
        num_channels = self.get_num_channels()

        blob_downloader = self._data_blob_client.download_blob(offset=first_byte, length=sample_size*nitems)
        stream = io.BytesIO()
        blob_downloader.readinto(stream)

        data = np.frombuffer(buffer=stream.getbuffer(), dtype=data_type_in, count=nitems)
        if num_channels != 1:
            # return reshaped view for num_channels
            # first dimension will be double size if `is_complex_data`
            data = data.reshape(data.shape[0] // num_channels, num_channels)
        if not raw_components:
            data = data.astype(data_type_out)
            if autoscale and is_fixedpoint_data:
                data = data.view(np.dtype("f4"))
                if is_unsigned_data:
                    data -= 2**(component_size*8-1)
                data *= 2**-(component_size*8-1)
                data = data.view(data_type_out)
            if is_complex_data:
                data = data.view(np.complex64)
        else:
            data = data.view(component_type_in)

        return data


    # # TODO: Convert to 2 functions, one that writes data back to the database, one that writes to blob
    # def todb(self, file_path, pretty=True, toarchive=False):
    #     '''
    #     Write metadata file or full archive containing metadata & dataset.

    #     Parameters
    #     ----------
    #     file_path : string
    #         Location to save.
    #     pretty : bool, default True
    #         When True will write more human-readable output, otherwise will be flat JSON.
    #     toarchive : bool, default False
    #         If True will write both dataset & metadata into SigMF archive format as a single `tar` file.
    #         If False will only write metadata to `sigmf-meta`.
    #     '''
    #     fns = get_sigmf_filenames(file_path)
    #     if toarchive:
    #         self.archive(fns['archive_fn'])
    #     else:
    #         with open(fns['meta_fn'], 'w') as fp:
    #             self.dump(fp, pretty=pretty)

    # def toblob(self, file_path, pretty=True, toarchive=False):
    #     '''
    #     Write metadata file or full archive containing metadata & dataset.

    #     Parameters
    #     ----------
    #     file_path : string
    #         Location to save.
    #     pretty : bool, default True
    #         When True will write more human-readable output, otherwise will be flat JSON.
    #     toarchive : bool, default False
    #         If True will write both dataset & metadata into SigMF archive format as a single `tar` file.
    #         If False will only write metadata to `sigmf-meta`.
    #     '''
    #     fns = get_sigmf_filenames(file_path)
    #     if toarchive:
    #         self.archive(fns['archive_fn'])
    #     else:
    #         with open(fns['meta_fn'], 'w') as fp:
    #             self.dump(fp, pretty=pretty)


# def get_dataset_uri_from_metadata(meta_fn, metadata=None):
#     '''
#     Parse provided metadata and return the expected data filename. In the case of
#     a metadata only distribution, or if the file does not exist, this will return
#     'None'. The priority for conflicting:
#       1. The file named <METAFILE_BASENAME>.sigmf-meta if it exists
#       2. The file in the `core:dataset` field (Non-Compliant Dataset) if it exists
#       3. None (may be a metadata only distribution)
#     '''
#     compliant_data_fn = get_sigmf_filenames(meta_fn)['data_fn']
#     noncompliant_data_fn = metadata['global'].get("core:dataset", None)

#     if path.isfile(compliant_data_fn):
#         if noncompliant_data_fn:
#             warnings.warn(f'Compliant Dataset `{compliant_data_fn}` exists but '
#                     f'"core:dataset" is also defined; using `{compliant_data_fn}`')
#         return compliant_data_fn

#     elif noncompliant_data_fn:
#         if path.isfile(noncompliant_data_fn):
#             if metadata['global'].get("core:metadata_only", False):
#                 warnings.warn('Schema defines "core:dataset" but "core:meatadata_only" '
#                         f'also exists; using `{noncompliant_data_fn}`')
#             return noncompliant_data_fn
#         else:
#             warnings.warn(f'Non-Compliant Dataset `{noncompliant_data_fn}` is specified '
#                     'in "core:dataset" but does not exist!')

#     return None

def initialize_blob_client(credential, uri):

    return BlobClient.from_blob_url(blob_url=uri, credential=credential)


def fromblob(blob_credential, meta_uri, data_uri=None, skip_checksum=False, skip_blob_sample_recount=False):

    blob_client = initialize_blob_client(credential=blob_credential, uri=meta_uri)
    blob_downloader = blob_client.download_blob()
    blob_bytes = blob_downloader.readall()

    return AzureSigMFFile(metadata=blob_bytes, data_uri=data_uri, skip_checksum=skip_checksum,
                 skip_blob_sample_recount=skip_blob_sample_recount, blob_credential=blob_credential)
