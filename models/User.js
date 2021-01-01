var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sumanth', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var userSchema = new mongoose.Schema({
  userId: String,
  firstName: String,
  lastName: String,                                                     //Creating schema for the user
  emailAddress: String,
  address1: String,
  address2: String,
  city:String,
  state: String,
  zipCode: String,
  country: String
});
var User = mongoose.model('User', userSchema);
module.exports = User
