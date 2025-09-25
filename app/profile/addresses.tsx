
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../../store';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { Address } from '../../types';

export default function AddressesScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [addresses] = useState<Address[]>(user?.addresses || []);

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
          onPress: () => {
            console.log('Delete address:', addressId);
            // Implement delete logic here
          },
        },
      ]
    );
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

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {addresses.length === 0 ? (
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
                      {address.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.addressActions}>
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
                      {address.city}, {address.state} {address.zipCode}
                    </Text>
                    <Text style={styles.addressText}>
                      {address.country}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
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
  addressList: {
    paddingVertical: spacing.md,
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
