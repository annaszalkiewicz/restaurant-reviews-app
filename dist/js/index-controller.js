// Register service worker

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js').then(function (reg) {
		console.log('Service worker registered successfully! Scope: ' + reg.scope);
	}).catch(function (error) {
		console.log('Sorry, there was a problem to register service worker' + error);
	});
}