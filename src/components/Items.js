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
      height: markerSize,
      width: markerSize,
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
      top: item.y,
      left: item.x,
      height: 6 * markerSize + 2 * 1.5 * zoneRadius,
      width: 6 * markerSize + 2 * 1.5 * zoneRadius,
      backgroundColor: debugMode ? 'rgba(255,130, 130, 0.3)' : 'transparent',
    }}
  >
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: 'absolute',
        top: zoneRadius,
        left: zoneRadius,
        backgroundColor: debugMode ? 'blue' : 'transparent',
        height: markerSize * 6,
        width: markerSize * 6,
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
