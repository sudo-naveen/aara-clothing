import { prisma } from '@/lib/prisma';

export async function createNotification(userId: string, title: string, body: string, orderId?: string) {
  return prisma.notification.create({
    data: { userId, title, body, orderId },
  });
}

export async function createNotificationForAllUsers(title: string, body: string, orderId?: string, excludeUserId?: string) {
  const where = excludeUserId ? { id: { not: excludeUserId } } : {};
  const users = await prisma.user.findMany({ where, select: { id: true } });

  return prisma.notification.createMany({
    data: users.map((user) => ({
      userId: user.id,
      title,
      body,
      orderId,
    })),
  });
}

export async function getUserNotifications(userId: string, limit = 20) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
        },
      },
    },
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}

export async function markAsRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}