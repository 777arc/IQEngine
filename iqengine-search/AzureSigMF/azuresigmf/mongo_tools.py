import copy
import hashlib
import json

from pymongo.collection import Collection
from pymongo.errors import DuplicateKeyError

from .errors import OptimisticConcurrencyError, ExpectedDocumentNotFoundError



def setup_collection(mongo_collection: Collection):
    '''Set up indexes on the mongo collection'''

    mongo_collection.create_index('base_uri', unique=True)
    

def ingest_meta_from_blob(mongo_collection: Collection, blob_str, metadata_uri, meta_suffix):
    

    sigmf_metadata = json.loads(blob_str)
    
    base_uri = metadata_uri[:-(len(meta_suffix)+1)]
    sigmf_metadata["base_uri"] = base_uri
    sigmf_metadata["blob"] = { 
        "metadata_uri": metadata_uri,
        "data_uri": None
        }

    sigmf_metadata["etag"] = compute_etag(sigmf_metadata)

    try:
        add_metadata_to_collection(mongo_collection, sigmf_metadata, base_uri)
        
    except ExpectedDocumentNotFoundError:
        # retry
        add_metadata_to_collection(mongo_collection, sigmf_metadata, base_uri)
        
        
    

    # filter_spec = {'blob.base_uri': base_uri}
    # result = mongo_collection.find_one(filter=filter_spec)

    # if result is not None: 


def add_metadata_to_collection(mongo_collection: Collection, sigmf_metadata: dict, base_uri: str, retry_count=10):
    """add sigmf metadata to the collection, respecting optimistic concurrencey"""

    try:
        mongo_collection.insert_one(sigmf_metadata)
    except DuplicateKeyError:
        # A doc already exists with that base_uri. Update our metadata with whatever the current version on the server has for it's 
        # data_uri, and make sure our writes don't conflict with other ongoing writes
        filter_spec = {'base_uri': base_uri}

        modified_count = 0
        retry_counter = 0

        while(modified_count!=1):
            if retry_counter >=retry_count:
                raise OptimisticConcurrencyError

            current_metadata = mongo_collection.find_one(filter_spec, projection={"_id": False})

            if current_metadata is not None:
                new_metadata = copy.deepcopy(sigmf_metadata)
                del new_metadata["etag"]
                # pymongo insert_one modifies sigmf_metadata in place, adding an ID when we try to insert the first time.
                # This trips up etag generation since ObjectId classes can't be serialized
                if "_id" in new_metadata:
                    del new_metadata["_id"]

                new_metadata["blob"]["data_uri"] = current_metadata["blob"]["data_uri"]
                new_metadata["etag"] = compute_etag(new_metadata)

                # check against URI and etag to make sure we won't conflict with another write using stale data
                filter_spec = {'base_uri': base_uri, 'etag': current_metadata['etag']}
                update_result = mongo_collection.replace_one(filter_spec, new_metadata, upsert=False)
                modified_count = update_result.modified_count

            else:
                raise ExpectedDocumentNotFoundError
            
            retry_counter = retry_counter + 1



def set_data_uri(mongo_collection: Collection, data_uri, data_suffix, retry_count=10):

    base_uri = data_uri[:-(len(data_suffix)+1)]

    sigmf_metadata = {
        "base_uri": base_uri,
        "blob": {
            "data_uri": None
        }
    }

    sigmf_metadata["etag"] = compute_etag(sigmf_metadata)

    try:
        mongo_collection.insert_one(sigmf_metadata)
    except DuplicateKeyError:
        # A doc already exists with that base_uri. Update our metadata with the data_uri, and make sure our writes 
        # don't conflict with other ongoing writes
        filter_spec = {'base_uri': base_uri}

        modified_count = 0
        retry_counter = 0

        while(modified_count!=1):
            if retry_counter >=retry_count:
                raise OptimisticConcurrencyError

            current_metadata = mongo_collection.find_one(filter_spec, projection={"_id": 0})

            if current_metadata is not None:
                new_metadata = copy.deepcopy(current_metadata)
                del new_metadata["etag"]
                # pymongo insert_one modifies sigmf_metadata in place, adding an ID when we try to insert the first time.
                # This trips up etag generation since ObjectId classes can't be serialized
                if "_id" in new_metadata:
                    del new_metadata["_id"]

                new_metadata["blob"]["data_uri"] = data_uri
                new_metadata["etag"] = compute_etag(new_metadata)

                # check against URI and etag to make sure we won't conflict with another write using stale data
                filter_spec = {'base_uri': base_uri, 'etag': current_metadata['etag']}
                update_result = mongo_collection.replace_one(filter_spec, new_metadata, upsert=False)
                modified_count = update_result.modified_count

            else:
                raise ExpectedDocumentNotFoundError
            
            retry_counter = retry_counter + 1


def compute_etag(doc: dict):
    return hashlib.md5(json.dumps(doc).encode()).hexdigest()