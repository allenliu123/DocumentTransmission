var express = require('express');
var router = express();
var fs = require('fs');
var moment = require('moment');

router.get('/',function(req, res, next){

	files = fs.readdirSync('./public/data/');
	fileList = [];
	files.forEach(function(file){
		status = fs.statSync('./public/data/' + file);
		var obj = new Object();
		if(status.isDirectory()){
			obj.type = "dir";
		} else {
			obj.type = "file";
			if(status.size < 1024){
				obj.size = status.size + " B";
			} else if( 1024 <= status.size && status.size < 1024 * 1024){
				obj.size = (status.size / 1024).toFixed(2) + " KB";
			} else {
				obj.size = (status.size / (1024 * 1024)).toFixed(2) + " MB";
			}
		}
		obj.name = file;
		var date = new Date(status.mtime);
		obj.timeStamp = date.getTime();
		obj.time = moment(date.getTime()).format('YYYY-MM-DD HH:mm:ss');
		fileList.push(obj);
	});
	fileList.sort(function(a, b){
		return a.timeStamp > b.timeStamp ? -1:1;
	});
	res.render('index.html',{
		fileList: fileList
	});
});

router.get('/init', function(req, res){
	
	files = fs.readdirSync('./public/data/');
	fileList = [];
	files.forEach(function(file){
		status = fs.statSync('./public/data/' + file);
		var obj = new Object();
		if(status.isDirectory()){
			obj.type = "dir";
		} else {
			obj.type = "file";
			if(status.size < 1024){
				obj.size = status.size + " B";
			} else if( 1024 <= status.size && status.size < 1024 * 1024){
				obj.size = (status.size / 1024).toFixed(2) + " KB";
			} else {
				obj.size = (status.size / (1024 * 1024)).toFixed(2) + " MB";
			}
		}
		obj.name = file;
		var date = new Date(status.mtime);
		obj.timeStamp = date.getTime();
		obj.time = moment(date.getTime()).format('YYYY-MM-DD HH:mm:ss');
		fileList.push(obj);
	});
	fileList.sort(function(a, b){
		return a.timeStamp > b.timeStamp ? -1:1;
	});
	res.json(fileList);
});

router.post('/delete', function(req, res, next){
	console.log(req.body.filename);
	var filename = req.body.filename.split(" ");
	filename.forEach(function(file){
		if(file){
			fs.unlinkSync('./public/data/' + file);
		}
	});
	res.json({message: "删除成功"});
});

router.post('/upload', function(req, res, next){
	var uploadFile = req.files.file;
	fs.rename(uploadFile.path, './public/data/' + uploadFile.originalFilename.replace(/ /g,"-"), function(){});
	res.json({message: '上传成功'});
});

router.post('/postText', function(req, res, next){
	var textarea = req.body.textarea;
	
	fs.writeFile('content.txt',textarea,function(err){
		if (err) {
			res.json({message: '文本上传失败  ' + errs});
	   	}
	   	else{
	   		res.json({message: '文本上传成功'});
	   	}
	});
});

router.get('/getText', function(req, res, next){
	var buf = new Buffer(1024);
	fs.open('content.txt', 'r+', function(err, fd) {
		if (err) {
			return console.error(err);
		}
		fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
			if (err){
				console.log(err);
			}

			if(bytes > 0){
				var str = buf.slice(0, bytes).toString();
				res.json({content: str});
			}
	  });
	});
});

module.exports = router;