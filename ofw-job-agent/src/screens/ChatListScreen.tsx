import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Conversation } from '../types/models';
import { ChatService } from '../services/api';
import { spacing } from '../theme/theme';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const ChatListScreen: React.FC = () => {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  useEffect(() => { ChatService.listConversations().then(setConvos); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('chat')}</Text>
      <FlatList
        data={convos}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Chat', { id: item.id })}>
            <Text style={styles.cardTitle}>Conversation {item.id}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  title: { fontSize: 22, fontWeight: '700', marginBottom: spacing.md },
  card: { backgroundColor: 'white', padding: spacing.md, borderRadius: 12, marginBottom: spacing.sm, borderColor: '#eee', borderWidth: 1 },
  cardTitle: { fontWeight: '600' }
});

export default ChatListScreen;