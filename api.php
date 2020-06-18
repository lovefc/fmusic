<?php 
define('PATH', strtr(dirname(__FILE__), '\\', '/'));
require(PATH.'/init.php');
// 读取网易云歌单中的所有歌曲信息,填充数据到此播放器操作
$playlist_id = (int) isset($_GET['id']) ? $_GET['id'] : 2812376219;
$musicLIST = save($playlist_id);
echo $musicLIST;
