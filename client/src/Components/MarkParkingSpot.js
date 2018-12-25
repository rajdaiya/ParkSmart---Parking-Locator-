import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    marginVertical: 50,
    marginHorizontal: 5,
    ...StyleSheet.absoluteFillObject,
    zIndex: -1
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'blue',
    padding: 10,
    marginBottom: 20
  },
  disabledButton: {
    alignItems: 'center',
    backgroundColor: 'grey',
    padding: 10,
    marginBottom: 20
  },
  text: {
    color: 'white'
  }
});

class MarkParkingSpot extends React.Component {
  state = {
    currentLocation: null
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = position.coords;
        this.setState({
          currentLocation: {
            lat: coords.latitude,
            lon: coords.longitude
          }
        });
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  shareLocation = () => {
    fetch('https://2rpz3k1w60.execute-api.us-east-1.amazonaws.com/Development/locations',{
      method: 'post',
      body: JSON.stringify(this.state.currentLocation)
    }).then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.flex}>
          <TouchableOpacity
            onPress={this.state.currentLocation && this.shareLocation}
            style={this.state.currentLocation ? styles.button : styles.disabledButton}
          >
            <Text style={styles.text}>
              Share Parking Spot
            </Text>
          </TouchableOpacity>
        </View>
        <MapView
          showsUserLocation
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: 40.750942,
            longitude: -73.980966,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
          }}
        >
        </MapView>
      </View>
    );
  }
}

export default MarkParkingSpot;
