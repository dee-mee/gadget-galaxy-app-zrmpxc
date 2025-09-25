
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Product } from '../types';
import { colors, spacing, commonStyles } from '../styles/commonStyles';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { RootState } from '../store';
import Icon from './Icon';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/product/${product.id}`);
    }
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    console.log('Added to cart:', product.name);
  };

  const handleWishlistToggle = (e: any) => {
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.images[0] }} style={styles.image} />
        {product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount}% OFF</Text>
          </View>
        )}
        <TouchableOpacity style={styles.wishlistButton} onPress={handleWishlistToggle}>
          <Icon
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={20}
            color={isWishlisted ? colors.error : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color={colors.warning} />
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>KES {product.price.toLocaleString()}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>KES {product.originalPrice.toLocaleString()}</Text>
          )}
        </View>
        
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Icon name="add" size={16} color={colors.background} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...commonStyles.shadow,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  discountText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '600',
  },
  wishlistButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.background,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  content: {
    padding: spacing.md,
  },
  brand: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: spacing.xs,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  addToCartText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
});
