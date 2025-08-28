import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigation from './src/navigation';
import { initializeI18n } from './src/services/i18n';

initializeI18n();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <RootNavigation />
    </>
  );
}
