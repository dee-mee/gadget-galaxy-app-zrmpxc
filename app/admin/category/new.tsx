
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, commonStyles } from '../../../styles/commonStyles';
import { supabase } from '../../integrations/supabase/client';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Icon from '../../../components/Icon';

const CATEGORY_ICONS = [
  'phone-portrait-outline',
  'headset-outline',
  'battery-charging-outline',
  'watch-outline',
  'laptop-outline',
  'tablet-portrait-outline',
  'camera-outline',
  'game-controller-outline',
  'tv-outline',
  'car-outline',
  'home-outline',
  'fitness-outline',
];

export default function NewCategory() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'folder-outline',
    image_url: '',
  });

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          icon: formData.icon,
          image_url: formData.image_url.trim() || null,
        });

      if (error) {
        console.error('Error creating category:', error);
        Alert.alert('Error', 'Failed to create category');
        return;
      }

      Alert.alert('Success', 'Category created successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error creating category:', error);
      Alert.alert('Error', 'Failed to create category');
    } finally {
      setLoading(false);
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
          <Text style={styles.title}>Add Category</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <Input
              label="Category Name *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter category name"
            />

            <Input
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Enter category description"
              multiline
              numberOfLines={3}
            />

            <Input
              label="Image URL"
              value={formData.image_url}
              onChangeText={(text) => setFormData({ ...formData, image_url: text })}
              placeholder="https://example.com/image.jpg"
            />
          </View>

          {/* Icon Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category Icon</Text>
            <View style={styles.iconGrid}>
              {CATEGORY_ICONS.map((iconName) => (
                <TouchableOpacity
                  key={iconName}
                  style={[
                    styles.iconOption,
                    formData.icon === iconName && styles.iconOptionSelected
                  ]}
                  onPress={() => setFormData({ ...formData, icon: iconName })}
                >
                  <Icon
                    name={iconName as any}
                    size={24}
                    color={formData.icon === iconName ? colors.primary : colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewIcon}>
                <Icon name={formData.icon as any} size={32} color={colors.primary} />
              </View>
              <View style={styles.previewDetails}>
                <Text style={styles.previewName}>
                  {formData.name || 'Category Name'}
                </Text>
                <Text style={styles.previewDescription}>
                  {formData.description || 'Category description will appear here'}
                </Text>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.saveContainer}>
            <Button
              text="Create Category"
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
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconOption: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  previewCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  previewDetails: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  previewDescription: {
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
