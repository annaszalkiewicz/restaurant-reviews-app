'use strict';

var staticCacheName = 'restaurant-reviews-v17.0';
var urlsToCache = ['/', 'css/styles.css', 'data/restaurants.json', 'img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg', 'img/5.jpg', 'img/6.jpg', 'img/7.jpg', 'img/8.jpg', 'img/9.jpg', 'img/10.jpg', 'img/1-thumbnail.jpg', 'img/2-thumbnail.jpg', 'img/3-thumbnail.jpg', 'img/4-thumbnail.jpg', 'img/5-thumbnail.jpg', 'img/6-thumbnail.jpg', 'img/7-thumbnail.jpg', 'img/8-thumbnail.jpg', 'img/9-thumbnail.jpg', 'img/10-thumbnail.jpg', 'img/restaurant-icon.png', 'img/static-map.jpg', 'img/icons/icon_48x48.png', 'img/icons/icon_96x96.png', 'img/icons/icon_128x128.png', 'img/icons/icon_144x144.png', 'img/icons/icon_192x192.png', 'img/icons/icon_256x256.png', 'img/icons/icon_384x384.png', 'img/icons/icon_512x512.png', 'js/index-controller.js', 'js/dbhelper.js', 'js/main.js', 'js/restaurant_info.js', 'index.html', 'restaurant.html', 'manifest.json'];

self.addEventListener('install', function (event) {
	event.waitUntil(caches.open(staticCacheName).then(function (cache) {
		return cache.addAll(urlsToCache);
	}));
});

self.addEventListener('activate', function (event) {
	event.waitUntil(caches.keys().then(function (cacheNames) {
		return Promise.all(cacheNames.filter(function (cacheName) {
			return cacheName.startsWith('restaurant-') && cacheName != staticCacheName;
		}).map(function (cacheName) {
			return caches.delete(cacheName);
		}));
	}));
});

self.addEventListener('fetch', function (event) {
	event.respondWith(caches.match(event.request).then(function (response) {
		if (response) {
			return response;
		}
		return fetch(event.request);
	}));
});