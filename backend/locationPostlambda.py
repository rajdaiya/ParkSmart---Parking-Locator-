import json
import boto3

def lambda_handler(event, context):
    if 'lat' not in event or 'lon' not in event:
        return {
            'statusCode': 400
        }
    else:
        kinesisClient = boto3.client('kinesis')
        response = kinesisClient.put_record(
            StreamName='test',
            Data=json.dumps(event),
            PartitionKey='string'
        )
        return {
            'statusCode': 200
        }
