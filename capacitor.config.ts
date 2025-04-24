
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
  // Revised iOS configuration with improved layout handling
  ios: {
    // Properly manage content display
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: true,
    
    // Critical fixes for layout issues
    contentInset: 'automatic',
    scrollEnabled: true,
    usesFocusEngine: true,
    
    // Fix viewport and rendering issues
    overrideUserInterfaceStyle: 'dark',
    hideWebViewBoundaries: true,
    webViewSuspensionEnabled: false,
    
    // Status bar configuration for notch devices
    statusBarStyle: "dark",
    
    // Fix bottom white space by forcing black background
    backgroundColor: "#000000"
  },
  // Improved plugins configuration
  plugins: {
    StatusBar: {
      style: "dark",
      backgroundColor: "#000000",
      overlaysWebView: true,
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
