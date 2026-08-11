import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Subscription() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Subscription Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#A8FF3E', fontSize: 20 }
});
