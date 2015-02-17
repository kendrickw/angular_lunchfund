/*jslint node: true */
/*jslint nomen: true */
"use strict";

var express = require('express'),
    http = require('http'),
    path = require('path'),
    routes = require('./routes');

var app_version = require('./package.json').version;
var app = express();

//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.multipart());
app.use(express.methodOverride());
app.use(app.router);
app.use(express['static'](path.join(__dirname, 'public')));
app.use(express['static'](path.join(__dirname, 'bower_components')));
app.use('/style', express['static'](path.join(__dirname, '/public/css')));
app.use('/fonts', express['static'](path.join(__dirname, '/bower_components/bootstrap/fonts')));

// development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', function (req, res) {
    routes.index(req, res, {
        'version' : app_version
    });
});


function getFormattedDate() {
    var date = new Date(),
        str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
              date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    return str;
}

var server = http.createServer(app);
server.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));

});