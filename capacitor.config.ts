
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
    statusBarStyle: 'default', // Changed to default for better visibility in light mode
    // Enable location services
    locationWhenInUsePermission: "We need your location to show you nearby clubs.",
    locationAlwaysPermission: "We need your location to show you nearby clubs even when the app is in background.",
    // Improved UI settings
    backgroundColor: '#FCF3E8', // Updated to match light theme linen color
    webViewSuspensionEnabled: true,
    limitsNavigationsToAppBoundDomains: true, // Added for security
    overrideUserInterfaceStyle: 'light' // Ensure system respects our theme setting
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
    // Add status bar configuration
    StatusBar: {
      style: "dark",
      backgroundColor: "#FCF3E8", // Match iOS navbar background
      overlaysWebView: false
    }
  }
};

export default config;
