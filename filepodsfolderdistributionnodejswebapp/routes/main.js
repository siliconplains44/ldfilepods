/**
 * Created by Allan on 1/26/2015.
 */

var appRoot = require('app-root-path');

exports.spa = function(req, res){
    res.sendfile(appRoot + "/views/spa.html");
};

