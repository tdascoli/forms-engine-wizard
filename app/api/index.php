<?php
session_start();
// Config
$_SESSION['configFile'] = __DIR__ . '/../config.json';

require __DIR__ . '/../../vendor/autoload.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use FormsEngine\Answers\Collection\Collection;
use FormsEngine\Answers\CompleteHandler\ServerCompleteHandler;
use FormsEngine\Definitions\Definitions;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

// ENV
$dotenv = Dotenv\Dotenv::create(__DIR__);
$dotenv->load();

$app = new \Slim\App;
$app->get('/hello/{name}', function (Request $request, Response $response, array $args) {
    $name = $args['name'];
    $response->getBody()->write("Hello, $name");

    return $response;
});

// FormsEngine Wizard
$app->put('/forms/{formId}', Definitions::class . ':save');

$app->get('/forms/{formId}', Definitions::class . ':load');

// FormsEngine
$app->put('/record/{formId}', ServerCompleteHandler::class . ':save');

$app->get('/record/{formId}[/{type}]', Collection::class . ':load');

$app->run();
?>
