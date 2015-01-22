#How To Create Realtime Notifications For HTML5 Apps

There are few apps nowadays for which realtime notifications are not a core feature. From friend requests to pull requests, keeping users updated is key to their experience. Users want to be in the know about the content that interests them, and receive current information without the need for a browser refresh. It improves peer interactions between friends and colleagues, increases social reach, and trigger important conversations that could be invaluable to your app. 

In this tutorial, we will show you how simple it is to add realtime notifications to your web or mobiles apps with Pusher.

##What We'll Cover

* A user will perform an action that will create a notification, and send it to the server.
* When the server receives the notification data, it will broadcast it to other users using the server language's Pusher HTTP library.
* All users running the web app will receive the notification via the Javascript Pusher Websockets library. It will be shown in the application views.
* We will use a third party library to enhance the notification experience.

##Pusher Terminology

The realtime web is sometimes referred to as “the evented web”. This is because our applications are full of events; events when data changes within your apps, events when users interact with an application and events when systems interact with each other. 

Events take place on something: on a table in a database as a new record is created, updated or deleted; on a particular part of the user interface. Anything that results in a change in the underlying application state. 

For this reason Pusher uses the terms channel for identifying and partitioning data and events for indicating actions upon that data.

###Channels

In Pusher, channels are a way to organize your data. In this tutorial, we will use a channel called `notifications`, but for other things you might wish to add, such as `chat-messages` or `user-activity`, you will want to use new channels to appropriately categorize the data you send.

