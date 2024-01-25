// From https://dev.to/orkhanjafarovr/real-compass-on-mobile-browsers-with-javascript-3emi
var arrow;

function startCompass() {
	if (window.DeviceOrientationEvent) {
		// Listen for the deviceorientation event and handle the raw data
		window.addEventListener("deviceorientation", handler, true);
	} else {
		alert("Device does not support compass heading!");
	}
}

function handler(e) {
	let alpha;
	// Check for iOS property
	if (e.webkitCompassHeading) {
		alpha = e.webkitCompassHeading;
	} else { // non iOS
		alpha = e.alpha;
		if (!window.chrome) {
			// Assume Android stock
			alpha = alpha - 270;
		}
	}

	arrow.style.transform = 'rotate(' + alpha + 'deg)';
}

window.onload = function() {
	try {
		arrow = document.getElementsByClassName("arrow")[0];
		startCompass();
	}
	catch (e) {
		alert(e);
	}
}
