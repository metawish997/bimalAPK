import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

type AnimatedTabBarButtonProps = BottomTabBarButtonProps & {
  scaleRef: Animated.Value;
  onSpring: () => void;
};

export function AnimatedTabBarButton({
  scaleRef,
  onSpring,
  style,
  onPress,
  ...rest
}: AnimatedTabBarButtonProps) {
  return (
    <Pressable
      {...rest}
      onPress={(event) => {
        onSpring();
        onPress?.(event);
      }}
      style={(state) => {
        const resolvedStyle = typeof style === 'function' ? style(state) : style;
        return [resolvedStyle, styles.tabBarPressable];
      }}
    />
  );
}

type TabIconProps = {
  scaleRef: Animated.Value;
  color: string;
  focused: boolean;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  shimmerAnim: Animated.Value;
};

export function TabIcon({
  scaleRef,
  color,
  focused,
  iconName,
  label,
  shimmerAnim,
}: TabIconProps) {
  return (
    <Animated.View style={[styles.iconWrapper, { transform: [{ scale: scaleRef }] }]}>
      <FontAwesome
        name={iconName}
        size={18}
        color={color}
        style={focused ? styles.activeIconGlow : undefined}
      />
      <Animated.Text
        style={[styles.tabMiniLabel, { color, opacity: focused ? shimmerAnim : 1 }]}
        numberOfLines={1}
      >
        {label}
      </Animated.Text>
      {focused ? (
        <Animated.View style={[styles.activeDotIndicator, { opacity: shimmerAnim }]} />
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBarPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingBottom: 4,
  },
  activeIconGlow: {
    textShadowColor: 'rgba(168, 255, 62, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  tabMiniLabel: {
    fontSize: 8,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  activeDotIndicator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#A8FF3E',
    marginTop: 3,
  },
});
