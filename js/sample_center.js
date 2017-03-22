$(function(){
	//页面刚打开时让当前这个页面的导航栏元素展开,即样品中心展开
	$("#nav dt:first").addClass("click_now").next().toggleClass("curr");
	$("#sample_center").on("click",function(){
		$("#nav dd p").removeClass("now");
		$(this).addClass("now");
		$.ajax({
			type:"get",
			url:"sampleCenter/sampleCenter.html",//加载样品中心页面
			success:function(data1){
				$("#iframe").html(data1);
				var sample;//定义出来，用来存放所有的数据信息
				//表格获取数据
				$.ajax({
					type:"get",
					url:"../data/data.json",//向自己的文件夹内的文件请求数据
					//url:"http://192.168.1.17:82/data.json?callback=jsonpCallback",//向服务器端请求数据，必须添加dataType，jsonpCallback，data.son的数据也需要加上回调函数名
					//dataType:"jsonp",
					//jsonpCallback:"callbackOne",//这三句为跨域访问的方法
					success:function(data){
						 sample=data.sample;//从数据库中获取的关于样品的数据，此时为经过任何的修改
		
					//表格底部的页数，每一页多少数据的设置
						var ln=sample.length;
						var page_every=$("#page_every").val();//每页多少个数据
						var num=Math.ceil(ln/page_every);//总共有多少页
						var page_now=$("#page_now").val();//当前第几页
						var endpage= page_now*page_every;//当前页的最后一个数据
						var startpage=0;//当前页的第一个数据
						$("#pages").html(num+" ");
						//定义一个获取数据库内全部数据的方法 start
             			function getAllData(sample,startpage,endpage){
							for(var i=0;i<sample.length;i++){
								if(i>=startpage&&i<endpage){
									var information='<tr id="'+sample[i].id+'"><td><input type="checkbox" name="sample_info"></td><td>'+
									sample[i].num+'</td><td>'+
									sample[i].name+'</td><td>'+
									sample[i].type+'</td><td>'+
									sample[i].sampleDate+'</td><td>'+
									sample[i].databaseWhether+'</td><td><i></i><ul><li id="text"><a href="javascript:void(0)">编辑</a></li><li id="cut"><a href="javascript:void(0)">删除</a></li></ul></td></tr>';
									$(".wrap table tbody").append(information);
								}
							}
								
							
							//隔行变色
							$(".wrap table tbody tr:odd").addClass("line_color");
						}
             			//定义一个获取数据库内全部数据的方法 end
						var change=function(){
							 ln=sample.length;
							 page_every=$("#page_every").val();
							 num=Math.ceil(ln/page_every);//总共有多少页
							$("#pages").html(num+" ");
							$("#page_now").val(page_now);
							endpage=page_now*page_every;
							startpage=endpage-page_every;
							$(".wrap table tbody").html("");
							getAllData(sample,startpage,endpage);
						};
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
								getAllData(sample,startpage,endpage);
								
							}
						})
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
								getAllData(sample,startpage,endpage);
								
							}
						})
             			//首页的点击
             			$("#first").click(function(){
             				page_every=$("#page_every").val();
             				$("#page_now").val("1");
             				$(".wrap table tbody").html("");
             				getAllData(sample,0,page_every);
             				
             			})
             			//尾页的点击
             			$("#last").click(function(){
             				page_every=$("#page_every").val();
             				endpage=sample.length;
             				startpage=(num-1)*page_every;
             				$("#page_now").val(num);
             				$(".wrap table tbody").html("");
             				getAllData(sample,startpage,endpage);
             				
             			})
				
						getAllData(sample,startpage,endpage);//请求成功后，加载数据库的数据
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
								//return;
							}
						})			
						/*****   
						 * 搜索功能的实现 start  
						 * */
						//点击页面上的搜索按钮
						$("#search").on({
							click:function(){
								var sampleID=$("#ID").val();
								var sampleName=$("#name").val();
								var sampleInfo={
										"sampleID":sampleID,
										"sampleName":sampleName
							  };
								//判断你的输入是否为空，不符合则不再需要检索数据库
								if(sampleID==""&&sampleName==""){
									if(sample.length==0){
										var empty_tip='<tr><td colspan="7">数据库为空!</td></tr>';//当信息检索不到时输出
										$(".wrap table tbody").html(empty_tip);
									}else{
										$(".wrap table tbody").html("");
										alert("请先输入数据");
										getAllData(sample,startpage,endpage)
									}
									return;
								}
								//判断你的输入是否符合数据库的数据规则，不符合则不再需要检索数据库		
								var flag=false;//用来判断数据库中是否有这项数据，通过ID判断
								var flag=false;//用来判断数据库中是否有这项数据，通过name判断			
								var tip='<tr><td colspan="7">你输入的信息不存在!</td></tr>';//当信息检索不到时输出
								//若通过了以上两个验证，则检索数据库，看是否有与数据库匹配的项
								/* 编号的搜索*/
								if(sampleID!=""){//若姓名不为空
									var info_searchget="";
									$.each(sample,function(i){						
									if(sampleID==sample[i].num){
										$(".wrap table tbody").html("");
										 info_searchget+='<tr id="'+sample[i].id+'"><td><input type="checkbox" name="sample_info"></td><td>'+
											sample[i].num+'</td><td>'+
											sample[i].name+'</td><td>'+
											sample[i].type+'</td><td>'+
											sample[i].sampleDate+'</td><td>'+
											sample[i].databaseWhether+'</td><td><i></i><ul><li id="text"><a href="javascript:void(0)">编辑</a></li><li id="cut"><a href="javascript:void(0)">删除</a></li></ul></td></tr>';
//										$(".wrap table tbody").append(info_searchget);
										
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
								/* 姓名的搜索*/
								if(sampleName!=""){
									var info_searchget="";
									$.each(sample,function(i){
										if(sampleName==sample[i].name){
											$(".wrap table tbody").html("");
											 info_searchget+='<tr id="'+sample[i].id+'"><td><input type="checkbox" name="sample_info"></td><td>'+
												sample[i].num+'</td><td>'+
												sample[i].name+'</td><td>'+
												sample[i].type+'</td><td>'+
												sample[i].sampleDate+'</td><td>'+
												sample[i].databaseWhether+'</td><td><i></i><ul><li id="text"><a href="javascript:void(0)">编辑</a></li><li id="cut"><a href="javascript:void(0)">删除</a></li></ul></td></tr>';
											
											//console.log("yes");
											flag=true;//如果数据库中有这个数据，则返回true，不再输入错误提示信息
											//return false;
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
						//点击回车键，给两个文本框绑定搜索功能，即回车即可搜索
						$("#ID").keydown(function(event){
							var event=event||window.event;
							if(event.keyCode==13){
								$("#search").trigger("click");
							}
						})
						$("#name").keydown(function(event){
							var event=event||window.event;
							if(event.keyCode==13){
								$("#search").trigger("click");
							}
						})
						
						/**
						 * 重置按钮功能的实现
						 * **/		
						 $("#reset_search").on("click",function(){
						 	if(sample.length==0){
								var empty_tip='<tr><td colspan="7">数据库为空!</td></tr>';//当信息检索不到时输出
								$(".wrap table tbody").html(empty_tip);
							}else{
								$(".wrap table tbody").html("");
								getAllData(sample,startpage,endpage);
							}
						 })
						 /**
						  * 添加样品功能的实现，点击添加样品信息，局部更新页面
						  * */
						
						var ln_last,newId;
						 $("#addEI").on({
						 	click:function(){
						 		$("#newnum").val("");
						 		$("#newname").val("");
						 		$("#type").val("");
						 		$("#transport").val("");
						 		$("#strat").val("");
						 		$("#quantity").val("");
						 		ln_last=sample.length;
						 		if(ln_last>0){
						 			 //寻找数据库的最后一项的id，并+1给新页面的ID text加上
						 			newId=Number(sample[ln_last-1].id)+1;
						 		}else{
						 			newId=1;
						 		}
								
						 		//显示样品“添加样品信息界面”
								$(".addSample").css("display","block");
								$("#addSample").css("display","block");
								$("#EditSample").css("display","none");
								$(".web_information_left span").html("当前位置:样品中心>样品信息>添加样品信息");
								
						 		$("#newsampleID").val(newId);
						 
						 	}
						 })
						 //表单验证的正则表达式
						var regID=/^16\d{7}$/;//判断编号是否是以16开头的9位数字
						var regName=/^[\u4e00-\u9fa5]{2,10}$/;//判断输入的姓名是否是汉字
						//确认添加样品的按钮
						 $("#addSample").on({
						 	click:function(){	
				 				var new_num=$("#newnum").val(),
					 			new_name=$("#newname").val(),
					 			new_type=$("#type").val(),					 			
					 			new_databaseWhether='',
					 			new_transportant=$("#transport").val(),
					 			new_startDate=$("#strat").val(),
					 			new_endDate=$("#end").val(),
					 			new_quantity=$("#quantity").val();
					 			$(".content input").on({
					 				blur:function(){
					 					$(this).css("border-color","#ccc");
					 					}
				 				})
					 			//$.each($(".content input"),"blur")
					 			if(new_num==""||new_name==""||new_startDate==""||new_endDate==""||new_startDate==""||new_transportant==""){
					 				$(".tell_tip span").fadeIn(1000).fadeOut(2000).html("请确保已将表格填充完成！");
					 				return;
					 			}
								if(!regID.test(new_num)){
									$(".tell_tip span").fadeIn(1000).fadeOut(2000).html("您输入的标号格式不符合数据库要求（编号格式应为9位的以16开头的字符串)!");
									$("#newnum").trigger("focus").css("border-color","red");
									return;
								}
								if(!regName.test(new_name)){
									$(".tell_tip span").fadeIn(1000).fadeOut(2000).html("请输入两个数字及以上的中文名字！");
									$("#newname").trigger("focus").css("border-color","red");
									return;
								}
					 			
					 			
						 		var newSample={
						 			"id":newId,
									"num":new_num,
									"name":new_name,
									"type":new_type,
									"sampleDate":new_endDate,
									"databaseWhether":"是",
									"transportant":new_transportant,
									"level":new_quantity,
									"startDate":new_startDate
						 		}
						 		sample.push(newSample);
						 		$(".wrap table tbody").html("");
						 		getAllData(sample,startpage,endpage)
						 		$(".addSample").css("display","none");
								$(".web_information_left span").html("当前位置:样品中心>样品信息");
						 	}
						 })
						 
						//取消添加样品的按钮：回到样品中心，并清除“添加样品信息”页面的信息
						$(".button_addSample input[name='cancel']")	.on({
							click:function(){
								$(".addSample").css("display","none");
							}
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
								$(".addSample").css("display","block");
								$("#addSample").css("display","none");
								$("#EditSample").css("display","block");
								var id_now=$(this).parent().parent().parent().attr("id");
								for(var i in sample){
									if(sample[i].id==id_now){
										//console.log(sample[i]);
										$("#newsampleID").val(sample[i].id);
										$("#newname").val(sample[i].name);
										$("#newnum").val(sample[i].num);								 			new_name=$("#newname").val(),
								 		$("#type").val(sample[i].type);				 				
								 		$("#transport").val(sample[i].transportant);
								 		$("#start").val(sample[i].startDate);
								 		$("#end").val(sample[i].sampleDate);
								 		$("#quantity").val(sample[i].level);
									}
								}
								//点击这个按钮，确定编辑结果，将结果提交到数据库
								$("#EditSample").on({
									click:function(){
										for(var j in sample){
											if(sample[j].id==id_now){
												sample[j].name=$("#newname").val();
												sample[j].id=$("#newsampleID").val();
												sample[j].num=$("#newnum").val();
												sample[j].type=$("#type").val();
												sample[j].sampleDate=$("#end").val();
												sample[j].databaseWhether="是";
												sample[j].transportant=$("#transport").val();
												sample[j].level=$("#quantity").val();
												sample[j].startDate=$("#start").val();
//												console.log(sample[j]);
											}
										}
										//编辑结果的验证 start
										var new_num=$("#newnum").val(),
								 			new_name=$("#newname").val(),
								 			new_type=$("#type").val(),					 			
								 			new_databaseWhether='',
								 			new_transportant=$("#transport").val(),
								 			new_startDate=$("#strat").val(),
								 			new_endDate=$("#end").val(),
								 			new_quantity=$("#quantity").val();
							 			$(".content input").on({
							 				blur:function(){
							 					$(this).css("border-color","#ccc");
							 					}
						 				})
							 			if(new_num==""||new_name==""||new_startDate==""||new_endDate==""||new_startDate==""||new_transportant==""){
							 				$(".tell_tip span").fadeIn(1000).fadeOut(2000).html("请确保已将表格填充完成！");
							 				return;
							 			}
										if(!regID.test(new_num)){
											$(".tell_tip span").fadeIn(1000).fadeOut(2000).html("您输入的标号格式不符合数据库要求（编号格式应为9位的以16开头的字符串)!");
											$("#newnum").trigger("focus").css("border-color","red");
											return;
										}
										if(!regName.test(new_name)){
											$(".tell_tip span").fadeIn(1000).fadeOut(2000).html("请输入两个数字及以上的中文名字！");
											$("#newname").trigger("focus").css("border-color","red");
											return;
										}
										//编辑结果的验证 send
										$(".addSample").css("display","none");
										$(".wrap table tbody").html("");
										getAllData(sample,startpage,endpage);
									}
								})
							})
							//删除操作的点击
							var empty_tip='<tr><td colspan="7">数据库为空!</td></tr>';//当信息检索不到时输出
							
							$(this).next().on("click","#cut",function(){
								var id_now=$(this).parent().parent().parent().attr("id");
							
								for(var i in sample){
									if(sample[i].id==id_now){
										sample.splice(i,1);
										$(this).parent().parent().parent().remove();//empty,remove,detach
										if(sample.length==0){
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
						$("#cutEI").click(function(){
							var inputGroup=$(".wrap tbody input[name='sample_info']");
							var empty_tip='<tr><td colspan="7">数据库为空!</td></tr>';//当信息检索不到时输出
							$.each($(".wrap tbody input[name='sample_info']"),function(i){
								var idofIt=$(this).parent().parent().attr("id");
								if($(inputGroup[i]).is(":checked")){
									for(var i in sample){
										if(sample[i].id==idofIt){
											sample.splice(i,1);
											$(this).parent().parent().remove();//empty,remove,detach
											if(sample.length==0){
												$(".wrap table tbody").html(empty_tip);
											}
										}
									}
								}
							})
						})
					},
					error:function(){
					}
				})
				
			},
			error:function(){
				alert("加载失败!");
			}
		}).done(function(){
			$(".loading").hide();
		});
	});
	$("#sample_center").trigger("click");
})