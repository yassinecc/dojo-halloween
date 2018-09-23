// @flow

import React from 'react';
import { View, TouchableOpacity } from 'react-native';

const itemsCount = 50;

const markerSize = 30;

export default class Items extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      itemsCoordinates: {
        x: this.generateCoordinates(itemsCount, props.background.x),
        y: this.generateCoordinates(itemsCount, props.background.y),
      },
    };
  }

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

  render() {
    return this.renderItems();
  }
}

type StateType = {
  itemsCoordinates: {
    x: Array<number>,
    y: Array<number>,
  },
};

type PropsType = {
  background: {
    x: number,
    y: number,
  },
};
