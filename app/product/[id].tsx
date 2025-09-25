
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import { formatKES } from '../../utils/currency';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.products);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);
  const isWishlisted = wishlistItems.some(item => item.id === id);

  useEffect(() => {
    if (!product) {
      router.back();
    }
  }, [product]);

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    console.log('Added to cart:', product.name, 'Quantity:', quantity);
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleWishlistToggle} style={styles.wishlistButton}>
            <Icon
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={24}
              color={isWishlisted ? colors.error : colors.text}
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Product Images */}
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setSelectedImageIndex(index);
              }}
            >
              {product.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.productImage} />
              ))}
            </ScrollView>
            
            {/* Image Indicators */}
            {product.images.length > 1 && (
              <View style={styles.imageIndicators}>
                {product.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      selectedImageIndex === index && styles.activeIndicator
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Discount Badge */}
            {product.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{product.discount}% OFF</Text>
              </View>
            )}
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.productName}>{product.name}</Text>
            
            {/* Rating */}
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    name={star <= Math.floor(product.rating) ? 'star' : 'star-outline'}
                    size={16}
                    color={colors.warning}
                  />
                ))}
              </View>
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Text style={styles.reviewCount}>({product.reviewCount} reviews)</Text>
            </View>

            {/* Price */}
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatKES(product.price)}</Text>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>{formatKES(product.originalPrice)}</Text>
              )}
            </View>

            {/* Stock Status */}
            <View style={styles.stockContainer}>
              <Icon
                name={product.stock > 0 ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={product.stock > 0 ? colors.success : colors.error}
              />
              <Text style={[
                styles.stockText,
                { color: product.stock > 0 ? colors.success : colors.error }
              ]}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </Text>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>

            {/* Features */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Features</Text>
              {product.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon name="checkmark" size={16} color={colors.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Specifications */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Specifications</Text>
              {Object.entries(product.specifications).map(([key, value]) => (
                <View key={key} style={styles.specItem}>
                  <Text style={styles.specKey}>{key}:</Text>
                  <Text style={styles.specValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Qty:</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Icon name="remove" size={20} color={quantity <= 1 ? colors.textSecondary : colors.text} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock}
            >
              <Icon name="add" size={20} color={quantity >= product.stock ? colors.textSecondary : colors.text} />
            </TouchableOpacity>
          </View>

          <Button
            text={`Add to Cart - ${formatKES(product.price * quantity)}`}
            onPress={handleAddToCart}
            style={[styles.addToCartButton, product.stock === 0 && styles.disabledButton]}
          />
        </View>
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
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  wishlistButton: {
    padding: spacing.sm,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  productImage: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  activeIndicator: {
    backgroundColor: colors.primary,
    opacity: 1,
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  discountText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  productInfo: {
    padding: spacing.md,
  },
  brand: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 32,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stars: {
    flexDirection: 'row',
    marginRight: spacing.sm,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing.xs,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 18,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: spacing.md,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  stockText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  specKey: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  specValue: {
    fontSize: 16,
    color: colors.textSecondary,
    flex: 2,
    textAlign: 'right',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginRight: spacing.sm,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
