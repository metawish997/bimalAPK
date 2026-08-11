import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '../../../src/store/useAuthStore';
import { kycService } from '../../../src/services/kycService';

export default function KycScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasStartedKyc, setHasStartedKyc] = useState(false); // ट्रैक करने के लिए कि यूजर पोर्टल पर गया या नहीं

  // डिगियो सेशन को इन-ऐप ब्राउज़र में खोलने का फ़ंक्शन
  const openDigioPortal = async (url: string) => {
    try {
      console.log('[KYC] Launching In-App Browser for Digio Portal...');
      setHasStartedKyc(true);

      // openBrowserAsync का उपयोग करेंगे जो Expo Go में सबसे स्टेबल है
      const result = await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        toolbarColor: '#000000',
        controlsColor: '#A8FF3E',
        showTitle: false,
        enableDefaultShareOption: false,
      });

      // जब यूजर ब्राउज़र की 'X' या 'Back' बटन दबाकर वापस आएगा
      console.log('[KYC] Browser closed, result:', result.type);
      verifyKycStatus();

    } catch (error) {
      console.error('[KYC] Error opening browser:', error);
      Alert.alert('Error', 'Could not open the secure verification portal.');
    }
  };

  const handleStartDigio = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const statusData = await kycService.getStatus();
      const existingStatus = statusData.kyc_status;
      const incompleteStatuses = ['requested', 'initiated', 'pending'];

      if (incompleteStatuses.includes(existingStatus) && statusData.resume_url) {
        console.log('[KYC] Resuming existing KYC session with status:', existingStatus);
        setIsLoading(false);
        openDigioPortal(statusData.resume_url);
        return;
      }

      if (existingStatus === 'approved') {
        Alert.alert('Already Verified', 'Your KYC is already approved! You can subscribe now.', [
          { text: 'Subscribe Now', onPress: () => router.push('/(student)/profile/upgrade') },
          { text: 'Later', onPress: () => router.back() }
        ]);
        return;
      }

      const response = await kycService.initiate({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || '',
        phone: (user as any).phone || (user as any).mobile || '',
        platform: 'mobile',
      });

      if (response.success && response.redirect_url) {
        openDigioPortal(response.redirect_url);
      } else {
        Alert.alert('Error', response.message || 'Could not start KYC session.');
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to initiate KYC.';
      Alert.alert('Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyKycStatus = async () => {
    setIsVerifying(true);
    try {
      // 1.5 सेकंड का छोटा डिले ताकि डिगियो का वेबहुक बैकएंड पर अपना काम पूरा कर सके
      await new Promise(resolve => setTimeout(resolve, 1500));

      const data = await kycService.getStatus();
      const status = data.kyc_status;
      console.log('[KYC] Verified Status from server:', status);

      if (status === 'approved') {
        Alert.alert('KYC Approved! 🎉', 'Your identity has been verified.', [
          { text: 'Subscribe Now', onPress: () => router.push('/(student)/profile/upgrade') },
          { text: 'Later', onPress: () => router.back() }
        ]);
      } else if (status === 'approval_pending') {
        Alert.alert('Under Review', 'Your KYC documents are under review.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else if (['requested', 'initiated', 'pending'].includes(status) && data.resume_url) {
        Alert.alert(
          'KYC Update',
          'Verification is still pending on Digio. Did you complete the process?',
          [
            { text: 'Try Again / Resume', onPress: () => openDigioPortal(data.resume_url) },
            { text: 'Check Status Again', onPress: () => verifyKycStatus() },
            { text: 'Later', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert('Verification Pending', `KYC status: ${status}.`, [
          { text: 'OK' }
        ]);
      }
    } catch (error) {
      console.error('[KycScreen] Status check error:', error);
      Alert.alert('Error', 'Failed to verify KYC status.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#A8FF3E" />
        <Text style={{ color: '#ffffff', marginTop: 20, fontSize: 16, fontWeight: '600' }}>Verifying KYC Documents...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identity Verification</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="security" size={72} color="#A8FF3E" />
        </View>

        <Text style={styles.title}>Complete Your KYC</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            To ensure a secure trading environment and comply with regulatory requirements, you need to complete your KYC process. We have partnered with Digio to make this fast and paperless.
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Document Verification</Text>
            <Text style={styles.bulletItem}>• Live Selfie & Face Match</Text>
            <Text style={styles.bulletItem}>• Digital Signature</Text>
          </View>
        </View>

        {!hasStartedKyc ? (
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxActive]}>
              {acceptedTerms && <MaterialIcons name="check" size={16} color="#000000" />}
            </View>
            <Text style={styles.checkboxText}>
              I hereby consent to provide my details and authorize Bimal Institute to fetch and verify my documents.
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.statusBox}>
            <MaterialIcons name="info-outline" size={20} color="#A8FF3E" />
            <Text style={styles.statusBoxText}>
              If you have completed the KYC process in the browser window, please click the button below to synchronize your account status.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {!hasStartedKyc ? (
          <TouchableOpacity
            style={[styles.button, (!acceptedTerms || isLoading) && styles.buttonDisabled]}
            disabled={!acceptedTerms || isLoading}
            onPress={handleStartDigio}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <Text style={styles.buttonText}>Start KYC Process</Text>
            )}
          </TouchableOpacity>
        ) : (
          // ── FIX: मैनुअल सिंक बटन जब यूजर डिगियो पूरा करके स्क्रीन अटका हुआ देखे ──
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#ffffff' }]}
            onPress={verifyKycStatus}
          >
            <Text style={[styles.buttonText, { color: '#000000' }]}>Check Verification Status</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderColor: '#141414' },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  content: { flex: 1, padding: 24 },
  iconContainer: { alignItems: 'center', marginBottom: 24, marginTop: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#ffffff', textAlign: 'center', marginBottom: 24 },
  infoCard: { backgroundColor: '#0A0A0A', borderWidth: 1, borderColor: '#1A1A1A', borderRadius: 16, padding: 20, marginBottom: 24 },
  infoText: { fontSize: 14, color: '#E5E5E5', lineHeight: 22, marginBottom: 16, opacity: 0.9 },
  bulletList: { gap: 8 },
  bulletItem: { fontSize: 14, color: '#A8FF3E', fontWeight: '500' },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#333333', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  checkboxActive: { backgroundColor: '#A8FF3E', borderColor: '#A8FF3E' },
  checkboxText: { flex: 1, fontSize: 13, color: '#888888', lineHeight: 20 },
  statusBox: { flexDirection: 'row', gap: 10, backgroundColor: '#0F1A05', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#2C4D0E' },
  statusBoxText: { flex: 1, color: '#CBE6A3', fontSize: 13, lineHeight: 18 },
  footer: { padding: 24, borderTopWidth: 1, borderColor: '#141414' },
  button: { backgroundColor: '#A8FF3E', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buttonDisabled: { backgroundColor: '#333333', opacity: 0.7 },
  buttonText: { color: '#000000', fontSize: 16, fontWeight: '700' }
});