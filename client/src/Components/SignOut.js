import React from 'react';
import {Text} from 'react-native';
import {Auth} from 'aws-amplify';

export default class SignOut extends React.Component {
  componentDidMount() {
    let self = this;

    Auth.signOut().then(() => {
      self.props.navigation.navigate('Home')
    });
  }

  render() {
    return <Text>Sign Out</Text>;
  }
}