
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money';
  cardLast4?: string;
  cardBrand?: string;
  cardExpiry?: string;
  mobileNumber?: string;
  provider?: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      cardLast4: '4242',
      cardBrand: 'Visa',
      cardExpiry: '12/25',
      isDefault: true,
    },
    {
      id: '2',
      type: 'mobile_money',
      mobileNumber: '254712345678',
      provider: 'M-Pesa',
      isDefault: false,
    },
  ]);

  const handleAddPaymentMethod = () => {
    router.push('/profile/add-payment-method');
  };

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    router.push(`/profile/edit-payment-method/${method.id}`);
  };

  const handleDeletePaymentMethod = (methodId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Delete payment method:', methodId);
            // Implement delete logic here
          },
        },
      ]
    );
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    if (method.type === 'card') {
      switch (method.cardBrand?.toLowerCase()) {
        case 'visa':
          return 'card-outline';
        case 'mastercard':
          return 'card-outline';
        default:
          return 'card-outline';
      }
    } else {
      return 'phone-portrait-outline';
    }
  };

  const getPaymentMethodTitle = (method: PaymentMethod) => {
    if (method.type === 'card') {
      return `${method.cardBrand} •••• ${method.cardLast4}`;
    } else {
      return `${method.provider} ${method.mobileNumber}`;
    }
  };

  const getPaymentMethodSubtitle = (method: PaymentMethod) => {
    if (method.type === 'card') {
      return `Expires ${method.cardExpiry}`;
    } else {
      return 'Mobile Money';
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
          <Text style={styles.title}>Payment Methods</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Add Payment Method Button */}
          <View style={styles.addMethodContainer}>
            <Button
              text="Add Payment Method"
              onPress={handleAddPaymentMethod}
              style={styles.addMethodButton}
            />
          </View>

          {paymentMethods.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="card-outline" size={80} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>No payment methods</Text>
              <Text style={styles.emptyStateSubtext}>Add a payment method to get started</Text>
            </View>
          ) : (
            <View style={styles.paymentMethodsList}>
              <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
              {paymentMethods.map((method) => (
                <View key={method.id} style={styles.paymentMethodCard}>
                  <View style={styles.paymentMethodHeader}>
                    <View style={styles.paymentMethodInfo}>
                      <Icon
                        name={getPaymentMethodIcon(method) as any}
                        size={24}
                        color={colors.primary}
                      />
                      <View style={styles.paymentMethodDetails}>
                        <Text style={styles.paymentMethodTitle}>
                          {getPaymentMethodTitle(method)}
                        </Text>
                        <Text style={styles.paymentMethodSubtitle}>
                          {getPaymentMethodSubtitle(method)}
                        </Text>
                      </View>
                      {method.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.paymentMethodActions}>
                      <TouchableOpacity
                        onPress={() => handleEditPaymentMethod(method)}
                        style={styles.actionButton}
                      >
                        <Icon name="create-outline" size={20} color={colors.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeletePaymentMethod(method.id)}
                        style={styles.actionButton}
                      >
                        <Icon name="trash-outline" size={20} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Popular Payment Methods in Kenya */}
          <View style={styles.popularMethods}>
            <Text style={styles.popularMethodsTitle}>Popular in Kenya</Text>
            <View style={styles.popularMethodsGrid}>
              <TouchableOpacity style={styles.popularMethodCard}>
                <Icon name="phone-portrait-outline" size={32} color={colors.success} />
                <Text style={styles.popularMethodText}>M-Pesa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.popularMethodCard}>
                <Icon name="phone-portrait-outline" size={32} color={colors.primary} />
                <Text style={styles.popularMethodText}>Airtel Money</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.popularMethodCard}>
                <Icon name="card-outline" size={32} color={colors.warning} />
                <Text style={styles.popularMethodText}>Visa/Mastercard</Text>
              </TouchableOpacity>
            </View>
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
  addMethodContainer: {
    paddingVertical: spacing.md,
  },
  addMethodButton: {
    backgroundColor: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  paymentMethodsList: {
    paddingVertical: spacing.md,
  },
  paymentMethodCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodDetails: {
    marginLeft: spacing.md,
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  paymentMethodSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  defaultBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: colors.background,
    fontWeight: '500',
  },
  paymentMethodActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  popularMethods: {
    marginTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  popularMethodsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  popularMethodsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popularMethodCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  popularMethodText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
