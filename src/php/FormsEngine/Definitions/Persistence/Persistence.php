<?php
namespace FormsEngine\Definitions\Persistence;

interface Persistence {

  public static function persist($name, $data);

  public static function load($name);

}
?>
