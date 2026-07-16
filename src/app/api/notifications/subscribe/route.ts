import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { savePushSubscription, removePushSubscription } from '@/features/notifications/notifications-service';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscription = await request.json();
  const userAgent = request.headers.get('user-agent') || undefined;
  await savePushSubscription(session.user.id, subscription, userAgent);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { endpoint } = await request.json();
  await removePushSubscription(endpoint);

  return NextResponse.json({ success: true });
}