// @flow

import React from 'react';
import { View, TouchableOpacity } from 'react-native';

const itemsCount = 50;

const markerSize = 30;

const threshold = 0.7;

export default class Items extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      itemsProperties: {
        type: this.generateItemType(itemsCount),
        x: this.generateCoordinates(itemsCount, props.background.x),
        y: this.generateCoordinates(itemsCount, props.background.y),
      },
    };
  }

  generateItemType = (size: number): Array<string> => {
    return Array(size)
      .fill(0)
      .map(n => (Math.random() > threshold ? 'good' : 'bad'));
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
          onPress={
            this.state.itemsProperties.type[i] === 'good'
              ? this.props.goodPress
              : this.props.badPress
          }
          style={{
            position: 'absolute',
            top: this.state.itemsProperties.y[i],
            left: this.state.itemsProperties.x[i],
            backgroundColor: 'blue',
            height: markerSize,
            width: markerSize,
          }}
        />
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
