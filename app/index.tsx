/**
 * app/index.tsx — Netflix-style logo intro splash
 *
 * Uses ONLY react-native's built-in Animated API (no reanimated, no plugins).
 *
 * Timeline:
 *   0 ms   → Logo fades in + scales up (spring-like overshoot)
 *   500 ms → Neon fill sweeps bottom-to-top through the logo (RAF loop, 700 ms)
 *   1100 ms→ Logo zooms big then snaps back (Netflix overshoot)
 *   1450 ms→ Logo slides UP; "BIMAL INSTITUTE" types in below it letter-by-letter
 *   2800 ms→ Entire screen fades to black → navigate
 */
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, { ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useAuthStore } from '../src/store/useAuthStore';

// ─── Constants ─────────────────────────────────────────────────────────────────
const LOGO_SIZE = 140;
const VB = 26;   // SVG viewBox = "0 0 26 26"
const BRAND_NAME = 'Bimal Institute';

const LOGO_PATH =
  'M18.9682 6.12623L14.0383 1.09754C13.2509 0.294308 11.9747 0.294308 ' +
  '11.1842 1.09754L6.28756 6.09238C6.26946 6.11085 6.26041 6.13239 6.26041 ' +
  '6.15701V9.9516C6.26041 10.0316 6.35696 10.0716 6.41428 10.0162L10.6894 ' +
  '5.65537C10.8554 5.48611 11.142 5.60613 11.142 5.84618V20.8615C11.142 ' +
  '21.1015 10.8554 21.2215 10.6894 21.0523L3.33086 13.5462C3.22828 13.4415 ' +
  '3.22828 13.2692 3.33086 13.1646L4.2933 12.1828C4.38381 12.0905 4.4351 ' +
  '11.9643 4.4351 11.8351V8.52055C4.4351 8.32359 4.19977 8.22511 4.064 ' +
  '8.3636L0.597422 11.8997C-0.190026 12.7029 -0.190026 14.0047 0.597422 ' +
  '14.811L11.1903 25.6163C11.2114 25.6378 11.2325 25.6593 11.2536 ' +
  '25.6778C12.2854 26.6411 13.9539 25.8563 13.9539 24.4314V5.71384C13.9539 ' +
  '5.4738 14.2405 5.35377 14.4064 5.52303L18.8053 10.0101C18.8807 10.087 ' +
  '19.0104 10.0316 19.0104 9.92391V6.21548C19.0104 6.1847 18.9984 6.15393 ' +
  '18.9742 6.12931L18.9682 6.12623ZM24.6282 11.8997L21.2491 8.44977C21.0952 ' +
  '8.29282 20.8327 8.40361 20.8327 8.62519V11.8628C20.8327 12.0012 20.887 ' +
  '12.1336 20.9806 12.229L21.8947 13.1615C21.9973 13.2661 21.9973 13.4384 ' +
  '21.8947 13.5431L16.1201 19.4335C16.0718 19.4827 16.0417 19.5535 16.0417 ' +
  '19.6243V22.9111C16.0417 23.1511 16.3283 23.2712 16.4942 23.1019L24.6282 ' +
  '14.8049C25.4156 14.0016 25.4156 12.6968 24.6282 11.8935V11.8997Z';

