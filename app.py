import pusher
import os

app_id = os.environ.get('PUSHER_APP_ID')
key = os.environ.get('PUSHER_APP_KEY')
secret = os.environ.get('PUSHER_APP_SECRET')

p = pusher.Pusher(
  app_id=app_id,
  key=key,
  secret=secret
)

p['my_channel'].trigger('my_event', {'message': 'hello world'})