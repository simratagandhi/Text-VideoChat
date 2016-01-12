var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');

var login = require('./routes/login');
var logout = require('./routes/logout');

var welcome = require('./routes/welcome');
var announcement = require('./routes/announcement');
var headless = require('./routes/headless');
var performance = require('./routes/performance');
var search = require('./routes/search');

var app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
// var http = require('http').Server(app);
// // app.use(bodyParser());
// var io = require('socket.io')(http);

var fs = require('fs');
var file = 'mayday.db';
var exists = fs.existsSync(file);

// var passport = require('passport');
// var Strategy = require('passport-local').Strategy;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);
global.users = {};
global.online = {};
global.offline = {};
global.idle = {};
global.performanceUser = '';
global.env = 'development';
//Creating db file
if (!exists) {
  console.log('creating db file!');
  fs.openSync(file, 'w');
  db.serialize(function() {
    db.run("CREATE TABLE STATUS (status_id TINYINT(1) PRIMARY KEY ,status TEXT ,color_code TEXT)");
    db.run("INSERT into STATUS VALUES (0,'Not Available','info')");
    db.run("INSERT into STATUS VALUES (1,'OK','success')");
    db.run("INSERT into STATUS VALUES (2,'HELP','warning')");
    db.run("INSERT into STATUS VALUES (3,'EMERGENCY','danger')");
    db.run("CREATE TABLE USERS (user_id TEXT NOT NULL  PRIMARY KEY, password TEXT NOT NULL, status_id TINYINT(1) DEFAULT 0, time_id TEXT, location TEXT, FOREIGN KEY (status_id) REFERENCES STATUS(status_id ))");
    db.run("CREATE TABLE MESSAGES (msg_id INTEGER PRIMARY KEY AUTOINCREMENT, msg TEXT, time_id TEXT, user_id TEXT, FOREIGN KEY (user_id) REFERENCES USERS(user_id))");
    db.run("CREATE TABLE PRIVATE_MESSAGES (msg_id INTEGER PRIMARY KEY AUTOINCREMENT, msg TEXT, sender TEXT, receiver TEXT, time_id DATETIME DEFAULT CURRENT_TIMESTAMP, msg_type TEXT, FOREIGN KEY (sender) REFERENCES USERS(user_id), FOREIGN KEY (receiver) REFERENCES USERS(user_id))");
    // db.run("CREATE TRIGGER [UpdateLastTime] AFTER UPDATE ON USERS FOR EACH ROW BEGIN UPDATE USERS SET time_id = CURRENT_TIMESTAMP; END");
    
    db.run("CREATE TABLE ANNOUNCEMENTS (msg_id INTEGER PRIMARY KEY AUTOINCREMENT, annon TEXT, user_id TEXT, time_id TEXT, FOREIGN KEY (user_id) REFERENCES USERS(user_id))");
    // db.run("UPDATE USERS set status_id=2 where user_id='keert'");
  });
  console.log('tables  created!');
} else {
  console.log('tables  found!');

  db.each("SELECT user_id,status_id,time_id as time_stamp, location FROM USERS", function(err, row) {
    console.log(JSON.stringify(row) + ":" + row.user_id + ":" + row.status_id + ":" + row.time_stamp);
    var userValue = {};
    userValue.status = row.status_id;
    userValue.time_id = row.time_stamp;
    userValue.location = row.location;

    global.users[row.user_id] = userValue;
    global.offline[row.user_id] = userValue;
  });
}



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(partials());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('body-parser').urlencoded({
  extended: true
}));
// app.use(require('express-session')({ secret: 'mayday', resave: false, saveUninitialized: false }));
/*app.use(passport.initialize());
app.use(passport.session());*/
app.all('*', function (req, res, next) {
  console.log("global.env::"+global.env+"::"+req.originalUrl+"::"+req.originalUrl.indexOf('performance'));
  if(req.originalUrl.indexOf('performance')== -1 && global.env == 'test'){

    res.render('test', {
      message: "Performance Test Triggered",
      error: "Please wait! Performance Test has been triggered ",
      user: ""
    });
  }else{
    next();
  }
});

