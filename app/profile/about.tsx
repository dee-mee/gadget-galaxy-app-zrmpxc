
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';

export default function AboutScreen() {
  const appVersion = '1.0.0';
  const buildNumber = '100';

  const handleRateApp = () => {
    // In a real app, this would open the app store
    console.log('Rate app');
  };

  const handleShareApp = () => {
    // In a real app, this would open the share dialog
    console.log('Share app');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://techstore.co.ke/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://techstore.co.ke/terms');
  };

  const handleWebsite = () => {
    Linking.openURL('https://techstore.co.ke');
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>About</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* App Info */}
          <View style={styles.appInfo}>
            <View style={styles.appIcon}>
              <Icon name="phone-portrait-outline" size={48} color={colors.primary} />
            </View>
            <Text style={styles.appName}>TechStore Kenya</Text>
            <Text style={styles.appTagline}>Your Electronics Shopping Destination</Text>
            <Text style={styles.appVersion}>Version {appVersion} ({buildNumber})</Text>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About TechStore</Text>
            <Text style={styles.aboutText}>
              TechStore Kenya is your premier destination for the latest electronics and gadgets. 
              We offer a wide range of smartphones, earphones, chargers, and accessories from 
              top brands at competitive prices.
            </Text>
            <Text style={styles.aboutText}>
              Founded in 2024, we are committed to providing excellent customer service and 
              fast delivery across Kenya. Our mission is to make technology accessible to everyone.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.featureText}>Wide range of electronics</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.featureText}>Secure payment options</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.featureText}>Fast delivery across Kenya</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.featureText}>24/7 customer support</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.featureText}>Easy returns and refunds</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support Us</Text>
            <TouchableOpacity style={styles.actionItem} onPress={handleRateApp}>
              <View style={styles.actionLeft}>
                <Icon name="star-outline" size={24} color={colors.warning} />
                <Text style={styles.actionText}>Rate this App</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleShareApp}>
              <View style={styles.actionLeft}>
                <Icon name="share-outline" size={24} color={colors.primary} />
                <Text style={styles.actionText}>Share with Friends</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Legal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            <TouchableOpacity style={styles.actionItem} onPress={handlePrivacyPolicy}>
              <View style={styles.actionLeft}>
                <Icon name="shield-outline" size={24} color={colors.textSecondary} />
                <Text style={styles.actionText}>Privacy Policy</Text>
              </View>
              <Icon name="open-outline" size={16} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleTermsOfService}>
              <View style={styles.actionLeft}>
                <Icon name="document-text-outline" size={24} color={colors.textSecondary} />
                <Text style={styles.actionText}>Terms of Service</Text>
              </View>
              <Icon name="open-outline" size={16} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleWebsite}>
              <View style={styles.actionLeft}>
                <Icon name="globe-outline" size={24} color={colors.textSecondary} />
                <Text style={styles.actionText}>Visit Website</Text>
              </View>
              <Icon name="open-outline" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Icon name="mail-outline" size={20} color={colors.primary} />
                <Text style={styles.contactText}>info@techstore.co.ke</Text>
              </View>
              <View style={styles.contactItem}>
                <Icon name="call-outline" size={20} color={colors.primary} />
                <Text style={styles.contactText}>+254 700 123 456</Text>
              </View>
              <View style={styles.contactItem}>
                <Icon name="location-outline" size={20} color={colors.primary} />
                <Text style={styles.contactText}>Nairobi, Kenya</Text>
              </View>
            </View>
          </View>

          {/* Copyright */}
          <View style={styles.footer}>
            <Text style={styles.copyrightText}>
              © 2024 TechStore Kenya. All rights reserved.
            </Text>
            <Text style={styles.madeWithText}>
              Made with ❤️ in Kenya
            </Text>
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
  appInfo: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  appTagline: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  appVersion: {
    fontSize: 14,
    color: colors.textSecondary,
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
  aboutText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  featuresList: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: spacing.md,
  },
  actionItem: {
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
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: spacing.md,
    fontWeight: '500',
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
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginTop: spacing.lg,
  },
  copyrightText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  madeWithText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
