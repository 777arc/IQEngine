# Copyright (c) Microsoft Corporation.
# Licensed under the MIT License.

import logging

import azure.functions as func
from azuresigmf import mongo_tools
from azuresigmf.errors import ExpectedDocumentNotFoundError
from pydantic import BaseSettings

from pymongo import MongoClient
from pymongo.write_concern import WriteConcern

class Settings(BaseSettings):
    mongo_conn_str: str
    mongo_db_name: str
    collection_name: str
    sigmf_metadata_suffix: str =  "sigmf-meta"
    sigmf_data_suffix: str= "sigmf-data"

settings = Settings()

def getMongoCollection():
    logging.info(f"Initializing Mongo Collection")

    write_concern = WriteConcern(w=1)
    dbclient = MongoClient(settings.mongo_conn_str)
    mongo_collection = dbclient[settings.mongo_db_name][settings.collection_name].with_options(write_concern=write_concern)
    return mongo_collection

collection = getMongoCollection()


def main(myblob: func.InputStream):
    

    meta_suffix=settings.sigmf_metadata_suffix.lower()
    data_suffix=settings.sigmf_data_suffix.lower()

    logging.info(f"Python blob trigger function processed blob \n"
                 f"Name: {myblob.name}\n"
                 f"Blob Size: {myblob.length} bytes")

    blob_name = myblob.name.lower()
    if blob_name.endswith(meta_suffix):
        logging.info(f"Processing a SigMF metadata blob")

        blob_str = myblob.read()
        metadata_uri = myblob.uri
        mongo_tools.ingest_meta_from_blob(
            mongo_collection=collection, 
            blob_str=blob_str, 
            metadata_uri=metadata_uri, 
            meta_suffix=meta_suffix)

    elif blob_name.endswith(data_suffix):
        logging.info(f"Processing a SigMF data blob")
        data_uri = myblob.uri

        try:
            mongo_tools.set_data_uri(
                mongo_collection=collection, 
                data_uri=data_uri, 
                data_suffix=data_suffix)

        except ExpectedDocumentNotFoundError:
            mongo_tools.set_data_uri(
                mongo_collection=collection, 
                data_uri=data_uri, 
                data_suffix=data_suffix)