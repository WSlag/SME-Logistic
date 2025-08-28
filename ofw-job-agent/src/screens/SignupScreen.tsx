import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '../theme/theme';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';

const SignupScreen: React.FC = () => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('signup')}</Text>
      <TextInput placeholder={t('fullName')!} value={fullName} onChangeText={setFullName} style={styles.input} />
      <TextInput placeholder={t('email')!} value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder={t('password')!} value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <PrimaryButton label={t('signup')!} onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.md, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: spacing.lg, color: colors.text },
  input: { borderWidth: 1, borderColor: colors.border, padding: spacing.md, borderRadius: 8, backgroundColor: 'white' }
});

export default SignupScreen;