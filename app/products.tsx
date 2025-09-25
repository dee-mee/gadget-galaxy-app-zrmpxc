
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../store';
import { colors, spacing, commonStyles } from '../styles/commonStyles';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';
import { Product } from '../types';

const SORT_OPTIONS = [
  { key: 'name', label: 'Name', value: 'asc' as const },
  { key: 'price', label: 'Price: Low to High', value: 'asc' as const },
  { key: 'price', label: 'Price: High to Low', value: 'desc' as const },
  { key: 'rating', label: 'Rating', value: 'desc' as const },
  { key: 'featured', label: 'Featured', value: 'desc' as const },
];

export default function ProductsScreen() {
  const { products, categories } = useSelector((state: RootState) => state.products);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    let filteredProducts = [...products];

    // Filter by category if selected
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(product => product.category.id === selectedCategory);
    }

    // Sort products
    const sorted = filteredProducts.sort((a, b) => {
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
        case 'featured':
          return selectedSort.value === 'desc'
            ? (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
            : (a.isFeatured ? 1 : 0) - (b.isFeatured ? 1 : 0);
        default:
          return 0;
      }
    });

    setSortedProducts(sorted);
  }, [products, selectedSort, selectedCategory]);

  const handleSortChange = (option: typeof SORT_OPTIONS[0]) => {
    setSelectedSort(option);
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>All Products</Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Icon name="search" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterOption,
                !selectedCategory && styles.filterOptionActive
              ]}
              onPress={() => handleCategoryFilter(null)}
            >
              <Text style={[
                styles.filterOptionText,
                !selectedCategory && styles.filterOptionTextActive
              ]}>
                All
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterOption,
                  selectedCategory === category.id && styles.filterOptionActive
                ]}
                onPress={() => handleCategoryFilter(category.id)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedCategory === category.id && styles.filterOptionTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
          <View style={styles.productsContainer}>
            <Text style={styles.resultsCount}>
              {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
            </Text>
            {sortedProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <ProductCard product={product} />
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
  filterContainer: {
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: colors.background,
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
  resultsCount: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    fontWeight: '500',
  },
  productCard: {
    marginBottom: spacing.lg,
  },
});
