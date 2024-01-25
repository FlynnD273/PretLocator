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
	navigator.geolocation.getCurrentPosition(locationHandler, locationError);
}

var f;
function locationError(e) {
	if (!f) {
		alert(e.message);
		f = 1;
	}
}

function locationHandler(e) {
	position = [e.coords.longitude, e.coords.latitude];
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
		alpha = Math.random() * 360;
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
