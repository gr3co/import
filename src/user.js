var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var userSchema = new Schema({
	created: {type: Date, default: Date.now},
	username: String,
	name: String,
	email: String,
	location: String,
	photo: String,
	githubId: String,
});

module.exports = mongoose.model('User', userSchema, 'users');
