import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Journal() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Journal Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#A8FF3E', fontSize: 20 }
});
