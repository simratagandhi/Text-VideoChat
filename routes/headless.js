var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mayday.db');
var bodyParser = require('body-parser');

router.get('/users', function(req, res, next) {
	// res.json(global.users);
	res.status(200).json({
		success: true,
		message: 'Fetched User List!',
		users: global.users,
		online: global.online,
		offline: global.offline
	});
});

router.get('/logout/:user', function(req, res, next) {
	// res.json(global.users);
	global.offline[user] = JSON.parse(JSON.stringify(global.online[user]));
	delete global.online[user];
	delete global.idle[user];
	res.status(200).json({
		success: true,
		message: 'Logged out!',
		user: user,
		value: global.users[user]
	});
});

router.get('/user/:user', function(req, res, next) {
	// res.json(global.users);
	var user = req.params.user;
	res.status(200).json({
		success: true,
		message: 'Fetched a Single User!',
		user: user,
		value: global.users[user]
	});
});



router.post('/updateUser', function(req, res) {
	var columnId = req.body.columnId;
	var value = req.body.value;
	var uid = req.body.user;
	console.log("columnId:" + columnId + "  Value:" + value + "::" + JSON.stringify(req.body));
	if (columnId != "status_id" && columnId != "time_id" && columnId != "user_id") {
		db.run("UPDATE USERS SET " + columnId + "='" + value + "'' where user_id='" + uid + "';", function(err, row) {
			if (err) {
				res.status(404).send({
					error: 'User or Column does not exist!'
				});
			} else {
				res.status(201).json({
					success: true,
					message: 'User column updated!',
					column: columnId
				});
			}

		});
	} else {
		res.status(200).json({
			success: true,
			message: 'User column not updated!',
			column: columnId
		});
	}
});

