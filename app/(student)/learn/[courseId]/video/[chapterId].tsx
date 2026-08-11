import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DUMMY_COMMENTS = [
  { id: '1', user: 'Rahul Verma', text: 'Can you explain the difference between a pin bar and a doji?', time: '2d ago' },
  { id: '2', user: 'Bimal Institute', text: 'Great question Rahul! A pin bar has a small body and a long tail, indicating strong rejection. A doji has almost no body, indicating indecision.', time: '1d ago', isInstructor: true },
];

const DUMMY_STRATEGIES = [
  { id: 's1', title: 'Engulfing Pattern Setup', type: 'BUY', target: '1.5x Risk', stopLoss: 'Below swing low', entry: 'On candle close', status: 'EDUCATIONAL' },
];

export default function VideoPlayerScreen() {
  const { courseId, chapterId } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'notes' | 'comments' | 'strategies'>('notes');
  const [noteText, setNoteText] = useState('');
  const [commentText, setCommentText] = useState('');

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* 1. High-Density Video Viewport Frame */}
      <View style={styles.videoPlayer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>

        <Feather name="play" size={44} color="#A8FF3E" style={styles.playIconCenter} />

        <View style={styles.videoControls}>
          <Text style={styles.timeText}>14:20 / 45:00</Text>
          <View style={styles.speedControl}>
            <Text style={styles.speedText}>1.5x</Text>
          </View>
        </View>
      </View>

      {/* 2. Left-Aligned Metadata Identity Panel */}
      <View style={styles.videoInfo}>
        <View style={styles.infoMetaRow}>
          <Text style={styles.videoSubtitle}>Advanced Price Action Mastery • Module 1</Text>
          <TouchableOpacity style={styles.markCompleteBtn} activeOpacity={0.7}>
            <View style={styles.pulseDot} />
            <Text style={styles.markCompleteText}>Mark Complete</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.videoTitle}>Understanding Market Structure</Text>
      </View>

      {/* 3. Flush Baseline Nav Tabs Grid */}
      <View style={styles.tabsContainer}>
        {(['notes', 'comments', 'strategies'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 4. Stream Render Outputs */}
      <ScrollView style={styles.tabContentContainer} showsVerticalScrollIndicator={false}>
        {activeTab === 'notes' && (
          <View style={styles.notesSection}>
            <View style={styles.fieldEntryBox}>
              <TextInput
                style={styles.terminalFieldInput}
                placeholder="Append a system log note..."
                placeholderTextColor="#333333"
                multiline
                value={noteText}
                onChangeText={setNoteText}
              />
              <TouchableOpacity style={styles.inlineActionBtn} activeOpacity={0.7}>
                <Text style={styles.inlineActionText}>Commit Note</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.savedNoteRow}>
              <Text style={styles.noteTimestamp}>[ 12:45 ]</Text>
              <Text style={styles.savedNoteText}>Remember that a break of structure (BOS) requires a body close above the previous high watermark.</Text>
            </View>
          </View>
        )}

        {activeTab === 'comments' && (
          <View style={styles.commentsSection}>
            <View style={styles.fieldEntryBox}>
              <TextInput
                style={styles.terminalFieldInput}
                placeholder="Broadcast a question to the stream channel..."
                placeholderTextColor="#333333"
                multiline
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity style={styles.inlineActionBtn} activeOpacity={0.7}>
                <Text style={styles.inlineActionText}>Broadcast</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.commentsStreamList}>
              {DUMMY_COMMENTS.map((comment) => (
                <View key={comment.id} style={styles.commentItemRow}>
                  <View style={styles.commentHeader}>
                    <View style={styles.userProfileIdentity}>
                      <Text style={[styles.commentUser, comment.isInstructor && styles.commentInstructor]}>
                        {comment.user}
                      </Text>
                      {comment.isInstructor && (
                        <Text style={styles.verifiedTokenTag}>[ VERIFIED ]</Text>
                      )}
                    </View>
                    <Text style={styles.commentTime}>{comment.time}</Text>
                  </View>
                  <Text style={styles.commentBodyText}>{comment.text}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'strategies' && (
          <View style={styles.strategiesSection}>
            {DUMMY_STRATEGIES.map((strategy) => (
              <View key={strategy.id} style={styles.terminalStrategyCard}>
                <View style={styles.strategyHeader}>
                  <Text style={styles.strategyTitleText}>{strategy.title}</Text>
                  <Text style={styles.strategyBadgeText}>//{strategy.status}</Text>
                </View>

                <View style={styles.strategyMatrixGrid}>
                  <View style={styles.matrixItem}>
                    <Text style={styles.matrixLabel}>Signal Trigger</Text>
                    <Text style={[styles.matrixValue, { color: strategy.type === 'BUY' ? '#A8FF3E' : '#FF5252' }]}>
                      {strategy.type === 'BUY' ? '▲ BUY' : '▼ SELL'}
                    </Text>
                  </View>
                  <View style={styles.matrixItem}>
                    <Text style={styles.matrixLabel}>Entry Parameter</Text>
                    <Text style={styles.matrixValue}>{strategy.entry}</Text>
                  </View>
                </View>

                <View style={[styles.strategyMatrixGrid, styles.noMarginBottom]}>
                  <View style={styles.matrixItem}>
                    <Text style={styles.matrixLabel}>Target Objective</Text>
                    <Text style={[styles.matrixValue, { color: '#A8FF3E' }]}>{strategy.target}</Text>
                  </View>
                  <View style={styles.matrixItem}>
                    <Text style={styles.matrixLabel}>Stop Allocation</Text>
                    <Text style={[styles.matrixValue, { color: '#FF5252' }]}>{strategy.stopLoss}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#050505',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 16,
    left: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
  },
  playIconCenter: {
    opacity: 0.9,
  },
  videoControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  timeText: {
    fontSize: 11,
    color: '#888888',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  speedControl: {
    backgroundColor: '#141414',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#222222',
  },
  speedText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '500',
  },
  videoInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#141414',
  },
  infoMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  videoSubtitle: {
    fontSize: 12,
    color: '#555555',
  },
  markCompleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  pulseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#A8FF3E',
  },
  markCompleteText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A8FF3E',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#141414',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 16,
    right: 16,
    height: 1.5,
    backgroundColor: '#A8FF3E',
  },
  tabText: {
    fontSize: 13,
    color: '#555555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  tabContentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  notesSection: {
    flex: 1,
  },
  fieldEntryBox: {
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  terminalFieldInput: {
    fontSize: 14,
    color: '#ffffff',
    minHeight: 60,
    textAlignVertical: 'top',
    paddingBottom: 8,
  },
  inlineActionBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  inlineActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A8FF3E',
  },
  savedNoteRow: {
    borderLeftWidth: 1,
    borderColor: '#1C1C1E',
    paddingLeft: 14,
    marginVertical: 4,
  },
  noteTimestamp: {
    fontSize: 11,
    color: '#444444',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
    marginBottom: 4,
  },
  savedNoteText: {
    fontSize: 14,
    color: '#888888',
    lineHeight: 18,
  },
  commentsSection: {
    flex: 1,
  },
  commentsStreamList: {
    gap: 4,
  },
  commentItemRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#121212',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userProfileIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  commentInstructor: {
    color: '#A8FF3E',
  },
  verifiedTokenTag: {
    fontSize: 9,
    color: '#A8FF3E',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  commentTime: {
    fontSize: 11,
    color: '#333333',
  },
  commentBodyText: {
    fontSize: 13,
    color: '#888888',
    lineHeight: 18,
  },
  strategiesSection: {
    flex: 1,
    gap: 12,
  },
  terminalStrategyCard: {
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
  },
  strategyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#141414',
  },
  strategyTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  strategyBadgeText: {
    fontSize: 10,
    color: '#555555',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  strategyMatrixGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  noMarginBottom: {
    marginBottom: 0,
  },
  matrixItem: {
    flex: 1,
  },
  matrixLabel: {
    fontSize: 11,
    color: '#444444',
    marginBottom: 2,
  },
  matrixValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#ffffff',
  },
});