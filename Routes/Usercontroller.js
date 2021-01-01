var express=require('express');
var router=express.Router();
var app= express();
var bodyparser = require('body-parser');
var urlencoded = bodyparser.urlencoded({ extended: false });
var Promise = require ('promise');
var DB=require('../utility/connectiondb.js');
var UserData = require('../utility/userDB.js')
var User = require('../models/User');
var Usercredential = require('../models/login.js');
var UserProfile = require('../models/UserProfile');
var UserProfileDb = require('../utility/userProfileDB.js');
var users = require('../models/UserObject.js');
const { check, validationResult } = require('express-validator');



var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sumanth', {useNewUrlParser: true});           //connecting to localhost
mongoose.Promise = global.Promise;
router.get('/', function(req, res){
  if (req.session.UserProfile){
    var userdetails = UserData.getUser(req.session.UserProfile._userId);            //getting UserId from the session
    userdetails.exec(function(err, username){
      if(err){
        console.log('error while getting user firstname')
      }
    var name = username[0].firstName;
    res.render('index', { loggedIn: true, Name: name })                             //If logged in, display the user  name in the index page
  });
}
else {
  res.render('index', { loggedIn: false, Name: '' });                           //If not logged in,name will not be displayed
}
});

router.get('/index', function(req, res){
  if (req.session.UserProfile){
    var userdetails = UserData.getUser(req.session.UserProfile._userId);
    userdetails.exec(function(err, username){
    if(err){
      console.log('error while getting user firstname')
    }
    var name = username[0].firstName;
    res.render('index', { loggedIn: true, Name: name })

    });
}
  else {
  res.render('index', { loggedIn: false, Name: '' });
}

});
router.get('/connections', function(req, res){
  if (req.session.UserProfile){
  var data = DB.getConnections().exec();
  data.then(function(connections){
    var category = DB.getCategories().exec();                                     //getting category names using getcategories function
    category.then(function(catName){
    var data = connections;
    var categoryname = catName;
    var userdetails = UserData.getUser(req.session.UserProfile._userId);          //getting UserId from the session
    userdetails.then(function(username){
    var name = username[0].firstName;
    res.render('connections', { data: data, category: categoryname, loggedIn: true, Name: name }); //render to connections page and display the category name
  }).catch(function(err) {
    console.log('error while getting User FirstName.');
  });
}).catch(function(err) {
    console.log('error while getting categories');
  });
}).catch(function(err) {
    console.log('error while getting connections from database');
  });

}
else {
  var data = DB.getConnections().exec();
  data.then(function(connections){                                              // Similar for else condition
    var category = DB.getCategories().exec();
    category.then(function(catName){
    var data = connections;
    var categoryname = catName;
    res.render('connections', { data: data, category: categoryname, loggedIn: false, Name: '' });
  }).catch(function(err) {
    console.log('error while getting categories');
  });
  }).catch(function(err) {
    console.log('error while getting connections from database');
  });
}
});

router.get('/connection/:ID', [check('ID','Invalid ID').isNumeric().toInt()],function(req, res){//validating the ID and checking if it is integer or not
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  return res.send(errors.errors);
  }
  if (req.session.UserProfile){
  var userdetails = UserData.getUser(req.session.UserProfile._userId);
  userdetails.then(function(username){
  var name = username[0].firstName;
  var con = DB.getConnection(req.params.ID).exec();                             //getting connections from the connections database
  con.then(function(connection){
    var size = DB.getSize().exec();
    size.then(function(count){
      if (connection!=null && req.params.ID <= count) {
        res.render('connection', {data: connection[0], Uid: req.params.ID, loggedIn: true, Name: name});
        }
      else{
        res.redirect('/connections');
      }
    }).catch(function(err) {                                                    //using catch function to catch any error
        console.log('error while getting size of connections!');
      });
      }).catch(function(err) {
          console.log('error while getting conections from database');
        });
    }).catch(function(err) {
        console.log('error while getting user FirstName');
      });
    }
  else{
    var con = DB.getConnection(req.params.ID).exec();
    con.then(function(connection){
    var size = DB.getSize().exec();
    size.then(function(count){
      if (connection!=null && req.params.ID <= count) {                         // checking for connections using the if condition
        res.render('connection', {data:connection[0], Uid: req.params.ID, loggedIn: false, Name: '' })
        }
        else{
            res.redirect('/connections');
          }
        }).catch(function(err) {                                                //catches if there is any error
            console.log('error while getting size of connections');
          });
        }).catch(function(err) {
            console.log('error while getting conections from database');
          });
      }
    });

