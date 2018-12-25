import json
import boto3

def lambda_handler(event, context):
    dynamoClient = boto3.client('dynamodb')
    response = dynamoClient.scan(
        TableName='park-smart',
        ProjectionExpression='grid, parkings'
    )
    result = []
    for item in response['Items']:
        result.append({
            'grid': item['grid']['N'],
            'count': item['parkings']['N']
        })
    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }
