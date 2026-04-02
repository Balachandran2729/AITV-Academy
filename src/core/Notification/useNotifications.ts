// src/core/Notification/notificationService.ts
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// This tells the app how to handle notifications when the app is OPEN
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// 1. Setup Permissions (Now a standard async function)
export const registerForPushNotificationsAsync = async () => {
  let token;
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
    trigger: null, // null means fire immediately
  });
};

// 3. The 24-Hour Retention Trigger (Now a standard async function)
export const scheduleRetentionReminder = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Keep your streak going! 🔥",
      body: "It's been a day since you last checked in. Dive back into your courses!",
      sound: true,
    },
    trigger: {
      seconds: 10,
      repeats: false,
    } as any,
  });
};