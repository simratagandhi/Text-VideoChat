var express = require('express');
var router = express.Router();
// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('mayday.db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('partials/users');
});

module.exports = router;
