
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../../store';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import ProductCard from '../../components/ProductCard';
import CategoryCard from '../../components/CategoryCard';
import SearchBar from '../../components/SearchBar';
import Icon from '../../components/Icon';
import { useDataSync } from '../../hooks/useDataSync';

export default function HomeScreen() {
  const { products, categories, featuredProducts, loading } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const { syncProducts, syncCategories } = useDataSync();

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([syncProducts(), syncCategories()]);
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    router.push(`/(tabs)/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Hello{user?.firstName ? `, ${user.firstName}` : ''}!</Text>
            <Text style={styles.subGreeting}>What are you looking for today?</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Icon name="person-circle" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search for products..."
            onSubmit={handleSearch}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => router.push('/categories')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.slice(0, 6).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => router.push('/products')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
            {featuredProducts.slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} horizontal />
            ))}
          </ScrollView>
        </View>

        {/* Latest Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Products</Text>
            <TouchableOpacity onPress={() => router.push('/products')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productGrid}>
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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
    flex: 1,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  profileButton: {
    padding: spacing.sm,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
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
    fontWeight: '600',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  categoriesScroll: {
    paddingLeft: spacing.md,
  },
  productsScroll: {
    paddingLeft: spacing.md,
  },
  productGrid: {
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
