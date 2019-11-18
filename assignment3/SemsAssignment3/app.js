var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var responseTime = require('response-time')

var indexRouter = require('./routes/index');
var gpsRouter = require('./routes/gpspaths');

var app = express();

app.use(responseTime())
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/gps', gpsRouter);



module.exports = app;
