
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var config = require('./config');
var nodeMariaDb = require('mysql');

var sanity = require('./routes/sanity');
var ajaj = require('./routes/ajaj');

require('http').globalAgent.maxSockets = Infinity;
require('https').globalAgent.maxSockets = Infinity;

var cors = require('cors');

var app = express();

app.use(cors());
app.options('*', cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

GLOBAL.serviceConnectionPool = nodeMariaDb.createPool({
    connectionLimit : config.connectionpoolconnectioncount,
    host : config.databasehost,
    port : config.databaseport,
    user : config.databaseusername,
    password : config.databasepassword,
    database : config.database/*,
    ssl : {
        ca : fs.readFileSync(config.cert)
    }*/
});

app.use('/sanity', sanity.sanity);

ajaj.loadRoutes(app, ajaj);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
