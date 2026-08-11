import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileTheme } from './theme';

const CERTIFICATES = [
  {
    id: 'CERT-0943',
    name: 'Advanced Technical Analysis',
    date: 'Oct 15, 2025',
    instructor: 'Michael Chen',
  },
  {
    id: 'CERT-1022',
    name: 'Options Trading Strategies',
    date: 'Nov 22, 2025',
    instructor: 'Sarah Jenkins',
  }
];

export const CertificationsSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Certifications</Text>

      <View style={styles.list}>
        {CERTIFICATES.map((cert, index) => (
          <View
            key={cert.id}
            style={[styles.itemRow, index === CERTIFICATES.length - 1 && styles.noBorder]}
          >
            {/* Left Content Column */}
            <View style={styles.mainInfo}>
              <Text style={styles.certName}>{cert.name}</Text>
              <Text style={styles.subText}>by {cert.instructor} • Issued {cert.date}</Text>
              <Text style={styles.idText}>ID: {cert.id}</Text>
            </View>

            {/* Right Mini Action Utilities with Distinct Color Layouts */}
            <View style={styles.actionsColumn}>
              <TouchableOpacity style={styles.inlineAction} activeOpacity={0.7}>
                {/* Electric Sky Blue for Downloader utility */}
                <Feather name="download" size={13} color="#38BDF8" />
                <Text style={[styles.actionText, { color: '#38BDF8' }]}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.inlineAction} activeOpacity={0.7}>
                {/* Orchid Fuchsia Pink for Share utility */}
                <Feather name="share-2" size={13} color="#F472B6" />
                <Text style={[styles.actionText, { color: '#F472B6' }]}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ProfileTheme.colors.background,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: ProfileTheme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  list: {
    gap: 0,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#141414',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  mainInfo: {
    flex: 1,
    paddingRight: 16,
  },
  certName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#A8FF3E', // Upgraded to premium high-end terminal green accent color
    letterSpacing: -0.1,
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
    marginBottom: 2,
  },
  idText: {
    fontSize: 11,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
    color: ProfileTheme.colors.textSecondary,
    opacity: 0.6,
  },
  actionsColumn: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  inlineAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});