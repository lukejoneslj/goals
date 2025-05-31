import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { App } from '@capacitor/app';

export const isNative = () => Capacitor.isNativePlatform();

export const initializeApp = async () => {
  if (!isNative()) return;

  try {
    // Hide splash screen
    try {
      await SplashScreen.hide();
    } catch (error) {
      console.log('SplashScreen not available:', error);
    }

    // Set status bar style for better visibility
    try {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      await StatusBar.show();
    } catch (error) {
      console.log('StatusBar not available:', error);
    }

    // Request notification permissions (optional)
    try {
      await LocalNotifications.requestPermissions();
    } catch (error) {
      console.log('LocalNotifications not available:', error);
    }

    console.log('Capacitor app initialized successfully');
  } catch (error) {
    console.error('Error initializing Capacitor app:', error);
  }
};

export const scheduleGoalReminder = async (title: string, body: string, scheduleTime: Date) => {
  if (!isNative()) {
    console.log('Notifications not available in web environment');
    return;
  }

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id: Date.now(),
          schedule: { at: scheduleTime },
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null
        }
      ]
    });
    console.log('Goal reminder scheduled successfully');
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

export const triggerHapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
  if (!isNative()) return;

  try {
    await Haptics.impact({ style });
  } catch (error) {
    console.log('Haptics not available:', error);
  }
};

export const getAppInfo = async () => {
  if (!isNative()) return null;

  try {
    return await App.getInfo();
  } catch (error) {
    console.error('Error getting app info:', error);
    return null;
  }
};

// Navigation handling for native apps
export const handleBackButton = (callback: () => void) => {
  if (!isNative()) return;

  try {
    App.addListener('backButton', callback);
  } catch (error) {
    console.log('Back button handling not available:', error);
  }
};

// Listen for app state changes
export const setupAppListeners = () => {
  if (!isNative()) return;

  try {
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active:', isActive);
    });

    App.addListener('appUrlOpen', (event) => {
      console.log('App opened via URL:', event.url);
    });

    // Handle hardware back button (Android)
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        // Let the app handle the back navigation
        window.history.back();
      } else {
        // Exit the app if can't go back
        App.exitApp();
      }
    });
  } catch (error) {
    console.log('App listeners not available:', error);
  }
}; 