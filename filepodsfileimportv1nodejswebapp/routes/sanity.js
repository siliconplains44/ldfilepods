var url = require('url');
var appRoot = require('app-root-path');

exports.sanity = function(req, res){
    res.sendfile(appRoot + "/views/sanity.html");
};