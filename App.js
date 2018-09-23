// @flow

import React from 'react';
import { StyleSheet, Image, View, PanResponder, Dimensions, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { backgroundImage } from 'dojo-halloween/assets/';
import { LifeStatus } from 'dojo-halloween/src/components';

const mapFactor = 1 / 25;

const itemsCount = 50;

const markerSize = 30;

const mapBorderWidth = 2;

const { width: backgroundWidth, height: backgroundHeight } = Image.resolveAssetSource(
  backgroundImage
);

const background = { x: backgroundWidth, y: backgroundHeight };

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
Dimensions.get;

const screen = { x: screenWidth, y: screenHeight };

export default class App extends React.Component<*, StateType> {
  constructor() {
    super();
    this.state = {
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
      itemsCoordinates: {
        x: this.generateCoordinates(itemsCount, background.x),
        y: this.generateCoordinates(itemsCount, background.y),
      },
    };
  }

  onImageLayout = (event: ViewLayoutEvent) => {
    const { x, y } = event.nativeEvent.layout;
    if (!this.state.start.x || !this.state.start.y) this.setState({ start: { x, y } });
  };

  getFinalDisplacement = (diff: number, dimension: string) => {
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

  generateCoordinates = (size: number, maxDimension: number) => {
    if (maxDimension < size) {
      console.warn('Cannot generate random coordinates', { size, maxDimension });
      return [];
    }
    let array = [];
    while (array.length < size) {
      const random = Math.floor(Math.random() * maxDimension);
      if (array.includes(random)) continue;
      array.push(random);
    }
    return array;
  };

  renderItems = (): Array<TouchableOpacity> => {
    return Array(itemsCount)
      .fill(0)
      .map((_, i) => (
        <TouchableOpacity
          key={i}
          style={{
            position: 'absolute',
            top: this.state.itemsCoordinates.y[i],
            left: this.state.itemsCoordinates.x[i],
            backgroundColor: 'blue',
            height: markerSize,
            width: markerSize,
          }}
        />
      ));
  };

  getMinimapMargin = (dimension: string) =>
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
    };
    return (
      <View style={styles.container}>
        <Image
          onLayout={this.onImageLayout}
          source={backgroundImage}
          style={imageStyle}
          {...this.panResponder.panHandlers}
        />
        <View style={itemContainerStyle} pointerEvents={'box-none'}>
          {this.renderItems()}
        </View>
        <LifeStatus />
        <MinimapContainerView pointerEvents={'box-none'}>
          <MinimapView
            pointerEvents={'box-none'}
            left={this.getMinimapMargin('x')}
            top={this.getMinimapMargin('y')}
          />
        </MinimapContainerView>
      </View>
    );
  }
}

type StateType = {
  initial: {
    x: number,
    y: number,
  },
  delta: {
    x: number,
    y: number,
  },
  start: {
    x: ?number,
    y: ?number,
  },
  itemsCoordinates: {
    x: Array<number>,
    y: Array<number>,
  },
};

type ViewLayoutEvent = {
  nativeEvent: {
    layout: {
      x: number,
      y: number,
      width: number,
      height: number,
    },
  },
};

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
