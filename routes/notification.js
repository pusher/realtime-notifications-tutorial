var express = require('express');
var router = express.Router();

var Pusher = require('pusher');

var app_id = process.env.PUSHER_APP_ID;
var app_key = process.env.PUSHER_APP_KEY;
var app_secret = process.env.PUSHER_APP_SECRET;

var pusher = new Pusher({
	appId: app_id,
	key: app_key,
	secret: app_secret
});

router.get('/', function(req, res){
	pusher.trigger('notifications', 'new_notification', {
		message: "hello world"
	});
	res.send("Notification triggered!")
});

module.exports = router;