// ─── Component ─────────────────────────────────────────────────────────────────
export default function SplashScreen() {
  const router = useRouter();
  const { token, user } = useAuthStore();

  // ── Animated values ─────────────────────────────────────────────────────────
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(0)).current;   // slides logo up
  const brandOpacity = useRef(new Animated.Value(0)).current;   // brand text container
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  // Blinking cursor
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  // ── SVG fill progress (RAF) ──────────────────────────────────────────────────
  const [fillH, setFillH] = useState(0);

  // ── Typewriter state ─────────────────────────────────────────────────────────
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(false);

  // ── Navigation ───────────────────────────────────────────────────────────────
  const navigate = useCallback(() => {
    if (!token) {
      router.replace('/(auth)/onboarding');
    } else if (user?.role === 'guest') {
      router.replace('/(guest)/home');
    } else {
      router.replace('/(student)/dashboard');
    }
  }, [token, user, router]);

  useEffect(() => {
    // ── Phase 1 (0 ms): Logo fade-in + scale overshoot ───────────────────────
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.12,
          duration: 420,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1.0,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // ── Phase 2 (500 ms): Neon fill sweep bottom-to-top ──────────────────────
    const FILL_START = 500;
    const FILL_DUR = 700;
    let rafId: ReturnType<typeof requestAnimationFrame>;
    let startTime: number | null = null;

    const doFill = (ts: number) => {
      if (startTime === null) startTime = ts;
      const t = Math.min((ts - startTime) / FILL_DUR, 1);
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setFillH(e * VB);
      if (t < 1) rafId = requestAnimationFrame(doFill);
    };

    const fillTimer = setTimeout(() => {
      rafId = requestAnimationFrame(doFill);
    }, FILL_START);

    // ── Phase 3 (1 100 ms): Netflix zoom overshoot ────────────────────────────
    const zoomTimer = setTimeout(() => {
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.38,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1.0,
          duration: 240,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 1100);

    // ── Phase 4 (1 500 ms): Logo slides up + brand text appears ──────────────
    const slideTimer = setTimeout(() => {
      // Slide logo upward
      Animated.timing(logoTranslateY, {
        toValue: -60,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      // Brand text container fades in immediately
      Animated.timing(brandOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();

      // Show blinking cursor
      setShowCursor(true);

      // Typewriter: reveal one letter every 80 ms
      const LETTER_INTERVAL = 80;
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        charIndex++;
        setTypedText(BRAND_NAME.slice(0, charIndex));
        if (charIndex >= BRAND_NAME.length) {
          clearInterval(typeInterval);
          // Hide cursor after typing finishes
          setTimeout(() => setShowCursor(false), 500);
        }
      }, LETTER_INTERVAL);

      // Blinking cursor animation (loops)
      Animated.loop(
        Animated.sequence([
          Animated.timing(cursorOpacity, { toValue: 0, duration: 350, useNativeDriver: true, easing: Easing.linear }),
          Animated.timing(cursorOpacity, { toValue: 1, duration: 350, useNativeDriver: true, easing: Easing.linear }),
        ])
      ).start();

      return () => clearInterval(typeInterval);
    }, 1500);

    // ── Phase 5 (2 200 ms): Tagline fades in at bottom ───────────────────────
    const tagTimer = setTimeout(() => {
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }, 2200);

    // ── Phase 6 (3 200 ms): Fade to black → navigate ─────────────────────────
    const navTimer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) navigate();
      });
    }, 3200);

    return () => {
      clearTimeout(fillTimer);
      clearTimeout(zoomTimer);
      clearTimeout(slideTimer);
      clearTimeout(tagTimer);
      clearTimeout(navTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── SVG fill geometry ────────────────────────────────────────────────────────
  const clipY = VB - fillH;
  const shimmerY = Math.max(0, clipY - 0.8);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>

      {/* ── Logo + brand block (moves together) ── */}
      <Animated.View
        style={[
          styles.centerBlock,
          {
            opacity: logoOpacity,
            transform: [
              { scale: logoScale },
              { translateY: logoTranslateY },
            ],
          },
        ]}
      >
        {/* SVG logomark */}
        <Svg width={LOGO_SIZE} height={LOGO_SIZE} viewBox={`0 0 ${VB} ${VB}`}>
          <Defs>
            <LinearGradient id="neonGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#DEFF9A" stopOpacity="1" />
              <Stop offset="50%" stopColor="#A4FF5C" stopOpacity="1" />
              <Stop offset="100%" stopColor="#5CC000" stopOpacity="1" />
            </LinearGradient>
            <ClipPath id="logoClip">
              <Path d={LOGO_PATH} />
            </ClipPath>
          </Defs>

          {/* Ghost base */}
          <Path d={LOGO_PATH} fill="#A4FF5C" fillOpacity={0.1} />

          {/* Neon fill — grows upward */}
          <G clipPath="url(#logoClip)">
            <Rect x={0} y={clipY} width={VB} height={fillH} fill="url(#neonGrad)" />
          </G>

          {/* Shimmer at the leading edge */}
          <G clipPath="url(#logoClip)">
            <Rect
              x={0}
              y={shimmerY}
              width={VB}
              height={1.6}
              fill="#F0FFD0"
              fillOpacity={fillH > 0.1 && fillH < VB - 0.1 ? 0.9 : 0}
            />
          </G>
        </Svg>

        {/* ── Brand name appears below logo ── */}
        <Animated.View style={[styles.brandRow, { opacity: brandOpacity }]}>
          <Animated.Text style={styles.brandText}>
            {typedText}
            {showCursor && (
              <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>
                {'|'}
              </Animated.Text>
            )}
          </Animated.Text>
        </Animated.View>
      </Animated.View>

      {/* ── Tagline at the very bottom ── */}
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Building Traders, Not Just Students
      </Animated.Text>

    </Animated.View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // The logo + brand text move as one unit
  centerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Row containing the typed brand name
  brandRow: {
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,           // fixed height so layout doesn't jump as text grows
  },

  brandText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Blinking cursor
  cursor: {
    color: '#A4FF5C',
    fontSize: 22,
    fontWeight: '300',
  },

  tagline: {
    position: 'absolute',
    bottom: 64,
    color: '#8A8A8A',
    fontSize: 12.5,
    letterSpacing: 2.2,
    fontStyle: 'italic',
  },
});