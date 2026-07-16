import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserNotifications, getUnreadCount, markAsRead, markAllAsRead } from '@/features/notifications/notifications-db-service';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notifications = await getUserNotifications(session.user.id);
  const unreadCount = await getUnreadCount(session.user.id);

  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { notificationId, markAll } = await request.json();

  if (markAll) {
    await markAllAsRead(session.user.id);
  } else if (notificationId) {
    await markAsRead(notificationId, session.user.id);
  }

  return NextResponse.json({ success: true });
}