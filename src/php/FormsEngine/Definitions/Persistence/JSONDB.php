<?php
namespace FormsEngine\Definitions\Persistence;

use FormsEngine\Definitions\Persistence\Persistence;
use SleekDB\SleekDB as DB;

class JSONDB implements Persistence {

  public static function persist($formId, $form){
    $store = self::prepare();
    $data['formId'] = $formId;
    $data['form']   = $form;
    $id = $store->insert($data);
  }

  public static function load($formId){
    $name = \getenv('PERSISTENCE_NAME');
    $store = self::prepare();
    $data = $store->where('formId','=',$formId)->fetch();
    return \json_encode($data, JSON_PRETTY_PRINT);
  }

  private static function prepare(){
    $name = \getenv('PERSISTENCE_NAME');
    $path = \getenv('PERSISTENCE_DIR');
    $store = DB::store($name, $path);
    return $store;
  }
}
?>
