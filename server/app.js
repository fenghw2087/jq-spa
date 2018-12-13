var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config/chunkConfig');
// var favicon = require('favicon');

var index = require('./routes/index');
var category = require('./routes/categoryController');
var tag = require('./routes/tagController');
var users = require('./routes/usersController');
var request = require('superagent');

var HOST = 'http://47.74.129.24';

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine( '.html', require( 'ejs' ).__express );

app.locals['filePath'] = config.mode === 'dev'?config.devConfig.filePath:config.prodConfig.filePath;
app.locals['vendorHash'] = config.hashChunks['vendor'] || '';
app.locals['resetHash'] = config.hashChunks['reset'] || '';

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    if(/^\/api\//.test(req.originalUrl)){
        var sreq = req.method.toLowerCase() === 'get'? request.get(HOST + req.originalUrl.replace(/^\/api\//,'/')): request.post(HOST + req.originalUrl.replace(/^\/api\//,'/')).set('headers',req.headers).send(req.body);
        sreq.pipe(res);
        sreq.on('end', function (error, res) {
            console.log('end');
        });
    }else{
        next();
    }
});


app.use('/', index);
app.use('/category', category);
app.use('/tag', tag);
app.use('/users', users);

module.exports = app;
