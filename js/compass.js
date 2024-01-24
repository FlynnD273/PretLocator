// From https://dev.to/orkhanjafarovr/real-compass-on-mobile-browsers-with-javascript-3emi
var arrow;
const isIOS = !(
	navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
	navigator.userAgent.match(/AppleWebKit/)
);

function startCompass() {
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
	angle = e.webkitCompassHeading || Math.abs(e.alpha - 360);
	arrow.style.transform = 'rotate(' + angle + 'deg)';
}

window.onload = function() {
	arrow = document.getElementsByClassName("arrow")[0];
	startCompass();
	// console.log(arrow);
	// setInterval(function() {
	// 	let date_now = new Date();
	// 	let time_now = date_now.getTime();
	// 	let angle = (time_now / 10) % 360;
	// 	arrow.style.transform = 'rotate(' + angle + 'deg)';
	// }, 20);
}
