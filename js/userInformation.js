$(function(){
	$("#userInformation").click(function(){
		$("#nav dd p").removeClass("now");
		$(this).addClass("now");
		$.ajax({
			type:"get",
			url:"sampleCenter/userInformation.html",//加载用户中心界面
			success:function(data){
//				console.log(data);
				$("#iframe").html(data);
				$.ajax({//请求数据库关于用户中心的数据
					type:"get",
					url:"../data/data.json",
					//url:"http://192.168.1.17:82/data.json?callback=jsonpCallback",//向服务器端请求数据，必须添加dataType，jsonpCallback，data.son的数据也需要加上回调函数名
					//dataType:"jsonp",
					//jsonpCallback:"callbackOne",//这三句为跨域访问的方式
					success:function(data){
						var userData=data.userData;
						//表格底部的页数，每一页多少数据的设置
						var ln=userData.length;
						var page_every=$("#page_every").val();
						var num=Math.ceil(ln/page_every);
						var page_now=$("#page_now").val();//当前第几页
						var endpage= page_now*page_every;//当前页的最后一个数据
						var startpage=0;//当前页的第一个数据
						$("#pages").html(num+" ");
						var change=function(){
							 ln=userData.length;
							 page_every=$("#page_every").val();
							 num=Math.ceil(ln/page_every);
							$("#pages").html(num+" ");
							$("#page_now").val(page_now);
							endpage=page_now*page_every;
							startpage=endpage-page_every;
							$(".wrap table tbody").html("");
							getAllData(userData,startpage,endpage);
						};
						//上一页的点击
             			$('#before').click(function(){
							page_now=$("#page_now").val();
							page_every=$("#page_every").val();
							if(page_now<=1){
								alert("当前已经是第一页！");
							}
							else{
								--page_now;
								$("#page_now").val(page_now);
								endpage=page_now*page_every;
								startpage=endpage-page_every;
								$(".wrap table tbody").html("");
								getAllData(userData,startpage,endpage);
								
							}
						})
             			//下一页的点击
             			$('#after').click(function(){
             				num=Math.ceil(ln/page_every);
							page_now=$("#page_now").val();
							page_every=$("#page_every").val();
							if(page_now>=num){
								alert("当前已经是最后一页！");
							}
							else{
								++page_now;
								$("#page_now").val(page_now);
								endpage=page_now*page_every;
								startpage=endpage-page_every;
								$(".wrap table tbody").html("");
								getAllData(userData,startpage,endpage);
								
							}
						})
             			//首页的点击
             			$("#first").click(function(){
             				page_every=$("#page_every").val();
             				$("#page_now").val("1");
             				$(".wrap table tbody").html("");
             				getAllData(userData,0,page_every);
             				
             			})
             			//尾页的点击
             			$("#last").click(function(){
             				page_every=$("#page_every").val();
             				endpage=userData.length;
             				startpage=(num-1)*page_every;
             				$("#page_now").val(num);
             				$(".wrap table tbody").html("");
             				getAllData(userData,startpage,endpage);
             				
             			})
             		//定义一个获取数据库内全部数据的方法 start
						function getAllData(userData,startpage,endpage){
							for(var i=0;i<userData.length;i++){
								if(i>=startpage&&i<endpage){
									var information='<tr id="'+userData[i].id+'"><td><input type="checkbox" name="sample_info"></td><td>'+
									userData[i].username+'</td><td>'+
									userData[i].doctor+'</td><td>'+
									userData[i].hospital+'</td><td>'+
									userData[i].telephone+'</td><td>'+
									userData[i].sampleData+'</td><td><i></i><ul><li id="text"><a href="javascript:void(0)">编辑</a></li><li id="cut"><a href="javascript:void(0)">删除</a></li></ul></td></tr>';
									$(".wrap table tbody").append(information);
								}
							}
							//隔行变色
							$(".wrap table tbody tr:odd").addClass("line_color");
						}
						//定义一个获取数据库内全部数据的方法 end
						
						getAllData(userData,startpage,endpage);//请求成功后，加载数据库的数据
						//分页功能的实现
						if($("#page_every").val()>0){
							 addHandler(document.getElementById("page_every"),"change",change);
						//document.getElementById("page_every").addEventListener("change",change,false);
						}else{
							removeHandler(document.getElementById("page_every"),"change",change);
						}
						/***
						 * 全选按钮的实现
						 * */
						$("#all_select").on({
							click:function(){
								if($(this).prop("checked")==false){
									$.each($(".wrap tbody input[name='sample_info']"),function(){
										$(this).prop("checked",false);
									})
								}else{
									$.each($(".wrap tbody input[name='sample_info']"),function(){
										$(this).prop("checked",true);
									})
								}							
							}
						})
						//若有一项没有选中，则取消全选
						$(".wrap tbody").on("click","input[name='sample_info']",function(){
							if($(this).prop("checked")==false){
								$("#all_select").prop("checked",false);
							}
						})			
						/*****   
						 * 搜索功能的实现 start  
						 * */
						//点击页面上的搜索按钮
						$("#search_user").on({
							click:function(){
								var username=$("#username").val();
								var doctor=$("#doctor").val();
								var sampleDate_user=$("#sampleDate_user").val();
								var userInfo={
										"username":username,
										"doctor":doctor,
										"sampleDate_user":sampleDate_user
							 	 };
								//判断你的输入是否为空，不符合则不再需要检索数据库
								if(username==""&&doctor==""&&sampleDate_user==""){
									if(userData.length==0){
										var empty_tip='<tr><td colspan="7">数据库为空!</td></tr>';//当信息检索不到时输出
										$(".wrap table tbody").html(empty_tip);
									}else{
										$(".wrap table tbody").html("");
										alert("请先输入数据");
										getAllData(userData,startpage,endpage);
									}
									return;
								}
								//判断你的输入是否符合数据库的数据规则，不符合则不再需要检索数据库		
								var flag=false;//用来判断数据库中是否有这项数据，通过ID判断
								var flag=false;//用来判断数据库中是否有这项数据，通过name判断			
								var tip='<tr><td colspan="7">你输入的信息不存在!</td></tr>';//当信息检索不到时输出
								//若通过了以上两个验证，则检索数据库，看是否有与数据库匹配的项
								/* 姓名的搜索*/
								if(username!=""){//若姓名不为空
									var info_searchget="";
									$.each(userData,function(i){						
									if(username==userData[i].username){
										$(".wrap table tbody").html("");
										info_searchget +='<tr id="'+userData[i].id+'"><td><input type="checkbox" name="sample_info"></td><td>'+
											userData[i].username+'</td><td>'+
											userData[i].doctor+'</td><td>'+
											userData[i].hospital+'</td><td>'+
											userData[i].telephone+'</td><td>'+
											userData[i].sampleData+'</td><td><i></i><ul><li id="text"><a href="javascript:void(0)">编辑</a></li><li id="cut"><a href="javascript:void(0)">删除</a></li></ul></td></tr>';
											flag=true;//如果数据库中有这个数据，则返回true，不再输入错误提示信息
										}
									$(".wrap table tbody").html(info_searchget);
									})
									if(flag==false){
										$(".wrap table tbody").html("");
										$(".wrap table tbody").html(tip);
										return false;
									}
								}
								/* 医生姓名的的搜索*/
								if(doctor!=""){//若姓名不为空
									var info_searchget="";
									$.each(userData,function(i){						
									if(doctor==userData[i].doctor){
										$(".wrap table tbody").html("");
										info_searchget +='<tr id="'+userData[i].id+'"><td><input type="checkbox" name="sample_info"></td><td>'+
											userData[i].username+'</td><td>'+
											userData[i].doctor+'</td><td>'+
											userData[i].hospital+'</td><td>'+
											userData[i].telephone+'</td><td>'+
											userData[i].sampleData+'</td><td><i></i><ul><li id="text"><a href="javascript:void(0)">编辑</a></li><li id="cut"><a href="javascript:void(0)">删除</a></li></ul></td></tr>';
											flag=true;//如果数据库中有这个数据，则返回true，不再输入错误提示信息
										}
									$(".wrap table tbody").html(info_searchget);
									})
									if(flag==false){
										$(".wrap table tbody").html("");
										$(".wrap table tbody").html(tip);
										return false;
									}
								}
								/*收样日期的搜索*/
								if(sampleDate_user!=""){//若姓名不为空
									var info_searchget="";
									$.each(userData,function(i){						
										if(sampleDate_user==userData[i].sampleData){
											$(".wrap table tbody").html("");
											info_searchget +='<tr id="'+userData[i].id+'"><td><input type="checkbox" name="sample_info"></td><td>'+
												userData[i].username+'</td><td>'+
												userData[i].doctor+'</td><td>'+
												userData[i].hospital+'</td><td>'+
												userData[i].telephone+'</td><td>'+
												userData[i].sampleData+'</td><td><i></i><ul><li id="text"><a href="javascript:void(0)">编辑</a></li><li id="cut"><a href="javascript:void(0)">删除</a></li></ul></td></tr>';
												flag=true;//如果数据库中有这个数据，则返回true，不再输入错误提示信息
										}
										$(".wrap table tbody").html(info_searchget);
									})
									if(flag==false){
										$(".wrap table tbody").html("");
										$(".wrap table tbody").html(tip);
										return false;
									}
								}
								
							}
						})
						/*****   搜索功能的实现 end  */
						//点击回车键，给前两个文本框绑定搜索功能，即回车即可搜索
						$("#username").keydown(function(event){
							var event=event||window.event;
							if(event.keyCode==13){
								$("#search_user").trigger("click");
							}
						})
						$("#doctor").keydown(function(event){
							var event=event||window.event;
							if(event.keyCode==13){
								$("#search_user").trigger("click");
							}
						})
						
						/**
						 * 重置按钮功能的实现
						 * **/		
						 $("#reset_search_user").on("click",function(){
						 	if(userData.length==0){
								var empty_tip='<tr><td colspan="7">数据库为空!</td></tr>';//当信息检索不到时输出
								$(".wrap table tbody").html(empty_tip);
							}else{
								$(".wrap table tbody").html("");
								getAllData(userData,startpage,endpage);
							}
						 })
						  //取消添加样品的按钮：回到样品中心，并清除“添加样品信息”页面的信息
						$("#reset_userInfo").on({
							click:function(){
								$(".addUserInformation").css("display","none");
							}
						})
						 /**
						  * 添加用户信息按钮后的操作
						  * */
						 var ln_last,newId;
						 $("#adduser").click(function(){
						 	$(".addUserInformation").css("display","block");
						 	$(".web_information_left span").html("当前位置:样品中心>用户信息>添加用户信息");
						 	$("#add_userInfo").css("display","block");
						 	$("#edit_userInfo").css("display","none");
//						 	$("#adduser").trigger($("#reset_userInfo").click());
							//$("#reset_userInfo").trigger("click");
					 		ln_last=userData.length;
					 		if(ln_last>0){
					 			 //寻找数据库的最后一项的id，并+1给新页面的ID text加上
					 			newId=Number(userData[ln_last-1].id)+1;
					 		}else{
					 			newId=1001;
					 		}
					 		$("#userIDT").val(newId);
						 })
						 /*
						  * 点击确认添加样品的按钮
						  * */
						var Medical_history=[];//用于存放被检者病况与病史
						var Medical_historyAll=$(".Medical_history textarea");//存放被检者病况与病史的textarea
						 $("#add_userInfo").click(function(){
						 	
							//先获取页面信息
							var userID=$("#userIDT").val(),
								username=$("#usernameT").val(),
								userage=$("#userageT").val(),
								userDate=$("#userDateT").val(),
								userheight=$("#userheightT").val(),
								userweight=$('#userweightT').val(),
								userphone=$("#userphoneT").val(),
								adress=$("#adressT").val(),
								hospital=$("#hospitalT").val(),
								userdoctor=$("#userdoctorT").val(),
								userGestational_age=$("#userGestational_ageT").val(),
								fetal_type=$("#fetal_typeT").val(),
								Chorionic=$("#ChorionicT").val(),
								userPre_production_period=$("#userPre_production_periodT").val(),
								userMenstruation=$("#userMenstruationT").val(),
								Down_syndrome=$("#Down_syndromeT").val(),
								ultrasonic=$("#ultrasonicT").val();	
								
							for(var i=0;i<Medical_historyAll.length;i++){
								Medical_history.push($(Medical_historyAll[i]).val());	
							}
							$(".content2 input").on({
				 				blur:function(){
				 					$(this).css("border-color","#ccc");
				 					}
			 				})
							//表单信息的验证					
							var regName=/^[\u4e00-\u9fa5]{2,10}$/;//判断输入的姓名是否是汉字
							//var regage=/^16\d{7}$/;//判断编号是否是以16开头的9位数字
							var regPhone=/^\d{11}$/;//电话号码的验证
							var regLChinese=/^[\u4e00-\u9fa5]{4,50}$/;
							if(userID==""||username==""||userage==""||userDate==""||userheight==""||userweight==""||
							userphone==""||adress==""||hospital==""||hospital==""||userdoctor==""||userGestational_age==""||
							fetal_type==""||Chorionic==""||userPre_production_period==""||userMenstruation==""||Down_syndrome==""||ultrasonic==""){
								$(".tell_tip2 span").fadeIn(1000).fadeOut(2000).html("请确保已将表格填充完成！");
					 				return;
							}
							for(var i=0;i<Medical_historyAll.length;i++){
								if($(Medical_historyAll[i]).val()==""){
									$(".tell_tip2 span").fadeIn(1000).fadeOut(2000).html("请确保已将表格填充完成！");
									return;
								}
							}
							if(!regName.test(username)){
								$(".tell_tip2 span").fadeIn(1000).html("请在姓名文本框内输入两个数字及以上的中文名字！");
								$("#usernameT").trigger("focus").css("border-color","red");
								return;
							}
							if(isNaN(userage)){
								$(".tell_tip2 span").fadeIn(1000).html("请输入的年龄请确保是个数字");
								$("#userageT").trigger("focus").css("border-color","red");
								return;
							}
							if(userage<=10||userage>80){
								$(".tell_tip2 span").fadeIn(1000).html("请输入的年龄不符合范围要求！");
								$("#userageT").trigger("focus").css("border-color","red");
								return;
							}
							if(isNaN(userheight)||userheight<100||userheight>250){
								$(".tell_tip2 span").fadeIn(1000).fadeOut(2000).html("请输入的身高请确保是个100-250的数字");
								$("#userheightT").trigger("focus").css("border-color","red");
								return;
							}
							if(isNaN(userweight)||userweight<30||userweight>400){
								$(".tell_tip2 span").fadeIn(1000).html("请输入的体重请确保是个30-400的数字");
								$("#userweightT").trigger("focus").css("border-color","red");
								return;
							}
							if(!regPhone.test(userphone)){
								$(".tell_tip2 span").fadeIn(1000).html("请输入11位的电话号码");
								$("#userphoneT").trigger("focus").css("border-color","red");
								return;
							}
							if(!regName.test(userdoctor)){
								$(".tell_tip2 span").fadeIn(1000).html("请在姓名文本框内输入两个数字及以上的中文名字！");
								$("#userdoctorT").trigger("focus").css("border-color","red");
								return;
							}
							if(!regLChinese.test(hospital)){
								$(".tell_tip2 span").fadeIn(1000).html("请输入医院正确的中文名字！");
								$("#hospitalT").trigger("focus").css("border-color","red");
								return;
							}
							
							
							
							
							
							
							
							var newuserInfo={
								"id":newId,
								"username":username,
								"doctor":userdoctor,
								"hospital":hospital,
								"telephone":userphone,
								"sampleData":userDate,
								"userage":userage,
								"userDate":userDate,
								"userheight":userheight,
								"userweight":userweight,
								"userphone":userphone,
								"adress":adress,
								"userGestational_age":userGestational_age,
								"fetal_type":fetal_type,
								"Chorionic":Chorionic,
								"userPre_production_period":userPre_production_period,
								"userMenstruationT":userMenstruation,
								"Down_syndrome":Down_syndrome,
								"ultrasonic":ultrasonic,
								"Medical_history":[
									{
										"present":Medical_history[0],
										"Past_medical_history":Medical_history[1],
										"family_history":Medical_history[2],
										"allergic_history":Medical_history[3],
										"pregnancy_reproductive_history":Medical_history[4],
										"remark":Medical_history[5]
									}
								]
							};
							userData.push(newuserInfo);
							$(".wrap table tbody").html("");
						 	getAllData(userData,startpage,endpage);
						 	$(".addUserInformation").css("display","none");
							$(".web_information_left span").html("当前位置:样品中心>用户信息");
						 })

						 
						/****
						 * 
						 * 表格最后一列操作功能的实现
						 * */
						$(".wrap table tbody").on("mouseover","td i",function(){
							$(".wrap table tbody td ul").css("display","none");
							$(this).next("ul").css("display","block");
							
							//编辑操作的点击
							$(this).next().children("#text").click(function(){
								$(".addUserInformation").css("display","block");
								$("#add_userInfo").css("display","none");
								$("#edit_userInfo").css("display","block");
								var id_now=$(this).parent().parent().parent().attr("id");
								for(var i in userData){
									if(userData[i].id==id_now){
										$("#userIDT").val(userData[i].id);
										$("#usernameT").val(userData[i].username);
										$("#userageT").val(userData[i].userage);
										$("#userDateT").val(userData[i].userDate);
										$("#userheightT").val(userData[i].userheight);
										$('#userweightT').val(userData[i].userweight);
										$("#userphoneT").val(userData[i].userphone);
										$("#adressT").val(userData[i].adress);
										$("#hospitalT").val(userData[i].hospital);
										$("#userdoctorT").val(userData[i].doctor);
										$("#userGestational_ageT").val(userData[i].userGestational_age);
										$("#fetal_typeT").val(userData[i].fetal_type);
										$("#ChorionicT").val(userData[i].Chorionic);
										$("#userPre_production_periodT").val(userData[i].userPre_production_period);
										$("#userMenstruationT").val(userData[i].userMenstruationT);
										$("#Down_syndromeT").val(userData[i].Down_syndrome);
										$("#ultrasonicT").val(userData[i].ultrasonic);	
										//console.log(userData[i].Medical_history[0]);
										var Medical_historyContent=userData[i].Medical_history[0];
										$(".Medical_history textarea").eq(0).val(Medical_historyContent.present);
										$(".Medical_history textarea").eq(1).val(Medical_historyContent.Past_medical_history);
										$(".Medical_history textarea").eq(2).val(Medical_historyContent.family_history);
										$(".Medical_history textarea").eq(3).val(Medical_historyContent.allergic_history);
										$(".Medical_history textarea").eq(4).val(Medical_historyContent.pregnancy_reproductive_history);
										$(".Medical_history textarea").eq(5).val(Medical_historyContent.remark);
									}
								}
								//点击这个按钮，确定编辑结果，将结果提交到数据库
								$("#edit_userInfo").on({
									click:function(){
										for(var i in userData){
											if(userData[i].id==id_now){
												userData[i].id=$("#userIDT").val();
												userData[i].username=$("#usernameT").val();
												userData[i].userage=$("#userageT").val();
												userData[i].userDate=$("#userDateT").val();
												userData[i].sampleData=$("#userDateT").val();
												userData[i].userheight=$("#userheightT").val();
												userData[i].userweight=$('#userweightT').val();
												userData[i].userphone=$("#userphoneT").val();
												userData[i].adress=$("#userphoneT").val();
												userData[i].hospital=$("#hospitalT").val();
												userData[i].doctor=$("#userdoctorT").val();
												userData[i].userGestational_age=$("#userGestational_ageT").val();
												userData[i].fetal_type=$("#fetal_typeT").val();
												userData[i].Chorionic=$("#ChorionicT").val();
												userData[i].userPre_production_period=$("#userPre_production_periodT").val();
												userData[i].userMenstruation=$("#userMenstruationT").val();
												userData[i].Down_syndrome=$("#Down_syndromeT").val();
												userData[i].ultrasonic=$("#ultrasonicT").val();
												userData[i].Medical_history[0].present=$(".Medical_history textarea").eq(0).val();
												userData[i].Medical_history[0].Past_medical_history=$(".Medical_history textarea").eq(1).val();
												userData[i].Medical_history[0].family_history=$(".Medical_history textarea").eq(2).val();
												userData[i].Medical_history[0].allergic_history=$(".Medical_history textarea").eq(3).val();
												userData[i].Medical_history[0].pregnancy_reproductive_history=$(".Medical_history textarea").eq(4).val();
												userData[i].Medical_history[0].remark=$(".Medical_history textarea").eq(5).val();
												//console.log(userData[i]);
											}
										}
										
										var userID=$("#userIDT").val(),
											username=$("#usernameT").val(),
											userage=$("#userageT").val(),
											userDate=$("#userDateT").val(),
											userheight=$("#userheightT").val(),
											userweight=$('#userweightT').val(),
											userphone=$("#userphoneT").val(),
											adress=$("#adressT").val(),
											hospital=$("#hospitalT").val(),
											userdoctor=$("#userdoctorT").val(),
											userGestational_age=$("#userGestational_ageT").val(),
											fetal_type=$("#fetal_typeT").val(),
											Chorionic=$("#ChorionicT").val(),
											userPre_production_period=$("#userPre_production_periodT").val(),
											userMenstruation=$("#userMenstruationT").val(),
											Down_syndrome=$("#Down_syndromeT").val(),
											ultrasonic=$("#ultrasonicT").val();	
								
										for(var i=0;i<Medical_historyAll.length;i++){
											Medical_history.push($(Medical_historyAll[i]).val());	
										}
										$(".content2 input").on({
							 				blur:function(){
							 					$(this).css("border-color","#ccc");
							 				}
						 				})
										
			//							//编辑结果的验证 start
										var regName=/^[\u4e00-\u9fa5]{2,10}$/;//判断输入的姓名是否是汉字
										var regPhone=/^\d{11}$/;//电话号码的验证
										var regLChinese=/^[\u4e00-\u9fa5]{4,50}$/;
										if(userID==""||username==""||userage==""||userDate==""||userheight==""||userweight==""||
										userphone==""||adress==""||hospital==""||hospital==""||userdoctor==""||userGestational_age==""||
										fetal_type==""||Chorionic==""||userPre_production_period==""||userMenstruation==""||Down_syndrome==""||ultrasonic==""){
											$(".tell_tip2 span").fadeIn(1000).fadeOut(2000).html("请确保已将表格填充完成！");
								 				return;
										}
										for(var i=0;i<Medical_historyAll.length;i++){
											if($(Medical_historyAll[i]).val()==""){
												$(".tell_tip2 span").fadeIn(1000).fadeOut(2000).html("请确保已将表格填充完成！");
												return;
											}
										}
										if(!regName.test(username)){
											$(".tell_tip2 span").fadeIn(1000).html("请在姓名文本框内输入两个数字及以上的中文名字！");
											$("#usernameT").trigger("focus").css("border-color","red");
											return;
										}
										if(isNaN(userage)){
											$(".tell_tip2 span").fadeIn(1000).html("请输入的年龄请确保是个数字");
											$("#userageT").trigger("focus").css("border-color","red");
											return;
										}
										if(userage<=10||userage>80){
											$(".tell_tip2 span").fadeIn(1000).html("请输入的年龄不符合范围要求！");
											$("#userageT").trigger("focus").css("border-color","red");
											return;
										}
										if(isNaN(userheight)||userheight<100||userheight>250){
											$(".tell_tip2 span").fadeIn(1000).fadeOut(2000).html("请输入的身高请确保是个100-250的数字");
											$("#userheightT").trigger("focus").css("border-color","red");
											return;
										}
										if(isNaN(userweight)||userweight<30||userweight>400){
											$(".tell_tip2 span").fadeIn(1000).html("请输入的体重请确保是个30-400的数字");
											$("#userweightT").trigger("focus").css("border-color","red");
											return;
										}
										if(!regPhone.test(userphone)){
											$(".tell_tip2 span").fadeIn(1000).html("请输入11位的电话号码");
											$("#userphoneT").trigger("focus").css("border-color","red");
											return;
										}
										if(!regName.test(userdoctor)){
											$(".tell_tip2 span").fadeIn(1000).html("请在姓名文本框内输入两个数字及以上的中文名字！");
											$("#userdoctorT").trigger("focus").css("border-color","red");
											return;
										}					
										if(!regLChinese.test(hospital)){
											$(".tell_tip2 span").fadeIn(1000).html("请输入医院正确的中文名字！");
											$("#hospitalT").trigger("focus").css("border-color","red");
											return;
										}
//										//编辑结果的验证 send
										$(".addUserInformation").css("display","none");
										$(".wrap table tbody").html("");
										getAllData(userData,startpage,endpage);
									}
								})
							})
							//删除操作的点击
							var empty_tip='<tr><td colspan="7">数据库为空!</td></tr>';//当信息检索不到时输出
							
							$(this).next().on("click","#cut",function(){
								var id_now=$(this).parent().parent().parent().attr("id");
							
								for(var i in userData){
									if(userData[i].id==id_now){
										userData.splice(i,1);
										$(this).parent().parent().parent().remove();//empty,remove,detach
										if(userData.length==0){
											$(".wrap table tbody").html(empty_tip);
										}
									}
								}
							})
						})
						
						
						$(document).click(function(){//点击页面的任何一处让编辑、删除操作再次隐藏
							$(".wrap table tbody td ul").css("display","none");
						})
						 
						/**
						 * *表格批量删除的实现
						 */
						$("#cutuser").click(function(){
							var inputGroup=$(".wrap tbody input[name='sample_info']");
							var empty_tip='<tr><td colspan="7">数据库为空!</td></tr>';//当信息检索不到时输出
							$.each($(".wrap tbody input[name='sample_info']"),function(i){
								var idofIt=$(this).parent().parent().attr("id");
								if($(inputGroup[i]).is(":checked")){
									for(var i in userData){
										if(userData[i].id==idofIt){
											userData.splice(i,1);
											$(this).parent().parent().remove();//empty,remove,detach
											if(userData.length==0){
												$(".wrap table tbody").html(empty_tip);
											}
										}
									}
								}
							})
						}) 
						 
						 
						 
						 
						 
						 
					},
					error:function(){
						alert("用户信息数据库请求失败！");
					}
					
				})
			},
			error:function(){
				alert("用户信息页面加载失败");
			}
		}).done(function(){
			$(".loading").hide();
		});
		
	})
})
