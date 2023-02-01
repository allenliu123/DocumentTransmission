var express = require('express');
var router = express();
var fs = require('fs');
var moment = require('moment');

var generateUUID = function() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 16; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	var uuid = s.join("");
	return uuid;
}

router.get('/',function(req, res, next){

	files = fs.readdirSync('./public/data/');
	fileList = [];
	files.forEach(function(file){
		const status = fs.statSync('./public/data/' + file);
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
		const status = fs.statSync('./public/data/' + file);
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
	var type = process.env.type;
	if(type && type === 'static') {
		res.json({message: "这是static，禁止删除"});
		return
	}
	console.log('delete: ' + req.body.filename);
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
	fs.rename(uploadFile.path, './public/data/' + generateUUID() + '-' + uploadFile.originalFilename.replace(/ /g,"-"), function(){});
	res.json({message: '上传成功'});
});

router.post('/saveText', function(req, res, next){
	var textarea = req.body.textarea;
	
	fs.writeFile('./public/content.txt',textarea,function(err){
		if (err) {
			res.json({message: '保存文本失败' + errs});
	   	}
	   	else{
			if(textarea.length == 0){
				res.json({message: '文本为空'});
				return;
			}
			var uuid = generateUUID()
			fs.copyFileSync('./public/content.txt', './public/data/'+uuid+'.txt', (err) => {});
	   		res.json({message: '已保存为' + uuid + '.txt'});
	   	}
	});
});

router.post('/postText', function(req, res, next){
	var textarea = req.body.textarea;
	
	fs.writeFile('./public/content.txt',textarea,function(err){
		if (err) {
			res.json({message: '文本上传失败  ' + errs});
	   	}
	   	else{
	   		res.json({message: '文本上传成功'});
	   	}
	});
});

router.get('/getText', function(req, res, next){

	if(!fs.existsSync('./public/content.txt')){
		res.json({content: ''});
	} else {
		fs.readFile('./public/content.txt', { encoding:"utf-8" }, function(err, data) {
			if (err) {
				res.json({content: ''});
			} else {
				res.json({content: data});
			}
		});
	}
});

module.exports = router;