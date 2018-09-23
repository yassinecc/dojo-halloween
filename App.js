import React from 'react';
import { StyleSheet, Image, View, PanResponder, Dimensions } from 'react-native';
import styled from 'styled-components';
import backgroundImage from './src/images/background.jpg';

const mapFactor = 1 / 25;

const mapBorderWidth = 2;

const { width: backgroundWidth, height: backgroundHeight } = Image.resolveAssetSource(
  backgroundImage
);

const background = { x: backgroundWidth, y: backgroundHeight };

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const screen = { x: screenWidth, y: screenHeight };

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
    start: {
      x: null,
      y: null,
    },
  };

  onImageLayout = event => {
    const { x, y } = event.nativeEvent.layout;

    if (!this.state.start.x || !this.state.start.y) this.setState({ start: { x, y } });
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
        <Image
          onLayout={this.onImageLayout}
          source={backgroundImage}
          style={imageStyle}
          {...this.panResponder.panHandlers}
        />
        <MinimapContainerView>
          <MinimapView
            left={
              (-this.state.start.x - this.state.initial.x - this.state.delta.x) * mapFactor -
              mapBorderWidth
            }
            top={
              (-this.state.start.y - this.state.initial.y - this.state.delta.y) * mapFactor -
              mapBorderWidth
            }
          />
        </MinimapContainerView>
      </View>
    );
  }
}

const MinimapContainerView = styled.View`
  height: ${background.y * mapFactor};
  width: ${background.x * mapFactor};
  position: absolute;
  right: 0;
  bottom: 0;
  border-color: red;
  border-width: ${mapBorderWidth};
  background-color: rgba(255, 0, 0, 0.3);
`;

const MinimapView = styled.View`
  height: ${screen.y * mapFactor};
  width: ${screen.x * mapFactor};
  position: absolute;
  border-color: red;
  border-width: ${mapBorderWidth};
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
