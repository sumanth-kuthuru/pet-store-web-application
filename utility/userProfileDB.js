var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sumanth', {useNewUrlParser: true});
var UserProfile = require('../models/UserProfile');
var Connection = require('../models/connection')
var Promise = require('promise');
var login = require('../models/login.js')
module.exports.getUserProfile = function(ID){
  var user = UserProfile.find({userId:ID});
  return user;
}

module.exports.addRSVP = function(data){                                    //Adds RSVP to the saved connections
  UserProfile.insertMany(data, function(err,docs){
      if(err) throw err;
   });
}
module.exports.updateRSVP = function(userId, Uid, event, category, rsvp){     //updates RSVP to the saved connections
  UserProfile.findOneAndUpdate({userId: userId, Uid: Uid , event:event,category:category}, {rsvp : rsvp}, {upsert: true, New: true}).exec(function(err, docs){
  if(err) throw err;
});
}

module.exports.addConnection = function(data) {                             //Adds connection in savedconnections page
  Connection.insertMany(data,function(err, docs){
    if(err) throw err;
  }
  )
}
module.exports.validatelogin = function(username){                    //validate credentials while logging in
  var user = login.find({userName: username});
  return user;
}
