<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../vendor/autoload.php';

if (isset($_GET['form'])){
  $url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http")."://{$_SERVER['HTTP_HOST']}/api/forms/{$_GET['form']}";
  var_dump($url);

  $response = \Httpful\Request::get($url)
      ->expectsJson()
      ->send();
  var_dump($response->body);
}
?>
