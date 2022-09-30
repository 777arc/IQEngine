from pymongo.collection import Collection
from pymongo.errors import DuplicateKeyError

from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient

from .errors import OptimisticConcurrencyError, ExpectedDocumentNotFoundError
from .mongo_tools import ingest_meta_from_blob, set_data_uri

def ingest_meta_from_container(mongo_collection: Collection,  blob_service_client: BlobServiceClient, container_name: str, sigmf_meta_suffix: str, sigmf_data_suffix: str):
    meta_suffix=sigmf_meta_suffix.lower()
    data_suffix=sigmf_data_suffix.lower()
    
    
    container_client = blob_service_client.get_container_client(container=container_name)
    
    blob_meta_found = 0
    blob_data_found = 0
    
    for blob in container_client.list_blobs():
        blob_name = blob.name.lower()
        if blob_name.endswith(meta_suffix):
            blob_meta_found = blob_meta_found + 1
            blob_client = container_client.get_blob_client(blob)
            blob_stream = blob_client.download_blob()
            blob_str = blob_stream.readall()
            metadata_uri = blob_client.primary_endpoint
            
            ingest_meta_from_blob(mongo_collection, blob_str, metadata_uri, meta_suffix)

        elif blob_name.endswith(data_suffix):
            blob_data_found = blob_data_found + 1
            blob_client = container_client.get_blob_client(blob)
            data_uri = blob_client.primary_endpoint

            try:
                set_data_uri(mongo_collection, data_uri, data_suffix)
            except ExpectedDocumentNotFoundError:
                set_data_uri(mongo_collection, data_uri, data_suffix)
        
        
    print(f"found {blob_meta_found} metadata files and {blob_data_found} data files")