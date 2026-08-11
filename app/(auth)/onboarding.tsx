import { Feather, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { PrimaryButton } from '../../src/components/common/PrimaryButton';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  { id: '1', title: 'Learn From Experts', description: 'Master the markets with guidance from seasoned professionals.' },
  { id: '2', title: 'Track Every Trade', description: 'Keep a detailed journal of your trading performance.' },
  { id: '3', title: 'Improve With AI Coach', description: 'Get personalized insights and psychology reviews.' },
  { id: '4', title: "Join India's Largest Trading Community", description: 'Connect, share, and grow with thousands of elite traders.' },
];

// --- Sub-components for illustrations ---

const TrackTradeIllustration = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <Animated.View style={{ transform: [{ translateY }], alignItems: 'center', justifyContent: 'center' }}>
      <Svg width="180" height="180" viewBox="0 0 180 180">
        <Defs>
          <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#A8FF3E" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#A8FF3E" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        {/* Grid lines */}
        <Line x1="10" y1="30" x2="170" y2="30" stroke="#1D3D2F" strokeWidth="1" strokeDasharray="4 4" />
        <Line x1="10" y1="60" x2="170" y2="60" stroke="#1D3D2F" strokeWidth="1" strokeDasharray="4 4" />
        <Line x1="10" y1="90" x2="170" y2="90" stroke="#1D3D2F" strokeWidth="1" strokeDasharray="4 4" />
        <Line x1="10" y1="120" x2="170" y2="120" stroke="#1D3D2F" strokeWidth="1" strokeDasharray="4 4" />
        <Line x1="10" y1="150" x2="170" y2="150" stroke="#1D3D2F" strokeWidth="1" strokeDasharray="4 4" />

        <Line x1="30" y1="10" x2="30" y2="170" stroke="#1D3D2F" strokeWidth="1" strokeDasharray="4 4" />
        <Line x1="70" y1="10" x2="70" y2="170" stroke="#1D3D2F" strokeWidth="1" strokeDasharray="4 4" />
        <Line x1="110" y1="10" x2="110" y2="170" stroke="#1D3D2F" strokeWidth="1" strokeDasharray="4 4" />
        <Line x1="150" y1="10" x2="150" y2="170" stroke="#1D3D2F" strokeWidth="1" strokeDasharray="4 4" />

        {/* Candles: Wick and Body */}
        {/* Candle 1 (Green) - X=30 */}
        <Line x1="30" y1="120" x2="30" y2="70" stroke="#A8FF3E" strokeWidth="2" />
        <Rect x="22" y="80" width="16" height="30" fill="#A8FF3E" rx="2" />

        {/* Candle 2 (Red) - X=70 */}
        <Line x1="70" y1="140" x2="70" y2="80" stroke="#FF5252" strokeWidth="2" />
        <Rect x="62" y="95" width="16" height="35" fill="#FF5252" rx="2" />

        {/* Candle 3 (Green) - X=110 */}
        <Line x1="110" y1="90" x2="110" y2="40" stroke="#A8FF3E" strokeWidth="2" />
        <Rect x="102" y="50" width="16" height="30" fill="#A8FF3E" rx="2" />

        {/* Candle 4 (Green) - X=150 */}
        <Line x1="150" y1="70" x2="150" y2="20" stroke="#A8FF3E" strokeWidth="2" />
        <Rect x="142" y="30" width="16" height="30" fill="#A8FF3E" rx="2" />

        {/* Area under the path */}
        <Path d="M 30 95 L 70 112.5 L 110 65 L 150 45 L 150 170 L 30 170 Z" fill="url(#chartGrad)" />

        {/* Trendline */}
        <Path d="M 30 95 Q 50 120 70 112.5 T 110 65 T 150 45" fill="none" stroke="#A8FF3E" strokeWidth="3" />

        {/* Target Reticle */}
        <Circle cx="150" cy="45" r="8" fill="#A8FF3E" opacity="0.3" />
        <Circle cx="150" cy="45" r="4" fill="#A8FF3E" />
      </Svg>

      {/* Floating buy badge */}
      <View style={styles.buyBadge}>
        <Text style={styles.buyBadgeText}>BUY +24.5%</Text>
      </View>
    </Animated.View>
  );
};

const AICoachIllustration = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Rotation loop
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotateAnim, pulseAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.1],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.5],
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 250, height: 250 }}>
      {/* Outer Rotating Radar Dashed Circle */}
      <Animated.View style={{ transform: [{ rotate: spin }], position: 'absolute' }}>
        <Svg width="220" height="220" viewBox="0 0 220 220">
          <Circle cx="110" cy="110" r="95" stroke="#A8FF3E" strokeWidth="1.5" strokeDasharray="6 8" fill="none" opacity="0.4" />
          <Circle cx="110" cy="110" r="75" stroke="#1D3D2F" strokeWidth="1" strokeDasharray="3 4" fill="none" />
        </Svg>
      </Animated.View>

      {/* Pulsing Core Glow */}
      <Animated.View style={{ transform: [{ scale }], opacity, position: 'absolute' }}>
        <View style={styles.aiCoreGlow} />
      </Animated.View>

      {/* AI CPU Core */}
      <View style={styles.aiCoreContainer}>
        <Feather name="cpu" size={44} color="#A8FF3E" />
      </View>

      {/* Floating diagnostic badges */}
      <View style={[styles.aiBadge, { top: 35, right: 10 }]}>
        <Text style={styles.aiBadgeText}>AI PATIENCE: 92%</Text>
      </View>

      <View style={[styles.aiBadge, { bottom: 35, left: 10, borderColor: '#7DFF3A' }]}>
        <Text style={styles.aiBadgeText}>WIN RATE +12%</Text>
      </View>
    </View>
  );
};

