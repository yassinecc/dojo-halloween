import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import backgroundImage from './src/images/background.jpg';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={backgroundImage} style={styles.image} />>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    left: 0,
    top: 0,
    resizeMode: 'contain',
  },
});
