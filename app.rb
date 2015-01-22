require 'pusher'

pusher = Pusher::Client.new({
	app_id: ENV["PUSHER_APP_ID"],
	key: ENV["PUSHER_APP_KEY"],
	secret: ENV["PUSHER_APP_SECRET"]
})

pusher.trigger('my_channel', 'my_event', {
	message: 'hello world'	
})