
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useLocalSearchParams } from 'expo-router';
import { RootState } from '../../store';
import { setSearchResults } from '../../store/slices/productSlice';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCard';
import Icon from '../../components/Icon';

const SORT_OPTIONS = [
  { key: 'name', label: 'Name', value: 'asc' as const },
  { key: 'price', label: 'Price: Low to High', value: 'asc' as const },
  { key: 'price', label: 'Price: High to Low', value: 'desc' as const },
  { key: 'rating', label: 'Rating', value: 'desc' as const },
];

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const dispatch = useDispatch();
  const { products, searchResults, categories } = useSelector((state: RootState) => state.products);
  
  const [searchQuery, setSearchQuery] = useState(q || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (q) {
      handleSearch(q);
    }
  }, [q]);

  // Fuzzy search function
  const fuzzyMatch = (text: string, query: string): number => {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Exact match gets highest score
    if (textLower.includes(queryLower)) {
      return textLower.indexOf(queryLower) === 0 ? 100 : 80;
    }
    
    // Character-by-character fuzzy matching
    let score = 0;
    let queryIndex = 0;
    
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        score += 1;
        queryIndex++;
      }
    }
    
    // Return percentage match
    return queryIndex === queryLower.length ? (score / queryLower.length) * 60 : 0;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      dispatch(setSearchResults([]));
      return;
    }

    // Enhanced search with fuzzy matching and scoring
    let searchResults = products.map(product => {
      const nameScore = fuzzyMatch(product.name, query);
      const brandScore = fuzzyMatch(product.brand, query);
      const descriptionScore = fuzzyMatch(product.description, query);
      const categoryScore = fuzzyMatch(product.category.name, query);
      
      // Calculate total score with weights
      const totalScore = nameScore * 0.4 + brandScore * 0.3 + descriptionScore * 0.2 + categoryScore * 0.1;
      
      return { product, score: totalScore };
    }).filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);

    let filtered = searchResults;

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category.id === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy.key as keyof typeof a];
      const bValue = b[sortBy.key as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortBy.value === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortBy.value === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    dispatch(setSearchResults(filtered));
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    handleSearch(searchQuery);
  };

  const handleSortChange = (option: typeof SORT_OPTIONS[0]) => {
    setSortBy(option);
    handleSearch(searchQuery);
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Search Header */}
        <SearchBar
          value={searchQuery}
          onSearch={handleSearch}
          placeholder="Search for products..."
          realTimeSearch={true}
        />

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesFilter}>
            <TouchableOpacity
              style={[styles.filterChip, !selectedCategory && styles.filterChipActive]}
              onPress={() => handleCategoryFilter('')}
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
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === category.id && styles.filterChipTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Icon name="funnel-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Sort Options */}
        {showFilters && (
          <View style={styles.sortContainer}>
            <Text style={styles.sortTitle}>Sort by:</Text>
            {SORT_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sortOption}
                onPress={() => handleSortChange(option)}
              >
                <Text style={[
                  styles.sortOptionText,
                  sortBy.key === option.key && sortBy.value === option.value && styles.sortOptionTextActive
                ]}>
                  {option.label}
                </Text>
                {sortBy.key === option.key && sortBy.value === option.value && (
                  <Icon name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Results */}
        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          {searchQuery && (
            <Text style={styles.resultsCount}>
              {searchResults.length} results for "{searchQuery}"
            </Text>
          )}
          
          {searchResults.length === 0 && searchQuery ? (
            <View style={styles.noResults}>
              <Icon name="search-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.noResultsText}>No products found</Text>
              <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
            </View>
          ) : (
            <View style={styles.productsGrid}>
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
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoriesFilter: {
    flex: 1,
  },
  filterChip: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  filterChipTextActive: {
    color: colors.background,
  },
  sortButton: {
    padding: spacing.sm,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortContainer: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  sortOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  sortOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  resultsCount: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
  },
  noResultsSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  productsGrid: {
    paddingBottom: spacing.xl,
  },
});
