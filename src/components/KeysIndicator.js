// @flow

import React from 'react';
import { View, Image } from 'react-native';
import { key } from 'dojo-halloween/assets';

const imageStyle = { width: 60, height: 40 };

type PropsType = {
  keysNumber: number,
};

export class KeysIndicator extends React.PureComponent<PropsType> {
  keysIndicator = () => {
    const array = [];
    for (var i = 0; i < this.props.keysNumber; i++) {
      array.push(<Image key={i} style={imageStyle} source={key} />);
    }
    return array;
  };

  render() {
    console.log(this.props);
    return (
      <View style={{ flexDirection: 'row', position: 'absolute', top: 20, right: 0 }}>
        {this.keysIndicator()}
      </View>
    );
  }
}
