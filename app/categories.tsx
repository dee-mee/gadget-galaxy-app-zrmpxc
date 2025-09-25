
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../store';
import { colors, spacing, commonStyles } from '../styles/commonStyles';
import CategoryCard from '../components/CategoryCard';
import Icon from '../components/Icon';
import { TouchableOpacity } from 'react-native';

export default function CategoriesScreen() {
  const { categories } = useSelector((state: RootState) => state.products);

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Categories</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Categories Grid */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryContainer}>
                <CategoryCard category={category} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  categoryContainer: {
    width: '48%',
    marginBottom: spacing.lg,
  },
});
