
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
  // Enhanced iOS configuration
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: true,
    scrollEnabled: true,
    // Handle status bar properly
    statusBarStyle: 'dark',
    statusBarDefaultScrollToTop: true,
    // Enable location services
    locationWhenInUsePermission: "We need your location to show you nearby clubs.",
    locationAlwaysPermission: "We need your location to show you nearby clubs even when the app is in background.",
    // Improved UI settings
    backgroundColor: '#FCF3E8',
    webViewSuspensionEnabled: false,
    limitsNavigationsToAppBoundDomains: true,
    // Add safe area settings
    preferredContentMode: 'mobile',
    handleApplicationNotifications: true,
    usesFaceID: true,
    // iOS UI positioning - important for status bar and notch
    overrideUserInterfaceStyle: 'light',
    // Fix status bar height and notch issues
    marginTop: 0,
    marginBottom: 0,
    allowsBackForwardNavigationGestures: false,
    // Additional settings for iOS devices
    scheme: 'app',
    cordovaDeployDisableHostCheck: true
  },
  // Permissions
  plugins: {
    // Camera configuration
    Camera: {
      ios: {
        usageDescription: "We need camera access to let you upload photos"
      },
      android: {}
    },
    // Geolocation configuration
    Geolocation: {
      ios: {
        usageDescription: "We need your location to show you nearby clubs"
      },
      android: {}
    },
    // Local notifications configuration
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#2A9D90",
      sound: "beep.wav"
    },
    // Status bar configuration with proper settings for iOS
    StatusBar: {
      style: "dark",
      backgroundColor: "#FCF3E8",
      overlaysWebView: true
    },
    // Add specific iOS status bar handling
    SplashScreen: {
      launchAutoHide: false,
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;
