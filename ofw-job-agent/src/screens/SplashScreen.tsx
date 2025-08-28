import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/theme';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const SplashScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('appName')}</Text>
      <Text>{t('welcome')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '800', color: colors.primary, marginBottom: 12 },
});

export default SplashScreen;