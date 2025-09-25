
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import { supabase } from '../integrations/supabase/client';
import Icon from '../../components/Icon';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
        Alert.alert('Error', 'Failed to load users');
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        Alert.alert('Error', 'Failed to update user role');
        return;
      }

      Alert.alert('Success', `User role updated to ${newRole}`);
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      Alert.alert('Error', 'Failed to update user role');
    }
  };

  const handleRoleChange = (user: UserProfile) => {
    Alert.alert(
      'Change User Role',
      `Change ${user.first_name} ${user.last_name}'s role?`,
      [
        {
          text: 'Make Admin',
          onPress: () => updateUserRole(user.id, 'admin'),
          style: user.role === 'admin' ? 'cancel' : 'default',
        },
        {
          text: 'Make User',
          onPress: () => updateUserRole(user.id, 'user'),
          style: user.role === 'user' ? 'cancel' : 'default',
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Manage Users</Text>
        </View>

        {/* Search and Filter */}
        <View style={styles.filtersContainer}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.roleFilters}>
            {['all', 'user', 'admin'].map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleFilter,
                  roleFilter === role && styles.roleFilterActive
                ]}
                onPress={() => setRoleFilter(role)}
              >
                <Text style={[
                  styles.roleFilterText,
                  roleFilter === role && styles.roleFilterTextActive
                ]}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{users.filter(u => u.role === 'admin').length}</Text>
            <Text style={styles.statLabel}>Admins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{users.filter(u => u.role === 'user').length}</Text>
            <Text style={styles.statLabel}>Regular Users</Text>
          </View>
        </View>

        {/* Users List */}
        <ScrollView style={styles.usersList} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading users...</Text>
            </View>
          ) : filteredUsers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="people-outline" size={80} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No users found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery || roleFilter !== 'all' ? 'Try adjusting your filters' : 'Users will appear here when they register'}
              </Text>
            </View>
          ) : (
            filteredUsers.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <View style={styles.userAvatar}>
                    <Icon name="person" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>
                      {user.first_name} {user.last_name}
                    </Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    {user.phone && (
                      <Text style={styles.userPhone}>{user.phone}</Text>
                    )}
                    <Text style={styles.userDate}>
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.userActions}>
                  <View style={[
                    styles.roleBadge,
                    { backgroundColor: user.role === 'admin' ? colors.primary + '20' : colors.backgroundAlt }
                  ]}>
                    <Icon
                      name={user.role === 'admin' ? 'shield-checkmark' : 'person'}
                      size={16}
                      color={user.role === 'admin' ? colors.primary : colors.textSecondary}
                    />
                    <Text style={[
                      styles.roleText,
                      { color: user.role === 'admin' ? colors.primary : colors.textSecondary }
                    ]}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRoleChange(user)}
                  >
                    <Icon name="create-outline" size={20} color={colors.secondary} />
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
  roleFilters: {
    flexDirection: 'row',
  },
  roleFilter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  roleFilterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleFilterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  roleFilterTextActive: {
    color: colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  usersList: {
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
  userCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  userPhone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  userDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  userActions: {
    alignItems: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  actionButton: {
    padding: spacing.sm,
  },
});
