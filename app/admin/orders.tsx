
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import { supabase } from '../integrations/supabase/client';
import { Order } from '../../types';
import { formatKES } from '../../utils/currency';
import Icon from '../../components/Icon';
import { useDataSync } from '../../hooks/useDataSync';

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

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { updateOrderStatus: updateOrderStatusSync } = useDataSync();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading orders:', error);
        Alert.alert('Error', 'Failed to load orders');
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const result = await updateOrderStatusSync(orderId, newStatus);
    
    if (result.success) {
      Alert.alert('Success', 'Order status updated successfully');
      loadOrders(); // Refresh the list
    } else {
      Alert.alert('Error', result.error || 'Failed to update order status');
    }
  };

  const handleStatusChange = (orderId: string, currentStatus: string) => {
    const statusOptions = [
      { label: 'Pending', value: 'pending' },
      { label: 'Confirmed', value: 'confirmed' },
      { label: 'Shipped', value: 'shipped' },
      { label: 'Delivered', value: 'delivered' },
      { label: 'Cancelled', value: 'cancelled' },
    ];

    Alert.alert(
      'Update Order Status',
      'Select new status:',
      [
        ...statusOptions.map(option => ({
          text: option.label,
          onPress: () => {
            if (option.value !== currentStatus) {
              updateOrderStatus(orderId, option.value);
            }
          },
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Manage Orders</Text>
        </View>

        {/* Search and Filter */}
        <View style={styles.filtersContainer}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search orders..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilters}>
            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
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
        </View>

        {/* Orders List */}
        <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading orders...</Text>
            </View>
          ) : filteredOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="bag-outline" size={80} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No orders found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Orders will appear here when customers place them'}
              </Text>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>Order #{order.id.slice(0, 8)}</Text>
                    <Text style={styles.orderDate}>
                      {new Date(order.order_date).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}
                    onPress={() => handleStatusChange(order.id, order.status)}
                  >
                    <Icon
                      name={getStatusIcon(order.status) as any}
                      size={16}
                      color={getStatusColor(order.status)}
                    />
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.orderDetails}>
                  <Text style={styles.orderTotal}>{formatKES(order.total)}</Text>
                  <Text style={styles.orderItems}>
                    {order.order_items?.length || 0} items
                  </Text>
                </View>

                <View style={styles.orderActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push(`/admin/order/${order.id}`)}
                  >
                    <Icon name="eye-outline" size={20} color={colors.primary} />
                    <Text style={styles.actionButtonText}>View</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleStatusChange(order.id, order.status)}
                  >
                    <Icon name="create-outline" size={20} color={colors.secondary} />
                    <Text style={styles.actionButtonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  filtersContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  statusFilters: {
    flexDirection: 'row',
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
    paddingVertical: spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  orderItems: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: spacing.xs,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: spacing.xs,
  },
});
