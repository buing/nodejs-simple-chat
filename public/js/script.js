$(function(){
	$(window).load(function(){
		$.resize();
		var socket = io.connect();
		socket.on('send',function(me,data){
			var cls = (me)?'me':'';
			var th = $('<th></th>').addClass(cls).html(data[0].nick);
			var td = $('<td></td>').addClass(cls).html((data[0].text));
			var html = $('<tr></tr>').append(th).append(td);
			$(".chat").append(html);
			$(".talk").scrollTop($(".talk").height());
		});
		socket.on('alert',function(data){
			var str;
			if(data[0].type) str = "입장";
			else str = "퇴장";
			var td = $('<td></td>').attr("colspan","2").html('<strong class=me>'+data[0].nick+'</strong>님이 '+str+'하셨습니다.');
			var html = $('<tr></tr>').append(td);
			$(".chat").append(html);
			$.count(data[0].count);
		});
		$('form').live('submit',function(){
			var data = $(this).serializeArray();
			socket.emit($(this).attr('name'),data);
			$(this).find('input').val('');
			return false;
		});
	}).resize(function(){
		$.resize();
	}).unload(function(){
		if(socket)socket.disconnect();
	});
	setInterval("$.resize()",100);
	$.resize = function(){
		$(document).height($(window).height());
		$('.talk').height($(document).height()-$("form[name=send]").height());
	};
	$.count = function(count){
		$('.count').html(count+'명');
	};
});