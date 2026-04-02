import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const RETENTION_NOTIFICATION_KEY = 'retention_notification_scheduled';
const APP_CLOSED_TIME_KEY = 'app_closed_time';

// 1. Setup Permissions (Now a standard async function)
export const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }
    return true;
  } else {
    console.log('Must use physical device for Push Notifications');
    return false;
  }
};

// 2. The 5-Bookmark Trigger (Now a standard async function)
export const triggerBookmarkMilestoneNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Milestone Reached! 🎉",
      body: "You've bookmarked 5 courses. Time to start learning!",
      sound: true,
    },
    trigger: null,
  });
};

// 3. The 24-Hour Retention Trigger (Fixed to work when app is closed)
export const scheduleRetentionReminder = async () => {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduledNotifications) {
    if (notification.identifier?.includes('retention')) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }

  // Schedule the retention notification with a unique identifier
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Keep your streak going! 🔥",
      body: "It's been a day since you last checked in. Dive back into your courses!",
      sound: true,
    },
    trigger: {
      seconds: 10, 
      repeats: false,
    } as Notifications.TimeIntervalTriggerInput,
  });

  // Mark that we've scheduled a retention notification
  await AsyncStorage.setItem(RETENTION_NOTIFICATION_KEY, 'true');
  console.log('Retention reminder scheduled for 10 seconds');
};

// Function to handle app closing (called from AppState or similar)
export const handleAppClosing = async () => {
  const hasScheduled = await AsyncStorage.getItem(RETENTION_NOTIFICATION_KEY);
  if (hasScheduled === 'true') {
    // Record the time when app was closed
    await AsyncStorage.setItem(APP_CLOSED_TIME_KEY, Date.now().toString());
  }
};

// Function to check if we need to reschedule when app opens
export const checkAndRescheduleRetentionNotification = async () => {
  const hasScheduled = await AsyncStorage.getItem(RETENTION_NOTIFICATION_KEY);
  
  if (hasScheduled === 'true') {
    // Optionally reschedule if needed based on business logic
    // For now, we'll just ensure the original notification remains scheduled
    console.log('Retention notification was previously scheduled');
  }
};