import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MessageType = 'text' | 'chart_analysis' | 'trade_review';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  type: MessageType;
  analysisData?: any;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'ai',
    type: 'text',
    text: "Hello! I'm your AI Trading Coach. I've been monitoring your portfolio.",
    timestamp: '10:00 AM'
  },
  {
    id: '2',
    sender: 'ai',
    type: 'trade_review',
    text: "Here is a breakdown of your performance this week. You hit your profit target, but your risk-reward ratio slipped on Wednesday.",
    timestamp: '10:00 AM',
    analysisData: {
      pnl: '+₹12,450',
      winRate: '68%',
      avgRR: '1:1.5',
      suggestion: 'Tighten trailing stop-losses during high volatility periods.'
    }
  },
  {
    id: '3',
    sender: 'user',
    type: 'text',
    text: "Can you analyze the NIFTY 50 chart I just uploaded?",
    timestamp: '10:02 AM'
  },
  {
    id: '4',
    sender: 'ai',
    type: 'chart_analysis',
    text: "I've analyzed the chart. We are seeing a strong rejection at the psychological 20,000 resistance level.",
    timestamp: '10:03 AM',
    analysisData: {
      instrument: 'NIFTY 50',
      timeframe: '15m',
      bias: 'Bearish',
      keyLevels: ['Support: 19,850', 'Resistance: 20,000'],
      confidence: 'High (85%)'
    }
  }
];

const SUGGESTIONS = [
  "Review last trade",
  "Market sentiment",
  "Risk parameters",
];

const AI_MODES = ['General', 'Trade Analysis', 'Risk Management'];

