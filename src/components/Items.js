// @flow

import React from 'react';
import { View, TouchableOpacity } from 'react-native';

const itemsCount = 20;

const threshold = 0.7;

const zoneRadius = 100;

const markerSize = 20;
export default class Items extends React.Component<PropsType, *> {
  generateItemType = (size: number): Array<string> => {
    return Array(size)
      .fill(0)
      .map(n => (Math.random() > threshold ? 'good' : 'bad'));
  };

  doPointsCollide = (pointA: Point<number>, pointB: Point<number>) => {
    const squareLength = markerSize + zoneRadius;
    return !(
      pointA.x + zoneRadius > pointB.x + squareLength ||
      pointA.y + zoneRadius > pointB.y + squareLength ||
      pointB.x + zoneRadius > pointA.x + squareLength ||
      pointB.y + zoneRadius > pointA.y + squareLength
    );
  };

  generateRandomCoordinates = (size: number, maxDimensionX: number, maxDimensionY: number) => {
    if (maxDimensionX < size || maxDimensionY < size) {
      console.warn('Cannot generate random coordinates', { size, maxDimensionX, maxDimensionY });
      return [];
    }
    let array = [];
    while (array.length < size) {
      const randomX = Math.floor(Math.random() * maxDimensionX);
      const randomY = Math.floor(Math.random() * maxDimensionY);
      const newPoint = { x: randomX, y: randomY };
      if (array.some((element: Point<number>) => this.doPointsCollide(element, newPoint))) continue;
      array.push(newPoint);
    }
    return array;
  };

  itemsProperties = {
    type: this.generateItemType(itemsCount),
    coordinates: this.generateRandomCoordinates(
      itemsCount,
      this.props.background.x,
      this.props.background.y
    ),
  };

  renderItems = (): Array<TouchableOpacity> => {
    return Array(itemsCount)
      .fill(0)
      .map((_, i) => (
        <View
          key={i}
          pointerEvents={'box-none'}
          style={{
            top: this.itemsProperties.coordinates[i].y,
            left: this.itemsProperties.coordinates[i].x,
            height: markerSize + 2 * zoneRadius,
            width: markerSize + 2 * zoneRadius,
            backgroundColor: 'rgba(255,130, 130, 0.3)',
          }}
        >
          <TouchableOpacity
            onPress={
              this.itemsProperties.type[i] === 'good' ? this.props.goodPress : this.props.badPress
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

type PropsType = {
  goodPress: () => void,
  badPress: () => void,
  background: {
    x: number,
    y: number,
  },
};
