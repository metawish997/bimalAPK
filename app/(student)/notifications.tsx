import React, { useState, useEffect, useCallback } from 'react';
import { 
  SafeAreaView, View, Text, StyleSheet, TouchableOpacity, 
  FlatList, ActivityIndicator, RefreshControl, ScrollView
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ProfileTheme } from '@/components/profile/theme';
import { notificationService } from '@/services/notificationService';

const timeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  // Derive unique types from current notifications
  const uniqueTypes = Array.from(new Set(notifications.map(n => n.type).filter(Boolean)));
  const TABS = ['ALL', ...uniqueTypes];

  const fetchNotifications = async (pageNum = 1, isRefresh = false) => {
    try {
      const res = await notificationService.getMyNotifications(pageNum, 15);
      const fetched = res.data?.data?.notifications || [];
      const newNotifications = fetched.map((n: any) => ({
        _id: n.notificationId?._id,
        isRead: n.isRead,
        title: n.notificationId?.title,
        message: n.notificationId?.message,
        type: n.notificationId?.type,
        createdAt: n.notificationId?.createdAt || n.createdAt
      }));
      
      if (isRefresh) {
        setNotifications(newNotifications);
      } else {
        setNotifications(prev => [...prev, ...newNotifications]);
      }
      
      setHasMore(newNotifications.length === 15);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications(1, true);
  }, []);

  const loadMore = () => {
    if (!loading && !refreshing && hasMore) {
      fetchNotifications(page + 1);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleNotificationPress = async (notification: any) => {
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification._id);
        setNotifications(prev => prev.map(n => 
          n._id === notification._id ? { ...n, isRead: true } : n
        ));
      } catch (error) {
        console.error('Failed to mark as read', error);
      }
    }
    // Handle navigation based on type if needed
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'TRADE_ALERT': return <Feather name="trending-up" size={18} color="#A8FF3E" />;
      case 'COURSE_UPDATE': return <Feather name="book-open" size={18} color="#A8FF3E" />;
      case 'MEETING': return <Feather name="video" size={18} color="#A8FF3E" />;
      case 'SYSTEM': return <Feather name="info" size={18} color="#4A90E2" />;
      case 'PROMOTION': return <Feather name="tag" size={18} color="#F5A623" />;
      default: return <Feather name="bell" size={18} color="#A8FF3E" />;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
      activeOpacity={0.7}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.iconContainer}>
        {getIconForType(item.type)}
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.time}>
          {item.createdAt ? timeAgo(item.createdAt) : 'Just now'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const filteredNotifications = notifications.filter(n => 
    activeTab === 'ALL' ? true : n.type === activeTab
  );

  const formatTabLabel = (type: string) => {
    if (type === 'ALL') return 'All';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
          <Text style={styles.markReadText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      {TABS.length > 1 && (
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
            {TABS.map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{formatTabLabel(tab)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {loading && page === 1 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#A8FF3E" />
        </View>
      ) : filteredNotifications.length === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="bell-off" size={48} color="#333" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptySubtitle}>You're all caught up! Check back later.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor="#A8FF3E" 
              colors={['#A8FF3E']} 
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasMore && !loading ? (
              <ActivityIndicator size="small" color="#A8FF3E" style={{ marginVertical: 20 }} />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ProfileTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#1C1C1E',
  },
  backButton: {
    paddingVertical: 4,
    width: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  markReadText: {
    fontSize: 12,
    color: '#A8FF3E',
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderColor: '#1C1C1E',
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 8,
  },
  activeTabButton: {
    backgroundColor: 'rgba(168, 255, 62, 0.1)',
    borderColor: '#A8FF3E',
  },
  tabText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#A8FF3E',
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#121212',
    backgroundColor: 'transparent',
  },
  unreadCard: {
    backgroundColor: 'rgba(168, 255, 62, 0.03)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#A8FF3E',
    borderWidth: 2,
    borderColor: '#000',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E5E5E5',
    marginBottom: 6,
  },
  unreadText: {
    fontWeight: '700',
    color: '#fff',
  },
  message: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
    marginBottom: 8,
  },
  time: {
    fontSize: 11,
    color: '#555',
  },
});