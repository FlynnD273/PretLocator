// From https://dev.to/orkhanjafarovr/real-compass-on-mobile-browsers-with-javascript-3emi
var arrow;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

function startCompass() {
	arrow.style.display = "block";
	if (isIOS) {
		DeviceOrientationEvent.requestPermission()
			.then((response) => {
				if (response === "granted") {
					window.addEventListener("deviceorientation", handler, true);
				} else {
					alert("has to be allowed!");
				}
			})
			.catch(() => alert("not supported"));
	} else {
		window.addEventListener("deviceorientationabsolute", handler, true);
	}
}

function handler(e) {
	let alpha;
	// Check for iOS property
	if (e.webkitCompassHeading) {
		alpha = e.webkitCompassHeading;
	} else { // non iOS
		alpha = e.alpha - 90;
		if (!window.chrome) {
			// Assume Android stock
			alpha -= 270;
		}
	}

	arrow.style.transform = 'rotate(' + alpha + 'deg)';
}

window.onload = function() {
	arrow = document.getElementsByClassName("arrow")[0];
	arrow.style.display = "none";
}

function startClick(e) {
	e.target.style.display = "none";
	startCompass();
}
