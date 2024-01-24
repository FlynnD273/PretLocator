window.onload = function() {
	var arrow = document.getElementsByClassName("arrow")[0];
	console.log(arrow);
	setInterval(function() {
		let date_now = new Date();
		let time_now = date_now.getTime();
		let angle = (time_now / 10) % 360;
		arrow.style.transform = 'rotate(' + angle + 'deg)';
	}, 10);
}
