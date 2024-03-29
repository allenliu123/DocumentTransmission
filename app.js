require('dotenv').config()
var express = require('express');
var swig = require('swig');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();
app.use(express.bodyParser({
	limit: '1024mb',
	uploadDir: "./public/data"}
));

app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, then){
	res.header("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	then();
});

// app.use(app.router);

swig.setDefaults({cache:false});

app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');
app.use('/public',express.static( __dirname + '/public'));

app.use('/',require('./routers/api'));
app.use('/shard',require('./routers/shard'));
if(!fs.existsSync('./public/data/')){
	fs.mkdirSync('./public/data/');
}

var type = process.env.type;
if(type && type === 'file') {
	app.listen(8081);
	console.log(type + " project, server start success in port 8081")
} else if(type && type === 'static') {
	app.listen(8082);
	console.log(type + " project, server start success in port 8082")
} else {
	app.listen(8080);
	console.log("server start success in port 8080")
}

