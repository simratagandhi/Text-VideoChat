var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var file = 'maydayTest.db';
var exists = fs.existsSync(file);
var bodyParser = require('body-parser');
var postCounter = 0;

var db = new sqlite3.Database(file);
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
    db.run("CREATE TABLE USERS (user_id TEXT NOT NULL  PRIMARY KEY, password TEXT NOT NULL, status_id TINYINT(1) DEFAULT 0, time_id DATETIME DEFAULT CURRENT_TIMESTAMP, location TEXT, FOREIGN KEY (status_id) REFERENCES STATUS(status_id ))");
    db.run("CREATE TABLE MESSAGES (msg_id INTEGER PRIMARY KEY AUTOINCREMENT, msg TEXT, time_id DATETIME DEFAULT CURRENT_TIMESTAMP, user_id TEXT, FOREIGN KEY (user_id) REFERENCES USERS(user_id))");
    db.run("CREATE TABLE PRIVATE_MESSAGES (msg_id INTEGER PRIMARY KEY AUTOINCREMENT, msg TEXT, sender TEXT, receiver TEXT, time_id DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (sender) REFERENCES USERS(user_id), FOREIGN KEY (receiver) REFERENCES USERS(user_id))");
    db.run("CREATE TRIGGER [UpdateLastTime] AFTER UPDATE ON USERS FOR EACH ROW BEGIN UPDATE USERS SET time_id = CURRENT_TIMESTAMP; END");   
    db.run("CREATE TABLE ANNOUNCEMENTS (msg_id INTEGER PRIMARY KEY AUTOINCREMENT, annon TEXT, user_id TEXT, time_id DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES USERS(user_id))");
    db.run("INSERT into USERS VALUES ('testPerform','measure',0,NULL,NULL)");
    // db.run("CREATE TRIGGER [deleteMessage] AFTER INSERT ON MESSAGES BEGIN DELETE FROM MESSAGES WHERE rowid < (last_row_id - 1000); END")
  });
  console.log('tables  created!');
} else {
  console.log('tables  found!');
}

router.post('/publicmessage', function(req, res) {
	var user = req.body.user;
	var msg = req.body.content;
	console.log("::" + (req.body.user) + postCounter);
	// var timestamp = req.body.time;
	if(postCounter >= req.body.maxReq){
		console.log("::Executing Delete");
		db.serialize(function() {

		db.run("DELETE FROM MESSAGES WHERE rowid > 0");
	});
    postCounter = 0;
			

	}
	db.serialize(function() {

		db.run("INSERT into MESSAGES(msg,user_id) VALUES ('" + msg + "','" + user + "')", function(err, row) {
			if (err) {
				res.status(404).send({
					error: 'User does not exist!'
				});
			} else {
				postCounter++;
				res.status(201).json({
					success: true,
					message: 'Message posted!'
				});
			}
		});
	});
});

router.get('/messages/wall', function(req, res) {
	// var timestamp = req.body.time;
	var result = [];
	db.serialize(function() {
		db.each("SELECT msg_id, strftime('%Y-%m-%d %H:%M',time_id,'localtime') as time_stamp, msg, user_id as uid FROM MESSAGES ORDER BY msg_id DESC", function(err, row) {
			result.push(row);
		}, function() {
			if (result.length === 0) {
				res.status(404).send({
					error: 'No messages!'
				});
			} else {
				res.status(200).json({
					success: true,
					message: 'Messages retrieved!',
					messages: result
				});
			}
		});
	});
});

router.get('/startTestEnv', function(req, res) {
	global.env = 'test';
	res.status(200).send({
					success: 'Test env set!'
				});
});

router.get('/stopTestEnv', function(req, res) {
	global.env = 'development';
	res.status(200).send({
					success: 'Test env unset!'
				});
});


module.exports = router;