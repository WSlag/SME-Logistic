import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Job } from '../types/models';
import { ApplicationService, JobService } from '../services/api';
import { useAuthStore } from '../store/auth';
import PrimaryButton from '../components/PrimaryButton';
import { spacing } from '../theme/theme';
import { useTranslation } from 'react-i18next';

const JobDetailsScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const [job, setJob] = useState<Job | undefined>();
  const addApplication = useAuthStore((s) => s.addApplication);
  const userId = useAuthStore((s) => s.userId) as string;
  const { t } = useTranslation();

  useEffect(() => {
    JobService.getJob(route.params?.id).then(setJob);
  }, [route.params]);

  if (!job) return null;

  async function handleApply() {
    if (!job) return; // guard for TS
    const app = await ApplicationService.apply(job.id, userId);
    addApplication(app);
    navigation.navigate('Applications');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('jobDetails')}</Text>
      <Text style={styles.label}>{job.title}</Text>
      <Text>{job.country} • {job.location}</Text>
      {!!job.salary && <Text>{t('salary')}: {job.salary}</Text>}
      <Text style={styles.section}>{job.description}</Text>
      <PrimaryButton label={t('apply')!} onPress={handleApply} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.md },
  title: { fontSize: 22, fontWeight: '700' },
  label: { fontSize: 18, fontWeight: '600' },
  section: { marginVertical: spacing.md }
});

export default JobDetailsScreen;