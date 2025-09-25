
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../store';
import { clearCart } from '../store/slices/cartSlice';
import { colors, spacing, commonStyles } from '../styles/commonStyles';
import { formatKES, calculateTax, calculateShipping } from '../utils/currency';
import Input from '../components/Input';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { useDataSync } from '../hooks/useDataSync';

export default function CheckoutScreen() {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const { createOrder } = useDataSync();

  const [shippingAddress, setShippingAddress] = useState({
    street: user?.addresses[0]?.street || '',
    city: user?.addresses[0]?.city || '',
    state: user?.addresses[0]?.state || '',
    zipCode: user?.addresses[0]?.zipCode || '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash_on_delivery'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const tax = calculateTax(total); // 16% VAT in Kenya
  const shipping = calculateShipping(total); // Free shipping over KES 6,500
  const finalTotal = total + tax + shipping;

  const handlePlaceOrder = async () => {
    // Validate shipping address
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      Alert.alert('Error', 'Please fill in all shipping address fields');
      return;
    }

    // Validate payment method
    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: items.map(item => ({
          id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        subtotal: total,
        tax,
        shipping,
        total: finalTotal,
        shippingAddress: {
          ...shippingAddress,
          country: 'Kenya',
        },
        paymentMethod: {
          type: paymentMethod,
          ...(paymentMethod === 'card' && {
            cardLast4: cardDetails.number.slice(-4),
            cardBrand: 'Visa',
          }),
        }
      };

      const result = await createOrder(orderData);

      if (result.success) {
        dispatch(clearCart());
        
        Alert.alert(
          'Order Placed Successfully!',
          `Your order has been placed and will be delivered within 7 days.`,
          [
            {
              text: 'View Orders',
              onPress: () => router.push('/orders'),
            },
            {
              text: 'Continue Shopping',
              onPress: () => router.push('/(tabs)/home'),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
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
          <Text style={styles.title}>Checkout</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.orderSummary}>
              {items.map((item) => (
                <View key={item.id} style={styles.orderItem}>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  <Text style={styles.itemDetails}>
                    {item.quantity} × {formatKES(item.product.price)} = {formatKES(item.quantity * item.product.price)}
                  </Text>
                </View>
              ))}
              
              <View style={styles.divider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatKES(total)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>{formatKES(tax)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>
                  {shipping === 0 ? 'FREE' : formatKES(shipping)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatKES(finalTotal)}</Text>
              </View>
            </View>
          </View>

          {/* Shipping Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <Input
              label="Street Address"
              value={shippingAddress.street}
              onChangeText={(text) => setShippingAddress(prev => ({ ...prev, street: text }))}
              placeholder="Enter street address"
            />
            <View style={styles.row}>
              <Input
                label="City"
                value={shippingAddress.city}
                onChangeText={(text) => setShippingAddress(prev => ({ ...prev, city: text }))}
                placeholder="City"
                containerStyle={styles.halfInput}
              />
              <Input
                label="State"
                value={shippingAddress.state}
                onChangeText={(text) => setShippingAddress(prev => ({ ...prev, state: text }))}
                placeholder="State"
                containerStyle={styles.halfInput}
              />
            </View>
            <Input
              label="ZIP Code"
              value={shippingAddress.zipCode}
              onChangeText={(text) => setShippingAddress(prev => ({ ...prev, zipCode: text }))}
              placeholder="ZIP Code"
              keyboardType="numeric"
            />
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            
            <View style={styles.paymentMethods}>
              <TouchableOpacity
                style={[styles.paymentMethod, paymentMethod === 'card' && styles.selectedPaymentMethod]}
                onPress={() => setPaymentMethod('card')}
              >
                <Icon name="card" size={24} color={paymentMethod === 'card' ? colors.primary : colors.textSecondary} />
                <Text style={[styles.paymentMethodText, paymentMethod === 'card' && styles.selectedPaymentMethodText]}>
                  Credit/Debit Card
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.paymentMethod, paymentMethod === 'cash_on_delivery' && styles.selectedPaymentMethod]}
                onPress={() => setPaymentMethod('cash_on_delivery')}
              >
                <Icon name="cash" size={24} color={paymentMethod === 'cash_on_delivery' ? colors.primary : colors.textSecondary} />
                <Text style={[styles.paymentMethodText, paymentMethod === 'cash_on_delivery' && styles.selectedPaymentMethodText]}>
                  Cash on Delivery
                </Text>
              </TouchableOpacity>
            </View>

            {paymentMethod === 'card' && (
              <View style={styles.cardDetails}>
                <Input
                  label="Card Number"
                  value={cardDetails.number}
                  onChangeText={(text) => setCardDetails(prev => ({ ...prev, number: text }))}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                />
                <View style={styles.row}>
                  <Input
                    label="Expiry Date"
                    value={cardDetails.expiry}
                    onChangeText={(text) => setCardDetails(prev => ({ ...prev, expiry: text }))}
                    placeholder="MM/YY"
                    containerStyle={styles.halfInput}
                  />
                  <Input
                    label="CVV"
                    value={cardDetails.cvv}
                    onChangeText={(text) => setCardDetails(prev => ({ ...prev, cvv: text }))}
                    placeholder="123"
                    keyboardType="numeric"
                    containerStyle={styles.halfInput}
                  />
                </View>
                <Input
                  label="Cardholder Name"
                  value={cardDetails.name}
                  onChangeText={(text) => setCardDetails(prev => ({ ...prev, name: text }))}
                  placeholder="John Doe"
                />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Place Order Button */}
        <View style={styles.bottomActions}>
          <Button
            text={isProcessing ? 'Processing...' : `Place Order - ${formatKES(finalTotal)}`}
            onPress={handlePlaceOrder}
            style={[styles.placeOrderButton, isProcessing && styles.disabledButton]}
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
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  section: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  orderSummary: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderItem: {
    marginBottom: spacing.sm,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  itemDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: spacing.sm,
  },
  paymentMethods: {
    marginBottom: spacing.md,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedPaymentMethod: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundAlt,
  },
  paymentMethodText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: spacing.md,
    fontWeight: '500',
  },
  selectedPaymentMethodText: {
    color: colors.primary,
    fontWeight: '600',
  },
  cardDetails: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bottomActions: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  placeOrderButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
