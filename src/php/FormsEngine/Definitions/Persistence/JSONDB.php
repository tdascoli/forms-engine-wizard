<?php
namespace FormsEngine\Definitions\Persistence;

use FormsEngine\Definitions\Persistence\Persistence;
use SleekDB\SleekDB as DB;

class JSONDB implements Persistence {

  public static function persist($formId, $form){
    $store = self::prepare();
    $data['formId'] = $formId;
    $data['form']   = $form;

    $form = $store->where('formId','=',$formId)->fetch();
    if (\count($form)>0){
      $store->where('formId','=',$formId)->update($data);
    }
    else {
      $id = $store->insert($data);
    }
  }

  public static function load($formId){
    $name = \getenv('PERSISTENCE_NAME');
    $store = self::prepare();
    $data = $store->where('formId','=',$formId)->fetch();
    // TODO: what about more than one result??
    if (count($data)==0){
      return NULL;
    }
    return \json_encode($data[0]['form'], JSON_PRETTY_PRINT);
  }

  private static function prepare(){
    $name = \getenv('PERSISTENCE_NAME');
    $path = \getenv('PERSISTENCE_DIR');
    $store = DB::store($name, $path);
    return $store;
  }
}
?>
