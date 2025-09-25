
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../../store';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import { supabase } from '../integrations/supabase/client';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

interface Address {
  id: string;
  user_id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export default function AddressesScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadAddresses();
    }
  }, [user?.id]);

  const loadAddresses = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading addresses:', error);
        Alert.alert('Error', 'Failed to load addresses');
        return;
      }

      setAddresses(data || []);
    } catch (error) {
      console.error('Error loading addresses:', error);
      Alert.alert('Error', 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAddresses();
    setRefreshing(false);
  };

  const handleAddAddress = () => {
    router.push('/profile/add-address');
  };

  const handleEditAddress = (address: Address) => {
    router.push(`/profile/edit-address/${address.id}`);
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('addresses')
                .delete()
                .eq('id', addressId);

              if (error) {
                console.error('Error deleting address:', error);
                Alert.alert('Error', 'Failed to delete address');
                return;
              }

              Alert.alert('Success', 'Address deleted successfully');
              loadAddresses();
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'Failed to delete address');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      // First, set all addresses to not default
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Then set the selected address as default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) {
        console.error('Error setting default address:', error);
        Alert.alert('Error', 'Failed to set default address');
        return;
      }

      loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      Alert.alert('Error', 'Failed to set default address');
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home':
        return 'home-outline';
      case 'work':
        return 'business-outline';
      default:
        return 'location-outline';
    }
  };

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case 'home':
        return 'Home';
      case 'work':
        return 'Work';
      default:
        return 'Other';
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
          <Text style={styles.title}>Addresses</Text>
          <TouchableOpacity onPress={handleAddAddress} style={styles.addButton}>
            <Icon name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading addresses...</Text>
            </View>
          ) : addresses.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="location-outline" size={80} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>No addresses saved</Text>
              <Text style={styles.emptyStateSubtext}>Add an address to get started</Text>
              <Button
                text="Add Address"
                onPress={handleAddAddress}
                style={styles.addAddressButton}
              />
            </View>
          ) : (
            <>
              {/* Add Address Button */}
              <View style={styles.addAddressContainer}>
                <Button
                  text="Add New Address"
                  onPress={handleAddAddress}
                  style={styles.addNewAddressButton}
                />
              </View>

              <View style={styles.addressList}>
                {addresses.map((address) => (
                  <View key={address.id} style={styles.addressCard}>
                    <View style={styles.addressHeader}>
                      <View style={styles.addressTypeContainer}>
                        <Icon
                          name={getAddressTypeIcon(address.type) as any}
                          size={20}
                          color={colors.primary}
                        />
                        <Text style={styles.addressType}>
                          {getAddressTypeLabel(address.type)}
                        </Text>
                        {address.is_default && (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultBadgeText}>Default</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.addressActions}>
                        {!address.is_default && (
                          <TouchableOpacity
                            onPress={() => handleSetDefault(address.id)}
                            style={styles.actionButton}
                          >
                            <Icon name="star-outline" size={20} color={colors.warning} />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={() => handleEditAddress(address)}
                          style={styles.actionButton}
                        >
                          <Icon name="create-outline" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeleteAddress(address.id)}
                          style={styles.actionButton}
                        >
                          <Icon name="trash-outline" size={20} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View style={styles.addressDetails}>
                      <Text style={styles.addressText}>
                        {address.street}
                      </Text>
                      <Text style={styles.addressText}>
                        {address.city}, {address.state} {address.zip_code}
                      </Text>
                      <Text style={styles.addressText}>
                        {address.country}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    padding: spacing.sm,
  },
  content: {
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
  addAddressButton: {
    width: '100%',
    maxWidth: 300,
  },
  addAddressContainer: {
    paddingVertical: spacing.md,
  },
  addNewAddressButton: {
    backgroundColor: colors.primary,
  },
  addressList: {
    paddingBottom: spacing.md,
  },
  addressCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.sm,
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
  addressActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  addressDetails: {
    paddingLeft: spacing.lg,
  },
  addressText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
