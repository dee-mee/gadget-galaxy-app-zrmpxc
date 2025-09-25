
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../../store';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import CartItem from '../../components/CartItem';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

export default function CartScreen() {
  const { items, total, itemCount } = useSelector((state: RootState) => state.cart);

  const tax = Math.round(total * 0.16); // 16% VAT in Kenya
  const shipping = total > 6500 ? 0 : 500; // Free shipping over KES 6,500
  const finalTotal = total + tax + shipping;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Shopping Cart</Text>
          </View>
          
          <View style={styles.emptyCart}>
            <Icon name="bag-outline" size={80} color={colors.textSecondary} />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <Text style={styles.emptyCartSubtext}>Add some products to get started</Text>
            <Button
              text="Continue Shopping"
              onPress={() => router.push('/(tabs)/home')}
              style={styles.continueShoppingButton}
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
          <Text style={styles.title}>Shopping Cart</Text>
          <Text style={styles.itemCount}>{itemCount} items</Text>
        </View>

        {/* Cart Items */}
        <ScrollView style={styles.itemsContainer} showsVerticalScrollIndicator={false}>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </ScrollView>

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>KES {total.toLocaleString()}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>KES {tax.toLocaleString()}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {shipping === 0 ? 'FREE' : `KES ${shipping.toLocaleString()}`}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>KES {finalTotal.toLocaleString()}</Text>
          </View>
          
          <Button
            text="Proceed to Checkout"
            onPress={handleCheckout}
            style={styles.checkoutButton}
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
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyCartText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptyCartSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  continueShoppingButton: {
    width: '100%',
    maxWidth: 300,
  },
  summaryContainer: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.text,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  checkoutButton: {
    marginTop: spacing.md,
  },
});
