var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sumanth', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var userSchema = new mongoose.Schema({
  userId: String,                                 //Creating schema for login and credentials
  userName: String,
  password: String
});
var credential = mongoose.model('credential', userSchema);
module.exports = credential;
