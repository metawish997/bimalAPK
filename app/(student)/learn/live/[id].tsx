import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, SafeAreaView, PermissionsAndroid } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Colors } from '../../../../src/constants/Colors';
import { Typography } from '../../../../src/constants/Typography';
import { useAuthStore } from '../../../../src/store/useAuthStore';

const DUMMY_CHAT = [
  { id: '1', user: 'Rahul Verma', text: 'Good morning sir!', isInstructor: false, time: '09:01 AM' },
  { id: '2', user: 'Priya Sharma', text: 'Are we trading BankNifty today?', isInstructor: false, time: '09:02 AM' },
  { id: '3', user: 'Bimal Institute', text: 'Yes, keep BankNifty 44500 CE on your watchlist.', isInstructor: true, time: '09:03 AM' },
  { id: '4', user: 'Amit Patel', text: 'Added to watchlist 👍', isInstructor: false, time: '09:04 AM' },
  { id: '5', user: 'System', text: 'Important: Never trade with more than 2% of your capital on a single trade.', isInstructor: true, isSystem: true, time: '09:05 AM' },
  { id: '6', user: 'Rohan Gupta', text: 'Market opening gap up!', isInstructor: false, time: '09:14 AM' },
];

const DUMMY_STRATEGIES = [
  { id: 's1', title: 'Intraday BankNifty Setup', type: 'BUY', target: '44800', stopLoss: '44400', entry: '44550', status: 'ACTIVE' },
  { id: 's2', title: 'Nifty Scalp Trade', type: 'SELL', target: '19400', stopLoss: '19550', entry: '19500', status: 'COMPLETED' },
];

