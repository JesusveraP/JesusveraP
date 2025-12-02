<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/Laravel/vendor/autoload.php';
echo "Autoload OK<br>";

require __DIR__ . '/Laravel/bootstrap/app.php';
echo "App OK<br>";
