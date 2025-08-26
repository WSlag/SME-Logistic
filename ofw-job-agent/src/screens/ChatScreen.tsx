import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { Message } from '../types/models';
import { ChatService } from '../services/api';
import { spacing } from '../theme/theme';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const ChatScreen: React.FC = () => {
  const route = useRoute<any>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const { t } = useTranslation();

  useEffect(() => { ChatService.listMessages(route.params?.id).then(setMessages); }, [route.params?.id]);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.bubble}><Text>{item.text}</Text></View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput placeholder={t('typeMessage')!} value={text} onChangeText={setText} style={styles.input} />
        <Text style={styles.send}>{t('send')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  bubble: { backgroundColor: 'white', padding: spacing.md, borderRadius: 12, marginVertical: 4, alignSelf: 'flex-start' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  input: { flex: 1, borderWidth: 1, borderColor: '#eee', borderRadius: 24, padding: spacing.md, backgroundColor: 'white' },
  send: { color: 'dodgerblue', fontWeight: '700', paddingHorizontal: spacing.md }
});

export default ChatScreen;