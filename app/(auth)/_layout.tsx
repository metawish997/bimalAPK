import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/Colors';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: Colors.background }
    }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="otp-verification" />
    </Stack>
  );
}
