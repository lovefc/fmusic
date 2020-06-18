<?php
/**
 * 读取网易歌单数据
 * author:lovefc
 */
header("Content-type:text/html;Charset=utf8");
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:GET');
header('Access-Control-Allow-Headers:x-requested-with');

function netease_http($url, $data = false)
{
    $SSL      = substr($url, 0, 8) == "https://" ? true : false; //判断是不是https链接
    $refer    = "http://music.163.com/";
    $header[] = "Cookie: " . "appver=1.5.0.75771;";
    $ch       = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    if ($SSL === true) {
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // https请求 不验证证书和hosts
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    }
    if ($data) {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    }
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
    curl_setopt($ch, CURLOPT_REFERER, $refer);
    $cexecute = curl_exec($ch);
    curl_close($ch);

    if ($cexecute) {
        $result = $cexecute;
        return $result;
    } else {
        return false;
    }
}

function getlyc($id)
{
    $url     = 'http://music.163.com/api/song/lyric?id=' . $id . '&lv=-1&kv=-1';
    $json    = netease_http($url);
    $lyc     = empty($json) ? false : json_decode($json, true);
    $lyc_txt = isset($lyc['lrc']['lyric']) ? $lyc['lrc']['lyric'] : false;
    return $lyc_txt;
}


function search($str){
    if ($str) {
        $url      = 'http://music.163.com/api/search/pc';
        $response = netease_http($url, 's=' . urlencode($str) . '&offset=0&limit=10&type=1');
        $json     = json_decode($response, true);
		$list        = isset($json['result']['songs']) ? $json['result']['songs'] : null;
if (!$list) {
    return false;
}
$arr = array();
foreach ($list as $k => $v) {
    $arr[$k]['title']  = $v['name'];
    $arr[$k]['author'] = $v['artists'][0]['name'];
    $pic               = $v['album']['picUrl'] . '?param=200y200';
    $arr[$k]['pic']    = str_replace("http:", "https:", $pic);
    $url               = 'https://music.163.com/song/media/outer/url?id=' . $v['id'] . '.mp3';
    $arr[$k]['url']    = $url;
    $arr[$k]['lyc']    = getlyc($v['id']);
}
return json_encode($arr);
    }
}

function getJSON($playlist_id){
$url         = "http://music.163.com/api/playlist/detail?id=" . $playlist_id;
$response    = netease_http($url);
$json        = json_decode($response, true);
$list        = isset($json['result']['tracks']) ? $json['result']['tracks'] : null;
if (!$list) {
    return false;
}
$arr = array();
foreach ($list as $k => $v) {
    $arr[$k]['title']  = $v['name'];
    $arr[$k]['author'] = $v['artists'][0]['name'];
    $pic               = $v['album']['picUrl'] . '?param=200y200';
    $arr[$k]['pic']    = str_replace("http:", "https:", $pic);
    $url               = 'https://music.163.com/song/media/outer/url?id=' . $v['id'] . '.mp3';
    $arr[$k]['url']    = $url;
    $arr[$k]['lyc']    = getlyc($v['id']);
}
return $arr;
}

function save($playlist_id){
    $filename = PATH.'/data/'.$playlist_id.'.json';
    if(is_file($filename)){
       $musicLIST = file_get_contents($filename);	
    }else{
       $musicLIST=json_encode(getJSON($playlist_id));	
	    if(!empty($musicLIST)){
	        file_put_contents($filename,$musicLIST);
	    }
    }
    return $musicLIST;
}
