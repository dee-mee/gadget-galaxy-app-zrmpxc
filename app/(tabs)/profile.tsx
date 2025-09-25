
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
}

function MenuItem({ icon, title, subtitle, onPress, showArrow = true }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <Icon name={icon as any} size={24} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            signOut();
            router.replace('/auth/login');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color={colors.primary} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {user?.role === 'admin' && (
              <View style={styles.adminBadge}>
                <Icon name="shield-checkmark" size={16} color={colors.primary} />
                <Text style={styles.adminBadgeText}>Administrator</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push('/profile/edit')}>
            <Icon name="create-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <MenuItem
            icon="bag-outline"
            title="My Orders"
            subtitle="Track your orders"
            onPress={() => router.push('/orders')}
          />
          
          <MenuItem
            icon="location-outline"
            title="Addresses"
            subtitle="Manage delivery addresses"
            onPress={() => router.push('/profile/addresses')}
          />
          
          <MenuItem
            icon="card-outline"
            title="Payment Methods"
            subtitle="Manage payment options"
            onPress={() => router.push('/profile/payment-methods')}
          />
          
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage notifications"
            onPress={() => router.push('/profile/notifications')}
          />
          
          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help and contact us"
            onPress={() => router.push('/profile/support')}
          />
          
          <MenuItem
            icon="information-circle-outline"
            title="About"
            subtitle="App version and info"
            onPress={() => router.push('/profile/about')}
          />
        </View>

        {/* Admin Section (if user is admin) */}
        {user?.role === 'admin' && (
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Administration</Text>
            <MenuItem
              icon="settings-outline"
              title="Admin Dashboard"
              subtitle="Manage the application"
              onPress={() => router.push('/admin')}
            />
            <MenuItem
              icon="cube-outline"
              title="Manage Products"
              subtitle="Add, edit, and remove products"
              onPress={() => router.push('/admin/products')}
            />
            <MenuItem
              icon="folder-outline"
              title="Manage Categories"
              subtitle="Organize product categories"
              onPress={() => router.push('/admin/categories')}
            />
            <MenuItem
              icon="receipt-outline"
              title="Manage Orders"
              subtitle="View and update order status"
              onPress={() => router.push('/admin/orders')}
            />
            <MenuItem
              icon="people-outline"
              title="Manage Users"
              subtitle="View and manage user accounts"
              onPress={() => router.push('/admin/users')}
            />
          </View>
        )}

        {/* Sign Out */}
        <View style={styles.menuSection}>
          <MenuItem
            icon="log-out-outline"
            title="Sign Out"
            onPress={handleSignOut}
            showArrow={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  adminBadgeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  menuSection: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    padding: spacing.md,
    paddingBottom: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
