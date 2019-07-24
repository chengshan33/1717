$(function(){
	$("left_buttomzhi img").each(function(i){  循环获取的得到鼠标位置
		alert(i);
		var offset=$(this).offset(); //获取top 和 left的位置
		$(this).mouseenter(function(){
			$("#b1").css({"top":offset.top,"left":offset.left}).show(1000);  //时间
		})
	})
	$("#b1 a").click(function(){
		$("#b1").hide(1000);
	})
})
