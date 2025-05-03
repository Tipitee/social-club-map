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
  // Completely revised iOS configuration with improved layout handling
  ios: {
<<<<<<< HEAD
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
=======
    // Content display settings
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: true,
    
    // Critical layout fixes
    contentInset: 'automatic',
    allowsLinkPreview: false,
    
    // Fix viewport and rendering issues
    overrideUserInterfaceStyle: 'dark',
    hideWebViewBoundaries: true,
    
    // Status bar configuration
    statusBarStyle: "dark"
  },
  // Improved plugins configuration
>>>>>>> 8be8790b9a4fe4846e29f73461d4a0e16c12dccf
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
