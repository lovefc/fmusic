<?php 
define('PATH', strtr(dirname(__FILE__), '\\', '/'));
require(PATH.'/init.php');
// 读取网易云歌单中的所有歌曲信息,填充数据到此播放器操作
$playlist_id = (int) isset($_GET['id']) ? $_GET['id'] : 281237621;
$musicLIST = save($playlist_id);

?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>移动手势音乐播放</title>
	<meta name="keywords" content="封尘,lovefc,fc,个人原创,手势操作,移动播放器,lovefc.cn"/>	
    <meta name="description" content="封尘,lovefc,fc,个人原创,手势操作,移动播放器,lovefc.cn"/>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <link rel="icon" href="favicon.ico" type="image/x-icon" />
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
    <!-- 字体文件 -->
    <link href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <!-- 背景css -->
    <link href="css/bg.css?v=0.0.1" rel="stylesheet">
    <!-- 播放器css -->
    <link href="css/fcmusic.css?v=0.1.5" rel="stylesheet">
    <!-- 仿ios弹窗插件css -->
    <link href="alert/alert.css" rel="stylesheet">
    <script src="https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js"></script>
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/parallax.js/1.5.0/parallax.min.js"></script>-->
    <!-- 仿ios弹窗插件 -->
    <script src="alert/alert.js" type="text/javascript" ></script>
    <!-- js原生触屏位置操作插件--Sition -->
    <script src="js/sition.min.js?v=0.1.6" type="text/javascript" ></script>
  </head>
  
  <body>
    <!-- 网页背景部分,这个其实你可以自定义网页背景，我只是为了好看，所有用了这个 -->
    <div id="scene" class="stars-wrapper">
      <div data-depth="0.00" class="layer"></div>
      <div data-depth="0.30" class="stars-cluster stars-cluster-1">
        <div class="star star-1"></div>
        <div class="star star-2"></div>
        <div class="star star-3"></div>
        <div class="star star-4"></div>
        <div class="star star-5"></div>
        <div class="star star-6"></div>
        <div class="star star-7"></div>
        <div class="star star-8"></div>
        <div class="star star-9"></div>
        <div class="star star-10"></div>
        <div class="star star-11"></div>
        <div class="star star-12"></div>
        <div class="star star-13"></div>
        <div class="star star-14"></div>
        <div class="star star-15"></div>
        <div class="star star-16"></div>
        <div class="star star-17"></div>
        <div class="star star-18"></div>
        <div class="star star-19"></div>
        <div class="star star-20"></div>
        <div class="star star-21"></div>
        <div class="star star-22"></div>
        <div class="star star-23"></div>
        <div class="star star-24"></div>
        <div class="star star-25"></div>
        <div class="star star-26"></div>
        <div class="star star-27"></div>
        <div class="star star-28"></div>
        <div class="star star-29"></div>
        <div class="star star-30"></div>
        <div class="star star-31"></div>
        <div class="star star-32"></div>
        <div class="star star-33"></div>
        <div class="star star-34"></div>
        <div class="star star-35"></div>
        <div class="star star-36"></div>
        <div class="star star-37"></div>
        <div class="star star-38"></div>
        <div class="star star-39"></div>
        <div class="star star-40"></div>
      </div>
      <div data-depth="0.50" class="stars-cluster stars-cluster-2">
        <div class="star star-1"></div>
        <div class="star star-2"></div>
        <div class="star star-3"></div>
        <div class="star star-4"></div>
        <div class="star star-5"></div>
        <div class="star star-6"></div>
        <div class="star star-7"></div>
        <div class="star star-8"></div>
        <div class="star star-9"></div>
        <div class="star star-10"></div>
        <div class="star star-11"></div>
        <div class="star star-12"></div>
        <div class="star star-13"></div>
        <div class="star star-14"></div>
        <div class="star star-15"></div>
        <div class="star star-16"></div>
        <div class="star star-17"></div>
        <div class="star star-18"></div>
        <div class="star star-19"></div>
        <div class="star star-20"></div>
        <div class="star star-21"></div>
        <div class="star star-22"></div>
        <div class="star star-23"></div>
        <div class="star star-24"></div>
        <div class="star star-25"></div>
        <div class="star star-26"></div>
        <div class="star star-27"></div>
        <div class="star star-28"></div>
        <div class="star star-29"></div>
        <div class="star star-30"></div>
        <div class="star star-31"></div>
        <div class="star star-32"></div>
        <div class="star star-33"></div>
        <div class="star star-34"></div>
        <div class="star star-35"></div>
        <div class="star star-36"></div>
        <div class="star star-37"></div>
        <div class="star star-38"></div>
        <div class="star star-39"></div>
        <div class="star star-40"></div>
      </div>
      <div data-depth="0.90" class="stars-cluster stars-cluster-3">
        <div class="star star-1"></div>
        <div class="star star-2"></div>
        <div class="star star-3"></div>
        <div class="star star-4"></div>
        <div class="star star-5"></div>
        <div class="star star-6"></div>
        <div class="star star-7"></div>
        <div class="star star-8"></div>
        <div class="star star-9"></div>
        <div class="star star-10"></div>
        <div class="star star-11"></div>
        <div class="star star-12"></div>
        <div class="star star-13"></div>
        <div class="star star-14"></div>
        <div class="star star-15"></div>
      </div>
    </div>
	<!-- 背景结束了 -->
	
	<!-- 播放器部分 -->
	
    <div class="fcmusic">
      <div class="items-group">
        <div class="item active">
          <div class="block" id="fcmusic">
            <span class="circleLight"></span>
            <div class="text">
              <span class="icon">
                <img src="http://p2.music.126.net/WoR2LbM1IFauFpvhBWOjqA==/6642149743396577.jpg?param=300x300" id="round_icon" class="round_icon play-tx"></span>
              <span id="tools">
                <i class="fa fa-backward play-left"></i>
                <i class="fa fa fa-play-circle play"></i>
                <i class="fa fa-forward play-right"></i>
                <br /><br />
                <input type="range" name="PlayProgress" id="PlayProgress" value="0" onchange="PlayProgress(this.value)">
              </span>
              <p class="songtext">
			    <b class="songname" id="lyctext"></b>
              </p>			  
              <div class="scale_panel">
                <div class="scale" id="progressBar">
                  <div></div>
                  <span id="progressBtn"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
	<!-- 播放器部分 -->
	
	<!-- 离子背景加载js -->
    <script src="js/loader.js"></script>
    <script> var musicJson = <?php echo $musicLIST;?> </script>
    <script src="js/music.js?v=1.1" type="text/javascript"></script>
    <script src="js/play.js?v=1.1" type="text/javascript"></script>
	<script type="text/javascript" src="https://js.users.51.la/19692655.js"></script>
  </body>

</html>