import { View, TextInput as RNTextInput, Text, StyleSheet, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const TextInput: React.FC<CustomTextInputProps> = ({ label, error, containerStyle, ...props }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <RNTextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={Colors.textSecondary}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    ...Typography.body,
    color: Colors.textPrimary,
    backgroundColor: Colors.cardSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: Colors.loss,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.loss,
    marginTop: 4,
  },
});
