/* 
 * fmusic音乐播放器1.1 
 * author：lovefc
 * blog：http://lovefc.cn
*/

// 先来生成一个audio对象
var musicfc = document.createElement('audio');
    musicfc.controls = false;
    musicfc.src = '';
    document.body.appendChild(musicfc);
	
// 判断一下音乐播放状态
var playStatus = 0,
    
    //当前音乐播放总时长，记录一下总时长
    allTime = 0,
    
    // 当前音乐播放时长，记录一下当前进度的时长
    currentTime = 0,

    // 存储一下播放列表
    arrMusic = new Array(),

    // 当前播放计数, 默认从零开始
    nowPlayNum = 0,

    // 播放列表数量计数
    arrMusicNum = 0,
	
	// 歌词列表
	lycArray = new Array(),
    
	// 是否只播放一次
    onlyLoop = 0,
	
	// 初始音量
	volume = 1, 
	
	// 歌词行数
	currentnum = 0;

// 重新赋予音乐属性
function attrMusic(arr) {
	// 检测是不是有url这个值,没有就滚蛋
	if (arr && arr.hasOwnProperty('url')) {
		musicfc.src = arr['url']; // 改变当前的music的值
		$('#round_icon').attr("src", arr['pic']); // 改变封面的图片
		$('.songname').html(arr['title']); // 改变标题
		allTime = musicfc.duration; // 重新获取总时长
		currentTime = musicfc.currentTime; // 重新获取当前进度时长
		createLrc(arr['lyc']);// 解析歌词
        currentnum = 0;
	}
}

// JSON 转成数组
function jsonToArray(json) {
	// 重复调用该函数的时候，清空数组
	arrMusic = new Array(); 

	// 如果传入的json为空的话，直接返回false
	if (json == null && json.toString() == '') {
		console.log('json error');
		return false;
	}

	// 很好，现在来循环这个json，把它变成一个数组，这样比较好操作
	for (var item in json) {
		arrMusic[item] = json[item];
	}

	// 调用函数，重新开始赋值
	attrMusic(arrMusic[nowPlayNum]);

    // 记录一下一共有几首歌
	arrMusicNum = arrMusic.length; 
}


// 将json转换成数组并且将当前的元素值赋值到audio的元素中
jsonToArray(musicJson);


// 播放音乐
function autoPlay() {
	playStatus = 1; 

	musicfc.play(); // 播放音乐

	// 这里是改图标
    $(".play").attr("class", 'fa fa-stop-circle play');
    $('#round_icon').addClass('play-tx2');
}

// 暂停
function stopPlay() {
	playStatus = 0;

	musicfc.pause(); // 暂停音乐

	// 这里同样是改图标
    $(".play").attr("class", 'fa fa-play-circle play');
    $('#round_icon').removeClass('play-tx2');
}

// 进度判断
// ontimeupdate 在当前播放位置改变时执行函数
// 参考资料：http://www.runoob.com/jsref/event-ontimeupdate.html
musicfc.ontimeupdate = function() {
	// 判断有木有歌词
    if (lycArray.length > 0) {
		
		// 读取初始歌词
        if (currentnum == lycArray.length - 1 && musicfc.currentTime.toFixed(3) >= parseFloat(lycArray[currentnum].t)) {
            $('#lyctext').html(lycArray[currentnum].c);
        }
		
		// 这里是开始循环读取
        if (parseInt(lycArray[currentnum].t) <= parseInt(musicfc.currentTime + 0.1) && parseInt(musicfc.currentTime + 0.1) <= parseInt(lycArray[currentnum + 1].t)) {
            if (musicfc.currentTime > 0) {
                $('#lyctext').html(lycArray[currentnum].c);
            }
            currentnum++; // 这里是歌词的行数
        }
    }	
	allTime = musicfc.duration; // 总时长
	// 如果没有总时长，就说明这个音乐文件不存在，那么就不执行
	if(allTime){
		// 正在播放的时长,这里不能读取全局变量里面的，因为这个值总是在更新，所以要取最新的
		currentTime = musicfc.currentTime;
		// 计算一下当前的报进度，当前时长/总时长
		var PlayProgress = Math.round(currentTime / allTime * 100);
		// 改变当前进度条的值，用于实时监听当前的播放进度
		$('#PlayProgress').val(PlayProgress);
		$('.circleLight').css('background-color', 'hsla(' + Math.ceil(360 * Math.abs(currentTime / allTime)) + ',80%,50%,0.5)');
		$('#PlayProgress').css("background-size", PlayProgress + "% 100%");
	}
};

