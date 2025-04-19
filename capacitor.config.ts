
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.15770c0b47a8410182567925008c6bad',
  appName: 'Green Bud Guide',
  webDir: 'dist',
  server: {
    url: 'https://15770c0b-47a8-4101-8256-7925008c6bad.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Enable AndroidX support
  android: {
    androidxEnabled: true
  },
  // Enhanced iOS configuration with proper safe area handling
  ios: {
    contentInset: 'never', // Changed from 'automatic' to ensure exact control
    allowsLinkPreview: true,
    scrollEnabled: true,
    // Handle status bar properly
    statusBarStyle: 'dark',
    statusBarDefaultScrollToTop: true,
    // Viewport settings for proper rendering
    preferredContentMode: 'mobile',
    // Fix status bar and notch issues
    marginTop: 0, // Let CSS handle this with env() variables
    marginBottom: 0, // Let CSS handle this with env() variables
    // Additional settings
    webViewSuspensionEnabled: false,
    hideWebViewBoundaries: true, // Important to hide any unexpected boundaries
    overrideUserInterfaceStyle: 'light'
  },
  // Plugins
  plugins: {
    // Status bar configuration for proper iOS integration
    StatusBar: {
      style: "dark",
      backgroundColor: "#FCF3E8",
      overlaysWebView: false // Important change
    },
    SplashScreen: {
      launchAutoHide: true,
      showSpinner: false
    }
  }
};

export default config;
