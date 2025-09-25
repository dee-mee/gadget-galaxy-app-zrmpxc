
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../../store';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import { supabase } from '../integrations/supabase/client';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Icon from '../../components/Icon';

export default function AddAddressScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Kenya',
    isDefault: false,
  });

  const handleSave = async () => {
    if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not found');
      return;
    }

    setLoading(true);
    try {
      // If this is set as default, update other addresses to not be default
      if (formData.isDefault) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          type: formData.type,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          country: formData.country,
          is_default: formData.isDefault,
        });

      if (error) {
        console.error('Error saving address:', error);
        Alert.alert('Error', 'Failed to save address');
        return;
      }

      Alert.alert('Success', 'Address saved successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const addressTypes = [
    { value: 'home', label: 'Home', icon: 'home-outline' },
    { value: 'work', label: 'Work', icon: 'business-outline' },
    { value: 'other', label: 'Other', icon: 'location-outline' },
  ];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Add Address</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Address Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Type</Text>
            <View style={styles.typeSelector}>
              {addressTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeOption,
                    formData.type === type.value && styles.typeOptionSelected
                  ]}
                  onPress={() => setFormData({ ...formData, type: type.value as any })}
                >
                  <Icon
                    name={type.icon as any}
                    size={24}
                    color={formData.type === type.value ? colors.primary : colors.textSecondary}
                  />
                  <Text style={[
                    styles.typeLabel,
                    formData.type === type.value && styles.typeLabelSelected
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Address Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Details</Text>
            
            <Input
              label="Street Address *"
              value={formData.street}
              onChangeText={(text) => setFormData({ ...formData, street: text })}
              placeholder="Enter street address"
              multiline
              numberOfLines={2}
            />

            <Input
              label="City *"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              placeholder="Enter city"
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  label="State/County *"
                  value={formData.state}
                  onChangeText={(text) => setFormData({ ...formData, state: text })}
                  placeholder="Enter state"
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  label="Postal Code *"
                  value={formData.zipCode}
                  onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
                  placeholder="Enter postal code"
                />
              </View>
            </View>

            <Input
              label="Country"
              value={formData.country}
              onChangeText={(text) => setFormData({ ...formData, country: text })}
              placeholder="Enter country"
            />
          </View>

          {/* Default Address */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.defaultOption}
              onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
            >
              <View style={styles.defaultOptionLeft}>
                <Icon
                  name={formData.isDefault ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={formData.isDefault ? colors.primary : colors.textSecondary}
                />
                <View style={styles.defaultOptionText}>
                  <Text style={styles.defaultOptionTitle}>Set as default address</Text>
                  <Text style={styles.defaultOptionSubtitle}>
                    Use this address as your default shipping address
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <View style={styles.saveContainer}>
            <Button
              text="Save Address"
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
            />
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
  section: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  typeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  typeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  typeLabelSelected: {
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  defaultOption: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  defaultOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultOptionText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  defaultOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  defaultOptionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  saveContainer: {
    paddingVertical: spacing.xl,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
});
