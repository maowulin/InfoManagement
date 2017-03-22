$(function(){
	//手风琴效果
	$("#nav dt").click(function(){
		$(this).next().toggleClass("curr").siblings("dd").removeClass("curr");
		$(this).toggleClass("click_now").siblings().removeClass("click_now");
		//$(this).next().children("p").eq(0).css("color","#5bb2ea");
		// $(":after").css({
		// 	"background-color":"red"
		// })
	});
	//当天日期的获取
	function showTime(){
		var days=["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
		var timer=setInterval(function(){
			var time=new Date();
			var year=time.getFullYear();
			var month=time.getMonth()+1;
			var date=time.getDate();
			var day=time.getDay();
			var hour=time.getHours();
			var minutes=time.getMinutes();
			var seconds=time.getSeconds();
//			hour<10?"0"+hour*1:hour;
//			minutes<10?"0"+minutes*1:minutes;
//			seconds<10?"0"+seconds:seconds;
			if(hour<10){
				hour="0"+hour;
			}
			if(minutes<10){
				minutes="0"+minutes;
			}
			if(seconds<10){
				seconds="0"+seconds;
			}
			var str=year+"-"+month+"-"+date+" "+days[day]+" "+hour+":"+minutes+":"+seconds;
		$("#time").html(str)
		},1000);
	}
	showTime();
	//数据
	//全屏按钮的操作
	$("#all_screen").on({
		click:function(){
			$(this).css("display","none");
			$("#out_all_screen").css("display","block");
			$(".iframe").addClass("all1");
			$(".wrap").addClass("all2");
			$(".table_footer").addClass("all3");
			$(".footer").addClass("all_screen");
		}
	})
	//退出全屏的操作
	$("#out_all_screen").on({
		click:function(){
			$(this).css("display","none");
			$("#all_screen").css("display","block");
			$(".iframe").removeClass("all1");
			$(".wrap").removeClass("all2");
			$(".table_footer").removeClass("all3");
			$(".footer").removeClass("all_screen");
		}
	})
		
})
	//监听事件跨浏览器处理
	function  addHandler(element,type,handler){
	
	      if(element.addEventListener){                              //DOM2级事件监听
	
	         element.addEventListener(type,handler,false);
	
	     }else if(element.attachEvent){                              //IE浏览器事件监听
	
	         element.attachEvent('on'+type,handler);
	
	     }else{                                                                //旧版浏览器事件监听
	
	         element['on'+type]=handler;
	
	     }
	
	 }
	//删除监听事件的函数
	 function removeHandler(element,type,handler){
	      if(element.removeEventListener){                              //DOM2级事件监听
	
	         element.removeEventListener(type,handler,false);
	
	     }else if(element.detachEvent){                              //IE浏览器事件监听
	
	         element.detachEvent('on'+type,handler);
	
	     }else{                                                                //旧版浏览器事件监听
	         element['on'+type]=null;
	     }
	
	}
	 