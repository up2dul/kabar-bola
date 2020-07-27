importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
  console.log('Workbox berhasil dimuat!');
} else {
  console.log('Workbox gagal dimuat');
}

workbox.precaching.precacheAndRoute([
  'https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js',
  '/img/icons/icon-72x72.png',
  '/img/icons/icon-96x96.png',
  '/img/icons/icon-128x128.png',
  '/img/icons/icon-144x144.png',
  '/img/icons/icon-152x152.png',
  '/img/icons/icon-192x192.png',
  '/img/icons/icon-384x384.png',
  '/img/icons/icon-512x512.png',
  '/img/404.svg',
  '/img/2002.svg',
  '/img/2003.svg',
  '/img/2014.svg',
  '/img/2015.svg',
  '/img/2019.svg',
  '/img/2021.svg',
  '/img/logo.png',
  '/favicon.ico',
  { url: '/manifest.json', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/nav.html', revision: '1' },
  { url: '/league.html', revision: '1' },
  { url: '/team.html', revision: '1' },
  { url: '/js/materialize.min.js', revision: '1' },
  { url: '/js/moment-locale.min.js', revision: '1' },
  { url: '/js/api.js', revision: '2' },
  { url: '/js/main.js', revision: '1' },
  { url: '/js/reg-sw.js', revision: '1' },
  { url: '/js/idb.js', revision: '1' },
  { url: '/js/db.js', revision: '1' },
  { url: '/css/materialize.min.css', revision: '1' },
  { url: '/css/style.css', revision: '1' },
], {
  ignoreUrlParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
  /\/pages\//g,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages'
  })
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'api-data'
  })
);

workbox.routing.registerRoute(
  /^https:\/\/upload\.wikimedia\.org/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'team-logo'
  })
);

workbox.routing.registerRoute(
  /\/league.html/g,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'league',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 80,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\/team.html/g,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'team',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 80,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

self.addEventListener('push', (event) => {
	let body;
	if (event.data) {
		body = event.data.text();
	} else {
		body = 'Push message no payload';
	}
	let options = {
		body: body,
		icon: '/img/icon-512x512.png',
		badge: '/img/icon-512x512.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1,
		},
	};
	event.waitUntil(
		self.registration.showNotification('Push Notification', options)
	);
});
