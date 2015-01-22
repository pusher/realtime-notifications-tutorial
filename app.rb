require 'sinatra'
require 'pusher'

pusher = Pusher::Client.new({
	app_id: ENV["PUSHER_APP_ID"],
	key: ENV["PUSHER_APP_KEY"],
	secret: ENV["PUSHER_APP_SECRET"]
})

get '/' do
	erb :index
end

get '/notification' do
	pusher.trigger('notifications', 'new_notification', {
		message: 'hello world'	
	})
	"Notification triggered!"
end