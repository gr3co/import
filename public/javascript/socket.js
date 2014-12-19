(function() {

	var socket = io('/');
	var gotCards = false;

	function generateCard(index, card) {
		var base = $('#cards-container').offset();
		$('#cards-container')
		.append($('<div>', {
			class: 'card'
		})
		.attr('idnum', card['_id'])
		.offset({top: base.top + index * 5, 
			left: base.left + index * 5})
		.zIndex(20 - index)
		.width($('#cards-container').width())
		.append($('<img>', {
			class: 'img-thumbnail'
		}).attr('src', card.photo)));
	}

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
		if (cards.length == 0) {

		} else {
			for (var i = 0; i < cards.length; i++) {
				generateCard(i, cards[i]);
			}
			$(".card").draggable({ 
				revert: false, 
				scroll: false,
				stop: function(event, ui) {

					// The minimum delta-X to trigger a 'swipe'
					var swipeThreshold = $(window).width() - 100;

					if (ui.position.left < -swipeThreshold) {
						socket.emit('swipe', {
							direction: 'left',
							idnum: $(event.target).attr('idnum')
						});
						$(event.target).remove();
					} else if (ui.position.left > swipeThreshold) {
						socket.emit('swipe', {
							direction: 'right',
							idnum: $(event.target).attr('idnum')
						});
						$(event.target).remove();
					}

					// Revert back to original position
					$(event.target).animate(ui.originalPosition);
				}
			});
		}
	});

})();
