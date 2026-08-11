import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ProfileTheme } from './../profile/theme';

interface CircularProgressProps {
  percentage: number;
  radius?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  radius = 40,
  strokeWidth = 8,
  color = ProfileTheme.colors.primary,
  backgroundColor = ProfileTheme.colors.border,
  children,
}) => {
  const halfCircle = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <View style={{ width: halfCircle * 2, height: halfCircle * 2, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={halfCircle * 2} height={halfCircle * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <Circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          originX={halfCircle}
          originY={halfCircle}
          rotation="-90"
        />
      </Svg>
      <View style={StyleSheet.absoluteFillObject} className="justify-center items-center">
        {children}
      </View>
    </View>
  );
};
