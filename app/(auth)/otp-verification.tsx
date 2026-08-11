import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { OTPInput } from '../../src/components/common/OTPInput';
import { useAuthStore } from '../../src/store/useAuthStore';
import { AuthService } from '../../src/services/api';

// लॉगिन स्क्रीन से मैच्ड मिनिमलिस्टिक साइबर डार्क कलर्स
const DARK_COLORS = {
  background: '#000000',
  surface: '#0A0A0A',
  border: '#141414',
  accent: '#A8FF3E', // Cyber Green
  textPrimary: '#FFFFFF',
  textSecondary: '#666666',
};

export default function OTPVerificationScreen() {
  const router = useRouter();
  const { mobile } = useLocalSearchParams();
  const { login } = useAuthStore();

  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(30);

  // बटन शिमर एनीमेशन वैल्यु संदर्भ
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // टाइमर हैंडलर लूप
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // जब सबमिट हो रहा हो तो शिमर इफेक्ट को लूप में चलाना
  useEffect(() => {
    if (isSubmitting) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      shimmerAnim.setValue(0);
    }
  }, [isSubmitting]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;

    setIsSubmitting(true);
    try {
      const response = await AuthService.verifyLoginOtp({ phone: mobile, otp });
      const { accessToken, user } = response.data.data;
      
      login(accessToken, user);
      
      // Navigate to the unified dashboard
      router.replace('/(student)/dashboard');
    } catch (error: any) {
      console.error('Error verifying OTP', error);
      Alert.alert('Verification Failed', error.response?.data?.message || 'Invalid OTP or expired. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await AuthService.sendLoginOtp({ phone: mobile });
      setTimer(30);
      setOtp('');
      Alert.alert('Success', 'OTP resent successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  // शिमर वेव पोजीशन इंटरपोलेशन 
  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>

        {/* 1. Minimalistic Shield & Check Secure Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.iconCircle}>
            <FontAwesome5 name="shield-alt" size={32} color={DARK_COLORS.accent} style={styles.shieldIcon} />
            <FontAwesome5 name="check" size={12} color={DARK_COLORS.background} style={styles.checkIcon} />
          </View>
        </View>

        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to{' '}
            <Text style={styles.highlightText}>{mobile ? `+91 ${mobile}` : 'your number'}</Text>
          </Text>
        </View>

        {/* OTP Input Area */}
        <View style={styles.otpWrapper}>
          <OTPInput value={otp} onChange={setOtp} length={6} />
        </View>

        {/* 2. Shimmer Enabled Verify Button */}
        <TouchableOpacity
          style={[styles.button, otp.length !== 6 || isSubmitting ? styles.buttonDisabled : null]}
          onPress={handleVerify}
          disabled={otp.length !== 6 || isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <View style={styles.shimmerButtonContent}>
              <Animated.View style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}>
                <LinearGradient
                  colors={['transparent', 'rgba(255, 255, 255, 0.4)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientFill}
                />
              </Animated.View>
              <Text style={[styles.buttonText, { color: '#000000', opacity: 0.7 }]}>Verifying...</Text>
            </View>
          ) : (
            <Text style={[styles.buttonText, otp.length !== 6 ? { color: '#444444' } : null]}>
              Verify & Continue
            </Text>
          )}
        </TouchableOpacity>

        {/* Bottom Resend Timer Option */}
        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <View style={styles.timerRow}>
              <FontAwesome5 name="clock" size={12} color={DARK_COLORS.textSecondary} style={{ marginRight: 6 }} />
              <Text style={styles.timerText}>Resend code in 00:{timer.toString().padStart(2, '0')}</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
              <Text style={styles.resendLink}>Resend OTP</Text>
              <FontAwesome5 name="arrow-right" size={10} color={DARK_COLORS.accent} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          )}
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  bannerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: DARK_COLORS.surface,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  shieldIcon: {
    opacity: 0.9,
  },
  checkIcon: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: DARK_COLORS.accent,
    borderRadius: 8,
    padding: 3,
    overflow: 'hidden',
  },
  header: {
    marginBottom: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: DARK_COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: DARK_COLORS.textSecondary,
    lineHeight: 20,
  },
  highlightText: {
    color: DARK_COLORS.accent,
    fontWeight: '500',
  },
  otpWrapper: {
    marginBottom: 32,
  },
  button: {
    height: 54,
    backgroundColor: DARK_COLORS.accent,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#141414', // बिना 6 अंक डाले बटन डार्क डिसेबल्ड स्टेट में रहेगा
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.3,
  },
  shimmerButtonContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: DARK_COLORS.accent,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 200,
  },
  gradientFill: {
    flex: 1,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    color: DARK_COLORS.textSecondary,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  resendLink: {
    fontSize: 14,
    color: DARK_COLORS.accent,
    fontWeight: '600',
  },
});