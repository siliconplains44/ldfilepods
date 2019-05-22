var express = require('express');
var router = express.Router();
var url = require('url');
var config = require('../config');
var fs = require('fs');
var bl = require('../bl');
var path = require('path');
var appRoot = require('app-root-path');

/* GET home page. */
router.get('/', function(req, res) {
    res.sendfile(appRoot + "/views/index.html");
});

router.get('/downloadfile', function(req, res) {

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    if (query.identifier) {

        var businessLogic = new bl.businessLogic();

        businessLogic.downloadFile(query.identifier, res, function(err) {
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
