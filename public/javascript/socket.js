(function() {

	var socket = io('/');
	var gotCards = false;

	socket.on('requestLocation', function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				socket.emit('location', position.coords);
			});
		} else {
			socket.emit('location', 0);
		}
	});

	socket.on('locationOK', function() {
		if (!gotCards) {
			socket.emit('requestCards');
		}
	});

	socket.on('cards', function(cards) {
		gotCards = true;
		console.log(cards);
	});

})();

$("#img-draggable").draggable({ revert: "invalid", scroll: false });
