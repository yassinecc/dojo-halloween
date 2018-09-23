// @flow

import React from 'react';
import { StyleSheet, Image, View, PanResponder, Dimensions, Modal, Alert } from 'react-native';
import styled from 'styled-components';
import { backgroundImage, slenderMan } from 'dojo-halloween/assets/';
import { LifeStatus, Items, Sound } from 'dojo-halloween/src/components';

const mapFactor = 1 / 25;

const mapBorderWidth = 2;

const { width: backgroundWidth, height: backgroundHeight } = Image.resolveAssetSource(
  backgroundImage
);

const background = { x: backgroundWidth, y: backgroundHeight };

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const screen = { x: screenWidth, y: screenHeight };

export default class App extends React.Component<*, StateType> {
  constructor() {
    super();
    this.state = {
      showSlenderManModal: false,
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
  }

  componentDidMount() {
    Sound.init();
  }

  componentDidUpdate(_: any, prevState: StateType) {
    if (!prevState.showSlenderManModal && this.state.showSlenderManModal) {
      setTimeout(() => this.setState({ showSlenderManModal: false }), 1500);
    }
  }

  toggleSlenderManModal = (showModal: boolean) => {
    Sound.playScream();
    this.setState({ showSlenderManModal: showModal });
  };

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
          <Items
            goodPress={() => Alert.alert('Coucou')}
            badPress={() => this.toggleSlenderManModal(true)}
            background={background}
          />
        </View>
        <MinimapContainerView pointerEvents={'box-none'}>
          <MinimapView
            pointerEvents={'box-none'}
            left={this.getMinimapMargin('x')}
            top={this.getMinimapMargin('y')}
          />
        </MinimapContainerView>
        <LifeStatus />
        <Modal transparent animationType={'fade'} visible={this.state.showSlenderManModal}>
          <View style={styles.fullScreenStyle}>
            <Image source={slenderMan} resizeMode={'contain'} />
          </View>
        </Modal>
      </View>
    );
  }
}

type StateType = {
  showSlenderManModal: boolean,
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
  fullScreenStyle: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(93,93,93,0.5)',
  },
});
