'use strict';

var restaurant = void 0;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = function () {
	fetchRestaurantFromURL(function (error, restaurant) {
		if (error) {
			// Got an error!
			console.error(error);
		} else if (navigator.onLine) {
			self.map = new google.maps.Map(document.getElementById('map'), {
				zoom: 16,
				center: restaurant.latlng,
				scrollwheel: false
			});
			fillBreadcrumb();
			DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
			google.maps.event.addListenerOnce(map, 'idle', function () {
				document.getElementsByTagName('iframe')[0].title = 'Restaurant on Google Maps';
			});
		} else {
			var _map = document.getElementById('map');
			var staticMap = document.createElement('div');
			_map.appendChild(staticMap);
			staticMap.classList.add('offline-map');
		}
	});
};

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = function fetchRestaurantFromURL(callback) {
	if (self.restaurant) {
		// restaurant already fetched!
		callback(null, self.restaurant);
		return;
	}
	var id = getParameterByName('id');
	if (!id) {
		// no id found in URL
		error = 'No restaurant id in URL';
		callback(error, null);
	} else {
		DBHelper.fetchRestaurantById(id, function (error, restaurant) {
			self.restaurant = restaurant;
			if (!restaurant) {
				console.error(error);
				return;
			}
			fillRestaurantHTML();
			callback(null, restaurant);
		});
	}
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = function fillRestaurantHTML() {
	var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

	var name = document.getElementById('restaurant-name');
	name.innerHTML = restaurant.name;

	var address = document.getElementById('restaurant-address');
	address.innerHTML = restaurant.address;
	address.setAttribute('aria-label', 'Address' + restaurant.address);

	var image = document.getElementById('restaurant-img');
	image.className = 'restaurant-img';
	image.setAttribute('alt', restaurant.name);
	image.src = DBHelper.imageUrlForRestaurant(restaurant);

	var cuisine = document.getElementById('restaurant-cuisine');
	cuisine.innerHTML = restaurant.cuisine_type;
	cuisine.setAttribute('aria-label', 'Cuisine type' + restaurant.cuisine_type);

	// fill operating hours
	if (restaurant.operating_hours) {
		fillRestaurantHoursHTML();
	}
	// fill reviews
	fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = function fillRestaurantHoursHTML() {
	var operatingHours = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.operating_hours;

	var hours = document.getElementById('restaurant-hours');
	for (var key in operatingHours) {
		var row = document.createElement('tr');

		var day = document.createElement('td');
		day.innerHTML = key;
		row.appendChild(day);

		var time = document.createElement('td');
		time.innerHTML = operatingHours[key];
		row.appendChild(time);

		hours.appendChild(row);
	}
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = function fillReviewsHTML() {
	var reviews = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.reviews;

	var container = document.getElementById('reviews-container');
	var title = document.createElement('h2');
	title.innerHTML = 'Reviews';
	title.setAttribute('tabindex', '0');
	container.appendChild(title);

	if (!reviews) {
		var noReviews = document.createElement('p');
		noReviews.innerHTML = 'No reviews yet!';
		noReviews.setAttribute('tabindex', '0');
		container.appendChild(noReviews);
		return;
	}
	var ul = document.getElementById('reviews-list');
	reviews.forEach(function (review) {
		ul.appendChild(createReviewHTML(review));
	});
	container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = function createReviewHTML(review) {
	var li = document.createElement('li');
	var name = document.createElement('p');
	name.innerHTML = review.name;
	li.appendChild(name);

	var date = document.createElement('p');
	date.innerHTML = review.date;
	li.appendChild(date);

	var rating = document.createElement('p');
	rating.innerHTML = 'Rating: ' + review.rating;
	rating.setAttribute('tabindex', '0');
	li.appendChild(rating);

	var comments = document.createElement('p');
	comments.innerHTML = review.comments;
	comments.setAttribute('tabindex', '0');
	li.appendChild(comments);

	return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = function fillBreadcrumb() {
	var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

	var breadcrumb = document.getElementById('breadcrumb');
	var li = document.createElement('li');
	li.innerHTML = restaurant.name;
	breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	    results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};