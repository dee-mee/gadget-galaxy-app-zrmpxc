
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { supabase } from '../integrations/supabase/client';
import { formatKES } from '../../utils/currency';
import { AdminStats } from '../../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  menuItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  menuIcon: {
    marginBottom: spacing.md,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  menuDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  recentOrderCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...commonStyles.shadow,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    overflow: 'hidden',
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

const menuItems = [
  {
    id: 'products',
    title: 'Products',
    description: 'Manage product catalog',
    icon: 'cube-outline',
    route: '/admin/products',
  },
  {
    id: 'categories',
    title: 'Categories',
    description: 'Manage product categories',
    icon: 'grid-outline',
    route: '/admin/categories',
  },
  {
    id: 'orders',
    title: 'Orders',
    description: 'View and manage orders',
    icon: 'receipt-outline',
    route: '/admin/orders',
  },
  {
    id: 'users',
    title: 'Users',
    description: 'Manage user accounts',
    icon: 'people-outline',
    route: '/admin/users',
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get stats
      const [productsResult, ordersResult, usersResult] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('id, total', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
      ]);

      // Get recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_user_id_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate total revenue
      const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

      setStats({
        totalProducts: productsResult.count || 0,
        totalOrders: ordersResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalRevenue,
        recentOrders: recentOrders || [],
        lowStockProducts: [], // TODO: Implement low stock check
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { backgroundColor: '#FEF3C7', color: '#92400E' };
      case 'confirmed':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
      case 'shipped':
        return { backgroundColor: '#E0E7FF', color: '#3730A3' };
      case 'delivered':
        return { backgroundColor: '#D1FAE5', color: '#065F46' };
      case 'cancelled':
        return { backgroundColor: '#FEE2E2', color: '#991B1B' };
      default:
        return { backgroundColor: colors.surface, color: colors.text };
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage your e-commerce store</Text>
        </View>

        {/* Stats Grid */}
        {stats && (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name="cube-outline" size={32} color={colors.primary} />
              <Text style={styles.statValue}>{stats.totalProducts}</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="receipt-outline" size={32} color={colors.primary} />
              <Text style={styles.statValue}>{stats.totalOrders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="people-outline" size={32} color={colors.primary} />
              <Text style={styles.statValue}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="cash-outline" size={32} color={colors.primary} />
              <Text style={styles.statValue}>{formatKES(stats.totalRevenue)}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
          </View>
        )}

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuIcon}>
                <Icon name={item.icon} size={40} color={colors.primary} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Orders */}
        {stats?.recentOrders && stats.recentOrders.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            {stats.recentOrders.map((order: any) => (
              <View key={order.id} style={styles.recentOrderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>#{order.id.slice(-8)}</Text>
                  <Text style={[styles.orderStatus, getStatusColor(order.status)]}>
                    {order.status.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.orderAmount}>{formatKES(order.total)}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.created_at).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
