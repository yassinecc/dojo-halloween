// @flow

import React from 'react';
import { View, TouchableOpacity } from 'react-native';

const itemsCount = 100;

const threshold = 0.7;

const zoneRadius = 100;

const markerSize = 20;
export default class Items extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      itemsProperties: {
        type: this.generateItemType(itemsCount),
        x: this.generateRandomCoordinates(itemsCount, props.background.x, 200),
        y: this.generateRandomCoordinates(itemsCount, props.background.y, 200),
      },
    };
  }

  generateItemType = (size: number): Array<string> => {
    return Array(size)
      .fill(0)
      .map(n => (Math.random() > threshold ? 'good' : 'bad'));
  };

  generateRandomCoordinates = (size: number, maxDimension: number, scaleFactor: number) => {
    if (maxDimension < size) {
      console.warn('Cannot generate random coordinates', { size, maxDimension });
      return [];
    }
    let array = [];
    while (array.length < size) {
      const random = Math.floor(Math.random() * (maxDimension / scaleFactor));
      if (array.includes(random)) continue;
      array.push(random * scaleFactor);
    }
    return array;
  };

  renderItems = (): Array<TouchableOpacity> => {
    return Array(itemsCount)
      .fill(0)
      .map((_, i) => (
        <View
          key={i}
          pointerEvents={'box-none'}
          style={{
            top: this.state.itemsProperties.y[i],
            left: this.state.itemsProperties.x[i],
            height: markerSize + 2 * zoneRadius,
            width: markerSize + 2 * zoneRadius,
            backgroundColor: 'rgba(255,130, 130, 0.3)',
          }}
        >
          <TouchableOpacity
            onPress={
              this.state.itemsProperties.type[i] === 'good'
                ? this.props.goodPress
                : this.props.badPress
            }
            style={{
              position: 'absolute',
              top: zoneRadius,
              left: zoneRadius,
              backgroundColor: 'blue',
              height: markerSize,
              width: markerSize,
            }}
          />
        </View>
      ));
  };

  render() {
    return this.renderItems();
  }
}

type StateType = {
  itemsProperties: {
    type: Array<string>,
    x: Array<number>,
    y: Array<number>,
  },
};

type PropsType = {
  goodPress: () => void,
  badPress: () => void,
  background: {
    x: number,
    y: number,
  },
};
