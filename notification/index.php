<?php

require(dirname(__FILE__).'/../vendor/autoload.php');

$app_id = getenv('PUSHER_APP_ID');
$app_key = getenv('PUSHER_APP_KEY');
$app_secret = getenv('PUSHER_APP_SECRET');

$pusher = new Pusher($app_key, $app_secret, $app_id);

$text = htmlspecialchars($_POST['message']);

$data['message'] = $text;
$pusher->trigger('notifications', 'new_notification', $data);