app.use('/', login);
// app.use('/users', users);
app.use('/welcome', welcome);
app.use('/logout', logout);
app.use('/announcement', announcement);
app.use('/headless', headless);
app.use('/performance', performance);
app.use('/search', search);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Link not found');
  err.status = 404;
  next(err);
});


// error handlers

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      user: ""
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: "User not found",
    user: ""
  });
});

// app.get('/', function(req,res){
//   res.sendfile(__dirname + '/index.ejs');  
// });

/*
app.listen(5000, function(){
  console.log('listening to port 5000');
});
*/

module.exports = app;

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var date = new Date();

if(!module.parent){
  server.listen(5000, function() {
    console.log('listening to port 5000');
  });  
}

app.post('/hatsunemiku', function(req, res) {
  console.log('request received');
});



io.on('connection', function(socket) {
  // console.log('a user connected');


  //Emiting chat message on receiving
  socket.on('chat message', function(data) {
    // console.log('message: ' + data.msg);
     console.log("INSERT into MESSAGES(msg,user_id) VALUES ('" + encodeURIComponent(data.msg) + "','" + socket.uid + "')");
    db.serialize(function() {
      db.run("INSERT into MESSAGES(msg,user_id,time_id) VALUES ('" + encodeURIComponent(data.msg) + "','" + socket.uid + "','"+data.time_id+"')");
      db.each("SELECT msg_id, time_id as time_stamp FROM MESSAGES ORDER BY msg_id DESC LIMIT 1;", function(err, row) {
        data.msgid = row.msg_id;
        console.log("Row. msgid"+row.msg_id);
      }, function() {
          console.log('data: ' + JSON.stringify(data)+socket.uid);
        io.emit('chat message', data);
      });
    });

  });

  socket.on('private chat message', function(data) {
    console.log('data: ' + JSON.stringify(data));
    // console.log("INSERT into MESSAGES(msg,user_id) VALUES (" + data.msg + "," + socket.uid + ")");
    db.serialize(function() {
      db.run("INSERT into PRIVATE_MESSAGES(msg,sender,receiver,time_id,msg_type) VALUES ('" + encodeURIComponent(data.msg) + "','" + data.sender + "','" + data.receiver + "','"+data.time_id + "','"+data.msg_type+"')");
//      db.each("SELECT msg_id, datetime(time_id,'localtime') as time_stamp FROM MESSAGES ORDER BY msg_id DESC LIMIT 1;", function(err, row) {
//        data['msgid'] = row.msg_id;
//
//      }, function() {
        socket.emit('private chat message', data);
//      }, function() {
        for (var i = 0; i < io.sockets.sockets.length; i++) {
          var receiver_socket = io.sockets.sockets[i];
          var uid = receiver_socket.uid;
          if (uid !== undefined && uid !== "" && uid == data.receiver) {
            receiver_socket.emit('private chat message', data);
          }
        }
//      });
    });

  });

  socket.on('video chat signal', function(data) {
    for (var i = 0; i < io.sockets.sockets.length; i++) {
      var receiver_socket = io.sockets.sockets[i];
      var uid = receiver_socket.uid;
      if (uid !== undefined && uid !== "" && uid == data.receiver) {
        receiver_socket.emit('video chat signal', data);
      }
    }
  });

  //Store user id and maintain number of users list
  socket.on('user connected', function(data) {
    console.log('user connected: ' + data.uid);
    socket.uid = data.uid;
    var msgid = 0;
    db.serialize(function() {
      db.each("SELECT msg_id FROM MESSAGES ORDER BY msg_id DESC LIMIT 1;", function(err, row) {
        msgid = row.msg_id;
        // console.log(msgid + ":" + row.msg_id);
      }, function() {
        socket.lmsgid = msgid;
        data.msgid = msgid;
        // console.log(msgid);
        // var total = 0;
        var client = {};
        for (var i = 0; i < io.sockets.sockets.length; i++) {
          var uid = io.sockets.sockets[i].uid;
          if (uid !== undefined && uid !== "") client[uid] = 1;
        }
        data.total = Object.keys(client).length;

        io.emit('user connected', data);
      });
    });

  });

  socket.on('chatScrollUp', function(data) {
    var result = [];
    db.serialize(function() {
      // console.log("SELECT msg_id, datetime(time_id,'localtime','%Y-%m-%d %H:%M') as time_stamp, msg, user_id as uid FROM MESSAGES where msgid <= " + data.msgid + " ORDER BY msg_id DESC LIMIT 10;")
      db.each("SELECT msg_id, time_id as time_stamp, msg, user_id as uid FROM MESSAGES where msg_id <= " + parseInt(data.msgid) + " ORDER BY msg_id DESC LIMIT 30;", function(err, row) {
        // console.log(row);
        result.push(row);
      }, function() {
        socket.emit('chatScrollUpResult', result);
      });

    });

  });

  socket.on('getPrivateChat', function(data) {
    var result = [];
    db.serialize(function() {
      // console.log("SELECT msg_id, datetime(time_id,'localtime','%Y-%m-%d %H:%M') as time_stamp, msg, user_id as uid FROM MESSAGES where msgid <= " + data.msgid + " ORDER BY msg_id DESC LIMIT 10;")
      db.each("SELECT msg_id, time_id as time_stamp, msg,sender,receiver FROM PRIVATE_MESSAGES where sender in ('" + data.sender + "','" + data.receiver + "') and receiver in ('" + data.sender + "','" + data.receiver + "') ORDER BY msg_id DESC;", function(err, row) {
        // console.log(row);
        result.push(row);
      }, function() {
        socket.emit('getPrivateChatResult', result);
      });

    });

  });

  //Get online users list
  socket.on('onlineUsersList', function() {
    var data = {},
      online = {},
      idle = {}; //io.sockets;
    for (var i = 0; i < io.sockets.sockets.length; i++) {
      var uid = io.sockets.sockets[i].uid;
      if (uid !== undefined && uid !== "") {
        online[uid] = global.online[uid];
        delete global.idle[uid];
      }
    }
    data.online = online;
    // data['idle'] = global.idle;
    socket.emit('onlineUsersList', data);
  });


  //Maintain user list on disconnection
  socket.on('user disconnected', disc);
  socket.on('disconnect', disc);

  function disc() {
    console.log('user disconnected:' + socket.uid);
    if (socket.uid !== undefined) {
      var data = {};
      data.uid = socket.uid + "";
      socket.uid = "";
      // if (socket.uid != undefined && socket.uid != ""){
      global.idle[data.uid] = global.users[data.uid];
      // console.log('user disconnected id:' + this.id );
      // delete io.sockets.sockets[this.id];
      // delete socket;
      // var total = 0;
      var online = {},
        idle = {}; //io.sockets;
      for (var i = 0; i < io.sockets.sockets.length; i++) {

        // if(uid == socket[uid])
        //   delete io.sockets.sockets[i];
        // uid ="";
        if (io.sockets.sockets[i].uid !== undefined && io.sockets.sockets[i].uid !== "") {
          online[io.sockets.sockets[i].uid] = global.online[io.sockets.sockets[i].uid];

        }
      }
      // console.log("  length"+io.sockets.sockets.length);
      data.online = online;
      // data.['idle'] = global.idle;
      data.total = Object.keys(online).length;

      io.emit('user disconnected', data);
    }
    // s}
  }


    //fetch announcements data 
    socket.on('fetch announcements', function(data){
      console.log('announcements req received');
//      console.log(data.lastLoginTime);
      var result = [];  
      db.serialize(function() {
        //db.each("SELECT msg_id, strftime('%Y-%m-%d %H:%M',time_id,'localtime') as time_stamp, annon, user_id as uid FROM ANNOUNCEMENTS where time_id >= '" + data.lastLoginTime + "';" , function(err, row) {
        db.each("SELECT msg_id, time_id as time_stamp, annon, user_id as uid FROM ANNOUNCEMENTS;" , function(err, row) {
          if(err){console.log('fetch failed');}else{
            console.log('fetch success');
            result.push(row);    
          }
        },
        function() {
          socket.emit('showAnnouncements', result);
        });

    });

  });


    socket.on('realTimeAnnon', function(data) {
      var result = [];  
      db.serialize(function() {
        db.each("SELECT msg_id, time_id as time_stamp, annon, user_id as uid FROM ANNOUNCEMENTS ORDER BY msg_id DESC LIMIT 1;", 
        function(err, row){
          result.push(row);
          console.log(result);
        },
        function() {
          io.emit('showAnnouncements', result);
        });
      });
    });


});
