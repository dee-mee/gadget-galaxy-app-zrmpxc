
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles/commonStyles';
import Icon from './Icon';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFocus?: () => void;
  value?: string;
}

export default function SearchBar({ 
  placeholder = 'Search products...', 
  onSearch, 
  onFocus,
  value: controlledValue 
}: SearchBarProps) {
  const [query, setQuery] = useState(controlledValue || '');

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (text.trim() === '') {
      onSearch('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSearch}
          onFocus={onFocus}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Icon name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 25,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: spacing.sm,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: spacing.sm,
  },
});
