<?php

require __DIR__ . '/../vendor/autoload.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use FormsEngine\FormsEngine;

$serializedString = '{"pages":[[{"__joii_type":"7b60fa5a-574d-4c12-8c0c-24bdec980a83","id":"frage1","name":"frage1","label":"Frage 1","type":"text","placeholder":"","helptext":"","value":"","required":true,"inputmask":[],"style":[],"attributes":[],"readonly":false,"disabled":false,"__ko_mapping__":{"ignore":[],"include":["_destroy"],"copy":[],"observe":[],"mappedProperties":{"__joii_type":true,"id":true,"name":true,"label":true,"type":true,"placeholder":true,"helptext":true,"value":true,"required":true,"inputmask":true,"style":true,"attributes":true,"readonly":true,"disabled":true},"copiedProperties":{}}}]]}';
$engine = new FormsEngine();
$form = $engine->renderer();
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta content="initial-scale=1, shrink-to-fit=no, width=device-width" name="viewport">

    <title>FormsEngine</title>

    <!-- CSS -->
    <!-- Add Material font (Roboto) and Material icon as needed -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i|Roboto+Mono:300,400,700|Roboto+Slab:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- Add Material CSS, replace Bootstrap CSS -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/daemonite-material@4.1.1/css/material.min.css">

    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-3-typeahead/4.0.2/bootstrap3-typeahead.min.js"></script>
    <!-- Then Material JavaScript on top of Bootstrap JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/daemonite-material@4.1.1/js/material.min.js"></script>

    <!-- validation -->
    <script src="https://cdn.jsdelivr.net/npm/parsleyjs@2.9.1/dist/parsley.min.js"></script>

    <!-- FormsEngine JS + deps -->
    <script src="https://cdn.jsdelivr.net/npm/melanke-watchjs@1.5.0/src/watch.min.js"></script>
    <script src="js/formsEngine.pagination.js"></script>
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
        <a class="navbar-brand" href="index.php">FormsEngine</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="index.php">Documentation <span class="sr-only">(current)</span></a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<!-- content -->
<div class="container">
    <h3 class="mt-3">FormsEngine</h3>
    <p>
      <pre><?= $serializedString ?></pre>
    </p>
    <?php
      $form->load($serializedString);
    ?>
</div>

</body>
</html>
