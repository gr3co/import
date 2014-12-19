var mongoose = require('mongoose'),
Schema = mongoose.Schema,
idnum = Schema.ObjectId,
_ = require('underscore');

var userSchema = new Schema({
  created: {type: Date, default: Date.now},
  coords: {type: [Number], index: '2d'},
  githubId: String,
  username: String,
  name: String,
  email: String,
  city: String,
  photo: String,
  languages: {type: [String], default: []},
  votes: {type: [{
    liked: Boolean,
    user: {type: idnum, ref: 'User'},
    timestamp: {type: Date, default: Date.now}
  }], default: []}
},
{
  versionKey: false
});

userSchema.statics.updateLocation = function(id, lat, lng, next) {
  return this.findOneAndUpdate(
    {'_id' : id},
    {coords: [lng, lat]},
    {upsert : false},
    next);
};

userSchema.statics.findNearMe = function(id, rad, next) {
  return this.findOne({'_id' : id})
  .exec(function(err, user) {
    if (err) {
      return next(err);
    } else {
        // generate a list of people this user has already
        // swiped on, so we don't show them again
        var userIds = _.map(user.votes, function(v) {
          return v.user;
        });
        // make sure the list includes the user himself
        userIds.push(id);
        return mongoose.model('User')
        .geoNear(
          user.coords,
          {
            // query is a filter, so it'll only return
            // results such that '_id' isn't in userIds
            query: {'_id' : {$in: userIds}},

            // limit results to within a radius
            maxDistance : rad,

            // only return 10 results... this can be changed
            num: 10

          },
          next);
      }
    });
}


module.exports = mongoose.model('User', userSchema, 'users');
