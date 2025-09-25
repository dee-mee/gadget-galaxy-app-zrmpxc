
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: string;
}

export default function NotificationsScreen() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'order_updates',
      title: 'Order Updates',
      description: 'Get notified about your order status changes',
      enabled: true,
      icon: 'bag-outline',
    },
    {
      id: 'promotions',
      title: 'Promotions & Offers',
      description: 'Receive notifications about deals and discounts',
      enabled: true,
      icon: 'pricetag-outline',
    },
    {
      id: 'new_products',
      title: 'New Products',
      description: 'Be the first to know about new arrivals',
      enabled: false,
      icon: 'sparkles-outline',
    },
    {
      id: 'price_drops',
      title: 'Price Drops',
      description: 'Get alerted when items in your wishlist go on sale',
      enabled: true,
      icon: 'trending-down-outline',
    },
    {
      id: 'stock_alerts',
      title: 'Stock Alerts',
      description: 'Know when out-of-stock items are available again',
      enabled: false,
      icon: 'cube-outline',
    },
    {
      id: 'newsletter',
      title: 'Newsletter',
      description: 'Weekly updates and tech news',
      enabled: false,
      icon: 'mail-outline',
    },
  ]);

  const handleToggle = (settingId: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
    console.log('Toggled notification setting:', settingId);
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Notifications</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Push Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Push Notifications</Text>
            <Text style={styles.sectionDescription}>
              Manage your notification preferences to stay updated
            </Text>

            {settings.map((setting) => (
              <View key={setting.id} style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <Icon name={setting.icon as any} size={20} color={colors.primary} />
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                    <Text style={styles.settingDescription}>{setting.description}</Text>
                  </View>
                </View>
                <Switch
                  value={setting.enabled}
                  onValueChange={() => handleToggle(setting.id)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                />
              </View>
            ))}
          </View>

          {/* Email Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Email Preferences</Text>
            <View style={styles.emailPreferences}>
              <View style={styles.preferenceItem}>
                <Icon name="mail-outline" size={20} color={colors.primary} />
                <Text style={styles.preferenceText}>john.doe@example.com</Text>
                <TouchableOpacity>
                  <Icon name="create-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Notification Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quiet Hours</Text>
            <Text style={styles.sectionDescription}>
              Set times when you don&apos;t want to receive notifications
            </Text>
            
            <TouchableOpacity style={styles.scheduleItem}>
              <View style={styles.scheduleLeft}>
                <Icon name="moon-outline" size={20} color={colors.primary} />
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleTitle}>Do Not Disturb</Text>
                  <Text style={styles.scheduleTime}>10:00 PM - 8:00 AM</Text>
                </View>
              </View>
              <Switch
                value={true}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </TouchableOpacity>
          </View>

          {/* Notification History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
            <View style={styles.notificationHistory}>
              <View style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Icon name="bag-outline" size={16} color={colors.success} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>Order Delivered</Text>
                  <Text style={styles.historyTime}>2 hours ago</Text>
                </View>
              </View>
              
              <View style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Icon name="pricetag-outline" size={16} color={colors.warning} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>Flash Sale Started</Text>
                  <Text style={styles.historyTime}>1 day ago</Text>
                </View>
              </View>
              
              <View style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Icon name="trending-down-outline" size={16} color={colors.primary} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>Price Drop Alert</Text>
                  <Text style={styles.historyTime}>3 days ago</Text>
                </View>
              </View>
            </View>
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
  placeholder: {
    width: 40,
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
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  emailPreferences: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  preferenceText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: spacing.md,
    flex: 1,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleInfo: {
    marginLeft: spacing.md,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  scheduleTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  notificationHistory: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  historyTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
