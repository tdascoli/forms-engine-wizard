<?php
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
$app->run();
?>
