// @flow

import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  PanResponder,
  Dimensions,
  Modal,
  Alert,
  Vibration,
  Text,
} from 'react-native';
import uniq from 'lodash/uniq';
import { Gyroscope } from 'expo';
import styled from 'styled-components';
import {
  backgroundImage,
  slenderMan,
  characterUp,
  characterDown,
  characterLeft,
  characterRight,
} from 'dojo-halloween/assets/';
import { LifeStatus, Items, Sound } from 'dojo-halloween/src/components';
import {
  itemsCount,
  treasuresCount,
  mapFactor,
  mapBorderWidth,
  debugMode,
} from 'dojo-halloween/src/helpers/constants';
import {
  generateRandomCoordinates,
  doPointsCollide,
  getSquareDistance,
} from 'dojo-halloween/src/helpers/itemsHelper';

const backgroundDimensions: { width: number, height: number } = Image.resolveAssetSource(
  backgroundImage
);

const background = { x: backgroundDimensions.width, y: backgroundDimensions.height };

const screenDimensions: { width: number, height: number } = Dimensions.get('screen');

const screen = { x: screenDimensions.width, y: screenDimensions.height };

const characterDirections: {| up: Image, down: Image, left: Image, right: Image |} = {
  up: characterUp,
  down: characterDown,
  left: characterLeft,
  right: characterRight,
};

const itemsList = generateRandomCoordinates(background.x, background.y);

export default class App extends React.Component<*, StateType> {
  state: StateType = {
    gyroscopeData: { x: 0, y: 0, z: 0 },
    characterDirection: 'down',
    showSlenderManModal: false,
    keysNumber: 0,
    openedItemsKeys: [],
    isFinalChestVisible: false,
    isInDanger: false,
    collidingElement: null,
    showTreasureIndication: false,
    initial: {
      x: 0,
      y: 0,
    },
    delta: {
      x: 0,
      y: 0,
    },
    start: {
      x: 0,
      y: 0,
    },
  };

  subscription: EmitterSubscription<*>;

  componentDidMount() {
    Sound.init();
    this.subscription = Gyroscope.addListener((result: { x: number, y: number, z: number }) => {
      this.setState({ gyroscopeData: result });
    });
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove();
  }

