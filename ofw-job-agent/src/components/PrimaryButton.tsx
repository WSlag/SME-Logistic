import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

type Props = {
  label: string;
  onPress: (e: GestureResponderEvent) => void;
};

export const PrimaryButton: React.FC<Props> = ({ label, onPress }) => {
  return (
    <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
export default PrimaryButton;