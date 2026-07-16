// Service Worker for Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'Aara Clothing', body: 'New notification' };

  const options = {
    body: data.body,
    icon: '/aara-logo.jpg',
    badge: '/aara-logo.jpg',
    data: { orderId: data.orderId, url: data.url || '/dashboard' },
    tag: data.tag || 'default',
    renotify: true,
    actions: [
      { action: 'open', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if not
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});