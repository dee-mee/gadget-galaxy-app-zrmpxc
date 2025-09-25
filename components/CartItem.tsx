
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { CartItem as CartItemType } from '../types';
import { colors, spacing } from '../styles/commonStyles';
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice';
import { formatKES } from '../utils/currency';
import Icon from './Icon';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const dispatch = useDispatch();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(item.id));
    } else {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.product.images[0] }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.productInfo}>
            <Text style={styles.brand}>{item.product.brand}</Text>
            <Text style={styles.name} numberOfLines={2}>{item.product.name}</Text>
            <Text style={styles.price}>{formatKES(item.product.price)}</Text>
          </View>
          
          <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
            <Icon name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.quantity - 1)}
            >
              <Icon name="remove" size={16} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={styles.quantity}>{item.quantity}</Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.quantity + 1)}
            >
              <Icon name="add" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.totalPrice}>
            {formatKES(item.product.price * item.quantity)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  productInfo: {
    flex: 1,
  },
  brand: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginVertical: spacing.xs,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  removeButton: {
    padding: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    paddingHorizontal: spacing.xs,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: spacing.md,
    minWidth: 20,
    textAlign: 'center',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
});
