// From https://dev.to/orkhanjafarovr/real-compass-on-mobile-browsers-with-javascript-3emi
var debug;
var arrow;
var arrowNorth;
var position;
var posAngle;
var target = [51.521900, -0.124490];
const isIOS = /iPad|iPhone|iPod|Apple/.test(navigator.userAgent);

var pretLocations;
fetch("./json/pret.json")
	.then(response => { return response.json(); })
	.then(data => {
		pretLocations = data.points;
	})
	.catch(error => alert('Error fetching Pret locations:', error));

function startCompass() {
	arrow.style.display = "block";
	arrowNorth.style.display = "block";

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
	options = {
		enableHighAccuracy: true,
	};

	navigator.geolocation.watchPosition(locationHandler, locationError, options);
}

function locationError(e) {
	debug.innerHTML = e.message;
}

function distance(a, b) {
	return (a[1] - b[1]) * (a[1] - b[1]) + (a[0] - b[0]) * (a[0] - b[0]);
}

function locationHandler(e) {
	position = [e.coords.latitude, e.coords.longitude];
	if (pretLocations.length == 0) {
		target = null;
		debug.innerHTML = "Position: " + position;
		return;
	}

	let dist = distance(position, pretLocations[0]);
	let index = 0;
	for (let i = 1; i < pretLocations.length; i++) {
		let d = distance(position, pretLocations[i]);
		if (d < dist) {
			index = i;
			dist = d;
		}
	}
	target = pretLocations[index];
	debug.innerHTML = `Platform: ${isIOS ? "iOS" : "Android"}<br/>Position: ${position}<br/>Target: ${target}<br/>Distance (arbitrary unit): ${dist}<br/>Angle Offset: ${posAngle} rad ${posAngle * 180 / Math.PI} degrees`;

}

function compassHandler(e) {
	let alpha;
	// Check for iOS property
	if (e.webkitCompassHeading) {
		alpha = -e.webkitCompassHeading - 90;
	} else { // non iOS
		alpha = e.alpha - 180;
		if (!window.chrome) {
			// Assume Android stock
			alpha -= 270;
		}
	}
	let north = alpha;

	if (!position && !target) {
		let date_now = new Date();
		let time_now = date_now.getTime();
		alpha = (time_now / 10) % 360;
	} else {
		posAngle = Math.PI / 2 - Math.atan2(target[0] - position[0], position[1] - target[1]);
		alpha += posAngle * 180 / Math.PI;
	}
	arrow.style.transform = 'rotate(' + alpha + 'deg)';
	arrowNorth.style.transform = 'rotate(' + north + 'deg)';
}

window.onload = function() {
	arrow = document.getElementById("arrow");
	arrowNorth = document.getElementById("arrowNorth");
	debug = document.getElementById("debug");
	arrow.style.display = "none";
	arrowNorth.style.display = "none";
}

function startClick(e) {
	e.target.style.display = "none";
	startCompass();
}
