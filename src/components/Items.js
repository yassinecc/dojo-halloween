// @flow

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  generateItemType,
  generateRandomCoordinates,
} from 'dojo-halloween/src/helpers/itemsHelper';

import { itemsCount, zoneRadius, markerSize } from 'dojo-halloween/src/helpers/constants';
export default class Items extends React.Component<PropsType, *> {
  itemsProperties = {
    type: generateItemType(itemsCount),
    coordinates: generateRandomCoordinates(
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
