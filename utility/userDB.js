var User = require('../models/User');
var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sumanth', {useNewUrlParser: true});
var db = mongoose.connection;

module.exports.getUser = function(ID){                      //getUser function to get the user details using userId
  var user = User.find({userId:ID});
  return user;
}
