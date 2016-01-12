var express = require('express');
var router = express.Router();


/*renew global arrays when a user logout*/
router.get('/:user', function(req, res, next){
  var user= req.params.user;
  global.offline[user] =  JSON.parse(JSON.stringify(global.online[user]));
  delete global.online[user];
  delete global.idle[user];
  res.redirect('/');
});


module.exports = router;
