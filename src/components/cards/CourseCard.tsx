import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { FontAwesome } from '@expo/vector-icons';

interface CourseCardProps {
  title: string;
  instructor: string;
  duration: string;
  rating: number;
  thumbnailUrl?: string;
  onPress: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  instructor,
  duration,
  rating,
  thumbnailUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.thumbnailContainer}>
        {thumbnailUrl ? (
          <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
        ) : (
          <View style={styles.placeholderThumbnail}>
            <FontAwesome name="play-circle-o" size={40} color={Colors.border} />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.instructor}>{instructor}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <FontAwesome name="clock-o" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <FontAwesome name="star" size={14} color={Colors.warning} />
            <Text style={styles.metaText}>{rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 16,
    flexDirection: 'row',
  },
  thumbnailContainer: {
    width: 120,
    backgroundColor: Colors.card,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    ...Typography.body,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  instructor: {
    ...Typography.caption,
    color: Colors.primary,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
});