  componentDidUpdate(_: any, prevState: StateType) {
    const charItem = {
      key: String(itemsCount),
      x: background.x / 2 - this.state.initial.x - this.state.delta.x - 30,
      y: background.y / 2 - this.state.initial.y - this.state.delta.y - 30,
      type: 'character',
    };
    const collidingElement = itemsList.find(
      (element: Point<number>) => element.type === 'bad' && doPointsCollide(element, charItem)
    );
    const collidingTreasure = itemsList.find(
      (element: Point<number>) =>
        ['good', 'treasure'].includes(element.type) && doPointsCollide(element, charItem)
    );
    if (
      !prevState.showTreasureIndication &&
      collidingTreasure &&
      (collidingTreasure.type === 'good' || this.state.keysNumber === treasuresCount) &&
      !this.state.openedItemsKeys.includes(collidingTreasure.key)
    ) {
      this.setState({ showTreasureIndication: true });
    }
    if (prevState.keysNumber !== this.state.keysNumber) {
      this.setState({ showTreasureIndication: false });
    }
    // Set inDanger flag when entering danger zone
    if (!prevState.collidingElement && collidingElement) {
      Vibration.vibrate(500);
      this.setState({ collidingElement, isInDanger: true });
    }
    // Reset when exiting danger zone
    if (prevState.collidingElement && !collidingElement) {
      this.setState({ collidingElement: null });
    }
    if (
      !this.state.showSlenderManModal &&
      this.state.isInDanger &&
      collidingElement &&
      getSquareDistance(collidingElement, charItem) < 10000
    ) {
      Sound.playScream();
      this.setState({ showSlenderManModal: true });
    }
    // Auto hide slenderManModal
    if (!prevState.showSlenderManModal && this.state.showSlenderManModal) {
      setTimeout(() => this.setState({ showSlenderManModal: false, isInDanger: false }), 1500);
    }
    // Gyroscope transition
    if (
      collidingTreasure &&
      collidingTreasure.key &&
      prevState.gyroscopeData.y <= 7 &&
      this.state.gyroscopeData.y > 7
    ) {
      const openedItems: Array<number> = uniq([
        ...this.state.openedItemsKeys,
        collidingTreasure.key,
      ]);
      this.setState({
        keysNumber: this.state.keysNumber + 1,
        openedItemsKeys: openedItems,
        isFinalChestVisible: openedItems.length === treasuresCount,
      });
      Alert.alert('Félicitations', 'Coffre ouvert');
    }
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

  getMinimapMargin = (dimension: string) =>
    (-this.state.start[dimension] - this.state.initial[dimension] - this.state.delta[dimension]) *
      mapFactor -
    mapBorderWidth;

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState: { dx: number, dy: number }) => {
      const finalDx = this.getFinalDisplacement(gestureState.dx, 'x');
      const finalDy = this.getFinalDisplacement(gestureState.dy, 'y');
      let characterDirection = this.state.characterDirection;
      if (Math.abs(finalDx) > Math.abs(finalDy)) {
        characterDirection = finalDx < 0 ? 'right' : 'left';
      }

      if (Math.abs(finalDx) < Math.abs(finalDy)) {
        characterDirection = finalDy < 0 ? 'down' : 'up';
      }
      this.setState({ delta: { x: finalDx, y: finalDy }, characterDirection });
    },
    onPanResponderRelease: () => {
      const { initial, delta } = this.state;
      this.setState({
        initial: { x: initial.x + delta.x, y: initial.y + delta.y },
        delta: { x: 0, y: 0 },
      });
    },
  });

  minimapItemColor = (type: string) => {
    switch (type) {
      case 'good':
        return 'red';
      case 'treasure':
        return debugMode ? 'gold' : 'transparent';
      case 'bad':
        return debugMode ? 'blue' : 'transparent';
      default:
        return 'transparent';
    }
  };

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
            isFinalChestVisible={this.state.isFinalChestVisible}
            foundTreasures={this.state.openedItemsKeys}
            itemsList={itemsList}
          />
        </View>
        <Image
          style={{ position: 'absolute' }}
          source={characterDirections[this.state.characterDirection]}
        />
        <MinimapContainerView pointerEvents={'box-none'}>
          {itemsList.map(
            item =>
              (item.type !== 'treasure' || this.state.isFinalChestVisible) && (
                <View
                  key={item.key}
                  style={{
                    position: 'absolute',
                    top: item.y * mapFactor,
                    left: item.x * mapFactor,
                    height: 2,
                    width: 2,
                    backgroundColor: this.minimapItemColor(item.type),
                  }}
                />
              )
          )}
          <MinimapView
            pointerEvents={'box-none'}
            left={this.getMinimapMargin('x')}
            top={this.getMinimapMargin('y')}
          />
        </MinimapContainerView>
        <LifeStatus />
        {this.state.showTreasureIndication && (
          <View
            pointerEvents="box-none"
            style={{
              flex: 1,
              position: 'absolute',
              bottom: 16,
              backgroundColor: 'rgba(0,0,0,0.6)',
              alignSelf: 'center',
            }}
          >
            <Text style={{ padding: 32, flex: 1, color: 'white' }}>Ouvrez le coffre!</Text>
          </View>
        )}
        <Modal
          transparent
          animationType={'fade'}
          visible={this.state.showSlenderManModal}
          onRequestClose={() => {}}
        >
          <View style={styles.fullScreenStyle}>
            <Image source={slenderMan} resizeMode={'contain'} />
          </View>
        </Modal>
      </View>
    );
  }
}

type StateType = {
  gyroscopeData: {
    x: number,
    y: number,
    z: number,
  },
  keysNumber: number,
  openedItemsKeys: Array<number>,
  characterDirection: 'up' | 'down' | 'left' | 'right',
  showSlenderManModal: boolean,
  showTreasureIndication: boolean,
  isFinalChestVisible: boolean,
  isInDanger: boolean,
  collidingElement: ?Point<number>,
  initial: {
    x: number,
    y: number,
  },
  delta: {
    x: number,
    y: number,
  },
  start: {
    x: number,
    y: number,
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

const styles: { [key: string]: Object } = StyleSheet.create({
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
