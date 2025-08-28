import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/auth';
import { spacing } from '../theme/theme';
import { useTranslation } from 'react-i18next';

const ApplicationsScreen: React.FC = () => {
  const applications = useAuthStore((s) => s.applications);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('applications')}</Text>
      <FlatList
        data={applications}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text>{t('noResults')}</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{t('applied')} • {new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  title: { fontSize: 22, fontWeight: '700', marginBottom: spacing.md },
  card: { backgroundColor: 'white', padding: spacing.md, borderRadius: 12, marginBottom: spacing.sm, borderColor: '#eee', borderWidth: 1 }
});

export default ApplicationsScreen;