const CommunityIllustration = () => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.4],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 0],
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 250, height: 250 }}>
      {/* Dynamic Pulsing Rings behind nodes */}
      <Animated.View style={{ transform: [{ scale }], opacity, position: 'absolute' }}>
        <Svg width="250" height="250" viewBox="0 0 250 250">
          <Circle cx="125" cy="125" r="60" stroke="#A8FF3E" strokeWidth="2" fill="none" />
          <Circle cx="60" cy="80" r="30" stroke="#A8FF3E" strokeWidth="1.5" fill="none" />
          <Circle cx="190" cy="70" r="30" stroke="#A8FF3E" strokeWidth="1.5" fill="none" />
          <Circle cx="80" cy="180" r="30" stroke="#A8FF3E" strokeWidth="1.5" fill="none" />
          <Circle cx="180" cy="170" r="30" stroke="#A8FF3E" strokeWidth="1.5" fill="none" />
        </Svg>
      </Animated.View>

      {/* Constellation Network Lines */}
      <View style={{ position: 'absolute' }}>
        <Svg width="250" height="250" viewBox="0 0 250 250">
          {/* Connections */}
          <Line x1="125" y1="125" x2="60" y2="80" stroke="#1D3D2F" strokeWidth="2" />
          <Line x1="125" y1="125" x2="190" y2="70" stroke="#1D3D2F" strokeWidth="2" />
          <Line x1="125" y1="125" x2="80" y2="180" stroke="#1D3D2F" strokeWidth="2" />
          <Line x1="125" y1="125" x2="180" y2="170" stroke="#1D3D2F" strokeWidth="2" />
          <Line x1="60" y1="80" x2="190" y2="70" stroke="#1D3D2F" strokeWidth="1" strokeDasharray="3 3" />
          <Line x1="80" y1="180" x2="180" y2="170" stroke="#1D3D2F" strokeWidth="1" strokeDasharray="3 3" />
        </Svg>
      </View>

      {/* Nodes (Avatars/Icons) */}
      {/* Center Node */}
      <View style={[styles.nodeCircle, { width: 60, height: 60, borderRadius: 30 }]}>
        <FontAwesome6 name="users-line" size={24} color="#A8FF3E" />
      </View>

      {/* Top Left Node */}
      <View style={[styles.nodeCircle, { position: 'absolute', top: 55, left: 35 }]}>
        <Feather name="trending-up" size={14} color="#FFFFFF" />
      </View>

      {/* Top Right Node */}
      <View style={[styles.nodeCircle, { position: 'absolute', top: 45, right: 35 }]}>
        <MaterialCommunityIcons name="currency-usd" size={16} color="#FFFFFF" />
      </View>

      {/* Bottom Left Node */}
      <View style={[styles.nodeCircle, { position: 'absolute', bottom: 45, left: 55 }]}>
        <Feather name="message-square" size={14} color="#FFFFFF" />
      </View>

      {/* Bottom Right Node */}
      <View style={[styles.nodeCircle, { position: 'absolute', bottom: 50, right: 45 }]}>
        <Feather name="globe" size={14} color="#FFFFFF" />
      </View>
    </View>
  );
};

// --- Main Screen Component ---

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push('/(auth)/login');
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/login');
  };

  const onScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const renderIllustration = (id: string) => {
    switch (id) {
      case '1':
        return (
          <Image
            source={require('../../assets/images/bimal.png')}
            style={styles.illustrationImage}
            resizeMode="cover"
          />
        );
      case '2':
        return <TrackTradeIllustration />;
      case '3':
        return <AICoachIllustration />;
      case '4':
        return (
          <Image
            source={require('../../assets/images/1-scaled-1.jpg')}
            style={styles.illustrationImage}
            resizeMode="cover"
          />
        );
      default:
        return null;
    }
  };

  const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => (
    <View style={styles.slide}>
      <View style={styles.imagePlaceholder}>
        {renderIllustration(item.id)}
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        <PrimaryButton
          title={currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 16,
    zIndex: 10,
  },
  skipText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: height * 0.08,
  },
  imagePlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: Colors.card,
    borderRadius: 125,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.h2,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  buyBadge: {
    position: 'absolute',
    bottom: 25,
    backgroundColor: '#0B1F17',
    borderWidth: 1.5,
    borderColor: '#A8FF3E',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    shadowColor: '#A8FF3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buyBadgeText: {
    color: '#A8FF3E',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  aiCoreGlow: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#A8FF3E',
  },
  aiCoreContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#050505',
    borderWidth: 2,
    borderColor: '#A8FF3E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A8FF3E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  aiBadge: {
    position: 'absolute',
    backgroundColor: '#0B1F17',
    borderWidth: 1.2,
    borderColor: '#A8FF3E',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  aiBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  nodeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10251D',
    borderWidth: 1.5,
    borderColor: '#1D3D2F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A8FF3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
