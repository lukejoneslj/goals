import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lukejoneslwj.repentdaily',
  appName: 'Repent Daily',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      style: 'light',
      backgroundColor: '#ffffff',
      overlaysWebView: false
    },
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    }
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#ffffff'
  },
  android: {
    backgroundColor: '#ffffff'
  }
};

export default config;
