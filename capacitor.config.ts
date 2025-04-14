
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.15770c0b47a8410182567925008c6bad',
  appName: 'green-bud-guide',
  webDir: 'dist',
  server: {
    url: 'https://15770c0b-47a8-4101-8256-7925008c6bad.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Enable AndroidX support
  android: {
    androidxEnabled: true
  },
  // iOS configuration
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: true,
    scrollEnabled: true
  }
};

export default config;
