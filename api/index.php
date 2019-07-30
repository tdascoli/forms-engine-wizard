<?php
session_start();
// Config
$_SESSION['configFile'] = __DIR__ . '/../app/config.json';

require __DIR__ . '/vendor/autoload.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use FormsEngine\Answers\Collection\Collection;
use FormsEngine\Answers\CompleteHandler\ServerCompleteHandler;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app = new \Slim\App;
$app->get('/hello/{name}', function (Request $request, Response $response, array $args) {
    $name = $args['name'];
    $response->getBody()->write("Hello, $name");

    return $response;
});

$app->put('/forms/{formId}',  function (Request $request, Response $response, array $args) {
    $formId = $args['formId'];

    $body = $request->getBody();
    $form = json_decode($body);

    $handle = fopen(__DIR__ .'/../forms/'.$formId.'.json','w+');
    fwrite($handle, \json_encode($form));
    fclose($handle);

    $response->getBody()->write('ok');
    return $response;
});

$app->get('/forms/{formId}',  function (Request $request, Response $response, array $args) {
    $formId = $args['formId'];
    $filename = __DIR__ .'/../forms/'.$formId.'.json';

    if (file_exists($filename)){
      $handle = fopen($filename,'r');
      $formJson = fread($handle, filesize($filename));
      fclose($handle);

      $newResponse = $response->withJson(json_decode($formJson));
    }
    else {
      $newResponse = $response->withStatus(404);
    }
    return $newResponse;
});

// FormsEngine
$app->put('/record/{formId}', ServerCompleteHandler::class . ':save');

$app->get('/record/{formId}[/{type}]', Collection::class . ':load');

$app->run();
?>