router.get('/savedconnections', function(req, res){
  if(req.session.UserProfile){
  if (req.session.UserProfile._userConnections.length > 0  ){                  //checking if the connections length is greater than 0
    var userdetails = UserData.getUser(req.session.UserProfile._userId).exec();
    userdetails.then(function(username){
    var name = username[0].firstName;
  res.render('savedconnections', { data: req.session.UserProfile._userConnections , connectionsExist: true, loggedIn: true, Name: name });
}).catch(function(err) {
    console.log('error  while getting user FirstName');
  });
}
else {
  var userdetails = UserData.getUser(req.session.UserProfile._userId).exec();
  userdetails.then(function(username){
  var name = username[0].firstName;
  res.render('savedconnections', { data: req.session.UserProfile._userConnections , connectionsExist: false, loggedIn: true, Name: name });
}).catch(function(err) {
    console.log('error  while getting user FirstName');
  });
}
}
else{
res.redirect('/login');
}
});

router.post('/savedconnections', urlencoded, [check('Uid', 'Invalid Uid').isAlphanumeric(),          //validating the savedconnections
check('connName', 'Invalid event' ).escape().trim(), check('catName', 'Invalid categoryName' ).escape().trim(),
check('button', 'Invalid RSVP' ).isAlpha(), check('actionOp', 'Invalid action' ).isAlpha()], function (req, res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  return res.send(errors.errors);
  }
  switch (req.body.actionOp) {
    case "add":                                                                 //case "add" for adding a new connection
    var search = [
      {
      userId : req.session.UserProfile._userId,
      Uid : req.body.Uid,
      event : req.body.connName,
      category : req.body.catName,
    }];

      UserProfile.findOne(search[0], function(err, allsaved){                     //finding the particular connection using findOne function
        if(err){
            var data = [{
              userId : req.session.UserProfile._userId,
              Uid : req.body.Uid,
              event : req.body.connName,
              category : req.body.catName,
              rsvp : req.body.button  }];



          UserProfileDb.addRSVP(data[0]);                                         //using addRSVP function to add the rsvp in savedconnections
        }
        else{
          //console.log(docs);
          UserProfileDb.updateRSVP(req.session.UserProfile._userId, req.body.Uid, req.body.connName, req.body.catName, req.body.button);
        }                                                                        //using updateRSVP function to update the ne rsvp

      });
      var myconnections = getUserConn(req.session.UserProfile);
      var userConnection = new users.Userconn (req.body.Uid, req.body.connName, req.body.catName, req.body.button);
      myconnections.addconnection(userConnection);
      myconnections.updateconnection(req.body.Uid, req.body.button);
      req.session.UserProfile = myconnections;
      //console.log(req.session.UserProfile._userConnections);
      res.redirect('/savedconnections');
      break;
      case "delete":                                                            //case "delete" used for deleting the connection in saved conenctions
      var connection = req.body.Uid;
      UserProfile.deleteOne({Uid:connection}).exec(function(err, docs){
      if(err) throw err;
    });
      var myconnections = getUserConn(req.session.UserProfile);
      myconnections.removeconnection(req.body.Uid);
      req.session.UserProfile = myconnections;
    //  console.log(req.session.UserProfile);
      res.redirect('/savedconnections');
      break;

};
});



router.get('/signout', function (req, res) {
    req.session.destroy(function (err) {                                        // destroting the session using destroy function
        if (err) {
            return next(err);
        } else {
            return res.redirect('/');
        }
    });
});

router.get('/newconnection', function(req, res){
  if (req.session.UserProfile){
    var userdetails = UserData.getUser(req.session.UserProfile._userId);
    userdetails.exec(function(err, username){
      if(err)
      {
        console.log('error wile opening newconnection page')
      }
    var name = username[0].firstName;
    res.render('newconnection', { loggedIn: true, errors: '',Name: name } );

    });
  }
  else{
    res.render('newconnection', { loggedIn: false, errors: '',Name: '' } )
  }
});

