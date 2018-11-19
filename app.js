var express = require('express');
var swig = require('swig');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();
app.use(express.bodyParser({uploadDir: "./public/data"}));

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
if(!fs.existsSync('./public/data/')){
	fs.mkdirSync('./public/data/');
}
console.log("server start success in port 8081")

app.listen(8081);
