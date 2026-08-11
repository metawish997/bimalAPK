import { FontAwesome5 } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Animated, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { z } from 'zod';
import { AuthService } from '../../src/services/api';

const DARK_COLORS = {
  background: '#000000',
  surface: '#0A0A0A',
  border: '#141414',
  accent: '#A8FF3E',
  textPrimary: '#FFFFFF',
  textSecondary: '#666666',
};

const loginSchema = z.object({
  mobile: z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { mobile: '' },
  });

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

  const onSubmit = async (data: LoginForm) => {
    try {
      await AuthService.sendLoginOtp({ phone: data.mobile });
      router.push({
        pathname: '/(auth)/otp-verification',
        params: { mobile: data.mobile },
      });
    } catch (error: any) {
      console.error('Error sending login OTP', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

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

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.iconCircle}>
            <FontAwesome5 name="lock" size={32} color={DARK_COLORS.accent} style={styles.lockIcon} />
            <FontAwesome5 name="key" size={16} color={DARK_COLORS.background} style={styles.keyIcon} />
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Enter your mobile number to continue</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="mobile"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <View style={[styles.inputContainer, errors.mobile ? styles.inputErrorBorder : null]}>
                  <Text style={styles.countryCode}>+91</Text>
                  {/* 👈 यहाँ Animated.TextInput को बदलकर नॉर्मल TextInput कर दिया है */}
                  <TextInput
                    style={styles.textInput}
                    placeholder="00000 00000"
                    placeholderTextColor={DARK_COLORS.textSecondary}
                    keyboardType="phone-pad"
                    maxLength={10}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
                {errors.mobile && <Text style={styles.errorText}>{errors.mobile.message}</Text>}
              </View>
            )}
          />

          {/* Button with Shimmer */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
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
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK_COLORS.background },
  content: { flex: 1, paddingHorizontal: 28, justifyContent: 'center' },
  bannerContainer: { alignItems: 'center', marginBottom: 32 },
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
  lockIcon: { opacity: 0.9 },
  keyIcon: {
    position: 'absolute',
    bottom: 22,
    right: 22,
    backgroundColor: DARK_COLORS.accent,
    borderRadius: 10,
    padding: 3,
    overflow: 'hidden',
  },
  header: { marginBottom: 36 },
  title: { fontSize: 26, fontWeight: '700', color: DARK_COLORS.textPrimary, letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontSize: 14, color: DARK_COLORS.textSecondary, lineHeight: 20 },
  form: { marginBottom: 20 },
  inputWrapper: { marginBottom: 24 },
  inputLabel: { fontSize: 11, color: DARK_COLORS.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: DARK_COLORS.surface, borderWidth: 1, borderColor: DARK_COLORS.border, borderRadius: 12, paddingHorizontal: 16, height: 54 },
  inputErrorBorder: { borderColor: '#FF4444' },
  countryCode: { fontSize: 15, fontWeight: '600', color: DARK_COLORS.accent, marginRight: 12 },
  textInput: { flex: 1, fontSize: 16, color: DARK_COLORS.textPrimary, fontWeight: '500' },
  errorText: { color: '#FF4444', fontSize: 12, marginTop: 6 },
  button: { height: 54, backgroundColor: DARK_COLORS.accent, borderRadius: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: 8 },
  buttonText: { fontSize: 15, fontWeight: '700', color: '#000000', letterSpacing: 0.3 },
  shimmerButtonContent: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  shimmerOverlay: { position: 'absolute', top: 0, bottom: 0, width: 200 },
  gradientFill: { flex: 1 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { fontSize: 14, color: DARK_COLORS.textSecondary },
  registerLink: { fontSize: 14, color: DARK_COLORS.accent, fontWeight: '600' },
});