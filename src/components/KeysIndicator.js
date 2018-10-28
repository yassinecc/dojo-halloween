import React from 'react';
import { View, Image } from 'react-native';
import { key, noKey } from 'dojo-halloween/assets';
import { treasuresCount } from 'dojo-halloween/src/helpers/constants';

const imageStyle = { width: 60, height: 40 };

type PropsType = {
  keysNumber: number,
};

export class KeysIndicator extends React.PureComponent<PropsType> {
  keysIndicator = () => {
    const array = [];
    for (var i = 0; i < treasuresCount; i++) {
      array.push(
        <Image key={i} style={imageStyle} source={i < this.props.keysNumber ? key : noKey} />
      );
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
