
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
  // Improved iOS configuration with proper sizing and safe area handling
  ios: {
    // Set proper content mode for iOS
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: true,
    
    // Properly handle content and scrolling
    contentInset: 'automatic',
    allowsLinkPreview: true,
    scrollEnabled: true,
    
    // Fix viewport and rendering issues
    overrideUserInterfaceStyle: 'light',
    hideWebViewBoundaries: true,
    webViewSuspensionEnabled: false,
    
    // Fix status bar and notch issues
    statusBarStyle: 'dark'
  },
  // Plugins configuration for proper status bar and keyboard handling
  plugins: {
    StatusBar: {
      style: "dark",
      backgroundColor: "#ffffff",
      overlaysWebView: false,
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
