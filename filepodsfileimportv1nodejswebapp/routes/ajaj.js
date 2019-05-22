var mBusinessLogic = require('../bl');
var config = require('../config');
var requestenhanced = require('request-enhanced');

function postAjaj(url, objectToSend, cb) {

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
        timeout: 250000
    }, function (err, res, body) {

        if (err) {
            console.log(err);
            console.trace();
        }

        cb(err, res, res);
    });

};


/* Business Logic Methods */


module.exports.LoginSystemUser = function (req, res) {

    var bl = new mBusinessLogic.businessLogic();

    var jsonObjectReceived = req.body;
    var jsonObjectResult = {};

    result = true;
    //bl.authenticateApiUser(jsonObjectReceived.apiusername, jsonObjectReceived.apipassword, function(result) {

        if (result == false) {
            jsonObjectResult.result = false;
            jsonObjectReceived.err = 'api authentication failed';
            res.json(200, jsonObjectResult);
        }
        else {
            bl.LoginSystemUser(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in LoginSystemUser' + err);
                    jsonObjectResult.err = err;
                    jsonObjectResult.result = false;
                }
                else {
                    jsonObjectResult.result = true;
                    jsonObjectResult.outData = outData;
                }

                res.json(200, jsonObjectResult);
            });
        }
    //});

};



module.exports.RetrieveFilePodFilesByParentFolderID = function (req, res) {

    var jsonObjectToSend = {};

    jsonObjectToSend.apiusername = config.filepodsapiusername;
    jsonObjectToSend.apipassword = config.filepodsapipassword;

    jsonObjectToSend.parentfolderid = parseInt(req.body.parentfolderid);
    jsonObjectToSend.podid = parseInt(req.body.podid);

    postAjaj(config.filepodsapiurl + '/ajaj/RetrieveFilePodFilesByParentFolderID', jsonObjectToSend,
        function(err, ress, body) {
            if (!err) {
                res.json(200, body);
            }
            else {
                res.json(400, null);
            }
        });

};



module.exports.startUpload = function (req, res) {

    var jsonObjectToSend = {};

    jsonObjectToSend.apiusername = config.filepodsapiusername;
    jsonObjectToSend.apipassword = config.filepodsapipassword;

    jsonObjectToSend.filename = req.body.filename;
    jsonObjectToSend.filesizeinbytes = parseInt(req.body.filesizeinbytes);
    jsonObjectToSend.folderparentid = parseInt(req.body.folderparentid);
    jsonObjectToSend.podid = parseInt(req.body.podid);

    postAjaj(config.filepodsapiurl + '/ajaj/StartFileUpload', jsonObjectToSend,
        function(err, ress, body) {
            if (!err) {
                res.json(200, body);
            }
            else {
                res.json(400, null);
            }
        });

};

module.exports.uploadFilePart = function (req, res) {

    var jsonObjectToSend = {};

    jsonObjectToSend.securityuserid = req.body.securityuserid;
    jsonObjectToSend.apiusername = config.filepodsapiusername;
    jsonObjectToSend.apipassword = config.filepodsapipassword;
    jsonObjectToSend.fileid = parseInt(req.body.fileid);
    jsonObjectToSend.partindex = parseInt(req.body.partindex);
    jsonObjectToSend.partcontent = req.body.partcontent;
    jsonObjectToSend.partoriginalsizeinbytes = parseInt(req.body.partoriginalsizeinbytes);
    jsonObjectToSend.partcompressedsizeinbytes = parseInt(req.body.partcompressedsizeinbytes);

    postAjaj(config.filepodsapiurl + '/ajaj/UploadFilePart', jsonObjectToSend,
        function(err, ress, body) {
            if (!err) {
                res.json(200, body);
            }
            else {
                res.json(400, null);
            }
        });

};

module.exports.flagUploadComplete = function (req, res) {

    var jsonObjectToSend = {};

    jsonObjectToSend.securityuserid = req.body.securityuserid;
    jsonObjectToSend.apiusername = config.filepodsapiusername;
    jsonObjectToSend.apipassword = config.filepodsapipassword;
    jsonObjectToSend.podfileid = parseInt(req.body.podfileid);

    postAjaj(config.filepodsapiurl + '/ajaj/FlagFileUploadComplete', jsonObjectToSend,
        function(err, ress, body) {
            if (!err) {
                res.json(200, body);
            }
            else {
                res.json(400, null);
            }
        });

};

module.exports.LockPodForEditing = function (req, res) {

    var jsonObjectToSend = {};

    jsonObjectToSend.securityuserid = req.body.securityuserid;
    jsonObjectToSend.apiusername = config.filepodsapiusername;
    jsonObjectToSend.apipassword = config.filepodsapipassword;
    jsonObjectToSend.podid = parseInt(req.body.podid);

    postAjaj(config.filepodsapiurl + '/ajaj/LockPodForEditing', jsonObjectToSend,
        function(err, ress, body) {
            if (!err) {
                res.json(200, body);
            }
            else {
                res.json(400, null);
            }
        });

};


module.exports.UnlockFilePod = function (req, res) {

    var jsonObjectToSend = {};

    jsonObjectToSend.apiusername = config.filepodsapiusername;
    jsonObjectToSend.apipassword = config.filepodsapipassword;
    jsonObjectToSend.podid = parseInt(req.body.podid);

    postAjaj(config.filepodsapiurl + '/ajaj/UnlockFilePod', jsonObjectToSend,
        function(err, ress, body) {
            if (!err) {
                res.json(200, body);
            }
            else {
                res.json(400, null);
            }
        });

};

module.exports.loadRoutes = function(app, ajaj) {
    app.post('/ajaj/LoginSystemUser', ajaj.LoginSystemUser);
    app.post('/ajaj/RetrieveFilePodFilesByParentFolderID', ajaj.RetrieveFilePodFilesByParentFolderID);
    app.post('/ajaj/startUpload', ajaj.startUpload);
    app.post('/ajaj/uploadFilePart', ajaj.uploadFilePart);
    app.post('/ajaj/flagUploadComplete', ajaj.flagUploadComplete);
    app.post('/ajaj/LockPodForEditing', ajaj.LockPodForEditing);
    app.post('/ajaj/UnlockFilePod', ajaj.UnlockFilePod);
};