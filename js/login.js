$(function(){
	//用户名
	var mydef_userName=document.getElementById("username").defaultValue;
	$("#username").on({
		focus:function(){
			//console.log(document.getElementById("username").defaultValue);
			//console.log($("#username").defaultValue);
			$(this).css("color","black");
			if($(this).val()==mydef_userName){
				$(this).val("");
			}
			if($("#password2").val()==""){
				$("#password").parent().css("visibility","visible");
				$("#password2").css("visibility","hidden");
			}
		},
		blur:function(){
			if($(this).val()==mydef_userName||$(this).val()==""){
				$(this).val(mydef_userName);
				$(this).css("color","#666");
			}else{
				$(this).css("color","black");
			}
			if($("#password2").val()==""){
				$("#password").parent().css("visibility","visible");
				$("#password2").css("visibility","hidden");
			}
		}
	})
	//密码
		console.log($("#password2:input").val());
	
	var mydef_password=document.getElementById("password").defaultValue;
	$("#password").on({
		focus:function(){
			if($(this).val()==mydef_password){
//				debugger;
//				$(this).val("");
				$(this).parent().css("visibility","hidden");
				$("#password2").css("visibility","visible");
			}
		},
//		blur:function(){
//			if($(this).val()==""){
//				alert("kong");
//				$(this).attr("type","text");
//			}else{
////              $(this).val(mydef_password);
//				$(this).css("color","#666");
//				$(this).attr("type","password");
//				$(this).css("color","black");
//			}
//		}
	})
	$("#password2").on({
		blur:function(){
			alert(1111);
			if($(this).val()==""){
				$("#password").parent().css("visibility","hidden");
				$(this).css("visibility","hiddens");
			}
		}
	})
	//登录按钮的点击
	var reguserName1=/^\d{11}$/;//手机号的验证
	var reguserName2=/^\w{1,}@[a-zA-Z]{1,}\.[a-zA-Z]{1,}$/;//邮箱的验证
	var reguserName3=/^[\u4e00-\u9fa5]{1,10}$/;//验证汉字
	var regPassword=/^\w{6,20}$/;
	$("#login").click(function(){
		if($("#username").val()==""||$("#username").val()==mydef_userName){
			$("#tip").fadeIn(1000).fadeOut(3000);
			$("#tip").html("请先输入用户名");
			return;
		}
		if($("#password2:input").val()==""){
			$("#tip").fadeIn(1000).fadeOut(3000);
			$("#password").parent().css("visibility","visible");
			
			$("#password2").css("display","none");
			$("#password").val("密码");
			$("#tip").html("请先输入密码");
			return;
		}
		if((!reguserName1.test($("#username").val()))&&(!reguserName2.test($("#username").val()))&&(!reguserName3.test($("#username").val()))){
			$("#tip").fadeIn(1000).fadeOut(3000);
			$("#tip").html("请输入正确的用户名，邮箱或者手机号");
			return;
		}
		if(!regPassword.test($("#password2:input").val())){
			$("#tip").fadeIn(1000).fadeOut(3000);
			$("#tip").html("请确保输入的密码是6-20位的数字,字母或者下划线组成的字符串");
			return;
		}else{
			alert("ok");
			window.open(url,"_new");
		}
		console.log($("#password2:input").val());
		
	})
})