// 切换上一首音乐
function prevMusic() {
	// 先把值减去1
	nowPlayNum--;

	// 判断值是否小于0.如果小于0，就说明列表已全部循环完毕，那么重新开始吧
	// 如果小于0,就把当前的播放数组数量减去1，因为数组是从零开始的
	if (nowPlayNum < 0) {
		nowPlayNum = arrMusicNum - 1;
	}
	// 很好，那么开始赋值吧
	attrMusic(arrMusic[nowPlayNum]);
}

// 切换下一首音乐
function nextMusic() {
    // 加 加 加 
	nowPlayNum++;
	
	// 判断当前播放的列表数量是不是大于了总列表的数量，大于，就重零开始吧
	if (nowPlayNum > arrMusicNum) {
		nowPlayNum = 0;
	}

	// 赋值
	attrMusic(arrMusic[nowPlayNum]);
}

// 监听播放结束，然后来搞点事情
musicfc.addEventListener('ended',
function() {
    // 如果此时状态还是在播放，那么就切换到下一首
	if (playStatus == 1) {
	    nextMusic(); // 把数组移到下一个，赋值元素
	    autoPlay(); // 重新开始播放，初始化属性值
	} else {
		// 这里就是停止了
		playStatus = 0;
		musicfc.pause();
        $(".play").attr("class", 'fa fa-play-circle play');
        $('#round_icon').removeClass('play-tx2');
	}
},
false);

// 控制播放进度,val是选择的进度
function PlayProgress(val,callback) {
	if(allTime && val){
		// 这里进行一下数值处理
	    musicfc.currentTime = Math.round(allTime * val / 100); 
        $('#PlayProgress').css("background-size", val + "% 100%");
	}
}

// 控制播放速度
function PlayRate(val) {
	// 这里是加快，最大值为2
    val = val/100+1;
    musicfc.playbackRate = val;
}


// 解析歌词
function createLrc(lycText) {
    lycArray = new Array();
    var medis = lycText;
    if (!lycText) {
        return false;
    }
    var lycs = new Array();
    var medises = medis.split("\n");
	// 循环读取值
	for ( var i = 0; i <medises.length; i++){
        var item = medises[i];	
        var t = item.substring(item.indexOf("[") + 1, item.indexOf("]"));
        lycArray.push({
            t: (t.split(":")[0] * 60 + parseFloat(t.split(":")[1])).toFixed(3),
            c: item.substring(item.indexOf("]") + 1, item.length)
        })	
	}
}

//检测音乐
function checkMusic() {
	currentTime = musicfc.currentTime;
	if(!currentTime){
		if(playStatus == 1){
			nextMusic();
			autoPlay();
		}
	}
};

// 检测音乐是否可播放，3秒一次
window.setInterval("checkMusic()",3000);


// 这里来监听实时歌曲进度
setInterval(function() {
    for (i = 0; i < lycArray.length; i++) {
        if (parseInt(lycArray[i].t) <= parseInt(currentTime + 0.1) && parseInt(lycArray[i + 1].t) >= parseInt(currentTime + 0.1)) {
            currentnum = i;
        }
    }
},
1000);

// 单曲循环
function cycle(loop) {
    if (loop == true) {
        musicfc.addEventListener("ended", autoPlay, false);
    } else {
        musicfc.removeEventListener("ended", autoPlay, false);
    }
}







