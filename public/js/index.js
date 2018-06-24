$(document).ready(function(){

	// 点击删除时， 发送文件名给后台处理
	$('#del').on('click', function(){
		$.ajax({
			type: 'post',
			url: 'delete',
			data: {
				filename: this.value
			},
			success: function(result){
				$('.alert').html(result.message);
				showAlert();
				refresh();
				$('#seleteDel').hide();
				$('#seleteAll').hide();
			}
		});
	})

	// 点击上传时， 将所选择的文件发给后台处理
	$('#upload').on('change', function(){
		var formData = new FormData();
		if($("#upload")[0].files[0]){
			formData.append("file",$("#upload")[0].files[0]);
			$.ajax({
				url : 'upload',
				type : 'POST',
				data : formData,
				processData : false,
				contentType : false,
				beforeSend: function(){
					$('.alert').html("正在上传，请稍候");
					$('.alert').fadeIn();
				},
				success: function(result) {
					$('.alert').html(result.message);
					showAlert();
					refresh();
				},
				error: function(result) {
					console.log("error");
				}
			});
		}
	})

	$('#operation').on('click', function(){
		$('input').iCheck({
			checkboxClass: 'icheckbox_square-green',
			radioClass: 'iradio_square-green',
		    increaseArea: '20%'
		});
		$('.checkboxs').toggle();
		$('#seleteDel').toggle();
		$('#seleteAll').toggle();
	})

	$('#seleteDel').on('click', function(){
		var checkboxes =  $("input:checked");

		if(checkboxes.length){
			var files = [];
			for(var i = 0; i < checkboxes.length; i++){
				files.push(checkboxes[i].value);
			}
			var str = files.join(" ");
			$("#del").val(str);
			$(".modal-body").html("你确定要删除<span> "+ str +"</span> 吗?");
		} else {
			$("#del").val('');
			$(".modal-body").html('没选择文件');
		}

	})

	// 全选
	$('#seleteAll').on('click',function () {
		
		var boxes = $(':checkbox');
		if(this.name == 'false'){
			for (var i = 0; i < boxes.length; i++) {
				boxes[i].checked = true;
				this.name = true;
			}
		} else if(this.name == 'true'){
			for (var i = 0; i < boxes.length; i++) {
				boxes[i].checked = false;
				this.name = false;
			}
		}
		
		//$(':checkbox')[8].checked=true;
		$('input').iCheck({
			checkboxClass: 'icheckbox_square-green',
			radioClass: 'iradio_square-green',
		    increaseArea: '20%'
		});
	})

	// 上传文本
	$('#textUpload').on('click', function(){
		$.ajax({
			type: 'post',
			url: 'postText',
			data: {
				textarea: $('#textarea').val()
			},
			success: function(result){
				$('.alert').html(result.message);
				showAlert();
				$('#textarea').val('');
			}
		});
	})

	// 显示文本
	$('#textShow').on('click', function(){
		$.ajax({
			type: 'get',
			url: 'getText',
			success: function(result){
				$('textarea').val(result.content);
			}
		});
	})
});

function del(the){
	$("#del").val(the.name);
	$(".modal-body").html("你确定要删除<span> "+ the.name +"</span> 吗?");
}

function copy(the){
	var url = window.location.host;
	url += "/public/data/" + the.name;
	$('#copy').val(url);
	var Url2=document.getElementById("copy");
		Url2.select(); // 选择对象  
		document.execCommand("Copy");
		$('.alert').html("已复制到剪贴板");
		showAlert();
}

function refresh(){
	$.ajax({
		type: 'get',
		url: 'init',
		success: function(result){
			var html= '';
			result.forEach(function(file){
				html += '<li class="row">' +
							'<span class="col-md-4"><span class="checkboxs" style="display: none"><input type="checkbox" value="'+
								file.name+'"> <i class="far fa-file"></i></span>'+file.name+'</span>' + 
							'<span class="col-md-4" style="opacity: 0.5">' +
								'<a href="javascript:;" onclick="del(this)" title="删除" data-toggle="modal" data-target="#exampleModal" class="delBtn"  name="' +
								 file.name + '"><i class="far fa-trash-alt fa-lg"></i></a>' +
								'<a href="./public/data/' + file.name + '" title="下载" download><i class="fa fa-arrow-down fa-lg"></i></a>' +
								'<a href="./public/data/' + file.name + '" title="打开"><i class="far fa-envelope-open fa-lg"></i></a>' +
								'<a href="javascript:;" onclick="copy(this)" title="复制链接地址" name="' + file.name + '"><i class="far fa-copy fa-lg"></i></a>' +
							'</span>' +
							'<span class="col-md-2">' + file.size + '</span>'+
							'<span class="col-md-2">' + file.time + '</span>'+
						'</li>';
			});
			$('#fileList').html(html);
		}
	});
}

function showAlert(){
	$('.alert').fadeIn();
	setTimeout(function(){
		$('.alert').fadeOut();
	},2500);
}