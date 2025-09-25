
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Category } from '../types';
import { colors, spacing } from '../styles/commonStyles';
import Icon from './Icon';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const handlePress = () => {
    router.push(`/category/${category.id}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Icon name={category.icon as any} size={32} color={colors.primary} />
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginRight: spacing.md,
    minWidth: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
