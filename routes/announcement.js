var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mayday.db');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('mayday2.db', null, null,{
    dialect: 'sqlite',
    port: '5000'
});
var Announcement = sequelize.import('../models/AnnouncementModel');

// Announcement.sync();
/*insert the announcement into database when an administrator announce sth*/
router.post('/', function(req, res){
	var annon = req.body.annon;    
	var uid = req.body.uid;
    var time_id = req.body.time_id;
    db.run("INSERT into ANNOUNCEMENTS(annon,user_id,time_id) VALUES ('" + annon + "','" + uid + "','"+time_id+"')", function(err, val) {
        if (err)
            res.status(500).send({
                error: 'Announcement could not be stored!'
            });
        else {
            res.json({
                success: true,
                message: 'Announcement stored!',
                annon: annon,
                uid: uid,
                time_id: time_id
            });
        }
    });
    //////for AnnouncementModel
//     Announcement.upsert({
//         annon: annon,
//         user_id: uid
//     }).then(function(err, val){
//         if (err)
//             res.status(500).send({
//                 error: 'Announcement could not be stored!'
//             });
//         else {
//             res.json({
//                 success: true,
//                 message: 'Announcement stored!',
//                 annon: annon,
//                 uid: uid
//             });
//         }        
//     });

});

/*fetch all historic announcemnets once a user enters announcements tag*/
router.post('/getHistory', function(req, res){
    var result = [];
    db.serialize(function() {
        db.each("SELECT * FROM ANNOUNCEMENTS ;", function(err, row) {
            result.push(row);
        }, function() {
            console.log(result);
            res.send(result);
        });
    });
// //for AnnouncementModel
//     Announcement.findAll().then(function(Announcement){
//          console.log(Announcement);
//          res.send(Announcement);
//      });
});


module.exports = router;