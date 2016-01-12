var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mayday.db');
var app = express();


// GB
router.get('/cName', function(req, res) {
    var resultOnline = [];
    var resultOffline = [];
    var searchTxt = req.param('searchTxt');
    for(var user in global.online){
        if(user.indexOf(searchTxt) != -1) {
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
        if (resultOnline.length == 0 && resultOffline.length == 0) {
            res.render('partials/search', {
                hasError: true,
                error: 'No results found!'
            });
        } else {
            res.render('partials/search', {
                hasError: false,
                paginate:false,
                result: {"OnlineUsers":resultOnline,
                         "OfflineUsers":resultOffline},
                header: {"user_id": "Users","status": "Status", "time_id": "Time","location":"Location"}
            });

        }
});

// search on status for online users
router.get('/cStatus', function(req, res) {
    var resultOnline = [];
    var resultOffline = [];
    /*var search = parseInt(req.body.searchTxt);*/
    var searchTxt = req.param('searchTxt');
    
    for(var user in global.online){
        if(global.online[user]['status'] == searchTxt ){
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
            res.render('partials/search', {
                hasError: true,
                error: 'No results found!'
            });
        } else {
            res.render('partials/search', {
                hasError: false,
                paginate: false,
                result: {"OnlineUsers":resultOnline,
                         "OfflineUsers": resultOffline},
                header: {"user_id": "Users","status": "Status", "time_id": "Time","location":"Location"}
            });
        }
});

// SG
router.get('/announcements', function(req, res) {
	var searchTxt = req.param('searchTxt');
	var result = [];
	
		db.each("SELECT * FROM ANNOUNCEMENTS WHERE annon like ('%"+searchTxt+"%') ORDER BY msg_id DESC;", function(err, row) {
			result.push(row);

		},function() {
			if (result.length == 0) {
			res.render('partials/search', {
					hasError: true,
                    error: 'No results found!'
				});
			} else {
			res.render('partials/search', {
					hasError: false,
                    paginate: true,
                    result: {"Announcement":result},
                    header:{"annon":"Announcement", "uid": "User", "time_id":"Time"} // Double check 
				});

			}
		});
	});



router.get('/publicChat', function(req, res) {
  var searchTxt = req.param('searchTxt'); 
  console.log('searchTxt:' +searchTxt)
  var result = []; 
  
  db.each("SELECT * FROM MESSAGES WHERE msg like ('%"+searchTxt+"%') ORDER BY msg_id DESC;", function(err, row) {
  	result.push(row);
  },function(){
			if (result.length == 0) {
			res.render('partials/search', {
					hasError: true,
                    error: 'No results found!'
				});
			} else {
				res.render('partials/search', {
                    hasError: false,
                    paginate: true,
                    result: {"Public Chat":result},
                    header:{"msg":"Message","user_id": "Sender", "time_id":"Time"}
				});
			}
  	});
});

//AF
router.get('/privateChat', function(req, res) {
	// console.log("IN welcome" + JSON.stringify(req.body));
	var searchTxt = req.param('searchTxt'); 
    var msgid = req.param('msgid');
	var result = [];

	db.each("SELECT * FROM PRIVATE_MESSAGES WHERE msg LIKE ('%"+searchTxt+"%') ORDER BY msg_id desc;", function(err,row) {
		result.push(row);
        result['msgid']=row.msg_id;
        console.log("Row. msgid"+row.msg_id);

	},function() {
		if (result.length == 0) {
			res.render('partials/search', {
				hasError: true,
                error: 'No results found!'
			});
		} else {
				res.render('partials/search', {
                    hasError: false,
                    paginate: true,
                    result: {"Private Chat":result},
                    header:{"msg":"Message","sender": "Sender","receiver": "Receiver", "time_id":"Time"}
				});
		}
	});

});

module.exports = router;


