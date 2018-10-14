<?php 
define('PATH', strtr(dirname(__FILE__), '\\', '/'));
require(PATH.'/init.php');
$str = isset($_GET['str']) ? $_GET['str'] : false;
echo search($str);
