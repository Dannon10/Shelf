// src/utils/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { MAX_PRODUCTS } from '../types';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('shelf-channel', {
            name: 'Shelf Alerts',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    return finalStatus === 'granted';
}

export async function scheduleLimitNotification(): Promise<void> {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Shelf is full',
            body: `You've reached the ${MAX_PRODUCTS}-product limit. Remove an item to add something new.`,
            sound: true,
            data: { type: 'limit_reached' },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 1 },
    });
}

export async function scheduleSlotNotification(remaining: number): Promise<void> {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Almost full',
            body: `Only ${remaining} slot${remaining !== 1 ? 's' : ''} left on your shelf.`,
            sound: true,
            data: { type: 'almost_full' },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 1 },
    });
}