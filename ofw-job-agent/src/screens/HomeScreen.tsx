import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Job } from '../types/models';
import { JobService } from '../services/api';
import { colors, spacing } from '../theme/theme';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  useEffect(() => {
    JobService.listJobs().then(setJobs);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('jobs')}</Text>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('JobDetails', { id: item.id })}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>{t('location')}: {item.location}</Text>
            {!!item.salary && <Text style={styles.cardMeta}>{t('salary')}: {item.salary}</Text>}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Text style={{ color: colors.primary }} onPress={() => navigation.navigate('SimilarJobs', { id: item.id })}>{t('similarJobs')}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.md },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  card: { backgroundColor: 'white', borderRadius: 12, padding: spacing.md, marginBottom: spacing.md, borderColor: '#eee', borderWidth: 1 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  cardMeta: { color: '#555' },
});

export default HomeScreen;