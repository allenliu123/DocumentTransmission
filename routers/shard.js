var express = require('express');
var router = express();
var fs = require('fs');

var generateUUID = function() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 16; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	var uuid = s.join("");
	return uuid;
}

router.get('/getToken',function(req, res, next){
	res.json({
    key: generateUUID(),
    token: 'asdfasdf'
  });
});

router.post('/uploadShard', function(req, res){
  // console.log(req.body)

	res.json({
    status: 'success'
  });
});

module.exports = router;