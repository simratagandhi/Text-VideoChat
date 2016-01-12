var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mayday.db');

/* render welcome page. */
router.get('/:user', function(req, res, next) {
	//make sure the user already successfully login/siguup and the data was stored correctly
	if (req.params.user && (global.online[req.params.user] !== null && global.online[req.params.user])) {
		//send back user/status data for "users" tag usage
		res.render('welcome', {
			user: req.params.user,
			status: global.online[req.params.user].status
		});
	} else {
		res.render("error", {
			error: 'Session expired',
			message: 'Please log out and log in again',
			user: ""
		});
	}
});

/*processes to check session*/
router.get('/:user/:nav', function(req, res, next) {
	var decoded = jwt.decode(req.get('x-user-token'), "mayday");
	// make sure the token not is expired and username is correct
	if (decoded.exp <= Date.now() || decoded.iss != req.params.user) {
		res.render("error", {
			error: 'Session expired',
			message: 'Please log out and log in again',
			user: req.params.user
		});
	} else {
		if (global.online[req.params.user] === null || global.online[req.params.user] === undefined)
			global.online[decoded.iss] = global.offline[decoded.iss] + "";
		delete global.offline[decoded.iss];
		console.log("online:length" + Object.keys(global.online).length + ":" + JSON.stringify(global.online) + "::");
		//user successfully enters into main page and render data to browser
		var users = {
			"online": global.online,
			"offline": global.offline
		};
		var status = {
			0: "Not Available",
			1: "OK",
			2: "HELP",
			3: "EMERGENCY"
		};
		var statusClass = {
			0: "info",
			1: "success",
			2: "warning",
			3: "danger"
		};
		var iconClass = {
			0: "exclamation-circle",
			1: "check-circle",
			2: "hand-paper-o",
			3: "ambulance"
		};
	}
	res.render('partials/' + req.params.nav, {
		user: decoded.iss,
		users: users,
		status: status,
		statusClass: statusClass,
		iconClass: iconClass
	});
});

/*udpate status and timestamp when a user update status*/
router.post('/updateStatus', function(req, res) {
	var uid = req.body.uid;
	var status = req.body.status;
	var timestamp = req.body.time_id;
	db.run("UPDATE USERS SET status_id=" + status + ", time_id='"+timestamp+"' where user_id='" + uid + "';", function(err, row) {
		if (err) {
			res.status(500).send({
				error: 'Error in updating the status!'
			});
		}
	});
	db.get("SELECT time_id as time_stamp FROM USERS where user_id='" + uid + "'", function(err, row) {
		if (row) {
			res.json({
				success: true,
				message: 'Status updated!',
				uid: uid,
				status: status,
				time: row.time_stamp
			});
			global.users[uid].status = status;
			global.online[uid].status = status;
			global.users[uid]["time_id"] = row.time_stamp;
			global.online[uid]["time_id"] = row.time_stamp;
			console.log("online" + JSON.stringify(global.online));
		}
	});
});


module.exports = router;