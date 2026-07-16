'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const isPushSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;

export function usePushNotifications() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>(
    isPushSupported ? Notification.permission : 'denied'
  );

  useEffect(() => {
    if (!session?.user || !isPushSupported) return;

    let cancelled = false;

    async function checkExistingSubscription() {
      try {
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription = await registration.pushManager.getSubscription();
        if (!cancelled && existingSubscription) {
          setSubscription(existingSubscription);
          if (Notification.permission === 'granted') {
            setPermission('granted');
          }
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    }

    checkExistingSubscription();

    return () => {
      cancelled = true;
    };
  }, [session?.user]);

  const subscribeToPush = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const response = await fetch('/api/notifications/vapid-key');
      const { publicKey } = await response.json();

      const applicationServerKey = urlBase64ToUint8Array(publicKey);

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });

      setSubscription(sub);
      setPermission('granted');
    } catch (error) {
      console.error('Error subscribing to push:', error);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isPushSupported) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        await subscribeToPush();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  }, [subscribeToPush]);

  const unsubscribe = useCallback(async () => {
    if (subscription) {
      try {
        await subscription.unsubscribe();
        await fetch('/api/notifications/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        setSubscription(null);
      } catch (error) {
        console.error('Error unsubscribing:', error);
      }
    }
  }, [subscription]);

  return {
    permission,
    subscription,
    isSupported: isPushSupported,
    requestPermission,
    unsubscribe,
  };
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}