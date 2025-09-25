
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      Alert.alert(
        'Reset Link Sent',
        'We have sent a password reset link to your email address.',
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  if (emailSent) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Icon name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Icon name="mail" size={60} color={colors.success} />
            </View>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successText}>
              We've sent a password reset link to {email}
            </Text>
            <Text style={styles.successSubtext}>
              Click the link in the email to reset your password. If you don't see the email, check your spam folder.
            </Text>

            <Button
              text="Back to Login"
              onPress={() => router.push('/auth/login')}
              style={styles.backToLoginButton}
            />

            <TouchableOpacity onPress={() => setEmailSent(false)}>
              <Text style={styles.resendLink}>Resend Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.iconContainer}>
            <Icon name="lock-closed" size={60} color={colors.primary} />
          </View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />

          <Button
            text={isLoading ? "Sending..." : "Send Reset Link"}
            onPress={handleResetPassword}
            style={[styles.resetButton, isLoading && styles.disabledButton]}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: spacing.lg,
    padding: spacing.sm,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  resetButton: {
    marginBottom: spacing.lg,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  successText: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontWeight: '500',
  },
  successSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  backToLoginButton: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  resendLink: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
});
