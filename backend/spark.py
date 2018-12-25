import json
import time
from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kinesis import KinesisUtils, InitialPositionInStream
import boto3

TABLE_NAME = 'park-smart'
DYNAMO_CLIENT = 'dynamodb'

def getDynamoObject(grid, time):
    key = {
        'grid':{
            'N':str(grid[0])
        }
    }
    attributes = {
        'parkings':{
            'Value':{
                'N':str(grid[1][0])
            }
        },
        'coordinates':{
            'Value':{
                'SS':list(set(grid[1][1]))
            }
        },
        'TTL':{
            'Value':{
                'N':str(time)
            }
        }
    }
    return key, attributes

def gridMap(coordinates):
    minLat = 40.68517
    maxLat = 40.868072
    maxLong = -73.919899
    minLong = -74.02526
    longConst = (maxLong - minLong)/25
    latConst = (maxLat - minLat)/100
    point = json.loads(coordinates)
    lat = float(point['lat'])
    long = float(point['lon'])
    colNum = (long - minLong)// longConst
    rowNum = (lat - minLat) // latConst
    gridNum = int(rowNum*12 + colNum)
    return gridNum, (1, [coordinates])

def reducerForGrids(x, y):
    if len(x)==2 and len(y)==2:
        return (x[0]+y[0], x[1] + y[1])

def computeGridVal(rdd):
    grids = rdd.map(gridMap).reduceByKey(reducerForGrids)
    grids = grids.collect()
    dbclient = boto3.client(DYNAMO_CLIENT)
    epochTime = int(time.time() + 300)
    for grid in grids:
        print(grid)
        key, attributes = getDynamoObject(grid, epochTime)
        response = dbclient.update_item(
            TableName=TABLE_NAME,
            Key=key,
            AttributeUpdates=attributes
        )

def main(appName, streamName, endpointUrl, regionName):
    sc = SparkContext(appName="BestApp")
    ssc = StreamingContext(sc, 10)
    data = KinesisUtils.createStream(ssc, appName, streamName, endpointUrl, regionName, InitialPositionInStream.LATEST, 10)
    result = data.window(60, 20).foreachRDD(computeGridVal)
    ssc.start()
    ssc.awaitTermination()

if __name__ == "__main__":
    appName = 'hello'
    streamName = 'test'
    endpointUrl = 'https://kinesis.us-east-1.amazonaws.com'
    regionName = 'us-east-1'
    main(appName, streamName, endpointUrl, regionName)
