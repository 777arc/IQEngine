from .azuresigmffile import AzureSigMFFile
class SigMFDBCollection():

    def __init__(self, pymongo_collection, blob_credential):
        self._collection = pymongo_collection
        self._blob_credential = blob_credential
        self.skip_blob_sample_recount = True

    def aggregate(self, *args, **kwargs):
        results = self._collection.aggregate(*args, **kwargs)
        sigmf_results = []
        for result in results:
            # get all the metadata (except annotations) for any document that matched
            meta = self._collection.find_one({"_id": result['_id']}, {"annotations":0, "_id":0})
            meta['annotations'] = result['annotations']

            data_uri = meta['blob']['data_uri']

            del meta['blob']

            sigmf_results.append(AzureSigMFFile(metadata=meta,
                                                data_uri=data_uri,
                                                skip_checksum=True,
                                                skip_blob_sample_recount=self.skip_blob_sample_recount,
                                                blob_credential=self._blob_credential))
        return sigmf_results

    def find(self, *args, **kwargs):
        results = self._collection.find(*args, **kwargs)
        sigmf_results = []
        for result in results:

            sigmf_results.append(self._result_to_sigmf(result))
        return sigmf_results

    def find_one(self, *args, **kwargs):
        result = self._collection.find_one(*args, **kwargs)

        return self._result_to_sigmf(result)

    def _result_to_sigmf(self, result):

        data_uri = result['blob']['data_uri']

        del result['blob']
        del result['base_uri']
        del result['etag']
        del result['_id']

        signal = AzureSigMFFile(
            metadata=result,
            data_uri=data_uri,
            skip_checksum=True,
            skip_blob_sample_recount=self.skip_blob_sample_recount,
            blob_credential=self._blob_credential)

        return signal