To transmit notifications, we will be using [public channels](https://pusher.com/docs/client_api_guide/client_public_channels). Information on public channels is potentially accessible to anybody. To control access to information on channels you would use [private channels](https://pusher.com/docs/private_channels).

###Events

Events are triggered on channels resulting in the event being distributed to all clients that are subscribed to that channel. They have a name, such as `new_notification`, and a JSON data payload, such as `{message: 'hello world'}`.

##The Tutorial

Now that you've grasped channels and events, let's get started with creating your own realtime notifications app!

### Step 0: Setting Up

[Sign up]() for a free account.

Make sure you have a server capable of running Ruby, PHP or Python.

Install the Pusher library for your given language:

[Ruby](): `gem install pusher`

[Python](): `pip install pusher`

[PHP](): `composer require pusher/pusher-php-server`

Create an application, and name it whatever you wish, e.g. 'Notifications Tutorial'. On the page for your application, you’ll find your application credentials.

![App Creation](https://raw.githubusercontent.com/jpatel531/notifications_tutorial/content/images/new_app.gif)

Create a directory called `notifications` with a structure that looks like this: 

Ruby: 
``` 
app.rb
views / index.erb
```

Python: 
```
app.py
templates / index.html
```

PHP
```
index.html
notification / index.php
```


If at any point you are stuck, [feel free to browse the source code]().

### Step 1: Triggering an event

To start with, we'll just trigger an event on a channel, and view it in the [Pusher debug console](https://pusher.com/docs/debugging).

First off, import the Pusher package or library. And then we initialise our Pusher instance with our app credentials: our app_id, app_key, and app_secret. 

Now, for testing purposes we’ll trigger an event called `my_event` on a channel called `my_channel`. We'll give this event an arbitrary payload, such as `{message: 'hello world'}`.


```ruby
require 'pusher'

pusher = Pusher::Client.new app_id: 'YOUR APP ID', key: 'YOUR APP KEY', secret: 'YOUR APP SECRET'
    
# trigger on my_channel' an event called 'my_event' with this payload:
    
pusher.trigger('my_channel', 'my_event', {
    message: 'hello world'
})
    
```

Open up the Pusher debug console for the app you have created. Then execute the code in the file you’ve just edited.

Ruby: ` ruby app.rb`

Python: `python app.py`

PHP: `php notification/index.php`

You should see the event pop up in the Pusher debug console. Pretty nifty, huh?

![Pusher Debug console image](https://raw.githubusercontent.com/jpatel531/notifications_tutorial/content/images/debug%20console%20tut.jpg)

### Step 2: Creating a very basic app

#### On Your Client

Let's jump in and see what we do on the client-side when using Pusher.

Include the [Pusher JavaScript library](https://github.com/pusher/pusher-js) in your `index.html` file. We’ll also include jQuery for rendering notifications in the UI:

```html
<script src="//js.pusher.com/2.2/pusher.min.js"></script>
<script src="//code.jquery.com/jquery-2.1.3.min.js"></script>
```

To get things started, let's initialize our Pusher instance in a HTML script tag:

```html
<script>
    var pusher = new Pusher('YOUR_APP_KEY');
</script>
```

Essentially, we wish to bind to an event on a channel, and pass a callback to be called any time the event takes place, such as this:

```js
myChannel.bind('my_event', function(data){
    // do something with our `data`
});
```

Let's bind to an event called `new_notification` on the `notifications` channel and show it in a `<div>`:

```js
//subscribe to our notifications channel
var notificationsChannel = pusher.subscribe('notifications');

//do something with our new information
notificationsChannel.bind('new_notification', function(notification){
    // assign the notification's message to a <div></div>
    var message = notification.message;
    $('div.notification').text(message);
});
```
    
Now, within your HTML, create a div, with class 'notification', such as `<div class="notification"></div>`. Your HTML should look like this:

```html
<!doctype html>
<html>
<head>
    <title>Realtime Notifications</title>
    <script src="http://js.pusher.com/2.2/pusher.min.js" type="text/javascript"></script>
    <script src="https://code.jquery.com/jquery-2.1.3.min.js" type="text/javascript"></script>
</head>
<body>

    <div class="notification"></div>

    <script>

    var pusher = new Pusher('YOUR_APP_KEY');

    var notificationsChannel = pusher.subscribe('notifications');

    notificationsChannel.bind('new_notification', function(notification){
        var message = notification.message;
        $('div.notification').text(message);
    });

    </script>

</body>
</html>

```

#### On Your Server

We’ll slightly modify our existing code so that whenever somebody makes a GET request to the `/notification` endpoint, this code will be executed and a `new_notification` event will be triggered on the `notifications` channel.


```ruby
get '/notification' do
    pusher.trigger('notifications', 'new_notification', {
        message: 'hello world'
    })
    “Notification triggered!”
end

# don't forget to render your index.html page

get '/' do
    erb :index
end
```

Run your server and open '/', showing `index.html`, on one browser window.

Then, open `/notification` URL in another browser window and you will see 'hello world' appear on the first window.
    

###Step 3: Make It Interactive

####On Your Client

That's all well and good - but what if we want to create notifications that say something other than 'hello world'? Let's make it so that we create a notification to all users whenever we submit some text to the UI.

Let's create our input:

```html
<input class="create-notification" placeholder="Send a notification :)"></input>
<button class="submit-notification">Go!</button>
```
    
Now, whenever clicks 'Go!', we want to POST to our `/notification` endpoint with the message to broadcast.

```js
var sendNotification = function(){

    // get the contents of the input
    var text = $('input.create-notification').val();

    // POST to our server
    $.post('/notification', {message: text}).success(function(){
        console.log('Notification sent!');
    });
};

$('button.submit-notification').on('click', sendNotification);
```
    
    
// need a sidebar about input validation and sanitization


####On Your Server

Server-side, we'll just want to replace our hard-coded 'hello world' message with whatever was posted to that endpoint. Furthermore, we'll want to make sure our code handles a POST request. This is so that we can POST messages to this endpoint to the client to create a notification.

```ruby
post '/notification' do
    message = params[:message]
    
    pusher.trigger('notifications', 'new_notification', {
        message: message
    })
end
```

Now, open up a second browser to show the `index.html` file. If you type a piece of text into your input box and click ‘Go!’, you'll see that all browsers receive your new notification.

###Step 4: Improve The Notification Experience

[Toastr]() is a fairly popular and easy-to-use library for nice, non-blocking in-app notifications. In showing you how to further extend your notifications app, let's use it to display new notifications in the UI.

Link in the Toastr CSS and Javascript in your between your `<head>` tags in `index.html`:
    
```html
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
```

Remove our `<div class="notification"></div>` as we won't need it any more.

Now let's simply call `toastr` in our `new_notification` Pusher callback:

```js
notificationsChannel.bind('new_notification', function(notification){
    var message = notification.message;
    toastr.success(message)
});
``` 

So, test it out! You can open up a new browser window to check it works.

A nice feature of toastr is that is provides a number of different styles of of notification… like you may have seen on things like Twitter etc.

[If you have ngrok installed, make a new tunnel by typing something like:

    ngrok -subdomain=pusher-notifications-tutorial 9393
    
Then open up 'pusher-notifications-tutorial.ngrok.com' in your phone, send yourself a notification and voilà! 
]


###What Now?

Docs
Try other stuff e.g. different toastr notifications
Try other notification libraries … a few links
If you don’t want the triggererer of the notification to see the notification they you can exclude recipients
----

Sidebars:

* Ngrok
* Input sanitization