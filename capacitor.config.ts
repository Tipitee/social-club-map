const config: CapacitorConfig = {
  appId: 'de.tipitee.socialclubmap',
  appName: 'Social Club Map',
  webDir: 'dist',
  // Remove or comment out the server.url line
  // server: {
  //   url: 'https://15770c0b-47a8-4101-8256-7925008c6bad.lovableproject.com?forceHideBadge=true',
  //   cleartext: true
  // },
  // Enhanced Android configuration
  android: {
    androidxEnabled: true
  },
  // Improved iOS configuration with proper sizing and safe area handling
  ios: {
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: true,
    contentInset: 'automatic',
    allowsLinkPreview: true,
    scrollEnabled: true,
    overrideUserInterfaceStyle: 'light',
    hideWebViewBoundaries: true,
    webViewSuspensionEnabled: false,
    statusBarStyle: "dark"
  },
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
