var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var userSchema = new Schema({
	created: {type: Date, default: Date.now},
	coords: {type: [Number], index: '2d'},
	username: String,
	name: String,
	email: String,
	city: String,
	photo: String,
	githubId: String,
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
				return mongoose.model('User')
				.geoNear(
					user.coords,
					{
						// query is a filter, so it'll only return
						// results such that '_id' != user.id
						query: {'_id' : user.id},

						// TODO: query out results already voted for

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