export default function AICoachScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState('General');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(20)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useFocusEffect(
    useCallback(() => {
      slideAnim.setValue(20);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true })
      ]).start();
    }, [slideAnim, fadeAnim])
  );

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.3, duration: 600, useNativeDriver: true })
        ])
      ).start();
    } else {
      glowAnim.setValue(0.3);
    }
  }, [isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      type: 'text',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const newAIMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        type: 'text',
        text: "I am actively monitoring the data streams. Let me know if you require a detailed ledger breakdown.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newAIMsg]);
    }, 2000);
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.type === 'text') {
      return (
        <View style={styles.textWrap}>
          <Text style={[styles.messageText, msg.sender === 'user' ? styles.textUser : styles.textAI]}>
            {msg.text}
          </Text>
          <Text style={styles.inlineTime}>{msg.timestamp}</Text>
        </View>
      );
    }

    if (msg.type === 'chart_analysis') {
      return (
        <View style={styles.terminalCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderTitle}>{msg.analysisData.instrument} • {msg.analysisData.timeframe}</Text>
            <Text style={styles.inlineTime}>{msg.timestamp}</Text>
          </View>
          
          <Text style={styles.cardMainDesc}>{msg.text}</Text>

          <ImageBackground 
            source={require('../../../assets/images/promo-banner.jpg')} 
            style={styles.chartFrame}
            imageStyle={{ borderRadius: 8, opacity: 0.4 }}
          >
            <View style={styles.chartOverlay}>
              <FontAwesome name="expand" size={12} color="#ffffff" />
            </View>
          </ImageBackground>

          <View style={styles.metricGrid}>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Directional Bias</Text>
              <Text style={[styles.metricValue, { color: msg.analysisData.bias === 'Bearish' ? '#FF5252' : '#A8FF3E' }]}>
                {msg.analysisData.bias}
              </Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Signal Confidence</Text>
              <Text style={[styles.metricValue, { color: '#ffffff' }]}>{msg.analysisData.confidence}</Text>
            </View>
          </View>
          
          <View style={styles.levelsContainer}>
            {msg.analysisData.keyLevels.map((lvl: string, idx: number) => (
              <Text key={idx} style={styles.monoLevelText}>▪ {lvl}</Text>
            ))}
          </View>

          <TouchableOpacity style={styles.actionLink} activeOpacity={0.7}>
            <Text style={styles.actionLinkText}>Initialize Advanced Charting</Text>
            <Ionicons name="arrow-forward-sharp" size={12} color="#A8FF3E" />
          </TouchableOpacity>
        </View>
      );
    }

    if (msg.type === 'trade_review') {
      return (
        <View style={styles.terminalCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderTitle}>System Intelligence Ledger</Text>
            <Text style={styles.inlineTime}>{msg.timestamp}</Text>
          </View>
          
          <Text style={styles.cardMainDesc}>{msg.text}</Text>
          
          <View style={styles.performanceRow}>
            <View style={styles.perfBlock}>
              <Text style={styles.metricLabel}>Net Yield PnL</Text>
              <Text style={[styles.metricValue, { color: '#A8FF3E', fontSize: 16 }]}>{msg.analysisData.pnl}</Text>
            </View>
            <View style={styles.perfBlock}>
              <Text style={styles.metricLabel}>Win Metrics Ratio</Text>
              <Text style={[styles.metricValue, { color: '#ffffff', fontSize: 16 }]}>{msg.analysisData.winRate}</Text>
            </View>
          </View>
          
          <View style={styles.suggestionBox}>
            <Text style={styles.suggestionTitle}>AI Optimization Stream</Text>
            <Text style={styles.suggestionText}>{msg.analysisData.suggestion}</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        
        {/* Universal Header */}
        <View style={[styles.headerArea, { paddingTop: insets.top + 8 }]}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.activeCoreDot} />
            <View>
              <Text style={styles.headerTitle}>AI Engine Terminal</Text>
              <Text style={styles.headerSubtitle}>System Active • {activeMode} Node</Text>
            </View>
          </View>
        </View>

        {/* Matrix Tab Selectors */}
        <View style={styles.modesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modesScroll}>
            {AI_MODES.map((mode) => {
              const isActive = activeMode === mode;
              return (
                <TouchableOpacity 
                  key={mode} 
                  style={[styles.modeTab, isActive && styles.activeModeTab]}
                  onPress={() => setActiveMode(mode)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modeTabText, isActive && styles.activeModeTabText]}>{mode}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Chat Stream Viewport */}
          <ScrollView
            style={styles.chatArea}
            contentContainerStyle={styles.chatContent}
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimerText}>
                E2E Encryption Ver. 4.0 // Historical matrix analytics mapped dynamically.
              </Text>
            </View>

            {messages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageRow,
                    isUser ? styles.rowUser : styles.rowAI
                  ]}
                >
                  <View style={[
                    styles.contentWrapper,
                    isUser ? styles.wrapperUser : styles.wrapperAI,
                    msg.type !== 'text' && { maxWidth: '100%', width: '100%' }
                  ]}>
                    {renderMessageContent(msg)}
                  </View>
                </View>
              );
            })}

            {isTyping && (
              <View style={[styles.messageRow, styles.rowAI]}>
                <View style={[styles.contentWrapper, styles.wrapperAI, styles.typingWrapper]}>
                  <Animated.View style={{ opacity: glowAnim, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                  </Animated.View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Input Terminal Box */}
          <View style={styles.inputArea}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsContent}>
              {SUGGESTIONS.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => handleSend(suggestion)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipText}>[ {suggestion} ]</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <View style={styles.utilityActions}>
                <TouchableOpacity style={styles.iconAction} activeOpacity={0.7}>
                  <Ionicons name="add-sharp" size={18} color="#888888" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconAction} activeOpacity={0.7}>
                  <Ionicons name="camera-outline" size={18} color="#888888" />
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Query system or stream chart metadata..."
                placeholderTextColor="#444444"
                value={inputText}
                onChangeText={setInputText}
                style={styles.textInput}
                multiline
              />
              
              <TouchableOpacity
                style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                onPress={() => handleSend(inputText)}
                disabled={!inputText.trim()}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-up-sharp" size={16} color={inputText.trim() ? '#000000' : '#444444'} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: '#141414',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activeCoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A8FF3E',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#888888',
    fontWeight: '400',
    marginTop: 1,
  },
  modesContainer: {
    borderBottomWidth: 1,
    borderColor: '#141414',
    paddingVertical: 10,
  },
  modesScroll: {
    paddingHorizontal: 16,
    gap: 6,
  },
  modeTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#141414',
  },
  activeModeTab: {
    borderColor: '#A8FF3E',
  },
  modeTabText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '400',
  },
  activeModeTabText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  keyboardAvoid: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  disclaimerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#444444',
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%',
  },
  rowAI: {
    justifyContent: 'flex-start',
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  contentWrapper: {
    maxWidth: '85%',
  },
  wrapperAI: {
    width: '100%',
  },
  wrapperUser: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  typingWrapper: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#141414',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: 'auto',
  },
  textWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
    width: '100%',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1,
    flex: 1,
  },
  textAI: {
    color: '#E5E5E5',
  },
  textUser: {
    color: '#ffffff',
  },
  inlineTime: {
    fontSize: 10,
    color: '#444444',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  terminalCard: {
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
    width: '100%',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardMainDesc: {
    fontSize: 14,
    color: '#888888',
    lineHeight: 18,
    marginBottom: 12,
  },
  chartFrame: {
    width: '100%',
    height: 110,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#262626',
    marginBottom: 12,
  },
  chartOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#141414',
  },
  metricRow: {
    alignItems: 'flex-start',
  },
  metricLabel: {
    fontSize: 11,
    color: '#555555',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  levelsContainer: {
    paddingVertical: 10,
  },
  monoLevelText: {
    fontSize: 12,
    color: '#888888',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
    marginBottom: 4,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  actionLinkText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A8FF3E',
  },
  performanceRow: {
    flexDirection: 'row',
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#141414',
    borderRadius: 8,
    padding: 10,
    gap: 16,
    marginBottom: 12,
  },
  perfBlock: {
    flex: 1,
  },
  suggestionBox: {
    borderTopWidth: 1,
    borderColor: '#141414',
    paddingTop: 10,
  },
  suggestionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A8FF3E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 13,
    color: '#888888',
    lineHeight: 18,
  },
  inputArea: {
    borderTopWidth: 1,
    borderColor: '#141414',
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    backgroundColor: '#000000',
  },
  suggestionsContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  suggestionChip: {
    backgroundColor: 'transparent',
  },
  chipText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 10,
  },
  utilityActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconAction: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    maxHeight: 80,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    color: '#ffffff',
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: '#A8FF3E',
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#141414',
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#A8FF3E',
    marginHorizontal: 2,
  },
});