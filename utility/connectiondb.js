var Connection = require('../models/connection.js');
var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sumanth', {useNewUrlParser: true});

  module.exports.getConnection = function (ID){                         //get connection function to find ID in connection/ID page
    var data = Connection.find({connId:ID});
    return data;
  }
  module.exports.getCategories = function(){            //get categorites function used yo find distinct Category name in connections page
    var data = Connection.distinct("catName");
    return data;
  }

  module.exports.getConnections = function(){                       //getConnections function to find the connections
    var data = Connection.find();
    return data;
  }
  module.exports.getSize = function () {                              //getsize function to count
      var data = Connection.count();
      return data;
   }
