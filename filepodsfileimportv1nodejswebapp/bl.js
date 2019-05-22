
var mDataAccessLayerXPooled = require('./dalxpooled');
var async = require('async');
var enums = require ('./enums');
var requestenhanced = require('request-enhanced');
var config = require('./config');
var moment = require('moment');
var dalmongo = require('./dalmongo');
var zlib = require('zlib');

var winston = require('winston');
require('winston-email');

winston.loggers.add('logger', {
    email: {
        from   : 'inquiries@leoparddata.com',
        to     : 'allan@leoparddata.com',
        service: 'Gmail',
        auth   : { user: 'inquiries@leoparddata.com', pass: 'anniswonderful00'},
        tags   : ['file share folder distribution service'] //optional tags for the subject
    }
    // other transports
});

logger = winston.loggers.get('logger');

function businessLogic() {

};

businessLogic.prototype.postAjaj = function(url, objectToSend, cb) {

    var default_headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux i686; rv:7.0.1) Gecko/20100101 Firefox/7.0.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-us,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
        // 'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Content-Type': "application/json; charset=utf-8"
    };

    requestenhanced.get({
        url: url,
        headers: default_headers,
        method: 'POST',
        body: JSON.stringify(objectToSend),
        rejectUnauthorized: false,
        timeout: 500000
    }, function (err, res, body) {

        if (err) {
            console.log(err);
            console.trace();
        }

        cb(err, res, res);
    });

};

businessLogic.prototype.authenticateApiUser = function(apiUsername, apiPassword, cb) {
    var self = this;

    if (config.webserviceusername === apiUsername &&
        config.webservicepassword === apiPassword) {
        cb(true);
    }
    else {
        cb(false);
    }

};

businessLogic.prototype.LoginSystemUser = function (inData, cb) { // forward to security serice
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPoolMothership);

    var jsonObjectToReturn = {};

    var users = null;

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlSelectStatement = "SELECT * FROM podfolderimports WHERE Identifier = '" + inData.username + "'";
                sqlSelectStatement += " AND WebPasscode = '" + inData.password + "' ";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        if (rows.length > 0) {
                            jsonObjectToReturn.accountexists = true;
                            jsonObjectToReturn.podfolderimport = rows[0];
                        }
                        else {
                            jsonObjectToReturn.accountexists = false;
                        }
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                logger.log('error', arguments.callee.toString(), err);
                cb(null, false, jsonObjectToReturn);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};



module.exports.businessLogic = businessLogic;