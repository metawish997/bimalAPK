import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

interface StatCardProps {
  title: string;
  value: string;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  trend?: 'up' | 'down' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, iconName, trend }) => {
  const getTrendColor = () => {
    if (trend === 'up') return Colors.success;
    if (trend === 'down') return Colors.loss;
    return Colors.textSecondary;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <FontAwesome name={iconName} size={16} color={Colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        {trend && (
          <FontAwesome
            name={trend === 'up' ? 'arrow-up' : trend === 'down' ? 'arrow-down' : 'minus'}
            size={14}
            color={getTrendColor()}
            style={styles.trendIcon}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  trendIcon: {
    marginLeft: 8,
  },
});
