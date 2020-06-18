/* 
 * fmusic音乐播放器1.3
 * author：lovefc
 * blog：http://lovefc.cn
 */
 
let musiclist = {}; 
// 获取歌单json
$.ajax({
	url: music_api,
	type: 'get',
	async: false,
	data: {},
	success: function(data) {
		musiclist = eval('('+data+')');
	},
	fail: function() {
		alert('歌单获取失败！');
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

function PlayProgress(val) {
	if (val) {
		// 这里进行一下数值处理
		music.playProgress(val);
		$('#PlayProgress').css("background-size", val + "% 100%");
	}
}

var playStatus = 0;

// 实例化mjs类库
let music = new mjs();

// 歌词显示的回调函数，写在init函数调用前面
music.lycCallback = (lycText) => {
	$('#lyctext').text(lycText);
};

// 切歌的回调，写在init函数调用前面
music.switchCallback = (attr) => {
	$('#lyctext').text(''); // 改变标题		
	$('#round_icon').attr("src", attr.pic); // 改变封面的图片
	$('#lyctext').text(attr.title); // 改变标题					
};

// 获取当前歌曲的播放时间和进度的回调
let playProgress = 0;
music.timeCallback = (music) => {
	playProgress = music.progress;
	$('.circleLight').css('background-color', 'hsla(' + Math.ceil(360 * Math.abs(playProgress / 100)) + ',80%,50%,0.5)');
	$('#PlayProgress').css("background-size", playProgress + "% 100%");
	$('#PlayProgress').val(playProgress);
};

// 传入歌曲json，初始化
// json为多维json
// [{'title':'歌曲名称','author':'作者','pic':'歌曲封面','url':'播放直链地址'}]
// music.init(歌曲json,循环方式[0,1,2],初始音量[0.1-1],跨域[true|false]);
music.init(musiclist);


function play() {
	if (playStatus == 1) {
		music.stopPlay(function() {
			$(".play").attr("class", 'fc-icon fc-icon-play play');
			$('#round_icon').removeClass('play-tx2');
			playStatus = 0;
		});
	} else {
		music.autoPlay(function() {
			$(".play").attr("class", 'fc-icon fc-icon-pause play');
			$('#round_icon').addClass('play-tx2');
			playStatus = 1;
		});
	}
}

// 播放
$(".play").click(function() {
	play();
});

// 播放
$("#round_icon").click(function() {
	play();
});

// 下一首
$(".play-right").click(function() {
	music.nextMusic(function(music) {});
});

// 上一首
$(".play-left").click(function() {
	music.prevMusic(function(music) {});
});

// 控制进度 
Sition('fcmusic', 'rightDownIng',
	function() {
		let progress = playProgress;
		progress += 3;
		music.playProgress(progress);
	});

Sition('fcmusic', 'leftDownIng',
	function() {
		let progress = playProgress;
		progress -= 3;
		music.playProgress(progress);
	});

// 切换上一首下一首
Sition('fcmusic', 'rightCenter',
	function() {
		music.nextMusic(function(music) {
			// 播放下一首的事件回调
		});
	});
Sition('fcmusic', 'leftCenter',
	function() {
		music.prevMusic(function(music) {
			// 播放上一首的事件回调
		});
	});

// 音量控制
var volume = 0;
Sition('fcmusic', 'upRightIng',
	function(ev) {
		volume += 0.02;
		if (volume > 1) {
			volume = 1;
		}
		music.playVolume(volume, function(num) {
			console.log('放大音量' + num);
		});
		$('#progressBar').show();
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
		music.playVolume(volume, function(num) {
			console.log('缩小音量' + num);
		});
		$('#progressBar').show();
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


// 单曲循环
Sition('fcmusic', 'leftUp',
function() {
    music.order = 2;
    $.alertView("已开启单曲循环");
});
Sition('fcmusic', 'rightUp',
function() {
    music.order = 1;
    $.alertView("已关闭单曲循环");
});

// 长按搜索
Sition('fcmusic', 'clicked',
	function() {
		var msgjson = {
			title: "",
			msg: '<input name="search-name" id="search_name" class="search" type="search" placeholder="请输入歌曲名称" />',
			buttons: [{
					title: "搜索",
					click: function() {
						var name = $('#search_name').val();
						$.ajax({
							url: music_search_api + name,
							async: false,
							success: function(result) {
								if (!result) {
									$.alertView('无搜索结果');
								} else {
									let json2 = eval('(' + result + ')');
									music.jsonToArray(json2);
									music.autoPlay();
								}
							}
						})
					}
				},
				{
					title: "取消",
					color: "red",
					click: function() {}
				}
			]
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

window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false);

/* 开局（一把刀）提示 */
var msgjson = {
	title: "",
	msg: "大爷,第一次玩？<br />让我来教您怎么<b style='color:green'>PY</b>吧！<span style='color:red'><br /><br /> 双击页面 -> 搜索歌曲</br />点击封面 -> 播放暂停</br />底部右滑 -> 快进音乐<br />底部左滑 -> 倒退音乐<br />音量 -> 右侧上下滑动<br />单曲 -> 顶部左右滑动<br />切换 -> 居中左右滑动<br />工具 -> 居中上下滑动</span><br /><b style='background: linear-gradient(to right, red, blue);-webkit-background-clip: text;color: transparent;'>o(*￣▽￣*)o</b>",
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
		}
	]
}
if (document.cookie.indexOf("a=hello") == -1) {
	$.alertView(msgjson);
}
