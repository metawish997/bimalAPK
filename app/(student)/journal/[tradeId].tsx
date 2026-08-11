import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { tradeJournalService } from '../../../src/services/tradeJournalService';

export default function TradeDetailsScreen() {
  const { tradeId } = useLocalSearchParams();
  const router = useRouter();

  const [trade, setTrade] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        const response = await tradeJournalService.getById(tradeId as string);
        setTrade(response.data?.data || response.data);
      } catch (error: any) {
        console.error('Failed to load trade', error);
        Alert.alert('Error', 'Failed to load position details.');
      } finally {
        setIsLoading(false);
      }
    };
    if (tradeId) fetchTrade();
  }, [tradeId]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#A8FF3E" />
      </View>
    );
  }

  if (!trade) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Position not found.</Text>
      </View>
    );
  }

  const isProfit = trade.status === 'WIN';
  const isOpen = trade.status === 'OPEN';
  const tradeDate = new Date(trade.date);
  const dateFormatted = tradeDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const timeFormatted = tradeDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      {/* Editorial Navigation Header */}
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Position Ledger</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => trade && router.push(`/(student)/journal/add-trade?editId=${trade._id}`)} 
          activeOpacity={0.7}
        >
          <Feather name="edit-2" size={18} color={trade ? "#A8FF3E" : "transparent"} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Left-Aligned Hero Section */}
        <View style={styles.heroSummary}>
          <View style={styles.instrumentMetaRow}>
            <Text style={[styles.directionIndicator, { color: trade.type === 'BUY' ? '#A8FF3E' : '#FF5252' }]}>
              {trade.type === 'BUY' ? '▲' : '▼'} {trade.type === 'BUY' ? 'LONG' : 'SHORT'}
            </Text>
            <Text style={styles.instrumentText}>{trade.symbol}</Text>
          </View>

          <Text style={[styles.pnlText, { color: isOpen ? '#ffffff' : (isProfit ? '#A8FF3E' : '#FF5252') }]}>
            {isOpen ? 'OPEN' : `${isProfit ? '+' : '-'}₹${Math.abs(trade.pnl || 0).toLocaleString()}`}
          </Text>
          <Text style={styles.timestampText}>{dateFormatted} • {timeFormatted}</Text>
        </View>

        {/* High-Density Metric Mini Cards Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Position Parameters</Text>

          <View style={styles.miniCardGrid}>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>Entry Price</Text>
              <Text style={styles.miniCardValue}>₹{trade.entry_price}</Text>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>Exit Price</Text>
              <Text style={styles.miniCardValue}>{trade.exit_price ? `₹${trade.exit_price}` : 'OPEN'}</Text>
            </View>
          </View>

          <View style={styles.miniCardGrid}>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>Quantity</Text>
              <Text style={[styles.miniCardValue, { color: '#ffffff' }]}>{trade.quantity}</Text>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>Strategy</Text>
              <Text style={[styles.miniCardValue, { color: '#A8FF3E' }]}>{trade.strategy_used}</Text>
            </View>
          </View>

          <View style={styles.miniCardGrid}>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>Segment / Trade Type</Text>
              <Text style={[styles.miniCardValue, { color: '#ffffff' }]}>{trade.segment || 'Cash'} / {trade.trade_type || 'Intraday'}</Text>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>Stop Loss / Target</Text>
              <Text style={[styles.miniCardValue, { color: '#ffffff' }]}>{trade.stop_loss ? `₹${trade.stop_loss}` : '-'} / {trade.target_price ? `₹${trade.target_price}` : '-'}</Text>
            </View>
          </View>

          <View style={styles.miniCardGrid}>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>Risk : Reward</Text>
              <Text style={[styles.miniCardValue, { color: '#ffffff' }]}>{trade.risk_reward ? `1:${trade.risk_reward}` : '-'}</Text>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>Entry / Exit Time</Text>
              <Text style={[styles.miniCardValue, { color: '#ffffff' }]}>{trade.trade_entry_time || '-'} / {trade.trade_exit_time || '-'}</Text>
            </View>
          </View>

          <View style={styles.miniCardGrid}>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>Psychology (Pre / Post)</Text>
              <Text style={styles.miniCardValue}>{trade.pre_trade_emotion} / {trade.post_trade_emotion}</Text>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>Execution Fault</Text>
              <Text style={[styles.miniCardValue, { color: trade.mistake_tag === 'None' ? '#ffffff' : '#FF5252' }]}>
                {trade.mistake_tag}
              </Text>
            </View>
          </View>

          {(trade.remark_1 || trade.remark_2) && (
            <View style={styles.miniCardGrid}>
              <View style={styles.miniCard}>
                <Text style={styles.miniCardLabel}>Remark 1</Text>
                <Text style={[styles.miniCardValue, { color: '#ffffff' }]}>{trade.remark_1 || '-'}</Text>
              </View>
              <View style={styles.miniCard}>
                <Text style={styles.miniCardLabel}>Remark 2</Text>
                <Text style={[styles.miniCardValue, { color: '#ffffff' }]}>{trade.remark_2 || '-'}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Position Log Entry */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log Notes</Text>
          <Text style={styles.notesBodyText}>{trade.notes}</Text>
        </View>

        {/* AI Terminal Review Stream */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Analytics Stream</Text>
          <View style={styles.aiTerminalBox}>
            <View style={styles.aiHeaderRow}>
              <View style={styles.pulseDot} />
              <Text style={styles.aiLabel}>Analysis Evaluation Complete</Text>
            </View>
            <Text style={styles.aiReviewText}>
              {trade.mistake_tag !== 'None' 
                ? `System detected an execution fault: ${trade.mistake_tag}. Ensure you follow your setup rules next time to minimize risk.` 
                : 'Excellent execution with no critical mistakes flagged. Keep maintaining this discipline!'}
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#1C1C1E',
  },
  backButton: {
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroSummary: {
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderColor: '#141414',
    marginBottom: 20,
  },
  instrumentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  directionIndicator: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  instrumentText: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '400',
  },
  pnlText: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.5,
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  timestampText: {
    fontSize: 12,
    color: '#444444',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555555',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  miniCardGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  miniCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'transparent',
  },
  miniCardLabel: {
    fontSize: 11,
    color: '#444444',
    marginBottom: 4,
  },
  miniCardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.1,
  },
  attachmentStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
  },
  attachmentText: {
    fontSize: 13,
    color: '#666666',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  notesBodyText: {
    fontSize: 14,
    color: '#E5E5E5',
    lineHeight: 20,
    fontWeight: '400',
  },
  aiTerminalBox: {
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  pulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#A8FF3E',
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A8FF3E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiReviewText: {
    fontSize: 13,
    color: '#888888',
    lineHeight: 18,
  },
});