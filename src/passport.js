var passport = require('passport'),
GitHubStrategy = require('passport-github').Strategy,
User = require('./user');

module.exports = function(app) {

  // authentication
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new GitHubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.host + ":" + config.port + "/login/cb"
  },
  function(accessToken, refreshToken, profile, done) {
   User.findOne({githubId: profile.id}, function(err, user){
    if (err){
      return done(err);
    }
    else if (user){
      return done(null,user);
    }
    else {
      var newUser = new User({
        githubId: profile.id,
        username: profile.username,
        name: profile.displayName,
        email: profile['_json'].email,
        city: profile['_json'].location,
        photo: profile['_json']['avatar_url'],
      });
      newUser.save(function(err, result){
        if (err){
          return done(err);
        }
        else {
          return done(null, newUser);
        }
      });
      newUser = null;
    }
  });
 }
 ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, done);
  });

}