router.post('/publicmessage', function(req, res) {
	var user = req.body.user;
	var msg = req.body.content;
	console.log("::" + (req.body.user));
	// var timestamp = req.body.time;
	db.serialize(function() {
		db.run("INSERT into MESSAGES(msg,user_id) VALUES ('" + msg + "','" + user + "')", function(err, row) {
			if (err) {
				res.status(404).send({
					error: 'User does not exist!'
				});
			} else {
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
			if (result.length == 0) {
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

router.post('/privatemessage', function(req, res) {
	var sender = req.body.sender;
	var receiver = req.body.receiver;
	var msg = req.body.content;
	var msg_type = req.body.msg_type;
	// var timestamp = req.body.time;
	db.serialize(function() {
		db.run("INSERT into PRIVATE_MESSAGES(msg,sender,receiver,msg_type) VALUES ('" + encodeURIComponent(msg) + "','" + sender + "','" + receiver + "','" + msg_type + "')", function(err, row) {
			if (err) {
				res.status(404).send({
					error: 'User does not exist!'
				});
			} else {
				res.status(201).json({
					success: true,
					message: 'Message posted!',
					sender: sender,
					receiver: receiver
				});
			}
		});
	});
});

router.get('/privatemessages/:sender/:receiver', function(req, res) {
	var sender = req.params.sender;
	var receiver = req.params.receiver;
	var result = [];
	db.serialize(function() {
		db.each("SELECT msg_id, strftime('%Y-%m-%d %H:%M',time_id,'localtime') as time_stamp, msg,sender,receiver,msg FROM PRIVATE_MESSAGES where sender in ('" + sender + "','" + receiver + "') and receiver in ('" + sender + "','" + receiver + "') ORDER BY msg_id DESC;", function(err, row) {
				result.push(row);
			},

			function() {
				if (result.length == 0) {
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

router.get('/chatbuddies/:user', function(req, res) {
	var user = req.params.user;
	var result = [];
	db.serialize(function() {
		db.each("SELECT DISTINCT receiver as buddy FROM PRIVATE_MESSAGES where sender ='" + user + "' OR receiver='" + user + "'", function(err, row) {
			result.push(row.buddy);
		}, function() {
			if (result.length == 0) {
				res.status(404).send({
					error: 'No buddies!'
				});
			} else {
				res.status(200).json({
					success: true,
					message: 'Buddies retrieved!',
					messages: result
				});
			}
		});

	});
});

router.get('/getmessage/:id', function(req, res) {
	var id = req.params.id;
	var result = [];
	db.serialize(function() {
		db.each("SELECT msg_id, strftime('%Y-%m-%d %H:%M',time_id,'localtime') as time_stamp, msg, user_id as uid FROM MESSAGES where msg_id =" + id, function(err, row) {
			result.push(row);
		}, function() {
			if (result.length == 0) {
				res.status(404).send({
					error: 'No msgs!'
				});
			} else {
				res.status(200).json({
					success: true,
					message: 'Msgs retrieved!',
					messages: result
				});
			}
		});

	});
});

router.post('/status/:user', function(req, res) {
	var uid = req.params.user;
	var status = req.body.statusCode;
	var timestamp = req.body.updatedAt;
	var location = req.body.location;
	db.run("UPDATE USERS SET status_id=" + status + " where user_id='" + uid + "';", function(err, row) {
		if (err) {
			res.status(404).send({
				error: 'Error in updating the status!'
			});
		}
	});
	db.get("SELECT strftime('%m-%d-%Y %H:%M',time_id,'localtime') as time_stamp FROM USERS where user_id='" + uid + "'", function(err, row) {
		if (row) {

			res.json({
				success: true,
				message: 'Status updated!',
				uid: uid,
				status: row.status,
				time: row.time_stamp
			});
			global.users[uid].status = status;
			global.online[uid].status = status;
			global.users[uid]["time_id"] = row.time_stamp;
			global.online[uid]["time_id"] = row.time_stamp;
		}
	});
});

router.post('/storeAnnouncement', function(req, res) {
	//console.log("post request received");
	//console.log(req.body.annon);
	//console.log(req.body.uid);
	var annon = req.body.annon;
	var uid = req.body.user;
	db.run("INSERT into ANNOUNCEMENTS(annon,user_id) VALUES ('" + annon + "','" + uid + "')", function(err, val) {
		// console.log("insert" + err + ":" + val);
		if (err)
			res.status(404).send({
				error: 'Announcement could not be stored!'
			});
		else {
			res.json({
				success: true,
				message: 'Announcement stored!',
				annon: annon,
				uid: uid

			});
		}
	});
});

router.get('/announcement', function(req, res) {
	var result = [];
	db.serialize(function() {
		db.each("SELECT * FROM ANNOUNCEMENTS ;", function(err, row) {
			result.push(row);
		}, function() {
			res.status(200).json({
				success: true,
				message: 'Announcements retrieved!',
				messages: result
			});
		});
	});
});

/*
Adding headless methods for search usecase
*/
router.get('/publicChat/:searchTxt', function(req, res) {
  var searchTxt = req.params.searchTxt; 
  console.log('searchTxt:' +searchTxt)
  var result = []; 
  
  db.each("SELECT * FROM MESSAGES WHERE msg like ('%"+searchTxt+"%') ORDER BY msg_id DESC;", function(err, row) {
  	result.push(row);
  },function(){
			if (result.length == 0) {
				res.status(404).send({
				error: 'No public chat msgs!'
			});
			} else {
				res.status(200).json({
					success: true,
					message: 'Msgs retrieved!',
					result: {"Public Chat":result}
					
				});

			}
  	});
});

router.get('/privateChat/:searchTxt', function(req, res) {
	// console.log("IN welcome" + JSON.stringify(req.body));
	var searchTxt = req.params.searchTxt; 
	var result = [];

	db.each("SELECT * FROM PRIVATE_MESSAGES WHERE msg LIKE ('%"+searchTxt+"%') ORDER BY msg_id;", function(err,row) {
		result.push(row);

	},function() {
		if (result.length == 0) {
			res.status(404).send({
				error: 'No private msgs!'
			});
		} else {
			res.status(200).json({
				success: true,
				message: 'Prviate message results retrieved!',
				result: {"Private Chat":result}
				
			});

		}
	});

});

router.get('/cName/:searchTxt', function(req, res) {
    var resultOnline = [];
    var resultOffline = [];
    /*var search = req.body.searchTxt;*/
	var searchTxt = req.params.searchTxt;
    //console.log("In post...."+search);
    for(var user in global.online){
        if(user.indexOf(searchTxt) != -1) {
            //global.online[user].status ==  search;
            var userData = global.online[user];
            userData.user_id = user;

            resultOnline.push(userData);
        }
    }

    for(var user in global.offline){
        if(user.indexOf(searchTxt) != -1) {
            //global.offline[user].status ==  search;
            var userData = global.offline[user];
            userData.user_id = user;

            resultOffline.push(userData);
        }
    }
    console.log(resultOnline);
    console.log(resultOffline);
    //res.send(result);
    //
        if (resultOnline.length == 0 && resultOffline.length == 0) {
           res.status(404).send({
                hasError: true,
                error: 'No citizens found!'
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Username found!',
                result: {"OnlineUsers":resultOnline,
                         "OfflineUsers":resultOffline}
              
            });
           /* res.render('partials/search', {
                hasError: false,
                result: {"OnlineUsers":resultOnline,
                         "OfflineUsers":resultOffline},
                header: {"user_id": "Users","status": "Status", "time_id": "Time","location":"Location"}
            });*/

        }
});

// search on status for online users
router.get('/cStatus/:searchTxt', function(req, res) {
    var resultOnline = [];
    var resultOffline = [];
    /*var search = parseInt(req.body.searchTxt);*/
 	var searchTxt = req.params.searchTxt;
    
    for(var user in global.online){
        if(global.online[user]['status'] == searchTxt ){
            //global.online[user].status ==  search;
            var userData = global.online[user];
            userData.user_id = user;

            resultOnline.push(userData);
        }
    }

    for(var user in global.offline){
        if(global.offline[user]['status'] == searchTxt ){
            //global.online[user].status ==  search;
            var userData = global.offline[user];
            userData.user_id = user;

            resultOffline.push(userData);
        }
    }

    console.log(resultOnline);
    console.log(resultOffline);
    //res.send(result);

        if ((resultOnline.length + resultOffline.length) == 0) {
				res.status(404).send({
				error: 'No status found!'
            });
        } else {
        	  res.status(200).json({
                success: true,
                message: 'Username with this status found!',
                result: {"OnlineUsers":resultOnline,
                         "OfflineUsers":resultOffline}
               });
            /*res.status(200).json({
                success: true,
                message: 'Username with this status found!',
                online: resultOnline,
                offline: resultOffline,
                header: {"user_id": "user_id","status": "status", "time_id": "time_id", "location":"location"}
            });*/
        }
});

// SG
router.get('/announcements/:searchTxt', function(req, res) {
	var searchTxt = req.params.searchTxt;
	var result = [];
	
		db.each("SELECT * FROM ANNOUNCEMENTS WHERE annon like ('%"+searchTxt+"%') ;", function(err, row) {
			result.push(row);

		},function() {
			if (result.length == 0) {
				res.status(404).send({
				error: 'No announcements found!'
			});
			} else {
				res.status(200).json({
					success: true,
					message: 'Announcements retrieved!',
					result: {"Announcement":result}					
				});

			}
		});
	});


module.exports = router;