var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sumanth', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var connectionSchema = new mongoose.Schema({
  connId: String,                                     //Creating schema for Connection
  connName: String,
  connHost: String,
  catName: String,
  details: String,
  dateTime: String,
  imageURL: String,

});
var Connection = mongoose.model('Connection', connectionSchema);
module.exports = Connection;