export default function LiveStreamScreen() {
  const { id, pwd } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'strategies'>('chat');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (Platform.OS === 'android') {
      const requestPermissions = async () => {
        try {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);
        } catch (err) {
          console.warn(err);
        }
      };
      requestPermissions();
    }
  }, []);

  const zoomUrl = `https://zoom.us/wc/join/${id}?pwd=${pwd || ''}&uname=${encodeURIComponent(user?.name || user?.email || 'Student')}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* Video Player Area */}
        <View style={styles.videoContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="keyboard-arrow-down" size={32} color="#FFF" />
          </TouchableOpacity>
          
          <WebView 
            source={{ uri: zoomUrl }} 
            style={styles.videoPlaceholder} 
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            mediaCapturePermissionGrantType="grant"
            originWhitelist={['*']}
            userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
            injectedJavaScript={`
              // Bypass the Zoom permission wait by immediately denying the microphone request
              // This allows the user to join as a viewer without getting stuck on the "Allow" popup
              if (navigator.mediaDevices) {
                navigator.mediaDevices.getUserMedia = function() {
                  return Promise.reject(new Error("NotAllowedError"));
                };
              }
              true;
            `}
            onShouldStartLoadWithRequest={(request) => {
              if (request.url.startsWith('http://') || request.url.startsWith('https://')) {
                return true;
              }
              return false;
            }}
          />

          <View style={styles.videoOverlayTop}>
            <View style={styles.liveBadge}>
              <View style={styles.redDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <View style={styles.viewersBadge}>
              <FontAwesome name="eye" size={12} color="#FFF" />
              <Text style={styles.viewersText}>1,248</Text>
            </View>
          </View>
        </View>

        {/* Stream Info */}
        <View style={styles.streamInfo}>
          <Text style={styles.streamTitle}>Live Options Trading & Market Analysis</Text>
          <Text style={styles.streamInstructor}>Bimal Institute</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
            onPress={() => setActiveTab('chat')}
          >
            <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>Live Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'strategies' && styles.activeTab]}
            onPress={() => setActiveTab('strategies')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.tabText, activeTab === 'strategies' && styles.activeTabText]}>Strategies</Text>
              <View style={styles.notificationDot} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.contentArea}>
          {activeTab === 'chat' ? (
            <>
              {/* Pinned Message */}
              <View style={styles.pinnedMessage}>
                <View style={styles.pinnedHeader}>
                  <MaterialIcons name="push-pin" size={14} color={Colors.background} />
                  <Text style={styles.pinnedTitle}>Pinned by Instructor</Text>
                </View>
                <Text style={styles.pinnedText}>Avoid overtrading today. Markets are highly volatile due to RBI policy announcement.</Text>
              </View>

              <ScrollView style={styles.chatScroll} contentContainerStyle={{ padding: 16 }}>
                {DUMMY_CHAT.map((msg) => (
                  <View key={msg.id} style={styles.chatMessage}>
                    <View style={styles.chatHeader}>
                      <Text style={[
                        styles.chatUser, 
                        msg.isInstructor && styles.instructorUser,
                        msg.isSystem && styles.systemUser
                      ]}>
                        {msg.user}
                        {msg.isInstructor && !msg.isSystem && <MaterialIcons name="verified" size={12} color={Colors.primary} style={{ marginLeft: 4 }} />}
                      </Text>
                      <Text style={styles.chatTime}>{msg.time}</Text>
                    </View>
                    <Text style={[
                      styles.chatText,
                      msg.isInstructor && styles.instructorText,
                      msg.isSystem && styles.systemText
                    ]}>{msg.text}</Text>
                  </View>
                ))}
              </ScrollView>

              {/* Chat Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Chat publicly..."
                  placeholderTextColor={Colors.textSecondary}
                  value={message}
                  onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton}>
                  <Feather name="send" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <ScrollView style={styles.strategiesScroll} contentContainerStyle={{ padding: 16, gap: 16 }}>
              {DUMMY_STRATEGIES.map((strategy) => (
                <View key={strategy.id} style={styles.strategyCard}>
                  <View style={styles.strategyHeader}>
                    <Text style={styles.strategyTitle}>{strategy.title}</Text>
                    <View style={[styles.statusBadge, strategy.status === 'ACTIVE' ? styles.statusActive : styles.statusCompleted]}>
                      <Text style={styles.statusText}>{strategy.status}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.strategyRow}>
                    <View style={styles.strategyStat}>
                      <Text style={styles.strategyStatLabel}>Action</Text>
                      <Text style={[styles.strategyStatValue, { color: strategy.type === 'BUY' ? Colors.success : Colors.loss }]}>
                        {strategy.type}
                      </Text>
                    </View>
                    <View style={styles.strategyStat}>
                      <Text style={styles.strategyStatLabel}>Entry Price</Text>
                      <Text style={styles.strategyStatValue}>{strategy.entry}</Text>
                    </View>
                  </View>

                  <View style={styles.strategyRow}>
                    <View style={styles.strategyStat}>
                      <Text style={styles.strategyStatLabel}>Target</Text>
                      <Text style={[styles.strategyStatValue, { color: Colors.success }]}>{strategy.target}</Text>
                    </View>
                    <View style={styles.strategyStat}>
                      <Text style={styles.strategyStatLabel}>Stop Loss</Text>
                      <Text style={[styles.strategyStatValue, { color: Colors.loss }]}>{strategy.stopLoss}</Text>
                    </View>
                  </View>
                  
                  {strategy.status === 'ACTIVE' && (
                    <TouchableOpacity style={styles.executeButton}>
                      <Text style={styles.executeButtonText}>Execute in Paper Trading</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
          )}
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#111',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  videoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoWatermark: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    letterSpacing: 2,
  },
  videoOverlayTop: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  liveText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 6,
  },
  viewersText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  streamInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  streamTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  streamInstructor: {
    ...Typography.caption,
    color: Colors.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  notificationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.loss,
  },
  contentArea: {
    flex: 1,
  },
  pinnedMessage: {
    backgroundColor: Colors.primary,
    padding: 12,
  },
  pinnedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  pinnedTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.background,
  },
  pinnedText: {
    fontSize: 14,
    color: Colors.background,
    fontWeight: '500',
  },
  chatScroll: {
    flex: 1,
  },
  chatMessage: {
    marginBottom: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatUser: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  instructorUser: {
    color: Colors.primary,
  },
  systemUser: {
    color: Colors.warning,
  },
  chatTime: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  chatText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  instructorText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  systemText: {
    color: Colors.warning,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.cardSecondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 12,
  },
  sendButton: {
    padding: 8,
  },
  strategiesScroll: {
    flex: 1,
  },
  strategyCard: {
    backgroundColor: Colors.cardSecondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  strategyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  strategyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: Colors.success + '26',
  },
  statusCompleted: {
    backgroundColor: Colors.textSecondary + '26',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  strategyRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  strategyStat: {
    flex: 1,
  },
  strategyStatLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  strategyStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  executeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  executeButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
