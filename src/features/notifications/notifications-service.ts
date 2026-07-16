import webPush from 'web-push';
import { prisma } from '@/lib/prisma';

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;
const vapidEmail = process.env.VAPID_EMAIL!;

webPush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function savePushSubscription(userId: string, subscription: PushSubscription, userAgent?: string) {
  return prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    create: {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userId,
      userAgent,
    },
    update: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  });
}

export async function removePushSubscription(endpoint: string) {
  return prisma.pushSubscription.deleteMany({ where: { endpoint } });
}

export async function sendNotification(userId: string, title: string, body: string, orderId?: string) {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  const payload = JSON.stringify({
    title,
    body,
    orderId,
    url: orderId ? `/dashboard` : '/dashboard',
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webPush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        payload
      )
    )
  );

  // Remove failed subscriptions (expired/invalid)
  const failedEndpoints: string[] = [];
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      failedEndpoints.push(subscriptions[index].endpoint);
    }
  });

  if (failedEndpoints.length > 0) {
    await prisma.pushSubscription.deleteMany({
      where: { endpoint: { in: failedEndpoints } },
    });
  }

  return { sent: results.length, failed: failedEndpoints.length };
}

export async function sendNotificationToAllUsers(title: string, body: string, orderId?: string, excludeUserId?: string) {
  const where = excludeUserId ? { id: { not: excludeUserId } } : {};
  const users = await prisma.user.findMany({ where, select: { id: true } });

  const results = await Promise.allSettled(
    users.map((user) => sendNotification(user.id, title, body, orderId))
  );

  return {
    totalUsers: users.length,
    results: results.map((r, i) => ({
      userId: users[i].id,
      success: r.status === 'fulfilled',
    })),
  };
}