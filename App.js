import React from 'react';
import { StyleSheet, Image, View, PanResponder } from 'react-native';
import backgroundImage from './src/images/background.jpg';

export default class App extends React.Component {
  state = {
    initial: {
      x: 0,
      y: 0,
    },
    delta: {
      x: 0,
      y: 0,
    },
  };
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      this.setState({ delta: { x: gestureState.dx, y: gestureState.dy } });
    },
    onPanResponderRelease: () => {
      const { initial, delta } = this.state;
      this.setState({
        initial: { x: initial.x + delta.x, y: initial.y + delta.y },

        delta: { x: 0, y: 0 },
      });
    },
  });

  render() {
    const { initial, delta } = this.state;
    const imageStyle = {
      left: initial.x + delta.x,
      top: initial.y + delta.y,
      resizeMode: 'contain',
    };
    return (
      <View style={styles.container}>
        <Image source={backgroundImage} style={imageStyle} {...this.panResponder.panHandlers} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
