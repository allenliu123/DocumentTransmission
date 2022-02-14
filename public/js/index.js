function uploadFile(file) {
	var formData = new FormData();
	formData.append("file", file);
	var str='<h5>文件: '+file.name+' 上传中</h5>';
	str+='<div class="progress" id="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div></div>'
	document.getElementById('drop_area').innerHTML=str;

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'upload');
	xhr.upload.onprogress = function(e){
		$('#progress .progress-bar').width(parseInt(e.loaded/e.total*100)+"%");
	};
	xhr.send(formData);
	//ajax返回
	xhr.onreadystatechange = function(){
		if ( xhr.readyState == 4 && xhr.status == 200 ) {
			$('.alert').html(JSON.parse(xhr.responseText).message);
			showAlert();
			document.getElementById('drop_area').innerHTML = '<h3>将文件拖拽到此,双击切换为输入模式</h3>';
			// setTimeout(function(){
				refresh();
			// }, 500);
		}
	};
	//设置超时时间
	xhr.timeout = 100000;
	xhr.ontimeout = function(event){
		alert('请求超时！');
	}
}

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
		if($("#upload")[0].files[0]){
			uploadFile($("#upload")[0].files[0])
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

	// 保存为文本文件
	$('#textSave').on('click', function(){
		$.ajax({
			type: 'post',
			url: 'saveText',
			data: {
				textarea: $('#textarea').val()
			},
			success: function(result){
				$('.alert').html(result.message);
				showAlert();
				$('#textarea').val('');
				refresh();
			}
		});
	})

	// toggle
	$('#toggle').on('click', function(){
		toggle('')
	})

	function toggle(str) {
		var modeId = $('#box')[0].children[0].id
		if(modeId === 'drop_area') {
			$('#box').html('<textarea class="form-control" id="textarea" rows="7" autofocus>'+str+'</textarea>');
			$('textarea').on('paste', function(e){
				e.stopPropagation();
			})
		} else if(modeId === 'textarea') {
			$('#box').html('<div id="drop_area"><h3>将文件拖拽到此上传，或直接按 ctrl+v 粘贴截图或文字</h3></div>');
		}
		$('#textUpload, #textShow, #textSave').toggle();
		$('#uploadBtn').toggle();
	}

	// 粘贴图片或文字
	document.addEventListener('paste', function (e) {
		if ( !(e.clipboardData && e.clipboardData.items) ) {
			return ;
		}
		if(e.clipboardData.items[0]){
			var item = e.clipboardData.items[0];
			if (item.kind === "string") {
					item.getAsString(function (str) {
						toggle(str)
						// 复制文件后粘贴自动上传
						// var localFileName = str.split('\n')[2]
						// if(localFileName && localFileName.substr(0, 4) === 'file') {
						// 	var filePath = localFileName.slice(7,localFileName.length)
						// } else {
						// 	toggle(str)
						// }
					})
			} else if (item.kind === "file") {
					var pasteFile = item.getAsFile();
					uploadFile(pasteFile)
			}
		}
	}, false);
});

function del(the){
	$("#del").val(the.name);
	$(".modal-body").html("你确定要删除<span> "+ the.name +"</span> 吗?");
}

function copy(the){
	if(window.location.ancestorOrigins.length!=0)
		var url = window.location.ancestorOrigins[0];
	else 
		var url = window.location.origin;
	url += "/public/data/" + the.name;
	$('#copy').val(url);
	var Url2=document.getElementById("copy");
		Url2.select(); // 选择对象  
		document.execCommand("Cut");
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
								'<a href="./public/data/' + file.name + '" title="打开" target="_block"><i class="far fa-envelope-open fa-lg"></i></a>' +
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

//+++++ 拖拽上传功能 ++++++

// 清除拖拽默认事件
document.addEventListener("drop",function(e){  //拖离   
    e.preventDefault();      
})  
document.addEventListener("dragleave",function(e){  //拖后放   
    e.preventDefault();      
})  
document.addEventListener("dragenter",function(e){  //拖进  
    e.preventDefault();      
})  
document.addEventListener("dragover",function(e){  //拖来拖去    
    e.preventDefault();      
})  

// 逻辑
var box = document.getElementById('drop_area'); //拖拽区域     
box.addEventListener("drop",function(e){
	var fileList = e.dataTransfer.files; //获取文件对象    
	//检测是否是拖拽文件到页面的操作
	if(fileList.length == 0){                
	    return false;            
	}             
	//拖拉图片到浏览器，可以实现预览功能    
	//规定视频格式  
	Array.prototype.S=String.fromCharCode(2);  
	Array.prototype.in_array=function(e){  
	    var r=new RegExp(this.S+e+this.S);  
	    return (r.test(this.S+this.join(this.S)+this.S));  
	};  
	var video_type=["video/mp4","video/ogg"];  
	
	//创建一个url连接,供src属性引用  
	var fileurl = window.URL.createObjectURL(fileList[0]);
	if(fileList[0].type.indexOf('image') === 0){
		var str="<img height='80%' src='"+fileurl+"'><br>";
		document.getElementById('drop_area').innerHTML=str;
	}else if(video_type.in_array(fileList[0].type)){
		var str="<video height='80%' controls='controls' src='"+fileurl+"'></video><br>";
		document.getElementById('drop_area').innerHTML=str;
	}else{
		var str='<h5>文件: '+fileList[0].name+' 上传中</h5>';
	}
	str+='<div class="progress" id="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div></div>'
	document.getElementById('drop_area').innerHTML=str;

	resultfile = fileList[0];
	var xhr = new XMLHttpRequest();
	var formData = new FormData(); 
	formData.append('file', resultfile);
	xhr.open('POST', 'upload');
	xhr.upload.onprogress = function(e){
		$('#progress .progress-bar').width(parseInt(e.loaded/e.total*100)+"%");
	};
	xhr.send(formData);
	//ajax返回
	xhr.onreadystatechange = function(){
		if ( xhr.readyState == 4 && xhr.status == 200 ) {
			$('.alert').html(JSON.parse(xhr.responseText).message);
			showAlert();
			document.getElementById('drop_area').innerHTML = '<h3>将文件拖拽到此,双击切换为输入模式</h3>';
			// setTimeout(function(){
				refresh();
			// }, 500);
		}
	};
	//设置超时时间
	xhr.timeout = 100000;
	xhr.ontimeout = function(event){
		alert('请求超时！');
	}
},false);
