
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, commonStyles } from '../../styles/commonStyles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const { register, isLoading } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    // Reset errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validation
    let hasError = false;
    
    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      hasError = true;
    }

    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    const result = await register(email, password, firstName, lastName);
    
    if (result.success) {
      router.replace('/(tabs)/home');
    } else {
      Alert.alert('Registration Failed', result.error || 'Please try again');
    }
  };

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
          
          <View style={styles.logoContainer}>
            <Icon name="storefront" size={60} color={colors.primary} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <Input
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              error={firstNameError}
              containerStyle={styles.nameInput}
            />
            <Input
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              error={lastNameError}
              containerStyle={styles.nameInput}
            />
          </View>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
            error={passwordError}
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
            error={confirmPasswordError}
          />

          <Button
            text={isLoading ? "Creating Account..." : "Create Account"}
            onPress={handleSignup}
            style={[styles.signupButton, isLoading && styles.disabledButton]}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
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
    paddingVertical: spacing.lg,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: spacing.lg,
    padding: spacing.sm,
  },
  logoContainer: {
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
  },
  form: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    flex: 1,
    marginRight: spacing.sm,
  },
  signupButton: {
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
});
