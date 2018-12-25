import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
  Linking
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Marker from '../../marker.png';
import ParkingSpot from '../../parking.png';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  flex: {
    flexDirection: 'row'
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

class FindParking extends React.Component {
  state = {
    initialLat: 40.750942,
    initialLong: -73.980966,
    markedLocation: null,
    latDelta: 0.1,
    longDelta: 0.1
  };

  markPointer = (event) => {
    const coordinates = event.nativeEvent.coordinate;
    this.setState({
      markedLocation: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      }
    });
  };

  zoomIn = () => {
    this.setState(prevState => ({
      latDelta: (prevState.latDelta - 0.01),
      longDelta: (prevState.longDelta - 0.01)
    }));
  };

  zoomOut = () => {
    this.setState(prevState => ({
      latDelta: (prevState.latDelta + 0.01),
      longDelta: (prevState.longDelta + 0.01)
    }));
  };

  findParking = () => {
    const lat = this.state.markedLocation.latitude;
    const lon = this.state.markedLocation.longitude;
    const url = `https://2rpz3k1w60.execute-api.us-east-1.amazonaws.com/Development/grid?lat=${lat}&lon=${lon}`;
    fetch(url).then(resp => resp.json()).then(response => {
      const result = response.map(point => {
        const pointJson = JSON.parse(point);
        return {
          latitude: parseFloat(pointJson.lat),
          longitude: parseFloat(pointJson.lon)
        }
      });
      console.log('hello ', result);
      this.setState({
        parkingSpots: result
      });
    }).catch(err => {
      console.log('erssdf', err);
    });
  };

  gotoSpot = (coordinates) => (event) => {
    const lat = coordinates.latitude;
    const lng = coordinates.longitude;
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q='
    });
    const latLng = `${lat},${lng}`;
    const label = 'Custom Label';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    Linking.openURL(url);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.flex}>
          <TouchableOpacity
            onPress={this.findParking}
            style={styles.button}
          >
            <Text style={styles.text}>
              Find Parking at Destination
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.zoomIn}
            style={styles.button}
          >
            <Text style={styles.text}>
              zoom in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.zoomOut}
            style={styles.button}
          >
            <Text style={styles.text}>
              zoom out
            </Text>
          </TouchableOpacity>
        </View>
        <MapView
          showsUserLocation
          provider={PROVIDER_GOOGLE}
          onLongPress={this.markPointer}
          style={styles.map}
          region={{
            latitude: this.state.initialLat,
            longitude: this.state.initialLong,
            latitudeDelta: this.state.latDelta,
            longitudeDelta: this.state.longDelta
          }}
        >
          {
            this.state.markedLocation && <MapView.Marker
              coordinate={this.state.markedLocation}
              image={Marker}
            />
          }
          {
            this.state.parkingSpots &&
            this.state.parkingSpots.map((point, index) => (
              <MapView.Marker
                key={index}
                coordinate={point}
                image={ParkingSpot}
                onPress={this.gotoSpot(point)}
              />
            ))
          }
        </MapView>
      </View>
    );
  }
}

export default FindParking;
