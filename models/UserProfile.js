var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sumanth', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var userConnectionSchema = new mongoose.Schema({
  userId: String,                                                           //Creating schema for user profile
  Uid: String,
  event: String,
  category: String,
  rsvp: String
})
var Userconnection = mongoose.model('Userconnection', userConnectionSchema);
module.exports = Userconnection;
