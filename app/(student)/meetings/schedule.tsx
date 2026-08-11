import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { zoomService } from '../../../src/services/zoomService';
import { Ionicons } from '@expo/vector-icons';

export default function ScheduleMeeting() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    topic: '',
    agenda: '',
    password: '',
    duration: '60',
    settings: {
      hostVideo: true,
      participantVideo: true,
      joinBeforeHost: false,
      muteUponEntry: true,
      waitingRoom: true
    }
  });

  const handleToggle = (key: string) => {
    setForm(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: !prev.settings[key as keyof typeof prev.settings]
      }
    }));
  };

  const handleSchedule = async () => {
    if (!form.topic.trim()) {
      Alert.alert('Validation Error', 'Topic is required');
      return;
    }

    try {
      setLoading(true);
      const data = {
        ...form,
        duration: parseInt(form.duration) || 60,
        startTime: new Date(Date.now() + 3600000).toISOString() // Default to 1 hour from now for demo
      };

      await zoomService.scheduleMeeting(data);
      Alert.alert('Success', 'Meeting scheduled successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Scheduling error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Topic</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter meeting topic"
          value={form.topic}
          onChangeText={(val) => setForm({...form, topic: val})}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Agenda (Optional)</Text>
        <TextInput 
          style={[styles.input, { height: 80 }]} 
          placeholder="What is this meeting about?"
          multiline
          value={form.agenda}
          onChangeText={(val) => setForm({...form, agenda: val})}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Duration (mins)</Text>
          <TextInput 
            style={styles.input} 
            keyboardType="numeric"
            value={form.duration}
            onChangeText={(val) => setForm({...form, duration: val})}
          />
        </View>
        <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Password (Optional)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. 123456"
            value={form.password}
            onChangeText={(val) => setForm({...form, password: val})}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Meeting Options</Text>
      
      <View style={styles.settingsContainer}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Host Video On</Text>
          <Switch value={form.settings.hostVideo} onValueChange={() => handleToggle('hostVideo')} />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Participant Video On</Text>
          <Switch value={form.settings.participantVideo} onValueChange={() => handleToggle('participantVideo')} />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Waiting Room</Text>
          <Switch value={form.settings.waitingRoom} onValueChange={() => handleToggle('waitingRoom')} />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Mute Participants on Entry</Text>
          <Switch value={form.settings.muteUponEntry} onValueChange={() => handleToggle('muteUponEntry')} />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Allow Join Before Host</Text>
          <Switch value={form.settings.joinBeforeHost} onValueChange={() => handleToggle('joinBeforeHost')} />
        </View>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSchedule} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Schedule Meeting</Text>}
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 16 },
  formGroup: { marginBottom: 16 },
  row: { flexDirection: 'row' },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginTop: 8, marginBottom: 16 },
  settingsContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#eee' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  settingLabel: { fontSize: 15, color: '#333' },
  submitBtn: { backgroundColor: '#2D8CFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
