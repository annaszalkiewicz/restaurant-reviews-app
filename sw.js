const staticCacheName = 'restaurant-reviews-v1.0';
const urlsToCache = [
	'/',
	'css/styles.css',
	'data/restaurants.json',
	'img/1.jpg',
	'img/2.jpg',
	'img/3.jpg',
	'img/4.jpg',
	'img/5.jpg',
	'img/6.jpg',
	'img/7.jpg',
	'img/8.jpg',
	'img/9.jpg',
	'img/10.jpg',
	'img/1-thumbnail.jpg',
	'img/2-thumbnail.jpg',
	'img/3-thumbnail.jpg',
	'img/4-thumbnail.jpg',
	'img/5-thumbnail.jpg',
	'img/6-thumbnail.jpg',
	'img/7-thumbnail.jpg',
	'img/8-thumbnail.jpg',
	'img/9-thumbnail.jpg',
	'img/10-thumbnail.jpg',
	'img/restaurant-icon.png',
	'js/app.js',
	'js/dbhelper.js',
	'js/main.js',
	'js/restaurant_info.js',
	'index.html',
	'restaurant.html',
	'https://fonts.googleapis.com/css?family=Montserrat:300,400',
	'https://fonts.googleapis.com/css?family=Pacifico'
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(staticCacheName).then((cache) => {
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.filter((cacheName) => {
					return cacheName.startsWith('r-') &&
					cacheName != staticCacheName;
				}).map((cacheName) => {
					return cache.delete(cacheName);
				})
			);
		})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				return response;
			}
			return fetch(event.request);
		}).catch(() => {
			console.log('Error to load files from cache');
		})
	);
});