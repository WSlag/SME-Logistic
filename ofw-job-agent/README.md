# OFW Job Agent (Expo + TypeScript)

A native-first app for Filipino jobseekers who want to work abroad. Screens include Splash, Signup, Login, Home (jobs), Job Details, Similar Jobs, Applications, Chat List, and Chat. English and Tagalog translations included.

## Prerequisites
- Node 18+
- Expo CLI (optional) and Expo Go app (for device testing)

## Setup
```bash
cd ofw-job-agent
npm install
```

## Run
- Android: `npm run android`
- iOS (Mac required or use Expo Go): `npm run ios`
- Web (optional):
  ```bash
  npx expo install react-dom react-native-web @expo/metro-runtime
  npm run web
  ```

## Notes
- Mock data/services are in `src/services/api.ts`.
- i18n resources in `src/assets/i18n`.
- Navigation is in `src/navigation`.
- State (auth/applications) uses Zustand in `src/store/auth.ts`.