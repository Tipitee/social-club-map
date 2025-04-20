
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
    androidxEnabled: true,
    backgroundColor: "#FCF3E8",
    buildOptions: {
      keystorePath: null,
      keystorePassword: null,
      keystoreAlias: null,
      keystoreAliasPassword: null,
      releaseType: null
    }
  },
  // Enhanced iOS configuration with proper safe area handling
  ios: {
    contentInset: 'automatic', // Better for scrollable content
    allowsLinkPreview: true,
    scrollEnabled: true,
    // Handle status bar properly
    statusBarStyle: 'dark',
    statusBarDefaultScrollToTop: true,
    // Viewport settings for proper rendering
    preferredContentMode: 'mobile',
    backgroundColor: "#FCF3E8",
    scheme: "Green Bud Guide",
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
      overlaysWebView: false
    },
    SplashScreen: {
      launchAutoHide: true,
      showSpinner: false,
      backgroundColor: "#FCF3E8"
    }
  },
  // Extra safety options for iOS
  cordova: {
    preferences: {
      "StatusBarOverlaysWebView": "false",
      "StatusBarBackgroundColor": "#FCF3E8",
      "StatusBarStyle": "lightcontent",
      "DisallowOverscroll": "true",
      "KeyboardResize": "true",
      "KeyboardResizeMode": "body",
      "EnableViewportScale": "true",
      "ViewportFit": "cover"
    }
  }
};

export default config;
