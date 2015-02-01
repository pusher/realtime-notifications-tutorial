var Pusher = require('pusher');

var app_id = process.env.PUSHER_APP_ID;
var app_key = process.env.PUSHER_APP_KEY;
var app_secret = process.env.PUSHER_APP_SECRET;

var pusher = new Pusher({
	appId: app_id,
	key: app_key,
	secret: app_secret
});

pusher.trigger('my_channel', 'my_event', {
	message: "hello world"
});