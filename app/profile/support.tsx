
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

export default function SupportScreen() {
  const handleCall = () => {
    const phoneNumber = '+254700123456';
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const handleEmail = () => {
    const email = 'support@techstore.co.ke';
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const handleWhatsApp = () => {
    const phoneNumber = '254700123456';
    const message = 'Hello, I need help with my order.';
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed');
    });
  };

  const handleFAQ = () => {
    router.push('/profile/faq');
  };

  const handleLiveChat = () => {
    Alert.alert('Live Chat', 'Live chat feature coming soon!');
  };

  const supportOptions: SupportOption[] = [
    {
      id: 'call',
      title: 'Call Us',
      description: 'Speak directly with our support team',
      icon: 'call-outline',
      action: handleCall,
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: 'Chat with us on WhatsApp',
      icon: 'logo-whatsapp',
      action: handleWhatsApp,
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us an email and we&apos;ll respond within 24 hours',
      icon: 'mail-outline',
      action: handleEmail,
    },
    {
      id: 'live_chat',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: 'chatbubble-outline',
      action: handleLiveChat,
    },
    {
      id: 'faq',
      title: 'FAQ',
      description: 'Find answers to commonly asked questions',
      icon: 'help-circle-outline',
      action: handleFAQ,
    },
  ];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Help & Support</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Contact Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Get in Touch</Text>
            <Text style={styles.sectionDescription}>
              Choose the best way to reach us. We&apos;re here to help!
            </Text>

            {supportOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.supportOption}
                onPress={option.action}
                activeOpacity={0.7}
              >
                <View style={styles.optionIcon}>
                  <Icon name={option.icon as any} size={24} color={colors.primary} />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Business Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Hours</Text>
            <View style={styles.businessHours}>
              <View style={styles.hourItem}>
                <Text style={styles.dayText}>Monday - Friday</Text>
                <Text style={styles.timeText}>8:00 AM - 6:00 PM</Text>
              </View>
              <View style={styles.hourItem}>
                <Text style={styles.dayText}>Saturday</Text>
                <Text style={styles.timeText}>9:00 AM - 4:00 PM</Text>
              </View>
              <View style={styles.hourItem}>
                <Text style={styles.dayText}>Sunday</Text>
                <Text style={styles.timeText}>Closed</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => router.push('/orders')}
              >
                <Icon name="bag-outline" size={24} color={colors.primary} />
                <Text style={styles.quickActionText}>Track Order</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => router.push('/profile/addresses')}
              >
                <Icon name="location-outline" size={24} color={colors.primary} />
                <Text style={styles.quickActionText}>Update Address</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => router.push('/profile/payment-methods')}
              >
                <Icon name="card-outline" size={24} color={colors.primary} />
                <Text style={styles.quickActionText}>Payment Issues</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Icon name="call-outline" size={20} color={colors.primary} />
                <Text style={styles.contactText}>+254 700 123 456</Text>
              </View>
              <View style={styles.contactItem}>
                <Icon name="mail-outline" size={20} color={colors.primary} />
                <Text style={styles.contactText}>support@techstore.co.ke</Text>
              </View>
              <View style={styles.contactItem}>
                <Icon name="location-outline" size={20} color={colors.primary} />
                <Text style={styles.contactText}>Nairobi, Kenya</Text>
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
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  businessHours: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  contactInfo: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  contactText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: spacing.md,
  },
});
