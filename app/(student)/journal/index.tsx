import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, KeyboardAvoidingView, TextInput } from 'react-native';
import { Colors } from '../../../src/constants/Colors';

import { tradeJournalService } from '../../../src/services/tradeJournalService';
import { journalNoteService } from '../../../src/services/journalNoteService';

export default function JournalDashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [trades, setTrades] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '', type: 'lesson' });
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const slideAnim = useRef(new Animated.Value(20)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Premium Shimmer Effect Animation Instance
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Infinite looping shimmer wave movement
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1200, // Speed optimized for fast and snappy response
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Maps coordinates cleanly across button bounds
  const shimmerTranslateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-250, 250],
  });

  useFocusEffect(
    useCallback(() => {
      slideAnim.setValue(20);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        })
      ]).start();

      const fetchTradesAndNotes = async () => {
        try {
          const [resTrades, resNotes] = await Promise.all([
            tradeJournalService.getAll(),
            journalNoteService.getAll()
          ]);
          setTrades(resTrades.data?.data || resTrades.data || []);
          setNotes(resNotes.data?.data || resNotes.data || []);
        } catch (e) {
          console.error("Failed to fetch data", e);
        }
      };
      fetchTradesAndNotes();
    }, [slideAnim, fadeAnim])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [resTrades, resNotes] = await Promise.all([
        tradeJournalService.getAll(),
        journalNoteService.getAll()
      ]);
      setTrades(resTrades.data?.data || resTrades.data || []);
      setNotes(resNotes.data?.data || resNotes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Dynamic Metric Calculations
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.pnl > 0 || t.status === 'WIN' || t.trade_result === 'Target').length;
  const losingTrades = trades.filter(t => t.pnl < 0 || t.status === 'LOSS' || t.trade_result === 'Stoploss').length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : '0.0';
  
  const totalProfit = trades.reduce((sum, t) => sum + (t.pnl > 0 ? t.pnl : 0), 0);
  const totalLoss = trades.reduce((sum, t) => sum + (t.pnl < 0 ? Math.abs(t.pnl) : 0), 0);
  const netPnL = totalProfit - totalLoss;

  let totalRR = 0;
  let validRRCount = 0;
  trades.forEach(t => {
    if (t.risk_reward) {
      const parts = String(t.risk_reward).split(':');
      let val = null;
      if (parts.length === 2) {
        val = parseFloat(parts[1]);
      } else {
        val = parseFloat(parts[0]);
      }
      if (!isNaN(val) && val !== null) {
        totalRR += val;
        validRRCount++;
      }
    }
  });
  const avgRR = validRRCount > 0 ? (totalRR / validRRCount).toFixed(1) : '0.0';

  const mistakeCounts: { [key: string]: number } = {};
  trades.forEach(t => {
    if (t.mistake_tag && t.mistake_tag !== 'None') {
      mistakeCounts[t.mistake_tag] = (mistakeCounts[t.mistake_tag] || 0) + 1;
    }
  });
  
  let topMistake = 'None';
  let topMistakeCount = 0;
  Object.keys(mistakeCounts).forEach(m => {
    if (mistakeCounts[m] > topMistakeCount) {
      topMistake = m;
      topMistakeCount = mistakeCounts[m];
    }
  });

  const handleSaveNote = async () => {
    if (!noteForm.title || !noteForm.content) return;
    setIsSubmittingNote(true);
    try {
      if (editingNote) {
        await journalNoteService.update(editingNote._id, noteForm);
      } else {
        await journalNoteService.create(noteForm);
      }
      setIsNoteModalVisible(false);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await journalNoteService.delete(id);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };
  
  const openAddNote = () => {
    setEditingNote(null);
    setNoteForm({ title: '', content: '', type: 'lesson' });
    setIsNoteModalVisible(true);
  };

  const openEditNote = (note: any) => {
    setEditingNote(note);
    setNoteForm({ title: note.title, content: note.content, type: note.type || 'lesson' });
    setIsNoteModalVisible(true);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} colors={[Colors.primary]} />
      }
    >
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

        {/* Header Layout */}
        <View style={styles.headerArea}>
          <View>
            <Text style={styles.title}>Trading Journal</Text>
            <Text style={styles.subtitle}>Track, analyze, and improve</Text>
          </View>
          <TouchableOpacity
            style={styles.analyticsIconBtn}
            onPress={() => router.push('/(student)/journal/analytics')}
            activeOpacity={0.7}
          >
            <Feather name="pie-chart" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* High-Density Typography Metrics Dashboard */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Win Rate</Text>
              <Text style={styles.metricValue}>{winRate}%</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Total Trades</Text>
              <Text style={styles.metricValue}>{totalTrades}</Text>
            </View>
          </View>

          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Avg R:R Ratio</Text>
              <Text style={styles.metricValue}>1:{avgRR}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Net PnL</Text>
              <Text style={[styles.metricValue, { color: netPnL >= 0 ? '#A8FF3E' : '#FF5252' }]}>
                {netPnL >= 0 ? '+' : '-'}₹{Math.abs(netPnL).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Trigger Block with Active Shimmer Layer */}
        <TouchableOpacity
          style={styles.logButton}
          onPress={() => router.push('/(student)/journal/add-trade')}
          activeOpacity={0.8}
        >
          {/* Animated Light Sweep Overlay Mask */}
          <Animated.View
            style={[
              styles.buttonShimmerWave,
              { transform: [{ translateX: shimmerTranslateX }, { rotate: '20deg' }] }
            ]}
          />
          <Feather name="plus" size={14} color="#000000" style={styles.btnIconZIndex} />
          <Text style={styles.logButtonText}>Log New Position</Text>
        </TouchableOpacity>

        {/* System Weakness Overview Box */}
        <View style={styles.mistakesSection}>
          <Text style={styles.sectionTitle}>Top Mistake This Week</Text>
          <View style={styles.mistakeBox}>
            <View style={styles.mistakeMeta}>
              <Text style={styles.mistakeTitle}>{topMistake === 'None' ? 'No Mistakes Logged' : topMistake}</Text>
              <Text style={styles.mistakeCount}>{topMistake === 'None' ? 'Perfect execution!' : `Recorded ${topMistakeCount} times`}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(student)/ai-coach')} activeOpacity={0.7}>
              <Text style={styles.aiReviewText}>AI Review</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statement-Style Positions List */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Positions</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tradeList}>
            {trades.map((trade, index) => {
              const isProfit = trade.status === 'WIN';
              const isOpen = trade.status === 'OPEN';
              
              const tradeDate = new Date(trade.date);
              const dateStr = tradeDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return (
                <TouchableOpacity
                  key={trade._id}
                  style={[styles.tradeRow, index === trades.length - 1 && styles.noBorder]}
                  onPress={() => router.push(`/(student)/journal/${trade._id}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.tradeLeft}>
                    <Text style={[styles.directionIndicator, { color: trade.type === 'BUY' ? '#A8FF3E' : '#FF5252' }]}>
                      {trade.type === 'BUY' ? '▲' : '▼'}
                    </Text>
                    <View style={styles.instrumentDetails}>
                      <Text style={styles.instrumentText}>{trade.symbol}</Text>
                      <Text style={styles.tradeSubMeta}>
                        {dateStr} <Text style={styles.monoMeta}>• {trade.pre_trade_emotion || 'Neutral'}</Text>
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.pnlText, { color: isOpen ? '#ffffff' : (isProfit ? '#A8FF3E' : '#FF5252') }]}>
                    {isOpen ? 'OPEN' : `${isProfit ? '+' : '-'}₹${Math.abs(trade.pnl || 0).toLocaleString()}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Global Journal Notes Section */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Global Journal Notes</Text>
            <TouchableOpacity onPress={openAddNote} activeOpacity={0.7}>
              <Text style={[styles.filterText, { color: '#A8FF3E' }]}>+ Add Note</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tradeList}>
            {notes.length === 0 ? (
              <Text style={{ color: '#555555', fontSize: 13, textAlign: 'center', paddingVertical: 20 }}>No notes found.</Text>
            ) : notes.map((note, index) => (
              <View key={note._id} style={[styles.tradeRow, index === notes.length - 1 && styles.noBorder, { flexDirection: 'column', alignItems: 'stretch' }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: note.type === 'lesson' ? '#3b82f6' : '#8b5cf6', textTransform: 'uppercase', borderWidth: 1, borderColor: note.type === 'lesson' ? '#3b82f640' : '#8b5cf640', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>{note.type || 'lesson'}</Text>
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>{note.title}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity onPress={() => openEditNote(note)}><Feather name="edit-2" size={14} color="#888" /></TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteNote(note._id)}><Feather name="trash-2" size={14} color="#FF5252" /></TouchableOpacity>
                  </View>
                </View>
                <Text style={{ color: '#aaa', fontSize: 13, lineHeight: 18, marginBottom: 8 }}>{note.content}</Text>
                <Text style={{ color: '#555', fontSize: 11 }}>{new Date(note.date || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
              </View>
            ))}
          </View>
        </View>

      </Animated.View>

      {/* Note Modal */}
      <Modal visible={isNoteModalVisible} transparent animationType="slide" onRequestClose={() => setIsNoteModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingNote ? 'Edit Note' : 'Add Journal Note'}</Text>
              <TouchableOpacity onPress={() => setIsNoteModalVisible(false)} style={{ padding: 4 }}>
                <Feather name="x" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.noteTypeRow}>
              <TouchableOpacity style={[styles.typeBtn, noteForm.type === 'lesson' && styles.typeBtnActive]} onPress={() => setNoteForm({...noteForm, type: 'lesson'})}>
                <Text style={[styles.typeBtnText, noteForm.type === 'lesson' && styles.typeBtnTextActive]}>Lesson</Text>
              </TouchableOpacity>
              <View style={{width: 12}} />
              <TouchableOpacity style={[styles.typeBtn, noteForm.type === 'observation' && styles.typeBtnActive]} onPress={() => setNoteForm({...noteForm, type: 'observation'})}>
                <Text style={[styles.typeBtnText, noteForm.type === 'observation' && styles.typeBtnTextActive]}>Observation</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Title"
              placeholderTextColor="#555"
              value={noteForm.title}
              onChangeText={(val) => setNoteForm({...noteForm, title: val})}
            />
            <TextInput
              style={[styles.modalInput, { minHeight: 100, textAlignVertical: 'top' }]}
              placeholder="Content..."
              placeholderTextColor="#555"
              multiline
              value={noteForm.content}
              onChangeText={(val) => setNoteForm({...noteForm, content: val})}
            />

            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveNote} disabled={isSubmittingNote}>
              <Text style={styles.modalSaveBtnText}>{isSubmittingNote ? 'Saving...' : 'Save Note'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  headerArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
  },
  analyticsIconBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 8,
  },
  metricsContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
  },
  metricRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#141414',
  },
  metricItem: {
    flex: 1,
    padding: 14,
    borderRightWidth: 1,
    borderColor: '#141414',
  },
  metricLabel: {
    fontSize: 11,
    color: '#555555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.1,
  },
  logButton: {
    flexDirection: 'row',
    backgroundColor: '#A8FF3E',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
    position: 'relative', // Contains absolute nested mask positioning bounds
    overflow: 'hidden', // Clips absolute glossy masks cleanly inside borders
  },
  logButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    zIndex: 2, // Keeps text rendering safely above animation stream
  },
  btnIconZIndex: {
    zIndex: 2,
  },
  buttonShimmerWave: {
    position: 'absolute',
    top: -24,
    bottom: -24,
    width: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.38)', // Glossy sweeping linear strip
    zIndex: 1,
  },
  mistakesSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  mistakeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
  },
  mistakeMeta: {
    flex: 1,
  },
  mistakeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 2,
  },
  mistakeCount: {
    fontSize: 12,
    color: '#555555',
  },
  aiReviewText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A8FF3E',
  },
  historySection: {
    marginBottom: 16,
  },
  filterText: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tradeList: {
    marginTop: 4,
  },
  tradeRow: {
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
  tradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  directionIndicator: {
    fontSize: 10,
    width: 18,
    textAlign: 'left',
  },
  instrumentDetails: {
    flex: 1,
    paddingRight: 16,
  },
  instrumentText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.1,
    marginBottom: 3,
  },
  tradeSubMeta: {
    fontSize: 12,
    color: '#555555',
  },
  monoMeta: {
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
    fontSize: 11,
  },
  pnlText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#111', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  noteTypeRow: { flexDirection: 'row', marginBottom: 16 },
  modalInput: { borderWidth: 1, borderColor: '#222', borderRadius: 8, padding: 12, color: '#fff', fontSize: 14, marginBottom: 16 },
  modalSaveBtn: { backgroundColor: '#A8FF3E', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  modalSaveBtnText: { color: '#000', fontSize: 14, fontWeight: '600' },
  typeBtn: { flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: '#222', borderRadius: 8, alignItems: 'center' },
  typeBtnActive: { borderColor: '#A8FF3E', backgroundColor: '#A8FF3E15' },
  typeBtnText: { color: '#888', fontSize: 13, fontWeight: '500' },
  typeBtnTextActive: { color: '#A8FF3E' },
});