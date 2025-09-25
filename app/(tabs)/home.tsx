
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../../store';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import SearchBar from '../../components/SearchBar';
import CategoryCard from '../../components/CategoryCard';
import ProductCard from '../../components/ProductCard';
import Icon from '../../components/Icon';

export default function HomeScreen() {
  const { featuredProducts, categories } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSearchFocus = () => {
    router.push('/search');
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName || 'Guest'}!</Text>
            <Text style={styles.subtitle}>What are you looking for today?</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')}>
            <Icon name="notifications-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} onFocus={handleSearchFocus} />

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => router.push('/categories')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => router.push('/products')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.productsGrid}>
            {featuredProducts.slice(0, 4).map((product) => (
              <View key={product.id} style={styles.productCardContainer}>
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        </View>

        {/* Special Offers Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Special Offers</Text>
            <Text style={styles.bannerSubtitle}>Up to 50% off on selected items</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    marginVertical: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  seeAll: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingLeft: spacing.md,
  },
  productsGrid: {
    paddingHorizontal: spacing.md,
  },
  productCardContainer: {
    marginBottom: spacing.md,
  },
  banner: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  bannerContent: {
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.background,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: colors.background,
    textAlign: 'center',
    marginVertical: spacing.sm,
    opacity: 0.9,
  },
  bannerButton: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 25,
    marginTop: spacing.sm,
  },
  bannerButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
