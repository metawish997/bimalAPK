import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../../src/store/useAuthStore'; // Auth स्टोर
import { ProfileTheme } from './theme';
import { API_BASE_URL } from '../../../src/services/api';

export const ProfileHeader = () => {
  const router = useRouter();
  const { user } = useAuthStore(); // ऑथेंटिकेटेड यूजर डेटा निकाला

  // डायनेमिक नाम जनरेट करने का लॉजिक
  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'User'
    : 'Guest User';

  // FIX: TS Error (ts2339) को हटाने के लिए (user as any) का उपयोग किया गया है
  const userRole = user ? `${user.role.name || 'test'}` : null;

  // FIX: यहाँ भी (user as any) का उपयोग करके profile_image एरर को फिक्स किया गया है
  // const profileImageUri = (user as any)?.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg';

  const rawImage = (user as any)?.profileImage || (user as any)?.profile_image;
  console.log(user);


  const profileImageUri = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : `${API_BASE_URL.replace('/api/v1', '')}${rawImage}` // '/api/v1' हटाकर मूल सर्वर पाथ बनाने के लिए
    : 'https://randomuser.me/api/portraits/men/32.jpg';

  return (
    <View style={styles.container}>

      {/* 1. Profile Identity Section (Left Aligned for Minimalism) */}
      <View style={styles.identityContainer}>
        <Image
          source={{ uri: profileImageUri }}
          style={styles.profileImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userRole}>{userRole}</Text>
        </View>
      </View>

      {/* 2. Thin, Clean Premium Badge Component */}
      <TouchableOpacity
        style={styles.premiumIndicator}
        onPress={() => router.push('/(student)/profile/subscription')}
        activeOpacity={0.7}
      >
        <View style={styles.premiumLeft}>
          <View style={styles.dotIndicator} />
          <Text style={styles.premiumText}>Premium plan active</Text>
          <Text style={styles.expiryText}>• Expires 22 Dec 2026</Text>
        </View>
        <FontAwesome name="chevron-right" size={10} color={ProfileTheme.colors.textSecondary} />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ProfileTheme.colors.background,
    paddingTop: 16,
    paddingHorizontal: 4,
  },
  identityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1A1A1A',
  },
  textContainer: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  userNameText: {
    color: '#ffffff',
  },
  userRole: {
    fontSize: 13,
    color: ProfileTheme.colors.textSecondary,
    fontWeight: '400',
  },
  premiumIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
  },
  premiumLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A8FF3E',
    marginRight: 10,
  },
  premiumText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#ffffff',
  },
  expiryText: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
    marginLeft: 6,
  },
});