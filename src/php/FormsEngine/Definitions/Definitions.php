<?php
namespace FormsEngine\Definitions;

use Psr\Container\ContainerInterface;
use FormsEngine\Definitions\Persistence\PersistenceType;

class Definitions {

  protected $container;

  public function __construct(ContainerInterface $container) {
    $this->container = $container;
    if (!\getenv('PERSISTENCE_TYPE')){
      $dotenv = Dotenv\Dotenv::create(__DIR__);
      $dotenv->load();
    }
  }

  public function save($request, $response, $args) {
    $formId = $args['formId'];
    $type = \getenv('PERSISTENCE_TYPE');

    $body = $request->getBody();
    $form = json_decode($body);
    $this->persist($formId, $form, $type);

    // todo error!!!
    $response->withStatus(404);
    return $response;
  }

  private function persist($formId, $form, $type){
    if (PersistenceType::isValid($type)){
        $class = 'FormsEngine\Definitions\Persistence\\'.$type;
        $data = $class::persist($formId, $form);
    }
    else if (\class_exists($type)){
        $class = $type;
        $data = $class::persist($formId, $form);
    }
  }

  public function load($request, $response, $args) {
    $formId = $args['formId'];
    $type = \getenv('PERSISTENCE_TYPE');

    $data = $this->collect($formId, $type);

    if (!empty($data) && $data != '[]'){
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
