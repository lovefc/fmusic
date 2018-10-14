
            //判断是否支持canvaas
            function isSupportCanvas(canvas) {
                return !!(canvas.getContext && canvas.getContext("2d"));
            }

            //requestAnimationFrame会自动使用最优的帧率进行渲染
            function setupRAF() {
                window.lastTime = 0;

                //兼容各个浏览器，Internet Explorer11、Google Chrome(Microsoft Edge)、Mozilla Firefox、Opera
                var vendors = ["ms", "moz", "webkit", "o"];
                for(var i=0; i<vendors.length; i++) {
                    window.requestAnimationFrame = window[vendors[i] + "RequestAnimationFrame"];
                    window.cancelAnimationFrame = window[vendors[i] + "CancelAnimationFrame"] || window[vendors[i] + "CancelRequestAnimationFrame"];

                    //测试浏览器支持哪一张
                    if(window.requestAnimationFrame) {
                        console.log(vendors[i] + "requestAnimationFrame");
                    }
                    if(window[vendors[i] + "CancelAnimationFrame"]) {
                        console.log(vendors[i] + "CancelAnimationFrame");
                    }
                    if(window[vendors[i] + "CancelRequestAnimationFrame"]) {
                        console.log(vendors[i] + "CancelRequestAnimationFrame");
                    }
                }

                //回退机制
                if(!window.requestAnimationFrame) {
                    window.requestAnimationFrame = function(callback, element) {
                        var currentTime = new Date().getTime();
                        var timeToCall = Math.max(0, 16-(currentTime-window.lastTime));
                        var callTime = currentTime + timeToCall;
                        var id = window.setTimeout(function() {
                            callback(callTime);
                        }, timeToCall);
                        window.lastTime = callTime;
                        return id;
                    };
                }

                //回退机制
                if(!window.cancelAnimationFrame) {
                    window.cancelAnimationFrame = function(id) {
                        clearTimeout(id);
                    }
                }
            }

            //在[min, max]中随机取一个数
            function rand(min, max) {
                return Math.random() * (max - min + 1) + min;
            }
            var CanvasController = function(canvas) {
                var ctx = canvas.getContext("2d");

                //进度条对象
                var Loader = function() {
                    //进度条宽度
                    this.width = canvas.width;
                    //进度条高度
                    this.height = 0.1;
                    //进度条X坐标
                    this.x = (canvas.width - this.width) / 2;
                    //进度条Y坐标
                    this.y = (canvas.height - this.height) / 2;
                    //进度条当前值
                    this.value = 0;
                    //进度条最大值
                    this.maxValue = 100;
                    //进度条更新速度
                    this.speed = .5;
                    //加深的颜色
                    this.lighterColor = "#f1f1f1";

                    //HSL(Hue:色相，Saturation:饱和度，Lightness：饱和度)
                    this.hue = 0;
                    this.hueStart = 0;
                    this.hueEnd = 360;

                    //获取当前值对应的X坐标
                    this.currentPosX = function() {
                        return this.x + this.width * this.value / 100; 
                    }

                    //更新进度条
                    this.update = function() {
                        this.value += this.speed;
                        if(this.value > this.maxValue) {
                            this.value = 0;
                        }
                    }

                    //渲染进度条
                    this.render = function() {
                        ctx.globalCompositeOperation = "source-over";
                        var currentWidth = this.width * this.value / 100;
                        this.hue = this.hueStart + (this.hueEnd - this.hueStart) * this.value / 100;
                        //ctx.fillStyle = "hsl(" + this.hue + ", 100%, 40%)";
                        var linearGradient = ctx.createLinearGradient(this.x, this.y, this.x + currentWidth, this.y);
                        linearGradient.addColorStop(0, "hsl(" + this.hueStart + ", 100%, 40%)");
                        linearGradient.addColorStop(1, "hsl(" + this.hue + ", 100%, 40%)");
                        //ctx.fillStyle = linearGradient;
                        ctx.fillRect(this.x, this.y, currentWidth, this.height);
                        ctx.fillStyle = this.lighterColor;
                        ctx.globalCompositeOperation = "lighter";                   
                        ctx.fillRect(this.x, this.y, currentWidth, this.height/2);
                    }
                }

                //单个粒子对象
                var Particle = function(x, y, hue, minX, maxX) {
                    //渲染粒子
                    this.render = function() {
                        ctx.fillStyle = "hsl(" + this.hue + ", 100%, 40%)"
                        ctx.globalCompositeOperation = "source-over";
                        ctx.fillRect(this.x, this.y, this.width, this.height);
                    }
                }

                //所有粒子效果的对象
                var Particles = function(minX, maxX) {
                    //存放生成的所有粒子对象
                    this.values = [];
                    //粒子生成速率
                    this.rate = 3;

                    //生成粒子
                    this.generate = function(x, y, hue) {
                        for(var i=0; i<this.rate; i++) {
                            this.values.push(new Particle(x, y, hue, minX, maxX));
                        }
                    }

                    //更新进度值
                    this.update = function() {
                        for(var i = this.values.length-1; i >= 0; i--) {
                            this.values[i].update();
                            if(!isInRect(this.values[i].x, this.values[i].y, 0, 0, canvas.width, canvas.height)) {
                                this.values.splice(i, 1);
                            }
                        }
                    }

                    //渲染进度条
                    this.render = function() {
                        for(var i =0; i<this.values.length; i++) {
                            this.values[i].render();
                        }
                    }
                }

                //清空画布
                function clearCanvas() {
                    //默认值，表示图形将绘制在现有画布之上
                    ctx.globalCompositeOperation = "source-over";
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }

                //初始化函数
                this.init = function() {
                    var loader = new Loader();
                    var particles = new Particles(loader.x, loader.x + loader.width);
                    var loop = function() {
                        requestAnimationFrame(loop, canvas);
                        clearCanvas();
                        loader.update();
                        loader.render();
                    }
                    loop();
                }
            }

            function init() {
                var canvas = document.getElementById("canvas");
                if(!isSupportCanvas(canvas)) {
                    return;
                }
                setupRAF();
                var canvasController = new CanvasController(canvas);
                canvasController.init();
            }