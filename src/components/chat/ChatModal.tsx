import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, Modal, TouchableOpacity, 
  TextInput, ScrollView, KeyboardAvoidingView, Platform, 
  ActivityIndicator, AppState, AppStateStatus
} from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { chatService } from '../../services/chatService';

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [superAdmin, setSuperAdmin] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const appState = useRef(AppState.currentState);

  // Group messages by date
  const formatDateForGroup = (dateStr: string) => {
    const msgDate = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (msgDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const groupedMessages = () => {
    const groups: Record<string, any[]> = {};
    messages.forEach(msg => {
        const dateKey = formatDateForGroup(msg.timestamp);
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(msg);
    });
    return groups;
  };

  const dateGroups = Object.keys(groupedMessages()).sort((a, b) => {
    if (a === 'Today') return -1;
    if (b === 'Today') return 1;
    if (a === 'Yesterday') return -1;
    if (b === 'Yesterday') return 1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const getOnlineStatus = () => {
    if (superAdmin?.isOnline) return 'Online';
    if (superAdmin?.lastSeen) {
        const lastSeen = new Date(superAdmin.lastSeen);
        const now = new Date();
        const diffMins = Math.floor((now.getTime() - lastSeen.getTime()) / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `Last seen ${diffMins} min ago`;
        if (diffMins < 1440) return `Last seen ${Math.floor(diffMins / 60)}h ago`;
        return `Last seen ${lastSeen.toLocaleDateString()}`;
    }
    return 'Offline';
  };

  const fetchSuperAdmin = async () => {
    try {
        const res = await chatService.getSuperAdmin();
        setSuperAdmin(res.data.data);
        setIsLoading(false);
    } catch (error) {
        console.error('Failed to fetch Super Admin:', error);
        setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!superAdmin) return;
    try {
        const res = await chatService.getMessages(superAdmin._id);
        const messagesData = res.data.data.messages || [];
        setMessages(messagesData);
    } catch (error) {
        console.error('Failed to fetch messages:', error);
    }
  };

  // Manage Online Status
  useEffect(() => {
    if (visible) {
      fetchSuperAdmin();
      chatService.updateOnlineStatus(true);
    } else {
      chatService.updateOnlineStatus(false);
    }

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active' && visible) {
        chatService.updateOnlineStatus(true);
      } else if (nextAppState.match(/inactive|background/)) {
        chatService.updateOnlineStatus(false);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      chatService.updateOnlineStatus(false);
    };
  }, [visible]);

  // Polling
  useEffect(() => {
    let msgInterval: NodeJS.Timeout;
    let adminInterval: NodeJS.Timeout;
    
    if (visible && superAdmin) {
      fetchMessages();
      msgInterval = setInterval(fetchMessages, 3000);
      adminInterval = setInterval(fetchSuperAdmin, 5000);
    }
    
    return () => {
      if (msgInterval) clearInterval(msgInterval);
      if (adminInterval) clearInterval(adminInterval);
    };
  }, [visible, superAdmin]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !superAdmin) return;

    setIsSending(true);
    try {
        await chatService.sendMessage({
            recipientId: superAdmin._id,
            text: inputValue
        });
        await fetchMessages();
        setInputValue('');
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
        console.error('Send message error:', error);
    } finally {
        setIsSending(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarWrapper}>
                <Feather name="user" size={20} color="#fff" />
                <View style={[styles.statusDot, superAdmin?.isOnline ? styles.statusOnline : styles.statusOffline]} />
              </View>
              <View>
                <Text style={styles.adminName}>
                  {superAdmin ? `${superAdmin.firstName} ${superAdmin.lastName}` : 'Admin Support'}
                </Text>
                <Text style={[styles.statusText, superAdmin?.isOnline && styles.statusTextOnline]}>
                  {getOnlineStatus()}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Chat Body */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.chatBody}
            contentContainerStyle={styles.chatContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#A8FF3E" style={{ marginTop: 20 }} />
            ) : messages.length === 0 ? (
              <Text style={styles.noMessagesText}>No messages yet. Start a conversation with the admin!</Text>
            ) : (
              dateGroups.reverse().map(dateGroup => {
                const groups = groupedMessages();
                return (
                  <View key={dateGroup}>
                    <Text style={styles.dateHeader}>{dateGroup}</Text>
                    {groups[dateGroup].map((msg) => {
                      const isUser = msg.sender === 'user';
                      return (
                        <View key={msg.id} style={[styles.messageRow, isUser ? styles.userRow : styles.adminRow]}>
                          <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.adminBubble]}>
                            <Text style={[styles.messageText, !isUser && styles.adminMessageText]}>{msg.text}</Text>
                            <View style={styles.messageFooter}>
                              <Text style={styles.timestamp}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                              </Text>
                              {isUser && (
                                <FontAwesome 
                                  name={msg.status === 'read' ? 'check-square' : 'check'} 
                                  size={10} 
                                  color={msg.status === 'read' ? '#A8FF3E' : '#888'} 
                                  style={{ marginLeft: 4 }}
                                />
                              )}
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#666"
              value={inputValue}
              onChangeText={setInputValue}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendBtn, (!inputValue.trim() || isSending) && styles.sendBtnDisabled]}
              onPress={handleSendMessage}
              disabled={!inputValue.trim() || isSending}
            >
              <Feather name="send" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    height: '80%',
    backgroundColor: '#0A0A0A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    backgroundColor: '#111',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#111',
  },
  statusOnline: {
    backgroundColor: '#A8FF3E',
  },
  statusOffline: {
    backgroundColor: '#666',
  },
  adminName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    color: '#888',
    fontSize: 12,
  },
  statusTextOnline: {
    color: '#A8FF3E',
  },
  closeBtn: {
    padding: 8,
  },
  chatBody: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 24,
  },
  noMessagesText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
  dateHeader: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  adminRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#A8FF3E',
    borderBottomRightRadius: 4,
  },
  adminBubble: {
    backgroundColor: '#1A1A1A',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  messageText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  adminMessageText: {
    color: '#fff',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.6)',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 100,
    minHeight: 40,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A8FF3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
});
