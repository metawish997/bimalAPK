import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';

export default function JournalLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: Colors.background }
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-trade" />
      <Stack.Screen name="[tradeId]" />
      <Stack.Screen name="analytics" />
    </Stack>
  );
}
