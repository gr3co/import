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

	$(".card").draggable({ 
		revert: false, 
		scroll: false,
		stop: function(event, ui) {
			
			// The minimum delta-X to trigger a 'swipe'
			var swipeThreshold = $(window).width() - 100;

			if (ui.position.left < -swipeThreshold) {
				socket.emit('swipe', {
					direction: 'left'
				});
			} else if (ui.position.left > swipeThreshold) {
				socket.emit('swipe', {
					direction: 'right'
				});
			}

			// Revert back to original position
			$(event.target).animate(ui.originalPosition);
		}
	});

})();
