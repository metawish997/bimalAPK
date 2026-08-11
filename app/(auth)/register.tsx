import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';

const { width } = Dimensions.get('window');

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  background: '#000000',
  surface: '#0A0A0A',
  card: '#111111',
  border: '#1A1A1A',
  accent: '#A8FF3E',
  accentDim: 'rgba(168,255,62,0.12)',
  accentBorder: 'rgba(168,255,62,0.25)',
  textPrimary: '#FFFFFF',
  textSecondary: '#666666',
  textMuted: '#333333',
  danger: '#FF4444',
  google: '#EA4335',
  facebook: '#1877F2',
  apple: '#FFFFFF',
};

// ─── Validation Schema ──────────────────────────────────────────────────────────
const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  mobile: z.string().regex(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[0-9]/, 'Must include a number'),
});
type RegisterForm = z.infer<typeof registerSchema>;

// ─── Role Card Component ────────────────────────────────────────────────────────
function RoleCard({
  icon,
  label,
  description,
  selected,
  onPress,
  scaleAnim,
  shimmerAnim,
}: {
  icon: string;
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  scaleAnim: Animated.Value;
  shimmerAnim: Animated.Value;
}) {
  // Map shimmerAnim (0→1) to a horizontal sweep across card width
  const cardW = (width - 48 - 12) / 2; // 48px total padding, 12px gap
  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-cardW * 1.2, cardW * 1.2],
  });

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.roleCardTouch}>
      <Animated.View
        style={[
          styles.roleCard,
          selected && styles.roleCardSelected,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Static green tint when selected — behind everything */}
        {selected && (
          <LinearGradient
            colors={['rgba(168,255,62,0.08)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}

        {/* One-shot shimmer sweep — static wrapper keeps it BEHIND content on Android */}
        <View
          style={[StyleSheet.absoluteFill, styles.roleCardShimmerWrap]}
          pointerEvents="none"
        >
          <Animated.View
            style={[StyleSheet.absoluteFill, { transform: [{ translateX: shimmerTranslateX }] }]}
          >
            <LinearGradient
              colors={[
                'transparent',
                selected ? 'rgba(168,255,62,0.25)' : 'rgba(255,255,255,0.07)',
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.roleCardShimmerGradient}
            />
          </Animated.View>
        </View>

        {/* Card content — always on top via zIndex: 1 */}
        <View style={styles.roleCardContent}>
          <View style={[styles.roleIconCircle, selected && styles.roleIconCircleSelected]}>
            <FontAwesome5 name={icon} size={26} color={selected ? C.background : C.textSecondary} />
          </View>
          <Text style={[styles.roleLabel, selected && styles.roleLabelSelected]}>{label}</Text>
          <Text style={styles.roleDesc}>{description}</Text>
        </View>

        {selected && (
          <View style={styles.roleCheckBadge}>
            <FontAwesome5 name="check" size={10} color={C.background} />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Confirm Button Shimmer ─────────────────────────────────────────────────────
function ConfirmShimmer({
  shimmerAnim,
  active,
}: {
  shimmerAnim: Animated.Value;
  active: boolean;
}) {
  const btnW = width - 48;
  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-btnW, btnW],
  });

  return (
    // Static absoluteFill View — no transform ⇒ no GPU layer promotion on Android.
    // Keeps shimmer BEHIND the button text at all times.
    <View
      style={[StyleSheet.absoluteFill, styles.confirmShimmerClip]}
      pointerEvents="none"
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ translateX: shimmerTranslateX }] }]}
      >
        <LinearGradient
          colors={[
            'transparent',
            active ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.05)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

// ─── Generic Looping Shimmer (safe static-wrapper pattern) ─────────────────────
function LoopShimmer({
  shimmerAnim,
  sweepWidth,
  color = 'rgba(255,255,255,0.18)',
  borderRadius = 0,
}: {
  shimmerAnim: Animated.Value;
  sweepWidth: number;
  color?: string;
  borderRadius?: number;
}) {
  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-sweepWidth, sweepWidth],
  });
  return (
    <View
      style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius }]}
      pointerEvents="none"
    >
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['transparent', color, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────────────
export default function RegisterScreen() {
  const router = useRouter();

  // Modal state
  const [roleModalVisible, setRoleModalVisible] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'student' | 'trader' | null>(null);

  // Animations
  const modalSlideAnim = useRef(new Animated.Value(300)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;
  const studentScaleAnim = useRef(new Animated.Value(1)).current;
  const traderScaleAnim = useRef(new Animated.Value(1)).current;
  const formOpacityAnim = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(30)).current;

  // Card click shimmer (one-shot per tap, resets to 0 before each play)
  const studentShimmerAnim = useRef(new Animated.Value(0)).current;
  const traderShimmerAnim = useRef(new Animated.Value(0)).current;

  // Confirm button — permanent looping shimmer
  const confirmShimmerAnim = useRef(new Animated.Value(0)).current;

  // Social icon buttons — shared looping shimmer
  const socialShimmerAnim = useRef(new Animated.Value(0)).current;

  // Register submit button — looping shimmer
  const submitShimmerAnim = useRef(new Animated.Value(0)).current;

  // Helper: start a looping shimmer on any Animated.Value
  const startLoop = (anim: Animated.Value, duration = 1400, pause = 700) =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.delay(pause),
      ])
    ).start();

  useEffect(() => {
    // Modal entrance animation
    Animated.parallel([
      Animated.spring(modalSlideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.timing(modalOpacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    // Start all looping shimmers (staggered so they don’t all peak together)
    startLoop(confirmShimmerAnim, 1400, 600);
    startLoop(socialShimmerAnim, 1600, 500);
    startLoop(submitShimmerAnim, 1300, 800);
  }, []);

  const handleSelectRole = (role: 'student' | 'trader') => {
    setSelectedRole(role);
    const scaleAnim = role === 'student' ? studentScaleAnim : traderScaleAnim;
    const shimmer = role === 'student' ? studentShimmerAnim : traderShimmerAnim;

    // Reset shimmer to start, then sweep once
    shimmer.setValue(0);
    Animated.timing(shimmer, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Bounce scale
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.93, useNativeDriver: true, tension: 300, friction: 10 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }),
    ]).start();
  };

  const handleConfirmRole = () => {
    if (!selectedRole) return;
    // Close modal with animation
    Animated.parallel([
      Animated.timing(modalSlideAnim, { toValue: 400, duration: 280, useNativeDriver: true }),
      Animated.timing(modalOpacityAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start(() => {
      setRoleModalVisible(false);
      // Animate form in
      Animated.parallel([
        Animated.timing(formOpacityAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(formSlideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]).start();
    });
  };

  // Form
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', mobile: '', email: '', password: '' },
  });

  const onSubmit = async (data: RegisterForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    router.push({ pathname: '/(auth)/otp-verification', params: { mobile: data.mobile } });
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Register with ${provider} as ${selectedRole}`);
  };

  return (
    <View style={styles.rootContainer}>

      {/* ── Role Selection Modal ─────────────────────────────────────────── */}
      <Modal transparent visible={roleModalVisible} animationType="none" statusBarTranslucent>
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalSheet,
              { opacity: modalOpacityAnim, transform: [{ translateY: modalSlideAnim }] },
            ]}
          >
            {/* Handle bar */}
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Join As</Text>
            <Text style={styles.modalSubtitle}>
              Choose how you want to register — you can always switch later.
            </Text>

            {/* Role Cards */}
            <View style={styles.roleCardsRow}>
              <RoleCard
                icon="graduation-cap"
                label="Student"
                description="I'm here to learn trading fundamentals"
                selected={selectedRole === 'student'}
                onPress={() => handleSelectRole('student')}
                scaleAnim={studentScaleAnim}
                shimmerAnim={studentShimmerAnim}
              />
              <RoleCard
                icon="chart-line"
                label="Trader"
                description="I actively trade & want advanced tools"
                selected={selectedRole === 'trader'}
                onPress={() => handleSelectRole('trader')}
                scaleAnim={traderScaleAnim}
                shimmerAnim={traderShimmerAnim}
              />
            </View>

            {/* Confirm Button — permanent shimmer loop */}
            <TouchableOpacity
              style={[styles.confirmBtn, !selectedRole && styles.confirmBtnDisabled]}
              onPress={handleConfirmRole}
              activeOpacity={0.85}
              disabled={!selectedRole}
            >
              {/* zIndex 0: shimmer sweeps behind the text */}
              <ConfirmShimmer shimmerAnim={confirmShimmerAnim} active={!!selectedRole} />
              {/* zIndex 1: text+icon always on top */}
              <View style={styles.confirmBtnContent}>
                <Text style={[styles.confirmBtnText, !selectedRole && styles.confirmBtnTextDisabled]}>
                  Continue as {selectedRole ? (selectedRole === 'student' ? 'Student' : 'Trader') : '...'}
                </Text>
                <FontAwesome5 name="arrow-right" size={14} color={selectedRole ? C.background : '#777777'} />
              </View>
            </TouchableOpacity>

            {/* Already have account */}
            <View style={styles.modalFooterRow}>
              <Text style={styles.modalFooterText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.modalFooterLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* ── Registration Form (shown after role selected) ─────────────────── */}
      {!roleModalVisible && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={{ opacity: formOpacityAnim, transform: [{ translateY: formSlideAnim }] }}
            >
              {/* Header */}
              <View style={styles.formHeader}>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => {
                    setRoleModalVisible(true);
                    Animated.parallel([
                      Animated.spring(modalSlideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
                      Animated.timing(modalOpacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                    ]).start();
                  }}
                >
                  <FontAwesome5 name="arrow-left" size={16} color={C.textSecondary} />
                </TouchableOpacity>

                <View style={styles.roleBadge}>
                  <FontAwesome5
                    name={selectedRole === 'student' ? 'graduation-cap' : 'chart-line'}
                    size={12}
                    color={C.accent}
                  />
                  <Text style={styles.roleBadgeText}>
                    {selectedRole === 'student' ? 'Student' : 'Trader'}
                  </Text>
                </View>
              </View>

              <Text style={styles.formTitle}>Create Account</Text>
              <Text style={styles.formSubtitle}>Join the elite trading community</Text>

              {/* ── Social Sign-In – Modern Icon Row ─────────────────── */}
              <View style={styles.socialSection}>
                <Text style={styles.socialSectionLabel}>Sign up with</Text>
                <View style={styles.socialIconRow}>

                  {/* Google */}
                  <TouchableOpacity
                    style={styles.socialIconBtn}
                    onPress={() => handleSocialRegister('Google')}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.socialIconBg, { backgroundColor: '#1C1C1C' }]}>
                      <LoopShimmer shimmerAnim={socialShimmerAnim} sweepWidth={56} color="rgba(255,255,255,0.15)" borderRadius={16} />
                      <FontAwesome name="google" size={20} color={C.google} />
                    </View>
                    <Text style={styles.socialIconLabel}>Google</Text>
                  </TouchableOpacity>

                  {/* Apple */}
                  <TouchableOpacity
                    style={styles.socialIconBtn}
                    onPress={() => handleSocialRegister('Apple')}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.socialIconBg, { backgroundColor: '#1C1C1C' }]}>
                      <LoopShimmer shimmerAnim={socialShimmerAnim} sweepWidth={56} color="rgba(255,255,255,0.15)" borderRadius={16} />
                      <FontAwesome name="apple" size={22} color="#FFFFFF" />
                    </View>
                    <Text style={styles.socialIconLabel}>Apple</Text>
                  </TouchableOpacity>

                  {/* Facebook */}
                  <TouchableOpacity
                    style={styles.socialIconBtn}
                    onPress={() => handleSocialRegister('Facebook')}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.socialIconBg, { backgroundColor: '#1C1C1C' }]}>
                      <LoopShimmer shimmerAnim={socialShimmerAnim} sweepWidth={56} color="rgba(255,255,255,0.15)" borderRadius={16} />
                      <FontAwesome name="facebook" size={20} color={C.facebook} />
                    </View>
                    <Text style={styles.socialIconLabel}>Facebook</Text>
                  </TouchableOpacity>

                </View>
              </View>


              {/* ── Divider ────────────────────────────────────────────── */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or register with email</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* ── Form Fields ───────────────────────────────────────── */}
              <View style={styles.form}>

                {/* Full Name */}
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Full Name</Text>
                      <View style={[styles.inputContainer, errors.fullName ? styles.inputError : null]}>
                        <FontAwesome5 name="user" size={14} color={C.textMuted} style={styles.inputIcon} />
                        <TextInput
                          style={styles.textInput}
                          placeholder="Enter your full name"
                          placeholderTextColor={C.textMuted}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          autoCapitalize="words"
                        />
                      </View>
                      {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}
                    </View>
                  )}
                />

                {/* Mobile */}
                <Controller
                  control={control}
                  name="mobile"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Mobile Number</Text>
                      <View style={[styles.inputContainer, errors.mobile ? styles.inputError : null]}>
                        <Text style={styles.countryCode}>+91</Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder="00000 00000"
                          placeholderTextColor={C.textMuted}
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

                {/* Email */}
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Email Address</Text>
                      <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
                        <FontAwesome5 name="envelope" size={14} color={C.textMuted} style={styles.inputIcon} />
                        <TextInput
                          style={styles.textInput}
                          placeholder="Enter your email"
                          placeholderTextColor={C.textMuted}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      </View>
                      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                    </View>
                  )}
                />

                {/* Password */}
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <View style={[styles.inputContainer, errors.password ? styles.inputError : null]}>
                        <FontAwesome5 name="lock" size={14} color={C.textMuted} style={styles.inputIcon} />
                        <TextInput
                          style={styles.textInput}
                          placeholder="Min 8 chars, 1 uppercase, 1 number"
                          placeholderTextColor={C.textMuted}
                          secureTextEntry={!showPassword}
                          autoCapitalize="none"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword((p) => !p)}
                          style={styles.eyeBtn}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <FontAwesome5
                            name={showPassword ? 'eye-slash' : 'eye'}
                            size={15}
                            color={showPassword ? C.accent : C.textSecondary}
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                    </View>
                  )}
                />

                {/* Submit Button */}
                <TouchableOpacity
                  style={[styles.submitBtn, isSubmitting && styles.submitBtnLoading]}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  activeOpacity={0.85}
                >
                  {/* Looping shimmer — static wrapper, inner animated translateX */}
                  <LoopShimmer
                    shimmerAnim={submitShimmerAnim}
                    sweepWidth={width - 48}
                    color="rgba(255,255,255,0.30)"
                    borderRadius={14}
                  />
                  {/* Content layer always on top */}
                  <View style={styles.submitBtnContent}>
                    {isSubmitting ? (
                      <Text style={styles.submitBtnText}>Creating Account...</Text>
                    ) : (
                      <>
                        <Text style={styles.submitBtnText}>Register as {selectedRole === 'student' ? 'Student' : 'Trader'}</Text>
                        <FontAwesome5 name="arrow-right" size={14} color={C.background} />
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>

            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: C.background,
  },

  // ── Modal ──────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#0C0C0C',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: '#1A1A1A',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#2A2A2A',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 28,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: C.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: C.textSecondary,
    lineHeight: 20,
    marginBottom: 28,
  },

  // ── Role Cards ─────────────────────────────────────────────────────────────
  roleCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  roleCardTouch: {
    flex: 1,
  },
  roleCard: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 155,
    justifyContent: 'center',
  },
  roleCardSelected: {
    borderColor: C.accentBorder,
    backgroundColor: '#0D0D0D',
  },
  roleIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  roleIconCircleSelected: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: C.textSecondary,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  roleLabelSelected: {
    color: C.textPrimary,
  },
  roleDesc: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  roleCheckBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Wraps icon+label+desc so zIndex:1 guarantees paint above shimmer on Android
  roleCardContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  // Role card shimmer sweep overlay
  roleCardShimmerWrap: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  roleCardShimmerGradient: {
    flex: 1,
    width: '100%',
  },

  // ── Confirm Button ─────────────────────────────────────────────────────────
  confirmBtn: {
    height: 54,
    backgroundColor: C.accent,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  confirmBtnDisabled: {
    backgroundColor: '#111',
    // borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.background,
    letterSpacing: 0.2,
  },
  confirmBtnTextDisabled: {
    color: '#777777', // readable on #111 bg (was #333 — nearly invisible)
  },
  // Wraps text+icon so zIndex:1 guarantees paint above shimmer on Android
  confirmBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 1,
  },
  // Static clip wrapper for the shimmer — no transform here so Android
  // doesn't promote this to a GPU compositing layer that paints over siblings
  confirmShimmerClip: {
    overflow: 'hidden',
    borderRadius: 14,
  },
  modalFooterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalFooterText: {
    fontSize: 14,
    color: C.textSecondary,
  },
  modalFooterLink: {
    fontSize: 14,
    color: C.accent,
    fontWeight: '600',
  },

  // ── Form ───────────────────────────────────────────────────────────────────
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.accentDim,
    borderWidth: 1,
    borderColor: C.accentBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.accent,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: C.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: C.textSecondary,
    marginBottom: 28,
    lineHeight: 20,
  },

  // ── Social Buttons ─────────────────────────────────────────────────────────
  socialSection: {
    marginBottom: 24,
  },
  socialSectionLabel: {
    fontSize: 11,
    color: C.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 14,
  },
  socialIconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
  socialIconBtn: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  socialIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconLabel: {
    fontSize: 11,
    color: C.textSecondary,
    fontWeight: '500',
  },

  // ── Divider ────────────────────────────────────────────────────────────────
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  dividerText: {
    fontSize: 12,
    color: C.textSecondary,
    fontWeight: '500',
  },

  // ── Inputs ────────────────────────────────────────────────────────────────
  form: {
    gap: 4,
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    color: C.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  inputError: {
    borderColor: C.danger,
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeBtn: {
    paddingLeft: 8,
    justifyContent: 'center',
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    color: C.accent,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: C.textPrimary,
    fontWeight: '500',
  },
  errorText: {
    color: C.danger,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 2,
  },

  // ── Submit ────────────────────────────────────────────────────────────────
  submitBtn: {
    height: 54,
    backgroundColor: C.accent,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    overflow: 'hidden',  // clips the shimmer to rounded corners
  },
  submitBtnLoading: {
    opacity: 0.7,
  },
  submitBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 1,  // always above shimmer layer
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.background,
    letterSpacing: 0.2,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
    color: C.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: C.accent,
    fontWeight: '600',
  },
});
