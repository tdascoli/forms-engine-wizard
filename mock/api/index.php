<?php
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require '../../vendor/autoload.php';

$app = new \Slim\App;
$app->get('/hello/{name}', function (Request $request, Response $response, array $args) {
    $name = $args['name'];
    $response->getBody()->write("Hello, $name");

    return $response;
});

$app->post('/testfunct', testFunct);
function testFunct($tmsg) {
   $request = Slim::getInstance()->request();
   echo $request->getBody();
}

$app->put('/forms/{formId}',  function (Request $request, Response $response, array $args) {
    $formId = $args['formId'];

    $body = $request->getBody();
    $user = json_decode($body);
    //var_dump($user);

    $response->getBody()->write("Hello, $formId:".$user->test);

    return $response;
});
$app->run();
?>
