import { ProfileTheme } from '@/components/profile/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, FlatList, ActivityIndicator, Alert } from 'react-native';
import { brokerService } from '../../../src/services/brokerService';
import { tradeJournalService } from '../../../src/services/tradeJournalService';

export default function AddTradeScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    symbol: '',
    market: 'NSE',
    broker: '',
    type: 'BUY',
    quantity: '',
    entryPrice: '',
    exitPrice: '',
    strategy: 'Price Action',
    preTradeEmotion: 'Calm',
    postTradeEmotion: 'Disciplined',
    mistakeTag: 'None',
    notes: '',
    segment: 'Cash',
    tradeType: 'Intraday',
    stopLoss: '',
    targetPrice: '',
    riskReward: '',
    pnlType: 'Profit',
    pnlValue: '',
    tradeResult: 'Pending',
    tradeEntryTime: '',
    tradeExitTime: '',
    remark1: '',
    remark2: '',
  });

  useEffect(() => {
    if (editId) {
      const fetchTrade = async () => {
        try {
          const response = await tradeJournalService.getById(editId as string);
          const t = response.data?.data || response.data;
          if (t) {
            setFormData({
              date: t.date ? new Date(t.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              day: t.day || new Date().toLocaleDateString('en-US', { weekday: 'long' }),
              symbol: t.symbol || '',
              market: t.market || 'NSE',
              broker: t.broker || '',
              type: t.type || 'BUY',
              quantity: t.quantity ? String(t.quantity) : '',
              entryPrice: t.entry_price ? String(t.entry_price) : '',
              exitPrice: t.exit_price ? String(t.exit_price) : '',
              strategy: t.strategy_used || 'Price Action',
              preTradeEmotion: t.pre_trade_emotion || 'Calm',
              postTradeEmotion: t.post_trade_emotion || 'Disciplined',
              mistakeTag: t.mistake_tag || 'None',
              notes: t.notes || '',
              segment: t.segment || 'Cash',
              tradeType: t.trade_type || 'Intraday',
              stopLoss: t.stop_loss ? String(t.stop_loss) : '',
              targetPrice: t.target_price ? String(t.target_price) : '',
              riskReward: t.risk_reward ? String(t.risk_reward) : '',
              pnlType: t.pnl && t.pnl < 0 ? 'Loss' : 'Profit',
              pnlValue: t.pnl ? String(Math.abs(t.pnl)) : '',
              tradeResult: t.trade_result || 'Pending',
              tradeEntryTime: t.trade_entry_time || '',
              tradeExitTime: t.trade_exit_time || '',
              remark1: t.remark_1 || '',
              remark2: t.remark_2 || '',
            });
          }
        } catch (err) {
          console.error("Failed to fetch edit trade", err);
        }
      };
      fetchTrade();
    }
  }, [editId]);

  const [brokers, setBrokers] = useState([]);
  const [isLoadingBrokers, setIsLoadingBrokers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selector Modal State
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [selectOptions, setSelectOptions] = useState<{label: string, value: string}[]>([]);
  const [selectKey, setSelectKey] = useState<string>('');
  const [selectTitle, setSelectTitle] = useState('');

  useEffect(() => {
    const fetchBrokers = async () => {
      setIsLoadingBrokers(true);
      try {
        const response = await brokerService.getActive();
        const brokerList = response.data?.data || response.data || [];
        setBrokers(brokerList.map((b: any) => ({ label: b.name, value: b.name })));
        if (brokerList.length > 0) {
          setFormData(prev => ({ ...prev, broker: brokerList[0].name }));
        }
      } catch (error) {
        console.error('Failed to fetch brokers:', error);
      } finally {
        setIsLoadingBrokers(false);
      }
    };
    fetchBrokers();
  }, []);

  const handleSave = async () => {
    if (!formData.symbol || !formData.entryPrice || !formData.quantity || !formData.date) {
      Alert.alert('Missing Fields', 'Please fill in Date, Symbol, Quantity, and Entry Price.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      date: formData.date,
      day: formData.day,
      symbol: formData.symbol,
      segment: formData.segment,
      market: formData.market,
      broker: formData.broker,
      type: formData.type,
      trade_type: formData.tradeType,
      quantity: Number(formData.quantity),
      entry_price: Number(formData.entryPrice),
      stop_loss: formData.stopLoss ? Number(formData.stopLoss) : undefined,
      target_price: formData.targetPrice ? Number(formData.targetPrice) : undefined,
      risk_reward: formData.riskReward !== '' ? Number(formData.riskReward) : undefined,
      exit_price: formData.exitPrice ? Number(formData.exitPrice) : undefined,
      pnl: formData.pnlValue !== '' ? (formData.pnlType === 'Loss' ? -Math.abs(Number(formData.pnlValue)) : Math.abs(Number(formData.pnlValue))) : undefined,
      trade_result: formData.tradeResult,
      trade_entry_time: formData.tradeEntryTime,
      trade_exit_time: formData.tradeExitTime,
      remark_1: formData.remark1,
      remark_2: formData.remark2,
      strategy_used: formData.strategy,
      pre_trade_emotion: formData.preTradeEmotion,
      post_trade_emotion: formData.postTradeEmotion,
      mistake_tag: formData.mistakeTag,
      notes: formData.notes,
    };

    try {
      let response;
      if (editId) {
        response = await tradeJournalService.update(editId as string, payload);
      } else {
        response = await tradeJournalService.create(payload);
      }
      if (response.data?.success) {
        Alert.alert('Success', editId ? 'Trade updated successfully!' : 'Trade logged successfully!');
        router.back();
      } else {
        Alert.alert('Error', response.data?.message || 'Failed to save trade.');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSelect = (key: string, title: string, options: {label: string, value: string}[]) => {
    setSelectKey(key);
    setSelectTitle(title);
    setSelectOptions(options);
    setIsSelectVisible(true);
  };

  const handleOptionSelect = (value: string) => {
    setFormData(prev => ({ ...prev, [selectKey]: value }));
    setIsSelectVisible(false);
  };

  const renderSelectRow = (label: string, key: string, options: {label: string, value: string}[]) => {
    const selectedOption = options.find(o => o.value === (formData as any)[key]);
    return (
      <TouchableOpacity 
        style={styles.inlineSelectRow} 
        activeOpacity={0.7} 
        onPress={() => openSelect(key, label, options)}
      >
        <Text style={styles.selectRowLabel}>{label}</Text>
        <View style={styles.selectRight}>
          <Text style={styles.selectValueText}>{selectedOption ? selectedOption.label : 'Select'}</Text>
          <Feather name="chevron-right" size={12} color="#333333" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7} disabled={isSubmitting}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editId ? 'Edit Position' : 'Log Position'}</Text>
        <TouchableOpacity onPress={handleSave} activeOpacity={0.7} disabled={isSubmitting}>
          {isSubmitting ? (
             <ActivityIndicator size="small" color="#A8FF3E" />
          ) : (
            <Text style={styles.saveActionText}>Commit</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>

          <View style={styles.typeSelectorRow}>
            <Text style={styles.inlineLabel}>Position Direction</Text>
            <View style={styles.typeToggleGroup}>
              <TouchableOpacity
                style={styles.toggleBtn}
                onPress={() => setFormData({...formData, type: 'BUY'})}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleBtnText, formData.type === 'BUY' && styles.activeLongText]}>LONG (BUY)</Text>
              </TouchableOpacity>
              <View style={styles.verticalSpacer} />
              <TouchableOpacity
                style={styles.toggleBtn}
                onPress={() => setFormData({...formData, type: 'SELL'})}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleBtnText, formData.type === 'SELL' && styles.activeShortText]}>SHORT (SELL)</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Trade Date</Text>
              <TextInput
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#333333"
                value={formData.date}
                onChangeText={(val) => {
                  let newDay = formData.day;
                  const d = new Date(val);
                  if (!isNaN(d.getTime())) {
                    newDay = d.toLocaleDateString('en-US', { weekday: 'long' });
                  }
                  setFormData({...formData, date: val, day: newDay});
                }}
                style={[styles.input, styles.monoText]}
              />
            </View>
            <View style={styles.colSpacer} />
            <View style={styles.col}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor="#333333"
                keyboardType="numeric"
                value={formData.quantity}
                onChangeText={(val) => setFormData({...formData, quantity: val})}
                style={[styles.input, styles.monoText]}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Instrument / Symbol</Text>
            <TextInput
              placeholder="e.g. NIFTY, BANKNIFTY, RELIANCE"
              placeholderTextColor="#333333"
              value={formData.symbol}
              onChangeText={(val) => setFormData({...formData, symbol: val})}
              style={styles.input}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Entry Price</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#333333"
                keyboardType="decimal-pad"
                value={formData.entryPrice}
                onChangeText={(val) => setFormData({...formData, entryPrice: val})}
                style={[styles.input, styles.monoText]}
              />
            </View>
            <View style={styles.colSpacer} />
            <View style={styles.col}>
              <Text style={styles.label}>Exit Price (Optional)</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#333333"
                keyboardType="decimal-pad"
                value={formData.exitPrice}
                onChangeText={(val) => setFormData({...formData, exitPrice: val})}
                style={[styles.input, styles.monoText]}
              />
            </View>
          </View>

          {renderSelectRow('Market', 'market', [
            { label: 'NSE', value: 'NSE' },
            { label: 'BSE', value: 'BSE' },
            { label: 'MCX', value: 'MCX' }
          ])}

          {renderSelectRow('Segment', 'segment', [
            { label: 'Cash', value: 'Cash' },
            { label: 'Crypto', value: 'Crypto' },
            { label: 'Futures', value: 'Futures' },
            { label: 'Options', value: 'Options' }
          ])}

          {renderSelectRow('Trade Type', 'tradeType', [
            { label: 'Intraday', value: 'Intraday' },
            { label: 'Delivery', value: 'Delivery' }
          ])}

          {/* {renderSelectRow('Broker', 'broker', isLoadingBrokers ? [{label: 'Loading...', value: ''}] : brokers)} */}

          <View style={styles.separatorContainer}>
            <Text style={styles.separatorText}>Targets & Stops</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Stop Loss</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#333333"
                keyboardType="decimal-pad"
                value={formData.stopLoss}
                onChangeText={(val) => setFormData({...formData, stopLoss: val})}
                style={[styles.input, styles.monoText]}
              />
            </View>
            <View style={styles.colSpacer} />
            <View style={styles.col}>
              <Text style={styles.label}>Target Price</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#333333"
                keyboardType="decimal-pad"
                value={formData.targetPrice}
                onChangeText={(val) => setFormData({...formData, targetPrice: val})}
                style={[styles.input, styles.monoText]}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Risk : Reward</Text>
              <TextInput
                placeholder="e.g. 2"
                placeholderTextColor="#333333"
                keyboardType="decimal-pad"
                value={formData.riskReward}
                onChangeText={(val) => setFormData({...formData, riskReward: val})}
                style={[styles.input, styles.monoText]}
              />
            </View>
            <View style={styles.colSpacer} />
            <View style={styles.col}>
              <Text style={styles.label}>P&L Value</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#333333"
                keyboardType="decimal-pad"
                value={formData.pnlValue}
                onChangeText={(val) => setFormData({...formData, pnlValue: val})}
                style={[styles.input, styles.monoText]}
              />
            </View>
          </View>

          {renderSelectRow('P&L Type', 'pnlType', [
            { label: 'Profit', value: 'Profit' },
            { label: 'Loss', value: 'Loss' }
          ])}

          {renderSelectRow('Trade Result', 'tradeResult', [
            { label: 'Pending', value: 'Pending' },
            { label: 'Target', value: 'Target' },
            { label: 'Stoploss', value: 'Stoploss' }
          ])}

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Entry Time</Text>
              <TextInput
                placeholder="HH:MM"
                placeholderTextColor="#333333"
                value={formData.tradeEntryTime}
                onChangeText={(val) => setFormData({...formData, tradeEntryTime: val})}
                style={[styles.input, styles.monoText]}
              />
            </View>
            <View style={styles.colSpacer} />
            <View style={styles.col}>
              <Text style={styles.label}>Exit Time</Text>
              <TextInput
                placeholder="HH:MM"
                placeholderTextColor="#333333"
                value={formData.tradeExitTime}
                onChangeText={(val) => setFormData({...formData, tradeExitTime: val})}
                style={[styles.input, styles.monoText]}
              />
            </View>
          </View>

          <View style={styles.separatorContainer}>
            <Text style={styles.separatorText}>Strategy & Tags</Text>
          </View>

          {renderSelectRow('Strategy Used', 'strategy', [
            { label: 'Breakout', value: 'Breakout' },
            { label: 'Scalping', value: 'Scalping' },
            { label: 'Swing', value: 'Swing' },
            { label: 'Price Action', value: 'Price Action' },
            { label: 'EMA Cross', value: 'EMA Cross' }
          ])}
          
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Remark 1</Text>
              <TextInput
                placeholder="e.g. GG/BG"
                placeholderTextColor="#333333"
                value={formData.remark1}
                onChangeText={(val) => setFormData({...formData, remark1: val})}
                style={[styles.input, styles.monoText]}
              />
            </View>
            <View style={styles.colSpacer} />
            <View style={styles.col}>
              <Text style={styles.label}>Remark 2</Text>
              <TextInput
                placeholder="Optional"
                placeholderTextColor="#333333"
                value={formData.remark2}
                onChangeText={(val) => setFormData({...formData, remark2: val})}
                style={[styles.input, styles.monoText]}
              />
            </View>
          </View>

          {/* <View style={styles.separatorContainer}>
            <Text style={styles.separatorText}>Psychology & Diary</Text>
          </View>

          {renderSelectRow('Pre-Trade Emotion', 'preTradeEmotion', [
            { label: 'Calm / Neutral', value: 'Calm' },
            { label: 'FOMO', value: 'FOMO' },
            { label: 'Greedy / Aggressive', value: 'Greedy' },
            { label: 'Anxious / Scared', value: 'Anxious' },
            { label: 'Revenge Mentality', value: 'Revenge' }
          ])}

          {renderSelectRow('Post-Trade Emotion', 'postTradeEmotion', [
            { label: 'Disciplined (Followed Plan)', value: 'Disciplined' },
            { label: 'Relieved', value: 'Relieved' },
            { label: 'Angry / Frustrated', value: 'Angry' },
            { label: 'Overconfident', value: 'Overconfident' }
          ])}

          {renderSelectRow('Error / Mistake Tag', 'mistakeTag', [
            { label: 'Perfect Execution (No Mistakes)', value: 'None' },
            { label: 'Early Entry (FOMO)', value: 'FOMO Entry' },
            { label: 'Chasing a Running Candle', value: 'Chasing Market' },
            { label: 'Moved or Removed Stop Loss', value: 'Moved SL' },
            { label: 'Overtrading / High Risk', value: 'Overtrading' },
            { label: 'Panic Exit (Cut profits early)', value: 'Early Exit' }
          ])} */}

          <View style={styles.notesGroup}>
            <Text style={styles.label}>Journal Log Notes</Text>
            <TextInput
              placeholder="Why did you take this trade? What did the market teach you today?"
              placeholderTextColor="#333333"
              value={formData.notes}
              onChangeText={(val) => setFormData({...formData, notes: val})}
              multiline
              style={styles.textArea}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Select Modal */}
      <Modal visible={isSelectVisible} transparent animationType="slide" onRequestClose={() => setIsSelectVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectTitle}</Text>
              <TouchableOpacity onPress={() => setIsSelectVisible(false)} style={{ padding: 4 }}>
                <Feather name="x" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={selectOptions}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalOptionBtn} onPress={() => handleOptionSelect(item.value)}>
                  <Text style={[styles.modalOptionText, (formData as any)[selectKey] === item.value && styles.activeModalOptionText]}>
                    {item.label}
                  </Text>
                  {(formData as any)[selectKey] === item.value && (
                    <Feather name="check" size={16} color="#A8FF3E" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  headerArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 56 : 20, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#1C1C1E' },
  backButton: { paddingVertical: 4 },
  headerTitle: { fontSize: 15, fontWeight: '600', color: '#ffffff', letterSpacing: -0.2 },
  saveActionText: { fontSize: 14, fontWeight: '600', color: '#A8FF3E' },
  formContainer: { flex: 1 },
  formContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  typeSelectorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderColor: '#141414', marginBottom: 16 },
  inlineLabel: { fontSize: 13, color: '#888888' },
  typeToggleGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleBtn: { paddingVertical: 4, paddingHorizontal: 4 },
  toggleBtnText: { fontSize: 13, fontWeight: '500', color: '#333333', letterSpacing: 0.3 },
  activeLongText: { color: '#A8FF3E', fontWeight: '600' },
  activeShortText: { color: '#FF5252', fontWeight: '600' },
  verticalSpacer: { width: 1, height: 12, backgroundColor: '#1C1C1E' },
  formGroup: { marginBottom: 24 },
  row: { flexDirection: 'row', marginBottom: 24 },
  col: { flex: 1 },
  colSpacer: { width: 24 },
  label: { fontSize: 11, fontWeight: '500', color: '#555555', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  input: { borderBottomWidth: 1, borderColor: '#141414', paddingVertical: 8, fontSize: 15, color: '#ffffff' },
  monoText: { fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }), fontSize: 14 },
  separatorContainer: { borderTopWidth: 1, borderColor: '#222222', paddingTop: 16, marginTop: 8, marginBottom: 8 },
  separatorText: { fontSize: 11, fontWeight: '600', color: '#A8FF3E', textTransform: 'uppercase', letterSpacing: 0.8 },
  inlineSelectRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderColor: '#121212' },
  selectRowLabel: { fontSize: 14, color: '#E5E5E5' },
  selectRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  selectValueText: { fontSize: 13, color: '#555555' },
  notesGroup: { marginTop: 24 },
  textArea: { paddingVertical: 10, fontSize: 14, color: '#ffffff', lineHeight: 20, minHeight: 100, textAlignVertical: 'top', backgroundColor: '#1a1a1a', borderRadius: 12, paddingHorizontal: 12, marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#111', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  modalOptionBtn: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderColor: '#222' },
  modalOptionText: { fontSize: 15, color: '#ccc' },
  activeModalOptionText: { color: '#A8FF3E', fontWeight: '600' }
});