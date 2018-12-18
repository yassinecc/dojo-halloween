import React from 'react';
import { View, Image } from 'react-native';
import { closedChest, openChest, closedFinalChest, openFinalChest } from 'dojo-halloween/assets';

import { itemsCount, zoneRadius, markerSize } from 'dojo-halloween/src/helpers/constants';

const Box = (item, isFound, isFinalChestVisible) => {
  const image =
    item.type === 'treasure'
      ? isFound
        ? openFinalChest
        : closedFinalChest
      : isFound
        ? openChest
        : closedChest;
  return (
    (item.type === 'good' || isFinalChestVisible) && (
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
        <Image height={markerSize(item.type)} width={markerSize(item.type)} source={image} />
      </View>
    )
  );
};
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
export class Items extends React.Component<*> {
  static defaultProps = {
    foundTreasures: [],
    isFinalChestVisible: false,
    style: {},
  };

  render() {
    return (
      <View style={this.props.style} pointerEvents="box-none">
        {this.props.itemsList.map(item => {
          if (item.type === 'bad') return Danger(item);
          console.log('coucou')
          const isFound = this.props.foundTreasures.includes(item.key);
          return Box(item, isFound, this.props.isFinalChestVisible);
        })}
      </View>
    );
  }
}
