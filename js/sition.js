/*
 * js原生触屏位置操作插件--Sition
 * author:lovefc
 * time:2018/10/04 14:07
 * 日志 *************************************
 * 修复了长按和滑动的冲突 -- 2018/10/14 15:02
 * 日志 *************************************
 */
var objsTime = 0; 
var objclicknum = 0;
function Sition(dom,nowAction,callBack,debug) {
    var obj = new Object();
    obj.startX = 0;
    obj.startY = 0;
    obj.sValue = 20;
    obj._sValue = obj.sValue*(-1);	
	obj.dom = dom;
	obj.domObjcet = '';
	obj.action = '';
	obj.nowAction = nowAction;
	obj.callBack  = callBack;
    obj.diffeValue = 0;	
	obj.dowHeight = 0;
	obj.domWidth =  0;
	obj.domTop   = 0;
	obj.dombottom  = 0;
	obj.domLeft  = 0;
	obj.domRight   = 0,
    obj.sTime = 0,
    obj.eTime = 0,
    obj.clicknum = 0,
    obj.clicked = 0,
	obj.debug = debug;
	
	obj.debugInfo = function(str){
		if(obj.debug == true)
	        console.log(str);	
	}
	obj.checkY = function(y){
	   y = Math.abs(y - obj.startY); 
	   var sValue = (obj.sValue >= 20)?20:obj.sValue; 	   
	   if(sValue >= y){
	      return true;
	   }
	   return false;
	}
	
	obj.checkX = function(x){
	   x = Math.abs(x - obj.startX);
	   var sValue = (obj.sValue >= 20)?20:obj.sValue;  
	   if(sValue >= x){
	      return true;
	   }
	   return false;
	}	
	// 开始监听
    obj.Start = function (evt){ 	
		obj.getWHLR();
        try{
            var touch = evt.touches[0],
                    x = Number(touch.pageX),
                    y = Number(touch.pageY);
            obj.startX = x;
            obj.startY = y;	
         }catch(e){
            console.log(e.message);
        }
        if(obj.nowAction != 'clicked'){
            obj.sTime = 0;
		    if(obj.nowAction == 'long'){
			   obj.sTime = new Date().getTime();
		    }							
        }else{		
            objsTime = objsTime==0?new Date().getTime():objsTime;
            objclicknum ++;
            if((new Date().getTime()-objsTime)>400){
                objsTime = new Date().getTime(); 
                objclicknum = 1;
            }
        }

    }
	// 触屏监听
    obj.Listener = function(evt){
	    evt.preventDefault();
        try{	
            var touch = evt.touches[0],
                x = Number(touch.pageX),
                y = Number(touch.pageY),
			    xValue = x - obj.startX,
			    yValue = y - obj.startY,
			    diffeValue = new Array(),
			    sValue2 = obj.sValue*2,
				action = '';
            if (xValue > obj.sValue && obj.checkY(y)) {
				action = 'right';
			}
            if (xValue < obj.sValue && obj.checkY(y)) {
                action = 'left';
            }			
			if(action === 'left' || action === 'right'){
				var a1 = obj.dowHeight/2+obj.domTop-sValue2;
				var a2 = obj.dowHeight/2+obj.domTop+sValue2;					
				var yHeight = document.documentElement.clientHeight - obj.domBottom;
				if(y <= obj.domTop+sValue2){
					obj.action = action+'Up';
				}else if(y >= yHeight-sValue2){
					obj.action = action+'Down';
				}else if(y < a2 && y > a1){
					obj.action = action+'Center';
				}else{
					obj.action = action;
				}
				obj.debugInfo(obj.action);
				diffeValue['start'] = obj.startX;	
				diffeValue['end'] = x;
				obj.diffeValue = diffeValue;
	            if(obj.action+'Ing' === obj.nowAction){
		            obj.runFun(obj.diffeValue);
					obj.debugInfo(obj.action+'Ing');
                }					
            }	
            if (yValue > obj.sValue && obj.checkX(x)) {		
			    action = 'down';
			}
            if (yValue < obj.sValue && obj.checkX(x)) {	
                action = 'up';
            }			
            if(action === 'down' || action === 'up'){
				var a1 = obj.domWidth/2+obj.domLeft-(obj.sValue*2);
                var a2 = obj.domWidth/2+obj.domLeft+(obj.sValue*2);	
				var xWidth = document.documentElement.clientWidth - obj.domRight;
				if(x <= obj.domLeft+obj.sValue){
					obj.action = action+'Left';
				}else if(x >= xWidth-obj.sValue){
					obj.action = action+'Right';
				}else if(x < a2 && x > a1){
					obj.action = action+'Center';
				}else{
					obj.action = action;
				}
				obj.debugInfo(obj.action);
				diffeValue['start'] = obj.startY;	
				diffeValue['end'] = y;
				obj.diffeValue = diffeValue;
	            if(obj.action+'Ing' === obj.nowAction){
		            obj.runFun(obj.diffeValue);
					obj.debugInfo(obj.action+'Ing');
                }			
            }
			obj.sTime = 0;
        }catch(e){
            console.log(e.message);
        }
    }
	// 函数执行
	obj.runFun = function(value){
        try {
            if(typeof obj.callBack === "function") {
                callBack(value);
            } else {
                console.log("not is function");
            }
        } catch(e){
			    console.log(e.message);
	    }	   
	}
	// 结束函数
    obj.End = function(evt){
	    if(obj.action === obj.nowAction){
		    obj.runFun(obj.diffeValue);
			obj.action = '';
			obj.sTime = 0;
			return false;
		}
        obj.eTime = new Date().getTime();
        if(obj.nowAction === 'long'){
            if(obj.sTime!=0 && (obj.eTime - obj.sTime) > 500) { 
                obj.runFun(obj.diffeValue);
                obj.action = '';
                objsTime = 0;
                objclicknum = 0;   
                obj.debugInfo('long');
            }    
        }
        if(obj.nowAction === 'clicked' && objclicknum == 2 && (new Date().getTime()-objsTime)<400){
            obj.runFun(obj.diffeValue);
            obj.action = '';         
            objclicknum = 0;
            objsTime = 0;
            obj.debugInfo('clicked');
        }
		if(obj.action+'Ing' != obj.nowAction+'Ing')
		    obj.diffeValue = 0;
        
    }
	// 获取位置
	obj.getWHLR = function(){
	    dom = document.getElementById(obj.dom);	
        if(!dom){
			dom = document;
            obj.dowHeight = document.documentElement.offsetHeight;
            obj.domWidth = document.documentElement.offsetWidth;			
        }else{
		    obj.dowHeight = dom.offsetHeight;
			obj.domWidth = dom.offsetWidth;
		}
		if(!obj.domWidth || !obj.dowHeight){
		    console.log("Can't get height and width");
			return false;
		}
        obj.domTop = dom.offsetTop;
		obj.domLeft =  dom.offsetLeft;
        obj.domRight = document.documentElement.clientWidth - dom.offsetWidth - obj.domLeft;
		obj.domBottom =  document.documentElement.clientHeight - dom.offsetHeight - obj.domTop;
	}
	
    // 初始化监听
    obj.Init = function(){
	    var dom = document.getElementById(obj.dom);	
        if(!dom){
			dom = document;
		} 	
        // {passive:false} 默认是true，此处设为true可关闭警告		
        dom.addEventListener('touchstart',obj.Start,{passive:false});
        dom.addEventListener('touchmove',obj.Listener,{passive:false});
        dom.addEventListener('touchend',obj.End,{passive:false});
	}
	obj.Init();
	return obj;
}