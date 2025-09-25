
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../store';
import { colors, spacing, commonStyles } from '../styles/commonStyles';
import { formatKES } from '../utils/currency';
import { Order } from '../types';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { useDataSync } from '../hooks/useDataSync';

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

const getStatusProgress = (status: string) => {
  switch (status) {
    case 'pending':
      return 25;
    case 'confirmed':
      return 50;
    case 'shipped':
      return 75;
    case 'delivered':
      return 100;
    case 'cancelled':
      return 0;
    default:
      return 0;
  }
};

export default function OrdersScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { syncOrders } = useDataSync();

  const onRefresh = async () => {
    setRefreshing(true);
    await syncOrders();
    setRefreshing(false);
  };

  const handleReorder = async (order: Order) => {
    // Add order items to cart and navigate to cart
    console.log('Reorder:', order.id);
    // Implementation would add items to cart
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>My Orders</Text>
          </View>
          
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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

        {/* Status Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilters}>
          {['all', 'pending', 'confirmed', 'shipped', 'delivered'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusFilter,
                statusFilter === status && styles.statusFilterActive
              ]}
              onPress={() => setStatusFilter(status)}
            >
              <Text style={[
                styles.statusFilterText,
                statusFilter === status && styles.statusFilterTextActive
              ]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Orders List */}
        <ScrollView 
          style={styles.ordersList} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyFiltered}>
              <Icon name="filter-outline" size={60} color={colors.textSecondary} />
              <Text style={styles.emptyFilteredText}>No {statusFilter} orders</Text>
              <Text style={styles.emptyFilteredSubtext}>Try selecting a different filter</Text>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => router.push(`/order/${order.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>Order #{order.id.slice(0, 8)}</Text>
                    <Text style={styles.orderDate}>
                      {new Date(order.order_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${getStatusProgress(order.status)}%`,
                          backgroundColor: getStatusColor(order.status)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {getStatusProgress(order.status)}% Complete
                  </Text>
                </View>

                <View style={styles.orderItems}>
                  {order.order_items?.slice(0, 2).map((item, index) => (
                    <Text key={index} style={styles.itemText}>
                      {item.quantity}× {item.products?.name || 'Product'}
                    </Text>
                  ))}
                  {(order.order_items?.length || 0) > 2 && (
                    <Text style={styles.moreItems}>
                      +{(order.order_items?.length || 0) - 2} more items
                    </Text>
                  )}
                </View>

                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotal}>{formatKES(order.total)}</Text>
                  <View style={styles.orderActions}>
                    {order.status === 'delivered' && (
                      <TouchableOpacity 
                        style={styles.reorderButton}
                        onPress={() => handleReorder(order)}
                      >
                        <Text style={styles.reorderText}>Reorder</Text>
                      </TouchableOpacity>
                    )}
                    {order.tracking_number && (
                      <TouchableOpacity style={styles.trackButton}>
                        <Icon name="location-outline" size={16} color={colors.primary} />
                        <Text style={styles.trackText}>Track</Text>
                      </TouchableOpacity>
                    )}
                    <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
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
  statusFilters: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  statusFilter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  statusFilterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusFilterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  statusFilterTextActive: {
    color: colors.background,
  },
  ordersList: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
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
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'right',
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
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  trackText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: spacing.xs,
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
  emptyFiltered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyFilteredText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
  },
  emptyFilteredSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
