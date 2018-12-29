/* 
 * fmusic音乐播放器1.1 
 * author：lovefc
 * blog：http://lovefc.cn
*/

// 播放与暂停--事件监听
$('.play').click(function() {
	if (playStatus == 0) {
		autoPlay();
	} else {
		stopPlay();
	}
});

// 切换上一首--事件监听
$('.play-left').click(function() {
	prevMusic();
	// 如果此时状态还是播放，那么就调用播放
	if (playStatus == 1) {
		autoPlay();
	}
});

// 切换下一首--事件监听
$('.play-right').click(function() {
	nextMusic();
	if (playStatus == 1) {
		autoPlay();
	}
});

/* 进度条 */
var dsq;
var scale = function(btn, bar) {
    this.btn = document.getElementById(btn);
    this.bar = document.getElementById(bar);
    this.step = this.bar.getElementsByTagName("div")[0];
};
scale.prototype = {
    start: function(x) {
        var f = this,
        g = document,
        b = window,
        m = Math;
        f.btn.style.left = x + 'px';
        this.step.style.width = Math.max(0, x) + 'px';
    }
}

var scale2 = new scale('progressBtn', 'progressBar');
var colseBar = function() {
    clearInterval(dsq);
    dsq = setTimeout(function() {
        $('#progressBar').hide(1000);
    },
    3000);
}
/* 进度条 */


/* 手势控制 */

// 双击封面，播放暂停 
Sition('round_icon', 'clicked',
function() {
    if (playStatus == 0) {
        autoPlay();
    } else {
        stopPlay();
    }
});

// 控制进度 
Sition('fcmusic', 'rightDownIng',
function() {
    musicfc.currentTime = currentTime + 5;
    if (musicfc.currentTime > allTime) {
        musicfc.currentTime = allTime;
    }
    currentTime = musicfc.currentTime;
});

Sition('fcmusic', 'leftDownIng',
function() {
    musicfc.currentTime = currentTime - 5;
    console.log(musicfc.currentTime);
    if (musicfc.currentTime < 0) {
        musicfc.currentTime = 0;
    }
    currentTime = musicfc.currentTime;
});

// 切换上一首下一首
Sition('fcmusic', 'rightCenter',
function() {
    nextMusic();
    if (playStatus == 1) {
        autoPlay();
    }
});
Sition('fcmusic', 'leftCenter',
function() {
    prevMusic();
    if (playStatus == 1) {
        autoPlay();
    }
});

// 单曲循环
Sition('fcmusic', 'leftUp',
function() {
    cycle(true);
    $.alertView("已开启单曲循环");
    onlyLoop = 1;
});
Sition('fcmusic', 'rightUp',
function() {
    cycle(false);
    $.alertView("已关闭单曲循环");
    onlyLoop = 0;
});


// 音量控制
Sition('fcmusic', 'upRightIng',
function(ev) {
    volume += 0.02;
    if (volume > 1) {
        volume = 1;
    }
    $('#progressBar').show();
    musicfc.volume = volume;
    var progressWidth = $('.scale_panel').width();
    if (progressWidth >= progressWidth * volume) {
        scale2.start(progressWidth * volume - 8);
    } else {
        scale2.start(progressWidth * volume);
    }
    colseBar();
});

Sition('fcmusic', 'downRightIng',
function(ev) {
    volume -= 0.02;
    if (volume <= 0) {
        volume = 0;
    }
    $('#progressBar').show();
    musicfc.volume = volume;
    var progressWidth = $('.scale_panel').width();
    scale2.start(progressWidth * volume);
    colseBar();
});

// 工具栏隐藏或显示
Sition('fcmusic', 'downCenter',
function(ev) {
    $('#tools').hide();
});
Sition('fcmusic', 'upCenter',
function(ev) {
    $('#tools').show();
});

// 长按搜索
Sition('fcmusic', 'long',
function() {
    var msgjson = {
        title: "",
        msg: '<input name="search-name" id="search_name" class="search" type="search" placeholder="请输入歌曲名称" />',
        buttons: [{
            title: "搜索",
            click: function() {
                var name = $('#search_name').val();
                $.ajax({
                    url: "search.php?str=" + name,
                    async: false,
                    success: function(result) {
                        if (!result) {
                            $.alertView('无搜索结果');
                        } else {
                            var json2 = eval('(' + result + ')');
                            jsonToArray(json2);
                            autoPlay();

                        }
                    }
                })
            }
        },
        {
            title: "取消",
            color: "red",
            click: function() {}
        }]
    }
    $.alertView(msgjson);
});

/* 手势控制 */


/* 横屏兼容 */
function hengshuping() {
    if (window.orientation == 90 || window.orientation == -90) {
        $('#tools').hide();
        $('.block').css('max-width', '1300px');
        $('.block').css('height', '500px');
        $('#fcmusic').css('padding', '0,0');
    }
}

window.addEventListener("onorientationchange" in window ? "orientationchange": "resize", hengshuping, false);

/* 开局（一把刀）提示 */
var msgjson = {
    title: "",
    msg: "大爷,第一次玩？<br />让我来教您怎么<b style='color:green'>PY</b>吧！<span style='color:red'><br /><br /> 长按页面 -> 搜索歌曲</br />双击封面 -> 播放暂停</br />底部右滑 -> 快进音乐<br />底部左滑 -> 倒退音乐<br />音量 -> 右侧上下滑动<br />单曲 -> 顶部左右滑动<br />切换 -> 居中左右滑动<br />工具 -> 居中上下滑动</span><br /><b style='background: linear-gradient(to right, red, blue);-webkit-background-clip: text;color: transparent;'>o(*￣▽￣*)o</b>",
    buttons: [{
        title: "下次提示",
        color: "red",
        click: function() {}
    },
    {
        title: "朕已知晓",
        click: function() {
            var t = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30);
            document.cookie = "a=hello; expires=" + t.toGMTString();
        }
    }]
}
if (document.cookie.indexOf("a=hello") == -1) {
    $.alertView(msgjson);
}