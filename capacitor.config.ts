
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.15770c0b47a8410182567925008c6bad',
  appName: 'Green Bud Guide',
  webDir: 'dist',
  server: {
    url: 'https://15770c0b-47a8-4101-8256-7925008c6bad.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Enhanced Android configuration
  android: {
    androidxEnabled: true
  },
  // Improved iOS configuration with proper safe area handling
  ios: {
    contentInset: 'automatic', // Changed to automatic for better handling
    allowsLinkPreview: true,
    scrollEnabled: true,
    // Handle status bar properly
    statusBarStyle: 'dark',
    statusBarDefaultScrollToTop: true,
    // Viewport settings for proper rendering
    preferredContentMode: 'mobile',
    // Fix status bar and notch issues
    marginTop: 0,
    marginBottom: 0,
    // Additional settings
    webViewSuspensionEnabled: false,
    hideWebViewBoundaries: true,
    overrideUserInterfaceStyle: 'light'
  },
  // Plugins
  plugins: {
    // Status bar configuration for proper iOS integration
    StatusBar: {
      style: "dark",
      backgroundColor: "#FCF3E8",
      overlaysWebView: true, // Changed to true to handle automatically
      animated: true
    },
    SplashScreen: {
      launchAutoHide: true,
      showSpinner: false,
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true
    }
  }
};

export default config;
