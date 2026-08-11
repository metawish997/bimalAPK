import { Tabs } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedTabBarButton, TabIcon } from '../../src/components/navigation/AnimatedTabBarButton';
import { useAuthStore } from '../../src/store/useAuthStore';
import { ChatModal } from '../../src/components/chat/ChatModal';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const TAB_BAR_BASE_HEIGHT = Platform.OS === 'ios' ? 56 : 54;
const TAB_ITEM_WIDTH = 68;

export default function StudentLayout() {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const roleName = typeof user?.role === 'string' ? user.role : user?.role?.name;
  const isTrader = roleName?.toLowerCase() === 'trader';
  const shimmerAnim = useRef(new Animated.Value(0.4)).current;
  const fabShimmerAnim = useRef(new Animated.Value(0.85)).current;
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const scaleDash = useRef(new Animated.Value(1)).current;
  const scaleLearn = useRef(new Animated.Value(1)).current;
  const scaleLog = useRef(new Animated.Value(1)).current;
  const scaleNotif = useRef(new Animated.Value(1)).current;
  const scaleProfile = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(fabShimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fabShimmerAnim, {
          toValue: 0.85,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim, fabShimmerAnim]);

  const executeTabSpring = (scaleRef: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scaleRef, {
        toValue: 0.92,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(scaleRef, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const tabBarHeight = TAB_BAR_BASE_HEIGHT + insets.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Tabs
        screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 1,
          borderTopColor: '#141414',
          height: tabBarHeight,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0),
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        tabBarActiveTintColor: '#A8FF3E',
        tabBarInactiveTintColor: '#444444',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarButton: (props) => (
            <AnimatedTabBarButton
              {...props}
              scaleRef={scaleDash}
              onSpring={() => executeTabSpring(scaleDash)}
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              scaleRef={scaleDash}
              color={color}
              focused={focused}
              iconName="dashboard"
              label="DASH"
              shimmerAnim={shimmerAnim}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          ...(isTrader
            ? { href: null }
            : {
                tabBarButton: (props) => (
                  <AnimatedTabBarButton
                    {...props}
                    scaleRef={scaleLearn}
                    onSpring={() => executeTabSpring(scaleLearn)}
                  />
                ),
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon
                    scaleRef={scaleLearn}
                    color={color}
                    focused={focused}
                    iconName="graduation-cap"
                    label="LEARN"
                    shimmerAnim={shimmerAnim}
                  />
                ),
              }),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarButton: (props) => (
            <AnimatedTabBarButton
              {...props}
              scaleRef={scaleLog}
              onSpring={() => executeTabSpring(scaleLog)}
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              scaleRef={scaleLog}
              color={color}
              focused={focused}
              iconName="book"
              label="LOG"
              shimmerAnim={shimmerAnim}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarButton: (props) => (
            <AnimatedTabBarButton
              {...props}
              scaleRef={scaleNotif}
              onSpring={() => executeTabSpring(scaleNotif)}
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              scaleRef={scaleNotif}
              color={color}
              focused={focused}
              iconName="bell"
              label="ALERTS"
              shimmerAnim={shimmerAnim}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarButton: (props) => (
            <AnimatedTabBarButton
              {...props}
              scaleRef={scaleProfile}
              onSpring={() => executeTabSpring(scaleProfile)}
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              scaleRef={scaleProfile}
              color={color}
              focused={focused}
              iconName="user"
              label="CORE"
              shimmerAnim={shimmerAnim}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="ai-coach"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="meetings"
        options={{ href: null }}
      />
    </Tabs>
      
      {/* Floating Chat Button */}
      <AnimatedTouchable 
        style={[styles.fab, { opacity: fabShimmerAnim }]}
        activeOpacity={0.8}
        onPress={() => setIsChatOpen(true)}
      >
        <Feather name="message-square" size={20} color="#000" />
      </AnimatedTouchable>

      {/* Chat Modal */}
      <ChatModal 
        visible={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#A8FF3E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A8FF3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  }
});
