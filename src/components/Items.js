// @flow

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { generateRandomCoordinates } from 'dojo-halloween/src/helpers/itemsHelper';

import {
  itemsCount,
  zoneRadius,
  markerSize,
  debugMode,
} from 'dojo-halloween/src/helpers/constants';

const Box = (item, i, onPress) => (
  <TouchableOpacity
    onPress={onPress}
    key={i}
    pointerEvents={'box-none'}
    style={{
      position: 'absolute',
      top: item.y,
      left: item.x,
      height: markerSize(item.type),
      width: markerSize(item.type),
      backgroundColor: 'rgb(205,130, 230)',
    }}
  />
);
const Danger = (item, i, onPress) => (
  <View
    key={i}
    pointerEvents={'box-none'}
    style={{
      position: 'absolute',
      top: item.y - zoneRadius(item.type),
      left: item.x - zoneRadius(item.type),
      height: 2 * zoneRadius(item.type) + markerSize(item.type),
      width: 2 * zoneRadius(item.type) + markerSize(item.type),
      backgroundColor: debugMode ? 'rgba(255,130, 130, 0.3)' : 'transparent',
    }}
  >
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: 'absolute',
        top: zoneRadius(item.type),
        left: zoneRadius(item.type),
        backgroundColor: debugMode ? 'blue' : 'transparent',
        height: markerSize(item.type),
        width: markerSize(item.type),
      }}
    />
  </View>
);
export default class Items extends React.Component<PropsType, *> {
  render() {
    return this.props.itemsList.map(
      (item, i) =>
        item.type === 'good'
          ? Box(item, i, this.props.goodPress)
          : Danger(item, i, this.props.badPress)
    );
  }
}

type PropsType = {
  goodPress: () => void,
  badPress: () => void,
  itemsList: Array<Point<number>>,
};
