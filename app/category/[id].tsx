
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useLocalSearchParams, router } from 'expo-router';
import { RootState } from '../../store';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import ProductCard from '../../components/ProductCard';
import Icon from '../../components/Icon';
import { Product, Category } from '../../types';

const SORT_OPTIONS = [
  { key: 'name', label: 'Name', value: 'asc' as const },
  { key: 'price', label: 'Price: Low to High', value: 'asc' as const },
  { key: 'price', label: 'Price: High to Low', value: 'desc' as const },
  { key: 'rating', label: 'Rating', value: 'desc' as const },
];

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, categories } = useSelector((state: RootState) => state.products);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    // Find the category
    const foundCategory = categories.find(cat => cat.id === id);
    setCategory(foundCategory || null);

    // Filter products by category
    const categoryProducts = products.filter(product => product.category.id === id);
    
    // Sort products
    const sorted = [...categoryProducts].sort((a, b) => {
      switch (selectedSort.key) {
        case 'name':
          return selectedSort.value === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case 'price':
          return selectedSort.value === 'asc' 
            ? a.price - b.price
            : b.price - a.price;
        case 'rating':
          return selectedSort.value === 'desc' 
            ? b.rating - a.rating
            : a.rating - b.rating;
        default:
          return 0;
      }
    });

    setSortedProducts(sorted);
  }, [id, products, categories, selectedSort]);

  const handleSortChange = (option: typeof SORT_OPTIONS[0]) => {
    setSelectedSort(option);
  };

  if (!category) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Category Not Found</Text>
            <View style={styles.placeholder} />
          </View>
          <View style={styles.notFound}>
            <Text style={styles.notFoundText}>Category not found</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{category.name}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {SORT_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sortOption,
                  selectedSort === option && styles.sortOptionActive
                ]}
                onPress={() => handleSortChange(option)}
              >
                <Text style={[
                  styles.sortOptionText,
                  selectedSort === option && styles.sortOptionTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Products */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {sortedProducts.length > 0 ? (
            <View style={styles.productsContainer}>
              {sortedProducts.map((product) => (
                <View key={product.id} style={styles.productCard}>
                  <ProductCard product={product} />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="cube-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>No Products Found</Text>
              <Text style={styles.emptyStateText}>
                There are no products in this category yet.
              </Text>
            </View>
          )}
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
  sortContainer: {
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortOptionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: colors.background,
  },
  content: {
    flex: 1,
  },
  productsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  productCard: {
    marginBottom: spacing.lg,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl * 2,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
