import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false, 
      contentStyle: { backgroundColor: Colors.background }
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="kyc" />
      <Stack.Screen name="subscription" />
    </Stack>
  );
}
