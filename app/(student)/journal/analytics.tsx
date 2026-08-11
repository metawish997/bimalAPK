import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { Animated, Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G, Line, Rect, Text as SvgText } from 'react-native-svg';

import { tradeJournalService } from '../../../src/services/tradeJournalService';
import { useState, useEffect } from 'react';

const { width } = Dimensions.get('window');

export default function PerformanceAnalyticsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const slideAnim = useRef(new Animated.Value(20)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [trades, setTrades] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState('Month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);
  const [selectedBar, setSelectedBar] = useState<{label: string, value: number, x: number, y: number} | null>(null);

  useEffect(() => {
    setSelectedBar(null);
  }, [timeFilter, customStart, customEnd]);

  useFocusEffect(
    useCallback(() => {
      slideAnim.setValue(20);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true })
      ]).start();

      const fetchTrades = async () => {
        try {
          const res = await tradeJournalService.getAll();
          setTrades(res.data?.data || res.data || []);
        } catch (e) {
          console.error(e);
        }
      };
      fetchTrades();
    }, [slideAnim, fadeAnim])
  );

  // Bar Chart calculations
  const chartHeight = 160;
  const chartWidth = width - 40;
  const zeroY = 100;
  const maxVal = 20000;
  const minVal = -10000;
  const valRange = maxVal - minVal;

  const getDynamicPnL = () => {
    let filteredTrades = trades;
    if (timeFilter === 'Custom' && customStart && customEnd) {
      const start = new Date(customStart).getTime();
      const end = new Date(customEnd).getTime();
      filteredTrades = trades.filter(t => {
        const d = new Date(t.date).getTime();
        return d >= start && d <= end;
      });
    }

    const sortedTrades = [...filteredTrades].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const orderedKeys: string[] = [];
    const orderedMap: { [key: string]: number } = {};
    
    sortedTrades.forEach(t => {
      const d = new Date(t.date);
      if (isNaN(d.getTime())) return;
      
      let key = '';
      if (timeFilter === 'Day' || timeFilter === 'Custom') {
        key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (timeFilter === 'Week') {
        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
        const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        key = `Wk ${weekNum}`;
      } else if (timeFilter === 'Month') {
        key = d.toLocaleDateString('en-US', { month: 'short' });
      } else if (timeFilter === 'Year') {
        key = String(d.getFullYear());
      }
      
      if (!orderedKeys.includes(key)) orderedKeys.push(key);
      orderedMap[key] = (orderedMap[key] || 0) + (t.pnl || 0);
    });
    
    let finalResult = orderedKeys.map(k => ({ label: k, value: orderedMap[k] }));
    
    if (finalResult.length === 0) {
       finalResult = [{ label: '-', value: 0 }];
    }
    
    if (finalResult.length > 6) {
      finalResult = finalResult.slice(finalResult.length - 6);
    }
    
    return finalResult;
  };
  const dynamicMonthlyPnL = getDynamicPnL();

  const getBarCoords = (value: number, index: number) => {
    const barWidth = 14; 
    const spacing = (chartWidth - 60) / dynamicMonthlyPnL.length;
    const x = 50 + index * spacing;
    const scale = (chartHeight - 40) / valRange;
    
    let renderValue = value;
    if (renderValue > maxVal) renderValue = maxVal;
    if (renderValue < minVal) renderValue = minVal;
    
    let y = zeroY;
    let height = 0;
    
    if (renderValue > 0) {
      height = renderValue * scale;
      y = zeroY - height;
    } else if (renderValue < 0) {
      height = Math.abs(renderValue) * scale;
      y = zeroY;
    }

    return { x, y, width: barWidth, height };
  };

  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.pnl > 0 || t.status === 'WIN' || t.trade_result === 'Target').length;
  const dynamicWinRate = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 100) : 0;

  const mistakeCounts: { [key: string]: number } = {};
  trades.forEach(t => {
    if (t.mistake_tag && t.mistake_tag !== 'None') {
      mistakeCounts[t.mistake_tag] = (mistakeCounts[t.mistake_tag] || 0) + 1;
    }
  });
  
  let dynamicTopMistake = 'None';
  let topMistakeCount = 0;
  Object.keys(mistakeCounts).forEach(m => {
    if (mistakeCounts[m] > topMistakeCount) {
      dynamicTopMistake = m;
      topMistakeCount = mistakeCounts[m];
    }
  });

  const strategyStats: { [key: string]: { count: number, wins: number } } = {};
  trades.forEach(t => {
    if (t.strategy_used) {
      if (!strategyStats[t.strategy_used]) strategyStats[t.strategy_used] = { count: 0, wins: 0 };
      strategyStats[t.strategy_used].count++;
      if (t.pnl > 0 || t.status === 'WIN' || t.trade_result === 'Target') {
        strategyStats[t.strategy_used].wins++;
      }
    }
  });
  
  let bestStrategy = 'None';
  let bestStrategyWinRate = 0;
  let worstStrategy = 'None';
  let worstStrategyWinRate = 100;
  
  Object.keys(strategyStats).forEach(s => {
    if (strategyStats[s].count >= 1) {
      const sr = Math.round((strategyStats[s].wins / strategyStats[s].count) * 100);
      if (sr >= bestStrategyWinRate) {
        bestStrategyWinRate = sr;
        bestStrategy = s;
      }
      if (sr <= worstStrategyWinRate) {
        worstStrategyWinRate = sr;
        worstStrategy = s;
      }
    }
  });

  if (bestStrategy === 'None') bestStrategy = 'Break & Retest';
  if (worstStrategy === 'None') worstStrategy = 'Reversals';

  // Donut Path configurations
  const radius = 54;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const winRate = dynamicWinRate;
  const winOffset = circumference * (1 - winRate / 100);

  return (
    <View style={styles.container}>
      {/* Editorial Navigation Header */}
      <View style={[styles.headerArea, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Performance Analytics</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          
          {/* 1. Monthly PnL Terminal Chart */}
          <View style={styles.terminalCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={[styles.chartTitle, { marginBottom: 0 }]}>Yield Dynamic</Text>
              <View style={{ flexDirection: 'row', gap: 4, backgroundColor: '#141414', padding: 4, borderRadius: 6 }}>
                {['Day', 'Week', 'Month', 'Year', 'Custom'].map(t => (
                  <TouchableOpacity key={t} onPress={() => setTimeFilter(t)} style={{ paddingHorizontal: 6, paddingVertical: 4, backgroundColor: timeFilter === t ? '#262626' : 'transparent', borderRadius: 4 }}>
                    <Text style={{ fontSize: 10, color: timeFilter === t ? '#A8FF3E' : '#888', fontWeight: timeFilter === t ? '600' : '400' }}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {timeFilter === 'Custom' && (
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                <TouchableOpacity onPress={() => setShowPicker('start')} style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10, color: '#555', marginBottom: 4 }}>FROM (YYYY-MM-DD)</Text>
                  <View style={{ borderBottomWidth: 1, borderColor: '#222', paddingBottom: 4 }}>
                    <Text style={{ color: customStart ? '#fff' : '#333', fontSize: 12 }}>{customStart || 'Select Date'}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowPicker('end')} style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10, color: '#555', marginBottom: 4 }}>TO (YYYY-MM-DD)</Text>
                  <View style={{ borderBottomWidth: 1, borderColor: '#222', paddingBottom: 4 }}>
                    <Text style={{ color: customEnd ? '#fff' : '#333', fontSize: 12 }}>{customEnd || 'Select Date'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {showPicker && (
              Platform.OS === 'ios' ? (
                <Modal transparent animationType="fade">
                  <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: '#222', padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Select Date</Text>
                        <TouchableOpacity onPress={() => setShowPicker(null)}>
                          <Text style={{ color: '#A8FF3E', fontSize: 16 }}>Done</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={
                          showPicker === 'start' && customStart ? new Date(customStart) :
                          showPicker === 'end' && customEnd ? new Date(customEnd) : new Date()
                        }
                        mode="date"
                        display="spinner"
                        themeVariant="dark"
                        onChange={(event, date) => {
                          if (date) {
                            const d = date.toISOString().split('T')[0];
                            if (showPicker === 'start') setCustomStart(d);
                            else setCustomEnd(d);
                          }
                        }}
                      />
                    </View>
                  </View>
                </Modal>
              ) : (
                <DateTimePicker
                  value={
                    showPicker === 'start' && customStart ? new Date(customStart) :
                    showPicker === 'end' && customEnd ? new Date(customEnd) : new Date()
                  }
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowPicker(null);
                    if (event.type === 'set' && date) {
                      const d = date.toISOString().split('T')[0];
                      if (showPicker === 'start') setCustomStart(d);
                      else setCustomEnd(d);
                    }
                  }}
                />
              )
            )}

            <View style={styles.chartWrapper}>
              <Svg width={chartWidth} height={chartHeight}>
                {/* Horizontal Scale Separators */}
                {[15000, 5000, 0, -5000].map((gridVal, i) => {
                  const scale = (chartHeight - 40) / valRange;
                  const y = zeroY - (gridVal * scale);
                  return (
                    <G key={i}>
                      <Line 
                        x1="45" 
                        y1={y} 
                        x2={chartWidth} 
                        y2={y} 
                        stroke={gridVal === 0 ? '#262626' : '#121212'} 
                        strokeWidth={gridVal === 0 ? 1 : 0.7}
                      />
                      <SvgText 
                        x="0" 
                        y={y + 4} 
                        fill="#444444" 
                        fontSize="10"
                        fontFamily={Platform.select({ ios: 'Courier', android: 'monospace' })}
                      >
                        {gridVal >= 0 ? `+${gridVal/1000}k` : `-${Math.abs(gridVal)/1000}k`}
                      </SvgText>
                    </G>
                  );
                })}

                {/* Vertical Histograms */}
                {dynamicMonthlyPnL.map((datum, index) => {
                  const coords = getBarCoords(datum.value, index);
                  const isPositive = datum.value >= 0;
                  return (
                    <G key={index}>
                      <Rect
                        x={coords.x}
                        y={coords.y}
                        width={coords.width}
                        height={coords.height}
                        fill={isPositive ? '#A8FF3E' : '#FF5252'}
                        rx={1}
                      />
                      <SvgText
                        x={coords.x + coords.width / 2}
                        y={chartHeight - 5}
                        fill="#666666"
                        fontSize="11"
                        textAnchor="middle"
                      >
                        {datum.label}
                      </SvgText>
                      {/* Invisible Touch Zone for reliable pressing */}
                      <Rect
                        x={coords.x - 5}
                        y={0}
                        width={coords.width + 10}
                        height={chartHeight}
                        fill="transparent"
                        onPress={() => setSelectedBar({ label: datum.label, value: datum.value, x: coords.x, y: coords.y })}
                      />
                    </G>
                  );
                })}
              </Svg>
              {selectedBar && (
                <View style={{
                  position: 'absolute',
                  left: Math.max(0, Math.min(chartWidth - 90, selectedBar.x - 30)),
                  top: Math.max(10, selectedBar.value >= 0 ? selectedBar.y - 55 : selectedBar.y - 65),
                  backgroundColor: '#1a1a1a',
                  padding: 8,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#333',
                  alignItems: 'center',
                  zIndex: 10,
                  minWidth: 80,
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 4,
                }}>
                  <Text style={{ color: '#888', fontSize: 10, marginBottom: 2, textTransform: 'uppercase' }}>{selectedBar.label}</Text>
                  <Text style={{ color: selectedBar.value >= 0 ? '#A8FF3E' : '#FF5252', fontSize: 13, fontWeight: '700' }}>
                    {selectedBar.value >= 0 ? '+' : '-'}₹{Math.abs(selectedBar.value).toLocaleString()}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setSelectedBar(null)} 
                    style={{ position: 'absolute', top: -6, right: -6, backgroundColor: '#333', borderRadius: 10, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Feather name="x" size={10} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* 2. Micro-Gauge Win Rate Arc */}
          <View style={styles.terminalCard}>
            <Text style={styles.chartTitle}>Win Metrics Ratio</Text>
            <View style={styles.donutWrapper}>
              <View style={styles.svgContainer}>
                <Svg width={140} height={140}>
                  <G rotation="-90" origin="70, 70">
                    {/* Secondary Track */}
                    <Circle
                      cx="70"
                      cy="70"
                      r={radius}
                      stroke="#141414"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                    />
                    {/* Active Track */}
                    <Circle
                      cx="70"
                      cy="70"
                      r={radius}
                      stroke="#A8FF3E"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={winOffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </G>
                </Svg>
                
                {/* Center Percentage Display */}
                <View style={styles.donutTextContainer}>
                  <Text style={styles.donutPercentage}>{winRate}%</Text>
                  <Text style={styles.donutSub}>W/L RATE</Text>
                </View>
              </View>

              {/* Pure Text Legend */}
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendIndicator, { backgroundColor: '#A8FF3E' }]} />
                  <Text style={styles.legendText}>{winRate}% Profit allocation</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendIndicator, { backgroundColor: '#FF5252' }]} />
                  <Text style={styles.legendText}>{100 - winRate}% Capital fallback</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 3. Setup Architecture Matrix */}
          <View style={styles.terminalCard}>
            <Text style={styles.chartTitle}>Strategy Framework Optimization</Text>
            <View style={styles.setupRow}>
              <View style={styles.setupCol}>
                <Text style={styles.setupLabel}>Alpha Engine Setup</Text>
                <Text style={[styles.setupValue, { color: '#A8FF3E' }]}>{bestStrategy}</Text>
                <Text style={styles.setupSub}>Ratio: {bestStrategyWinRate}% efficiency</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.setupCol}>
                <Text style={styles.setupLabel}>High Risk Variable</Text>
                <Text style={[styles.setupValue, { color: '#FF5252' }]}>{worstStrategy}</Text>
                <Text style={styles.setupSub}>Ratio: {worstStrategyWinRate}% efficiency</Text>
              </View>
            </View>
          </View>

          {/* 4. Psychological Insights Matrix */}
          <View style={styles.terminalCard}>
            <Text style={styles.chartTitle}>Psychology Insights</Text>
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>Primary Execution Fault</Text>
              <Text style={styles.insightValue}>{dynamicTopMistake} ({topMistakeCount})</Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>Optimal Emotional State</Text>
              <Text style={styles.insightValue}>Calm</Text>
            </View>
            <View style={[styles.insightItem, { borderBottomWidth: 0, paddingBottom: 4 }]}>
              <Text style={styles.insightLabel}>Consistency Score</Text>
              <Text style={[styles.insightValue, { color: '#A8FF3E' }]}>{winRate >= 50 ? 'A- Stable Alpha' : 'C- Volatile'}</Text>
            </View>
          </View>

        </Animated.View>
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
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: '#141414',
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
    paddingTop: 16,
    paddingBottom: 40,
    gap: 14,
  },
  terminalCard: {
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'transparent',
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 20,
  },
  chartWrapper: {
    alignItems: 'center',
    paddingLeft: 4,
  },
  donutWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  svgContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPercentage: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.5,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  donutSub: {
    fontSize: 9,
    color: '#444444',
    letterSpacing: 0.5,
    marginTop: 2,
    fontWeight: '500',
  },
  legendContainer: {
    flex: 1,
    paddingLeft: 24,
    gap: 12,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendIndicator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  legendText: {
    fontSize: 13,
    color: '#888888',
    fontWeight: '400',
  },
  setupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setupCol: {
    flex: 1,
    alignItems: 'flex-start',
  },
  verticalDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#141414',
    marginHorizontal: 16,
  },
  setupLabel: {
    fontSize: 11,
    color: '#555555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  setupValue: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
    marginBottom: 2,
  },
  setupSub: {
    fontSize: 12,
    color: '#444444',
  },
  insightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#121212',
  },
  insightLabel: {
    fontSize: 14,
    color: '#888888',
  },
  insightValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    letterSpacing: -0.1,
  },
});