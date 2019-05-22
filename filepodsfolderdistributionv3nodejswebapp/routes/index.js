var express = require('express');
var router = express.Router();
var url = require('url');
var config = require('../config');
var fs = require('fs');
var bl = require('../bl');
var path = require('path');
var appRoot = require('app-root-path');
var atob = require('atob');
var urlencode = require('urlencode');
var querystring = require('querystring');

/* GET home page. */
router.get('/', function(req, res) {
    res.sendfile(appRoot + "/views/index.html");
});

function encodeURL(str){
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

function decodeUrl(str){
    str = (str + '===').slice(0, str.length + (str.length % 4));
    return str.replace(/-/g, '+').replace(/_/g, '/');
}

router.get('/downloadfile', function(req, res) {

    var url_parts = url.parse(req.url, false);
    var query = url_parts.query;

    query = decodeUrl(query);
    query = atob(query);

    var values = querystring.parse(query);

    if (values.podfileid) {

        var businessLogic = new bl.businessLogic();

        businessLogic.DownloadFile(values.podfileid, res, function(err) {
            if (err) {
                console.log(err);
                res.status(404).send('File not found');
            }
        });
    }
    else {
        res.status(404).send('File not found');
    }
});

module.exports = router;
