import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput as RNTextInput, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, value, onChange }) => {
  const inputRef = useRef<RNTextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress} style={styles.inputsContainer}>
        {Array.from({ length }).map((_, index) => {
          const char = value[index] || '';
          const isCurrentDigit = index === value.length;
          const isActive = isFocused && isCurrentDigit;

          return (
            <View
              key={index}
              style={[
                styles.cell,
                isActive && styles.cellActive,
                char ? styles.cellFilled : null,
              ]}
            >
              <RNTextInput
                value={char}
                editable={false}
                style={styles.cellText}
              />
            </View>
          );
        })}
      </Pressable>
      <RNTextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          if (text.length <= length) {
            onChange(text);
          }
        }}
        keyboardType="number-pad"
        maxLength={length}
        style={styles.hiddenInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    alignItems: 'center',
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cell: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellActive: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  cellFilled: {
    borderColor: Colors.border,
  },
  cellText: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
