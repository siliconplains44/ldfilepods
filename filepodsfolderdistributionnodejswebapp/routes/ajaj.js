var mBusinessLogic = require('../bl');

/* Business Logic Methods */

module.exports.IsCurrentClientVersionValid = function (req, res) {

    var bl = new mBusinessLogic.businessLogic();

    var jsonObjectReceived = req.body;
    var jsonObjectResult = {};

    bl.authenticateApiUser(jsonObjectReceived.apiusername, jsonObjectReceived.apipassword, function(result) {

        if (result == false) {
            jsonObjectResult.result = false;
            jsonObjectReceived.err = 'api authentication failed';
            res.json(200, jsonObjectResult);
        }
        else {
            bl.IsCurrentClientVersionValid(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in IsCurrentClientVersionValid' + err);
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
    });

};

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

module.exports.RetrieveTreeIDByPodFolderID = function (req, res) {

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
        bl.RetrieveTreeIDByPodFolderID(jsonObjectReceived, function (err, result, outData) {

            if (err) {
                console.log('error in RetrieveTreeIDByPodFolderID' + err);
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

module.exports.RetrieveTreeByTreeID = function (req, res) {

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
        bl.RetrieveTreeByTreeID(jsonObjectReceived, function (err, result, outData) {

            if (err) {
                console.log('error in RetrieveTreeByTreeID' + err);
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

module.exports.RetrievePodFilesByPodFolderParentID = function (req, res) {

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
        bl.RetrievePodFilesByPodFolderParentID(jsonObjectReceived, function (err, result, outData) {

            if (err) {
                console.log('error in RetrievePodFilesByPodFolderParentID' + err);
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

module.exports.RetrieveAllPodFileRevisionsByPodFileID = function (req, res) {

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
        bl.RetrieveAllPodFileRevisionsByPodFileID(jsonObjectReceived, function (err, result, outData) {

            if (err) {
                console.log('error in RetrieveAllPodFileRevisionsByPodFileID' + err);
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

module.exports.ReportABug = function (req, res) {

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
            bl.ReportABug(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in ReportABug' + err);
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

module.exports.ReportASiteProblem = function (req, res) {

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
            bl.ReportASiteProblem(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in ReportASiteProblem' + err);
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

module.exports.DownloadFile = function (req, res) {

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
        bl.DownloadFile(jsonObjectReceived, res, function (err, result, outData) { });
    }
    //});

};


module.exports.loadRoutes = function(app, ajaj) {
    app.post('/ajaj/IsCurrentClientVersionValid', ajaj.IsCurrentClientVersionValid);
    app.post('/ajaj/LoginSystemUser', ajaj.LoginSystemUser);
    app.post('/ajaj/RetrieveTreeIDByPodFolderID', ajaj.RetrieveTreeIDByPodFolderID);
    app.post('/ajaj/RetrieveTreeByTreeID', ajaj.RetrieveTreeByTreeID);
    app.post('/ajaj/RetrievePodFilesByPodFolderParentID', ajaj.RetrievePodFilesByPodFolderParentID);
    app.post('/ajaj/RetrieveAllPodFileRevisionsByPodFileID', ajaj.RetrieveAllPodFileRevisionsByPodFileID);
    app.post('/ajaj/ReportABug', ajaj.ReportABug);
    app.post('/ajaj/ReportASiteProblem', ajaj.ReportASiteProblem);
    app.post('/ajaj/DownloadFile', ajaj.DownloadFile);
};