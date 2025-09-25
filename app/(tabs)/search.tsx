
import Icon from '../../components/Icon';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../../components/SearchBar';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { setSearchResults } from '../../store/slices/productSlice';
import ProductCard from '../../components/ProductCard';
import React, { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import { RootState } from '../../store';

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Rating' },
  { id: 'newest', label: 'Newest' },
];

export default function SearchScreen() {
  const { q } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState((q as string) || '');
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { products, categories, searchResults } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      dispatch(setSearchResults([]));
      return;
    }

    const filtered = products.filter(product => {
      const matchesQuery = fuzzyMatch(product.name.toLowerCase(), query.toLowerCase()) ||
                          fuzzyMatch(product.description?.toLowerCase() || '', query.toLowerCase()) ||
                          fuzzyMatch(product.brand?.toLowerCase() || '', query.toLowerCase());
      
      const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
      
      return matchesQuery && matchesCategory;
    });

    // Sort results
    let sorted = [...filtered];
    switch (selectedSort.id) {
      case 'price_low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
    }

    dispatch(setSearchResults(sorted));
  }, [products, selectedCategory, selectedSort, dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  const fuzzyMatch = (text: string, query: string): boolean => {
    if (!text || !query) return false;
    
    // Simple fuzzy matching - check if all characters in query exist in text in order
    let textIndex = 0;
    let queryIndex = 0;
    
    while (textIndex < text.length && queryIndex < query.length) {
      if (text[textIndex] === query[queryIndex]) {
        queryIndex++;
      }
      textIndex++;
    }
    
    return queryIndex === query.length;
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleSortChange = (option: typeof SORT_OPTIONS[0]) => {
    setSelectedSort(option);
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Search Header */}
        <View style={styles.header}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..."
            autoFocus
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
            <TouchableOpacity
              style={[styles.filterChip, !selectedCategory && styles.filterChipActive]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[styles.filterChipText, !selectedCategory && styles.filterChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.filterChip, selectedCategory === category.id && styles.filterChipActive]}
                onPress={() => handleCategoryFilter(category.id)}
              >
                <Text style={[styles.filterChipText, selectedCategory === category.id && styles.filterChipTextActive]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sort Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortFilter}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.filterChip, selectedSort.id === option.id && styles.filterChipActive]}
                onPress={() => handleSortChange(option)}
              >
                <Text style={[styles.filterChipText, selectedSort.id === option.id && styles.filterChipTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results */}
        <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
          {searchQuery.trim() === '' ? (
            <View style={styles.emptyState}>
              <Icon name="search" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>Search for products</Text>
              <Text style={styles.emptyStateText}>
                Find electronics, accessories, and more
              </Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="search" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>No results found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            <View style={styles.productGrid}>
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersContainer: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryFilter: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sortFilter: {
    paddingHorizontal: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.white,
  },
  results: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  productGrid: {
    paddingVertical: spacing.md,
  },
});
