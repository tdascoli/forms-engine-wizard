<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require __DIR__ . '/../../vendor/autoload.php';

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
$app->run();
?>
