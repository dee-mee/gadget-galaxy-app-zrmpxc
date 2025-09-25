
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../store';
import { colors, spacing, commonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import Button from '../components/Button';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return colors.warning;
    case 'confirmed':
      return colors.primary;
    case 'shipped':
      return colors.secondary;
    case 'delivered':
      return colors.success;
    case 'cancelled':
      return colors.error;
    default:
      return colors.textSecondary;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return 'time-outline';
    case 'confirmed':
      return 'checkmark-circle-outline';
    case 'shipped':
      return 'car-outline';
    case 'delivered':
      return 'checkmark-done-outline';
    case 'cancelled':
      return 'close-circle-outline';
    default:
      return 'help-circle-outline';
  }
};

export default function OrdersScreen() {
  const { orders } = useSelector((state: RootState) => state.orders);

  if (orders.length === 0) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>My Orders</Text>
          </View>
          
          <View style={styles.emptyOrders}>
            <Icon name="bag-outline" size={80} color={colors.textSecondary} />
            <Text style={styles.emptyOrdersText}>No orders yet</Text>
            <Text style={styles.emptyOrdersSubtext}>Start shopping to see your orders here</Text>
            <Button
              text="Start Shopping"
              onPress={() => router.push('/(tabs)/home')}
              style={styles.startShoppingButton}
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>My Orders</Text>
        </View>

        {/* Orders List */}
        <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => router.push(`/order/${order.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.statusContainer}>
                  <Icon
                    name={getStatusIcon(order.status) as any}
                    size={16}
                    color={getStatusColor(order.status)}
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.orderItems}>
                {order.items.slice(0, 2).map((item, index) => (
                  <Text key={index} style={styles.itemText}>
                    {item.quantity}× {item.product.name}
                  </Text>
                ))}
                {order.items.length > 2 && (
                  <Text style={styles.moreItems}>
                    +{order.items.length - 2} more items
                  </Text>
                )}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                <View style={styles.orderActions}>
                  {order.status === 'delivered' && (
                    <TouchableOpacity style={styles.reorderButton}>
                      <Text style={styles.reorderText}>Reorder</Text>
                    </TouchableOpacity>
                  )}
                  <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  ordersList: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...commonStyles.shadow,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  orderDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  orderItems: {
    marginBottom: spacing.md,
  },
  itemText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  moreItems: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  orderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reorderButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginRight: spacing.sm,
  },
  reorderText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyOrders: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyOrdersText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptyOrdersSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  startShoppingButton: {
    width: '100%',
    maxWidth: 300,
  },
});
