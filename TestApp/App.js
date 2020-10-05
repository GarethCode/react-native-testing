import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
      <Image 
        source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}}
        style={styles.img} 
      />
      <Button title="test"/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    //justifyContent: 'center', 

  },
  text: {
    color: 'green',
    fontSize: 30
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
  }
});

export default App;