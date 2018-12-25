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
  text: {
    color: 'white'
  }
});

class HomePage extends React.Component {
  state = {
    points: null,
    latDelta: 0.1,
    longDelta: 0.1
  };

  convertGridToCoordinates = (gridNum) => {
    const minLat = 40.68517;
    const maxLat = 40.868072;
    const maxLong = -73.919899;
    const minLong = -74.02526;
    const longConst = (maxLong - minLong) / 25;
    const latConst = (maxLat - minLat) / 100;
    const rowNum = Math.floor(gridNum / 12);
    const colNum = gridNum % 12;
    const latitude = (rowNum * latConst) + minLat;
    const longitude = (colNum * longConst) + minLong;
    return {latitude, longitude};
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    return fetch('https://2rpz3k1w60.execute-api.us-east-1.amazonaws.com/Development/heatmap').then(result => result.json()).then(response => {
      let points = JSON.parse(response.body);
      let result = points.map(point => {
        return {
          ...this.convertGridToCoordinates(parseInt(point.grid)),
          weight: parseInt(point.count)
        };
      });
      this.setState({
        points: result
      });
    }).catch(err => {
      console.log(err);
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

  render() {
    let points = this.state.points;
    return (
      <View style={styles.container}>
        <View style={styles.flex}>
          <TouchableOpacity
            onPress={this.refresh}
            style={styles.button}
          >
            <Text style={styles.text}>
              Refresh
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
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          enableZoomControl={true}
          region={{
            latitude: 40.750942,
            longitude: -73.980966,
            latitudeDelta: this.state.latDelta,
            longitudeDelta: this.state.longDelta
          }}
        >
          {
            points &&
            <MapView.Heatmap
              points={points}
              opacity={1}
              radius={20}
              maxIntensity={100}
              gradientSmoothing={10}
              heatmapMode={"POINTS_WEIGHT"}
            />
          }
        </MapView>
      </View>
    );
  }
}

export default HomePage;
