<?php
namespace FormsEngine\Definitions\Persistence;

use MyCLabs\Enum\Enum;

/**
 * Class Type of Persistence
 * @package FormsEngine\Definitions
 */
class PersistenceType extends Enum {
    const CSV       = 'CSV';
    const JSONDB    = 'JSONDB';
}
?>
