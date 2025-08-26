import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '../theme/theme';
import PrimaryButton from '../components/PrimaryButton';
import { useAuthStore } from '../store/auth';
import { useNavigation } from '@react-navigation/native';

const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useAuthStore((s) => s.signIn);
  const navigation = useNavigation<any>();

  function handleLogin() {
    signIn('u1');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('login')}</Text>
      <TextInput placeholder={t('email')!} value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder={t('password')!} value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <PrimaryButton label={t('login')!} onPress={handleLogin} />
      <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>{t('signup')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.md, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: spacing.lg, color: colors.text },
  input: { borderWidth: 1, borderColor: colors.border, padding: spacing.md, borderRadius: 8, backgroundColor: 'white' },
  link: { color: colors.primary, marginTop: spacing.md, textAlign: 'center' }
});

export default LoginScreen;