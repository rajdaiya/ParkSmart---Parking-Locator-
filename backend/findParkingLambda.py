import json
import boto3

def getGridNumber(coordinates):
    minLat = 40.68517
    maxLat = 40.868072
    maxLong = -73.919899
    minLong = -74.02526
    longConst = (maxLong - minLong)/25
    latConst = (maxLat - minLat)/100
    lat = float(coordinates['lat'])
    long = float(coordinates['lon'])
    colNum = (long - minLong)// longConst
    rowNum = (lat - minLat) // latConst
    gridNum = int(rowNum*12 + colNum)
    return gridNum

def getBatchKeyList(gridNumber):
    gridList = [gridNumber-11, gridNumber-12, gridNumber-13, gridNumber-1, gridNumber+1, gridNumber+11, gridNumber+12, gridNumber+13]
    print(gridList)
    result = [{'grid':{'N':str(i)}} for i in gridList]
    print(123, result)
    return result


def lambda_handler(event, context):
    coordinates = event['queryStringParameters']
    gridNumber = getGridNumber(coordinates)
    dynamoClient = boto3.client('dynamodb')
    response = dynamoClient.batch_get_item(
        RequestItems={
            'park-smart': {
                'Keys':getBatchKeyList(gridNumber),
                'ProjectionExpression': 'grid, parkings, coordinates'
            }
        }
    )
    result = []
    if 'Responses' in response and 'park-smart' in response['Responses']:
        responses = response['Responses']['park-smart']
        result = [i['coordinates']['SS'] for i in responses]
        result = list(set([item for sublist in result for item in sublist]))
    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }
