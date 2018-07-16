'use strict';

var restaurants = void 0,
	neighborhoods = void 0,
	cuisines = void 0;
var map;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', function (event) {
	fetchNeighborhoods();
	fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
function fetchNeighborhoods() {
	DBHelper.fetchNeighborhoods(function (error, neighborhoods) {
		if (error) {
			// Got an error
			console.error(error);
		} else {
			self.neighborhoods = neighborhoods;
			fillNeighborhoodsHTML();
		}
	});
};

/**
 * Set neighborhoods HTML.
 */
function fillNeighborhoodsHTML() {
	var neighborhoods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.neighborhoods;

	var select = document.getElementById('neighborhoods-select');
	neighborhoods.forEach(function (neighborhood) {
		var option = document.createElement('option');
		option.innerHTML = neighborhood;
		option.value = neighborhood;
		select.append(option);
	});
};

/**
 * Fetch all cuisines and set their HTML.
 */
function fetchCuisines() {
	DBHelper.fetchCuisines(function (error, cuisines) {
		if (error) {
			// Got an error!
			console.error(error);
		} else {
			self.cuisines = cuisines;
			fillCuisinesHTML();
		}
	});
};

/**
 * Set cuisines HTML.
 */
function fillCuisinesHTML() {
	var cuisines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.cuisines;

	var select = document.getElementById('cuisines-select');

	cuisines.forEach(function (cuisine) {
		var option = document.createElement('option');
		option.innerHTML = cuisine;
		option.value = cuisine;
		select.append(option);
	});
};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = function () {
	var loc = {
		lat: 40.722216,
		lng: -73.987501
	};
	if (navigator.onLine) {
		self.map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: loc,
			scrollwheel: false
		});
		google.maps.event.addListenerOnce(map, 'idle', function () {
			document.getElementsByTagName('iframe')[0].title = 'Google  Maps';
		});
	} else {
		var _map = document.getElementById('map');
		var staticMap = document.createElement('div');
		_map.appendChild(staticMap);
		staticMap.classList.add('offline-map');
	}

	updateRestaurants();
};

/**
 * Update page and map for current restaurants.
 */
function updateRestaurants() {
	var cSelect = document.getElementById('cuisines-select');
	var nSelect = document.getElementById('neighborhoods-select');

	var cIndex = cSelect.selectedIndex;
	var nIndex = nSelect.selectedIndex;

	var cuisine = cSelect[cIndex].value;
	var neighborhood = nSelect[nIndex].value;

	DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, function (error, restaurants) {
		if (error) {
			// Got an error!
			console.error(error);
		} else {
			resetRestaurants(restaurants);
			fillRestaurantsHTML();
		}
	});
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
function resetRestaurants(restaurants) {
	// Remove all restaurants
	self.restaurants = [];
	var ul = document.getElementById('restaurants-list');
	ul.innerHTML = '';

	// Remove all map markers
	self.markers.forEach(function (m) {
		return m.setMap(null);
	});
	self.markers = [];
	self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
function fillRestaurantsHTML() {
	var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;

	var ul = document.getElementById('restaurants-list');
	restaurants.forEach(function (restaurant) {
		ul.append(createRestaurantHTML(restaurant));
	});
	addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
function createRestaurantHTML(restaurant) {
	var li = document.createElement('li');

	var image = document.createElement('img');
	image.className = 'restaurant-img';
	image.src = DBHelper.thumbnailUrlForRestaurant(restaurant);
	image.setAttribute('alt', restaurant.name);
	li.append(image);

	var name = document.createElement('h1');
	name.innerHTML = restaurant.name;
	li.append(name);

	var neighborhood = document.createElement('p');
	neighborhood.innerHTML = restaurant.neighborhood;
	li.append(neighborhood);

	var address = document.createElement('p');
	address.innerHTML = restaurant.address;
	li.append(address);

	var more = document.createElement('a');
	more.innerHTML = 'View Details';
	more.href = DBHelper.urlForRestaurant(restaurant);
	more.setAttribute('role', 'button');
	more.setAttribute('tabindex', '0');
	more.setAttribute('aria-label', restaurant.name + 'View details');
	more.classList.add('view-details');
	li.append(more);

	return li;
};

/**
 * Add markers for current restaurants to the map.
 */
function addMarkersToMap() {
	var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;

	restaurants.forEach(function (restaurant) {
		// Add marker to the map
		var marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
		google.maps.event.addListener(marker, 'click', function () {
			window.location.href = marker.url;
		});
		self.markers.push(marker);
	});
};