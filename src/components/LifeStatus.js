// @flow

import React from 'react';
import { View, Image } from 'react-native';
import { full_heart } from 'dojo-halloween/assets';

export default class LifeStatus extends React.Component<*> {
  render() {
    return (
      <View style={{ flexDirection: 'row', position: 'absolute', top: 20, right: 0 }}>
        <Image style={{ marginHorizontal: 4 }} source={full_heart} />
        <Image style={{ marginHorizontal: 4 }} source={full_heart} />
        <Image style={{ marginHorizontal: 4 }} source={full_heart} />
      </View>
    );
  }
}
