// From https://dev.to/orkhanjafarovr/real-compass-on-mobile-browsers-with-javascript-3emi
var debug;
var arrow;
var position;
var target = [51.521900, -0.124490];
const isIOS = /iPad|iPhone|iPod|Apple/.test(navigator.userAgent);

function startCompass() {
	arrow.style.display = "block";

	if (isIOS) {
		DeviceOrientationEvent.requestPermission()
			.then((response) => {
				if (response === "granted") {
					window.addEventListener("deviceorientation", compassHandler, true);
				} else {
					alert("has to be allowed!");
				}
			})
			.catch(() => alert("not supported"));
	} else {
		window.addEventListener("deviceorientationabsolute", compassHandler, true);
	}
	let options = {
		enableHighAccuracy: true,
	};
	navigator.geolocation.getCurrentPosition(locationHandler, locationError, options);
}

function locationError(e) {
	debug.innerHTML = e.message;
}

function locationHandler(e) {
	position = [e.coords.latitude, e.coords.longitude];
	debug.innerHTML = position;
}

function compassHandler(e) {
	let alpha;
	// Check for iOS property
	if (e.webkitCompassHeading) {
		alpha = -e.webkitCompassHeading;
	} else { // non iOS
		alpha = e.alpha - 90;
		if (!window.chrome) {
			// Assume Android stock
			alpha -= 270;
		}
	}

	if (!position) {
		let date_now = new Date();
		let time_now = date_now.getTime();
		alpha = (time_now / 10) % 360;
	} else {
		posAngle = 90 - Math.atan2(target[1] - position[1], target[0] - position[0]);
		alpha += posAngle;
	}
	arrow.style.transform = 'rotate(' + alpha + 'deg)';
}

window.onload = function() {
	arrow = document.getElementsByClassName("arrow")[0];
	debug = document.getElementById("debug");
	arrow.style.display = "none";
}

function startClick(e) {
	e.target.style.display = "none";
	startCompass();
}
