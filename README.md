# Parking Locator Mobile Application - Cloud Computing 

How to run the react-native application?
1. Update the keys in aws-exports.js and Google Maps key in ios/ParkSmart/AppDelegate.m
2. Run the following commands
```
npm install

react-native run-ios
```
ParkSmart allows users to mark a free parking spot whenever they are about to leave a parking space or when they spot an empty parking space and share the geographical coordinates with other app users for them to access this location and use the empty parking space if they are nearby. The empty spot can be free or a metered parking. This parking spot is shared only for a certain time period after which it is assumed that the available space may have been filled by someone else. Availability of parking space is a typical problem in big cities and we want to solve this problem through this application.

The key highlighting features of ParkSmart are:

➢	User registration authentication through Amazon Cognito

➢	Kinesis-Spark Streaming-DynamoDB for back-end : real-time geolocation coordinates

➢	React-native iOS Application for Front-end

➢	Google Maps API Authorization using access key

➢	Crowd-sourcing mechanism

➢	Server-less architecture




Implementation:
ParkSmart has been implemented using Node.js and React Native. We will be using various cloud services like AWS Cognito, Amazon Kinesis, Amazon EMR, DynamoDB, API Gateway and Lambda Functions. 


Data Sources, API Usage & Technologies used:

❖	AWS Cognito

❖	Amazon Kinesis

❖	Amazon EMR - Spark

❖	Amazon DynamoDB

❖	Amazon API Gateway

❖	AWS Lambda function

❖	Google Maps API

❖	React-native 

❖	NodeJS


System Architecture:

![alt text](https://github.com/rajdaiya/ParkSmart-ParkingLocator/blob/master/client/image.png)

 

Workflow:

User Authentication: User has to authenticate to use the platform. The authentication will be done using AWS Cognito.

Data Collection: The locations of available parking spots will be crowdsourced, so the users who see an empty parking spot, they can report that to our app and can get some rewards. Initially, we are planning to get the dedicated people to report the parking locations and once, we get traction then the platform will become self sufficient. 

Data processing: Since we are dividing the New York City maps into 2500 grids (100 latitude x 25 longitude) depending upon the range in which a geolocation coordinate falls, we are using Spark Streaming into EMR by collecting (lat,long) pairs generated from Kinesis to process this grid mapping real-time. These results will be stored in DynamoDB which will be refreshed every 30 seconds considering data points since the past 5 minutes

Application Interface: Since the users might be driving while using our app, the interface has to be very easily understandable. We will be making a iOS application using react native which will be fetching data from DynamoDB and displaying it on our application interface.



Important key considerations for our iOS Application:

➢	Real-time updates considering data points from past 5 minutes refreshed every 30 seconds

➢	Our application is highly scalable due to Spark-Streaming & mapping into 2500 grids

➢	We are utilizing crowdsourcing mechanism for data processing










