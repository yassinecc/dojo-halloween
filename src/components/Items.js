// @flow

import React from 'react';
import { View, Image } from 'react-native';
import { generateRandomCoordinates } from 'dojo-halloween/src/helpers/itemsHelper';
import { closedChest, openChest } from 'dojo-halloween/assets';

import { itemsCount, zoneRadius, markerSize } from 'dojo-halloween/src/helpers/constants';

const Box = (item, isFound) => (
  <View
    key={item.key}
    pointerEvents={'box-none'}
    style={{
      position: 'absolute',
      top: item.y,
      left: item.x,
      height: markerSize(item.type),
      width: markerSize(item.type),
    }}
  >
    <Image
      height={markerSize(item.type)}
      width={markerSize(item.type)}
      source={isFound ? openChest : closedChest}
    />
  </View>
);
const Danger = item => (
  <View
    key={item.key}
    pointerEvents={'box-none'}
    style={{
      position: 'absolute',
      top: item.y - zoneRadius(item.type),
      left: item.x - zoneRadius(item.type),
      height: 2 * zoneRadius(item.type) + markerSize(item.type),
      width: 2 * zoneRadius(item.type) + markerSize(item.type),
    }}
  >
    <View
      style={{
        position: 'absolute',
        top: zoneRadius(item.type),
        left: zoneRadius(item.type),
        height: markerSize(item.type),
        width: markerSize(item.type),
      }}
    />
  </View>
);
export default class Items extends React.Component<PropsType, *> {
  render() {
    return this.props.itemsList.map(item => {
      if (item.type === 'bad') return Danger(item);
      const isFound = this.props.foundTreasures.includes(item.key);
      return Box(item, isFound);
    });
  }
}

type PropsType = {
  foundTreasures: Array<number>,
  itemsList: Array<Point<number>>,
};
