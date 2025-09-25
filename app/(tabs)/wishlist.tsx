
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../../store';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import ProductCard from '../../components/ProductCard';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

export default function WishlistScreen() {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  if (wishlistItems.length === 0) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Wishlist</Text>
          </View>
          
          <View style={styles.emptyWishlist}>
            <Icon name="heart-outline" size={80} color={colors.textSecondary} />
            <Text style={styles.emptyWishlistText}>Your wishlist is empty</Text>
            <Text style={styles.emptyWishlistSubtext}>Save products you love for later</Text>
            <Button
              text="Explore Products"
              onPress={() => router.push('/(tabs)/home')}
              style={styles.exploreButton}
            />
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
          <Text style={styles.title}>Wishlist</Text>
          <Text style={styles.itemCount}>{wishlistItems.length} items</Text>
        </View>

        {/* Wishlist Items */}
        <ScrollView style={styles.itemsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.productsGrid}>
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  itemCount: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  itemsContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  productsGrid: {
    paddingBottom: spacing.xl,
  },
  emptyWishlist: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyWishlistText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptyWishlistSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  exploreButton: {
    width: '100%',
    maxWidth: 300,
  },
});
