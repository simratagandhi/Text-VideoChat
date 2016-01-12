var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mayday.db');
var jwt = require('jwt-simple');
var bodyParser = require('body-parser');

global.localStorage = require('localStorage');

/*render login page to user*/
router.get('/', function(req, res, next) {
  res.render('login');
  console.log("render in login.js");
});

/*to validate existing account*/
router.post('/loginUser', function(req, res) {
  var username = req.body.loginUsername;
  var password = req.body.loginPassword;
  console.log('Req:' + JSON.stringify(req.body));
  //if usernames exists and password match, issue a token
  db.get("SELECT * FROM USERS WHERE user_id='" + username + "'", function(err, row) {
    if (row && password === row.password) {
      var exdate = new Date();
      var expires = exdate.getTime() + (1 * 24 * 60 * 60 * 1000);
      var token = jwt.encode({
        iss: username,
        exp: expires
      }, "mayday");

      //add the user to online and delete from offline
      global.online[row.user_id] = global.users[row.user_id];
      delete global.offline[row.user_id];

      //idle array is not used currently
      global.idle[row.user_id] = global.users[row.user_id];
      res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token,
        expires: expires,
        user: username
      });
    } else {
      res.status(500).send({
        error: 'Username or Password is not correct!'
      });
    }
  });
});

/*respones to signup request*/
router.post('/signupUser', function(req, res) {
  var username = req.body.loginUsername;
  var password = req.body.loginPassword;
  var exdate = new Date();
  var expires = exdate.getTime() + (1 * 24 * 60 * 60 * 1000);
  //confirm with db if the username already exists or not
  db.get('SELECT * FROM USERS WHERE user_id="' + username + '"', function(err, row) {
    if (row) {
      if (row && password === row.password) {
        var token = jwt.encode({
          iss: username,
          exp: expires
        }, "mayday");

        global.online[row.user_id] = global.users[row.user_id];
        global.idle[row.user_id] = global.users[row.user_id];
        delete global.offline[row.user_id];

        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          expires: expires,
          user: username
        });
      } else {
        res.status(500).send({
        error: 'Username taken! Try another!'
      });
      }

    } else {
      db.run("INSERT INTO USERS VALUES ('" + username + "','" + password + "',0,NULL,NULL)", function(err, val) {
        if (err)
          res.status(500).send({
            error: 'Username taken! Try another!'
          });
        else {
          var token = jwt.encode({
            iss: username,
            exp: expires
          }, "mayday");
          
          //add the new user to global
          var userValue = {};
          userValue['status'] = 0;
          userValue['time'] = "";
          userValue['location'] = "";
          global.users[username] = userValue;
          global.online[username] = userValue;
          global.idle[username] = userValue;
          delete global.offline[username];
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token,
            expires: expires,
            user: username
          });          
        }
      });
    }
  });
});


module.exports = router;