router.post('/newconnection', urlencoded,
[
  check('catName').isAlpha().withMessage('category Name should be in characters'),  //validating and sanitizing the data in ne connections
  check('connName').isAlpha().withMessage('Event Name should be in characters').trim(),
  check('details').isAlpha().withMessage('Details should be in characters').trim(),
  check('dateTime').isAlpha().withMessage('When should be in characters')
],

function(req,res){
  const errors =  validationResult(req);                                        //validates the error
  if(!errors.isEmpty()){
    if (req.session.UserProfile){
      var userdetails = UserData.getUser(req.session.UserProfile._userId);
      userdetails.exec(function(err, username){
        if(err){
          console.log('error while getting user FirstName');
        }
      var name = username[0].firstName;
      return res.render('newconnection', { loggedIn: true, errors:errors.errors, Name: name } );


      });
    }
    else{
      return res.render('newconnection', { loggedIn: false, errors:errors.errors, Name: '' } )
    }
}
else{
var kuthuru = DB.getSize().exec();                                              //using getsize function to get the count for connection IDs
kuthuru.then(function(count){
connId = count + 1;
  var newdata = [
    {
    connId: connId.toString(),
    connName: req.body.connName,
    connHost: " Host : path finder",
    catName: req.body.catName,
    details: req.body.details,
    dateTime: req.body.dateTime,
    imageURL: "../assets/images/id_1.jpg"

  }];
//console.log(newdata);
UserProfileDb.addConnection(newdata[0]);                                        // Using add connection in user profile
res.redirect('/connections');
}).catch(function(err) {
    console.log('error while adding a new connection!');
  });
}
});

router.get('/login', function(req, res){
  if (req.session.UserProfile){

    res.redirect('savedconnections');

  }
  else{
    res.render('login', { loggedIn: false, Name: '', errors: '', loginerror: ""  })
  }
});


router.post('/login', urlencoded, [check('username', 'Invalid username or password').isEmail().normalizeEmail(),
check('password', 'Invalid username or password' ).isLength({min:8})], function(req, res){ //validating the login page and sanitizing

const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.render('login', { loggedIn: false, Name: '', errors: "Invalid username or password",  loginerror: ""  });
}
var cred = UserProfileDb.validatelogin(req.body.username).exec();          //validating the credetials using validateCredential function
cred.then(function(docs){
if(docs.length>0 && docs[0].password== req.body.password){
  var id = docs[0].userId;
  var user = UserData.getUser(id);
  user.then(function(usersname){
  var name = usersname[0].firstName;
  var usercon = UserProfileDb.getUserProfile(id).exec();                        //getting user profile
  usercon.then(function(userconn){
  var d = userconn;
  var conns = [];
  d.forEach(function(con){
  var tmp = new users.Userconn(con.Uid, con.event, con.category, con.rsvp);
   u.push(tmp);
  });
  var userpro = new users.Userpro(usersname[0].userId, conns);
  req.session.UserProfile = userpro;
  console.log(req.session.UserProfile);
  res.redirect('savedconnections');
}).catch(function(err) {
    console.log('error while getting userprofile');
  });
}).catch(function(err) {
    console.log('error while getting user FirstName');
  });
}
else{
    res.render('login', { loggedIn: false, Name: '', errors: "", loginerror: "Incorrect username or password" });
}
});
});


router.get('/about', function(req, res){
  if (req.session.UserProfile){
    var userdetails = UserData.getUser(req.session.UserProfile._userId);
    userdetails.exec(function(err, username){
      if(err){
      return  console.log('error while getting user FirstName');
      }
    var name = username[0].firstName;
  res.render('about', { loggedIn: true, Name: name } );
  });
}
else{
  res.render('about', { loggedIn: false, Name: '' } )
}
});

router.get('/contact', function(req, res){
  if (req.session.UserProfile){
    var userdetails = UserData.getUser(req.session.UserProfile._userId);
    userdetails.exec(function(err, username){
      if(err){
      return  console.log('error while getting user FirstName');
      }
    var name = username[0].firstName;
  res.render('contact', { loggedIn: true, Name: name });

  });
}
else{
  res.render('contact', { loggedIn: false, Name: '' })
}
});
router.get('*', function(req, res){
  res.send('error')
});


var getUserConn = function (userprofile) {                              // function used for getting user connections
    var ID = userprofile._userId;
    var userConnections = userprofile._userConnections;
    var remdata = [];
    for (var i = 0; i < userConnections.length; i++) {
        var getall = new users.Userconn(userConnections[i]._Uid, userConnections[i]._event, userConnections[i]._category, userConnections[i]._rsvp);
        remdata.push(getall);
    }
    var userpro = new users.Userpro (ID, remdata);
    return userpro;
};
module.exports=router;
