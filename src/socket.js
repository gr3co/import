var express = require('express'), 
passportSocketIo = require("passport.socketio"),
User = require('mongoose').model('User');


module.exports = function(server, cstore) {

  //set up socket.io server
  var io = require('socket.io').listen(server);

  var acceptConnection = function(data, accept) {
    accept(null, true);
  };
  var rejectConnection = function(data, message, error, accept) {
    if (error) {
      console.error("Rejected connection: " + error);
    }
    accept(null, false);
  };

  //force authorization before handshaking
  io.set('authorization', passportSocketIo.authorize({
    cookieParser: express.cookieParser,
    secret: config.cookie.secret,
    store: cstore,
    success: acceptConnection,
    fail: rejectConnection
  }));

  io.sockets.on('connection', function(socket) {

    // for auth related purposes
    var user = socket.conn.request.user;

    // get the user's most recent location on connection
    socket.emit('requestLocation');

    // save the users location
    socket.on('location', function(loc) {
      if (loc.longitude && loc.latitude) {
        User.updateLocation(
          user.id, 
          loc.longitude, 
          loc.latitude, 
          function(err) {
            if (err) {
              console.log(err);
            } else {
              socket.emit('locationOK');
            }
          });
      }
    });

    socket.on('requestCards', function() {
      User.findNearMe(
        user.id, // current user
        1000,  // search radius
        function(err, users) {
          if (err) {
            console.log(err);
          } else {
            socket.emit('cards', [user, user, user, user, user]);
          }
        });
    });

    socket.on('swipe', function(data) {
      console.log(data);
    });

  });

}
