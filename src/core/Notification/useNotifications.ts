import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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
      console.log('Permission not granted');
      return false;
    }
    return true;
  } else {
    console.log('Must use physical device');
    return false;
  }
};

// ✅ UNTOUCHED — works perfectly
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

// ✅ FIXED — schedule only when app goes to background
export const scheduleRetentionReminder = async () => {
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of all) {
      if (n.identifier?.includes('retention')) {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
    }

    await Notifications.scheduleNotificationAsync({
      identifier: 'retention-reminder',
      content: {
        title: "Keep your streak going! 🔥",
        body: "It's been a day since you last checked in. Dive back into your courses!",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
        repeats: false,
      } as Notifications.TimeIntervalTriggerInput,
    });

    console.log('✅ Scheduled successfully');

    // ✅ Verify it actually got scheduled
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log('📋 All scheduled notifications:', JSON.stringify(scheduled));

  } catch (error) {
    console.error('❌ Failed to schedule retention notification:', error); // 👈 key
  }
};

// ✅ FIXED — cancel when user comes back
export const cancelRetentionReminder = async () => {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of all) {
    if (n.identifier?.includes('retention')) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
      console.log('🚫 Retention reminder cancelled (user came back)');
    }
  }
};