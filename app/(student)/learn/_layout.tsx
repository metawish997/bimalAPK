import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';

export default function LearnLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false, 
      contentStyle: { backgroundColor: Colors.background }
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="live-classes" />
      <Stack.Screen name="[courseId]/index" />
      <Stack.Screen name="[courseId]/video/[chapterId]" />
    </Stack>
  );
}
