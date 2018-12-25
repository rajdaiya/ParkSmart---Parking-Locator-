import React from 'react';
import {createDrawerNavigator, createAppContainer} from 'react-navigation';
import Amplify from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native';
import aws_exports from './aws-exports';
import HomePage from './src/Components/HomePage';
import SignOut from './src/Components/SignOut';
import MarkParkingSpot from './src/Components/MarkParkingSpot';
import FindParking from './src/Components/FindParking';

Amplify.configure(aws_exports);


const App = createDrawerNavigator({
  Home: {
    screen: HomePage
  },
  Mark: {
    screen: MarkParkingSpot
  },
  Find: {
    screen: FindParking
  },
  SignOut: {
    screen: SignOut
  }
}, {
  initialRouteName: 'Find'
});

const AppContainer = createAppContainer(App);

export default withAuthenticator(AppContainer);
