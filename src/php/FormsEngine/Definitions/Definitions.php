<?php
namespace FormsEngine\Definitions;

use Dotenv\Dotenv;
use Psr\Container\ContainerInterface;
use FormsEngine\Definitions\Persistence\PersistenceType;

class Definitions {

  protected $container;

  public function __construct(ContainerInterface $container) {
    $this->container = $container;
  }

  public function save($request, $response, $args) {
    // TODO: implement
    $formId = $args['formId'];
    $type = \getenv('PERSISTENCE_TYPE');

    $response->withStatus(404);
    return $response;
  }

  public function load($request, $response, $args) {
    // TODO: implement
    $formId = $args['formId'];
    $type = \getenv('PERSISTENCE_TYPE');

    $data = $this->collect($formId, $type);

    if (!empty($data)){
      $newResponse = $response->withJson(json_decode($data));
    }
    else {
      $newResponse = $response->withStatus(404);
    }
    return $newResponse;
  }

  private function collect($name, $type){
    $data = '';
    if (PersistenceType::isValid($type)){
        $class = 'FormsEngine\Definitions\Persistence\\'.$type;
        $data = $class::load($name);
    }
    else if (\class_exists($type)){
        $class = $type;
        $data = $class::load($name);
    }
    return $data;
  }
}
?>
