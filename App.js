import React from 'react';
import { StyleSheet, Image, View, PanResponder, Dimensions, TouchableOpacity } from 'react-native';
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

  getFinalDisplacement = (diff, dimension) => {
    return diff > 0
      ? Math.min(diff, -this.state.start[dimension] - this.state.initial[dimension])
      : Math.max(
          diff,
          screen[dimension] -
            background[dimension] -
            this.state.start[dimension] -
            this.state.initial[dimension]
        );
  };

  getMinimapMargin = dimension =>
    (-this.state.start[dimension] - this.state.initial[dimension] - this.state.delta[dimension]) *
      mapFactor -
    mapBorderWidth;

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const finalDx = this.getFinalDisplacement(gestureState.dx, 'x');
      const finalDy = this.getFinalDisplacement(gestureState.dy, 'y');
      this.setState({ delta: { x: finalDx, y: finalDy } });
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
    };
    const itemContainerStyle = {
      position: 'absolute',
      left: this.state.start.x + initial.x + delta.x,
      top: this.state.start.y + initial.y + delta.y,
      height: background.y,
      width: background.x,
      justifyContent: 'center',
      alignItems: 'center',
    };
    return (
      <View style={styles.container}>
        <Image
          onLayout={this.onImageLayout}
          source={backgroundImage}
          style={imageStyle}
          {...this.panResponder.panHandlers}
        />
        <MinimapContainerView pointerEvents={'box-none'}>
          <MinimapView
            pointerEvents={'box-none'}
            left={this.getMinimapMargin('x')}
            top={this.getMinimapMargin('y')}
          />
        </MinimapContainerView>
        <View style={itemContainerStyle} pointerEvents={'box-none'}>
          <TouchableOpacity style={{ backgroundColor: 'blue', height: 50, width: 50 }} />
        </View>
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
