#!/usr/bin/python3
import json
import boto3
from time import sleep
from random import randint

with open('sample.json') as f:
    data = json.load(f)

kinesisClient = boto3.client('kinesis', 'us-east-1')
STREAM_NAME = 'test'
PARTITION_KEY = 'string'
DATA_LEN = len(data) - 1
while True:
    coordinates = data[randint(1, DATA_LEN)]
    print(coordinates)
    response = kinesisClient.put_record(StreamName=STREAM_NAME, Data=json.dumps(coordinates), PartitionKey=PARTITION_KEY)
    print(response)
    sleep(0.1)
