var mBusinessLogic = require('../bl');
var mDalX = require('../dalx');

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

module.exports.ActivateService = function (req, res) {

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
            bl.ActivateService(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in ActivateService' + err);
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


module.exports.DeactivateService = function (req, res) {

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
            bl.DeactivateService(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in DeactivateService' + err);
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

    bl.authenticateApiUser(jsonObjectReceived.apiusername, jsonObjectReceived.apipassword, function(result) {

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
    });

};

module.exports.IsHandleInUse = function (req, res) {

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
            bl.IsHandleInUse(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in IsHandleInUse' + err);
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

module.exports.RetrieveSecurityUserHandle = function (req, res) {

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
            bl.RetrieveSecurityUserHandle(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveSecurityUserHandle' + err);
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

module.exports.SetSecurityUserHandle = function (req, res) {

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
            bl.SetSecurityUserHandle(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in SetSecurityUserHandle' + err);
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

module.exports.RetrieveSecurityUserIDByHandle = function (req, res) {

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
            bl.RetrieveSecurityUserIDByHandle(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveSecurityUserIDByHandle' + err);
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

module.exports.AddFilePod = function (req, res) {

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
            bl.AddFilePod(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in AddFilePod' + err);
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

module.exports.ModifyFilePod = function (req, res) {

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
            bl.ModifyFilePod(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in ModifyFilePod' + err);
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

module.exports.DeleteFilePod = function (req, res) {

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
            bl.DeleteFilePod(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in DeleteFilePod' + err);
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

module.exports.RetrieveFilePodsByOwnerSecurityUserID = function (req, res) {

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
            bl.RetrieveFilePodsByOwnerSecurityUserID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveFilePodsByOwnerSecurityUserID' + err);
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

module.exports.RetrieveFilePodsSharedWithMe = function (req, res) {

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
            bl.RetrieveFilePodsSharedWithMe(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveFilePodsSharedWithMe' + err);
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

module.exports.RetrieveFilePodsArchived = function (req, res) {

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
            bl.RetrieveFilePodsArchived(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveFilePodsArchived' + err);
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

module.exports.ArchiveFilePod = function (req, res) {

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
            bl.ArchiveFilePod(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in ArchiveFilePod' + err);
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

module.exports.UnarchiveFilePod = function (req, res) {

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
            bl.UnarchiveFilePod(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in UnarchiveFilePod' + err);
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

module.exports.RetrieveFilePodInformation = function (req, res) {

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
            bl.RetrieveFilePodInformation(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveFilePodInformation' + err);
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

module.exports.RetrieveFilePodFilesByParentFolderID = function (req, res) {

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
            bl.RetrieveFilePodFilesByParentFolderID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveFilePodFilesByParentFolderID' + err);
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

module.exports.RetrievePodFileByPodFileID = function (req, res) {

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
            bl.RetrievePodFileByPodFileID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrievePodFileByPodFileID' + err);
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

module.exports.RetrieveFilePodSecurityUserAccess = function (req, res) {

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
            bl.RetrieveFilePodSecurityUserAccess(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveFilePodSecurityUserAccess' + err);
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

module.exports.GrantHandleAccessToFilePod = function (req, res) {

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
            bl.GrantHandleAccessToFilePod(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in GrantHandleAccessToFilePod' + err);
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

module.exports.RevokeHandleAccessToFilePod = function (req, res) {

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
            bl.RevokeHandleAccessToFilePod(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RevokeHandleAccessToFilePod' + err);
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

module.exports.RetrieveSecurityUserAccessLevelToFilePod = function (req, res) {

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
            bl.RetrieveSecurityUserAccessLevelToFilePod(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveSecurityUserAccessLevelToFilePod' + err);
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

module.exports.SetHandleWritePermissionsToFilePod = function (req, res) {

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
            bl.SetHandleWritePermissionsToFilePod(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in SetHandleWritePermissionsToFilePod' + err);
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

module.exports.LockFilePodForEditing = function (req, res) {

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
            bl.LockFilePodForEditing(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in LockFilePodForEditing' + err);
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

module.exports.UnlockFilePod = function (req, res) {

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
            bl.UnlockFilePod(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in UnlockFilePod' + err);
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

module.exports.IsFilePodLocked = function (req, res) {

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
            bl.IsFilePodLocked(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in IsFilePodLocked' + err);
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

module.exports.GetLastFilePodLockTime = function (req, res) {

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
            bl.GetLastFilePodLockTime(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in GetLastFilePodLockTime' + err);
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

module.exports.UpdatePodLastChangeTime = function (req, res) {

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
            bl.UpdatePodLastChangeTime(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in UpdatePodLastChangeTime' + err);
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

module.exports.RetrievePodLastChangeTime = function (req, res) {

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
            bl.RetrievePodLastChangeTime(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrievePodLastChangeTime' + err);
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

module.exports.RetrieveFilePodRootFolder = function (req, res) {

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
            bl.RetrieveFilePodRootFolder(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveFilePodRootFolder' + err);
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

module.exports.CreateFilePodRootFolder = function (req, res) {

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
            bl.CreateFilePodRootFolder(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in CreateFilePodRootFolder' + err);
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

module.exports.AddShortcut = function (req, res) {

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
            bl.AddShortcut(jsonObjectReceived, function (err, result, outData) {

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
    });

};

module.exports.ModifyShortcut = function (req, res) {

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
            bl.ModifyShortcut(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in ModifyShortcut' + err);
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

module.exports.DeleteShortcut = function (req, res) {

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
            bl.DeleteShortcut(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in DeleteShortcut' + err);
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

module.exports.RetrieveShortcutsByFilePod = function (req, res) {

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
            bl.RetrieveShortcutsByFilePod(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveShortcutsByFilePod' + err);
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

module.exports.AddTag = function (req, res) {

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
            bl.AddTag(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in AddTag' + err);
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

module.exports.ModifyTag = function (req, res) {

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
            bl.ModifyTag(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in ModifyTag' + err);
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

module.exports.DeleteTag = function (req, res) {

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
            bl.DeleteTag(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in DeleteTag' + err);
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

module.exports.RetrieveTagsByOwnerSecurityUserIDAndObject = function (req, res) {

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
            bl.RetrieveTagsByOwnerSecurityUserIDAndObject(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveTagsByOwnerSecurityUserIDAndObject' + err);
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

module.exports.RetrieveAllPreUsedTagsByOwnerSecurityUserID = function (req, res) {

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
            bl.RetrieveAllPreUsedTagsByOwnerSecurityUserID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveAllPreUsedTagsByOwnerSecurityUserID' + err);
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

module.exports.StartFileUpload = function (req, res) {

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
            bl.StartFileUpload(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in StartFileUpload' + err);
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

module.exports.UploadFilePart = function (req, res) {

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
            bl.UploadFilePart(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in UploadFilePart' + err);
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

module.exports.FlagFileUploadComplete = function (req, res) {

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
            bl.FlagFileUploadComplete(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in FlagFileUploadComplete' + err);
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

module.exports.RetrieveExternalFileIDByPodFileID = function (req, res) {

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
            bl.RetrieveExternalFileIDByPodFileID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveExternalFileIDByPodFileID' + err);
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

module.exports.RetrieveTopRevisionFilePodIDByExistingPodFileIDFamily = function (req, res) {

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
            bl.RetrieveTopRevisionFilePodIDByExistingPodFileIDFamily(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveTopRevisionFilePodIDByExistingPodFileIDFamily' + err);
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

module.exports.RetrieveAllPodFileRevisions = function (req, res) {

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
            bl.RetrieveAllPodFileRevisions(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveAllPodFileRevisions' + err);
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

module.exports.RetrieveAllPodFileRevisionsForListOfFiles = function (req, res) {

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
            bl.RetrieveAllPodFileRevisionsForListOfFiles(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveAllPodFileRevisionsForListOfFiles' + err);
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


module.exports.StartFileDownload = function (req, res) {

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
            bl.StartFileDownload(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in StartFileDownload' + err);
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

module.exports.DownloadFilePart = function (req, res) {

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
            bl.DownloadFilePart(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in DownloadFilePart' + err);
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

module.exports.RenameFile = function (req, res) {

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
            bl.RenameFile(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RenameFile' + err);
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

module.exports.DeleteFile = function (req, res) {

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
            bl.DeleteFile(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in DeleteFile' + err);
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

module.exports.MoveFileToNewParentFolder = function (req, res) {

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
            bl.MoveFileToNewParentFolder(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in MoveFileToNewParentFolder' + err);
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

module.exports.RetrieveAllPodFileSharesByOwnerSecurityID = function (req, res) {

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
            bl.RetrieveAllPodFileSharesByOwnerSecurityID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveAllPodFileSharesByOwnerSecurityID' + err);
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

module.exports.RetrieveAllPodFileSharesByPodID = function (req, res) {

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
            bl.RetrieveAllPodFileSharesByPodID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveAllPodFileSharesByPodID' + err);
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

module.exports.RetrievePodFileShareByPodFileID = function (req, res) {

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
            bl.RetrievePodFileShareByPodFileID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrievePodFileShareByPodFileID' + err);
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

module.exports.RetrievePodFileShareByPodFileShareID = function (req, res) {

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
            bl.RetrievePodFileShareByPodFileShareID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrievePodFileShareByPodFileShareID' + err);
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


module.exports.IsAlwaysHighestRevisionForPodFileID = function (req, res) {

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
            bl.IsAlwaysHighestRevisionForPodFileID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in IsAlwaysHighestRevisionForPodFileID' + err);
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

module.exports.AddPodFileShare = function (req, res) {

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
            bl.AddPodFileShare(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in AddPodFileShare' + err);
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

module.exports.ModifyPodFileShare = function (req, res) {

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
            bl.ModifyPodFileShare(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in ModifyPodFileShare' + err);
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

module.exports.DeletePodFileShare = function (req, res) {

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
            bl.DeletePodFileShare(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in DeletePodFileShare' + err);
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

module.exports.RetrieveAllPodFolderSharesByOwnerSecurityID = function (req, res) {

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
            bl.RetrieveAllPodFolderSharesByOwnerSecurityID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveAllPodFolderSharesByOwnerSecurityID' + err);
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

module.exports.RetrieveAllPodFolderSharesByPodID = function (req, res) {

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
            bl.RetrieveAllPodFolderSharesByPodID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveAllPodFolderSharesByPodID' + err);
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

module.exports.RetrievePodFolderShareByPodFolderID = function (req, res) {

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
            bl.RetrievePodFolderShareByPodFolderID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrievePodFolderShareByPodFolderID' + err);
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

module.exports.RetrievePodFolderShareByPodFolderShareID = function (req, res) {

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
            bl.RetrievePodFolderShareByPodFolderShareID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrievePodFolderShareByPodFolderShareID' + err);
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

module.exports.AddPodFolderShare = function (req, res) {

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
            bl.AddPodFolderShare(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in AddPodFolderShare' + err);
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

module.exports.ModifyPodFolderShare = function (req, res) {

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
            bl.ModifyPodFolderShare(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in ModifyPodFolderShare' + err);
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

module.exports.DeletePodFolderShare = function (req, res) {

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
            bl.DeletePodFolderShare(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in DeletePodFolderShare' + err);
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

module.exports.IsPodFolderShareUsernameInUse = function (req, res) {

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
            bl.IsPodFolderShareUsernameInUse(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in IsPodFolderShareUsernameInUse' + err);
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

module.exports.RetrieveAllPodFolderImportsByOwnerSecurityID = function (req, res) {

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
            bl.RetrieveAllPodFolderImportsByOwnerSecurityID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveAllPodFolderImportsByOwnerSecurityID' + err);
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


module.exports.RetrieveAllPodFolderImportsByPodID = function (req, res) {

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
            bl.RetrieveAllPodFolderImportsByPodID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveAllPodFolderImportsByPodID' + err);
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

module.exports.RetrievePodFolderImportByPodFolderID = function (req, res) {

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
            bl.RetrievePodFolderImportByPodFolderID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrievePodFolderImportByPodFolderID' + err);
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

module.exports.RetrievePodFolderImportByPodFolderImportID = function (req, res) {

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
            bl.RetrievePodFolderImportByPodFolderImportID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrievePodFolderImportByPodFolderImportID' + err);
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

module.exports.AddPodFolderImport = function (req, res) {

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
            bl.AddPodFolderImport(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in AddPodFolderImport' + err);
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

module.exports.ModifyPodFolderImport = function (req, res) {

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
            bl.ModifyPodFolderImport(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in ModifyPodFolderImport' + err);
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

module.exports.DeletePodFolderImport = function (req, res) {

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
            bl.DeletePodFolderImport(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveAllPodFolderSharesByOwnerSecurityID' + err);
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

module.exports.IsPodFolderImportUsernameInUse = function (req, res) {

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
            bl.IsPodFolderImportUsernameInUse(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in IsPodFolderImportUsernameInUse' + err);
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

module.exports.RetrieveAllPodFileShortcutsBySecurityUserID = function (req, res) {

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
            bl.RetrieveAllPodFileShortcutsBySecurityUserID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveAllPodFileShortcutsBySecurityUserID' + err);
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

module.exports.RetrievePodFileShortcutByPodFileShortcutID = function (req, res) {

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
            bl.RetrievePodFileShortcutByPodFileShortcutID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrievePodFileShortcutByPodFileShortcutID' + err);
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

module.exports.AddPodFileShortcut = function (req, res) {

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
            bl.AddPodFileShortcut(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in AddPodFileShortcut' + err);
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

module.exports.ModifyPodFileShortcutName = function (req, res) {

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
            bl.ModifyPodFileShortcutName(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in ModifyPodFileShortcutName' + err);
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

module.exports.DeletePodFileShortcut = function (req, res) {

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
            bl.DeletePodFileShortcut(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in DeletePodFileShortcut' + err);
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

module.exports.RetrieveAllPodFolderShortcutsBySecurityUserID = function (req, res) {

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
            bl.RetrieveAllPodFolderShortcutsBySecurityUserID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveAllPodFolderShortcutsBySecurityUserID' + err);
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

module.exports.RetrievePodFolderShortcutByPodFolderShortcutID = function (req, res) {

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
            bl.RetrievePodFolderShortcutByPodFolderShortcutID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrievePodFolderShortcutByPodFolderShortcutID' + err);
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

module.exports.AddPodFolderShortcut = function (req, res) {

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
            bl.AddPodFolderShortcut(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in AddPodFolderSortcut' + err);
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

module.exports.ModifyPodFolderShortcutName = function (req, res) {

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
            bl.ModifyPodFolderShortcutName(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in ModifyPodFolderShortcutName' + err);
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

module.exports.DeletePodFolderShortcut = function (req, res) {

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
            bl.DeletePodFolderShortcut(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in DeletePodFoldeShortcut' + err);
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

module.exports.SearchForFiles = function (req, res) {

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
            bl.SearchForFiles(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in SearchForFiles' + err);
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

module.exports.SearchForFolders = function (req, res) {

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
            bl.SearchForFolders(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in SearchForFolders' + err);
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

module.exports.RetrievePodByFolderID = function (req, res) {

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
            bl.RetrievePodByFolderID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrievePodByFolderID' + err);
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

module.exports.insertRootFolder = function (req, res) {

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
            bl.insertRootFolder(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in insertRootFolder' + err);
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

module.exports.insertFolderAboveExistingFolder = function (req, res) {

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
            bl.insertFolderAboveExistingFolder(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in insertFolderAboveExistingFolder' + err);
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

module.exports.insertFolderBelowExistingFolder = function (req, res) {

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
            bl.insertFolderBelowExistingFolder(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in insertFolderBelowExistingFolder' + err);
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

module.exports.insertFolderChildOfExistingFolder = function (req, res) {

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
            bl.insertFolderChildOfExistingFolder(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in insertFolderChildOfExistingFolder' + err);
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

module.exports.moveFolderDownOneNode = function (req, res) {

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
            bl.moveFolderDownOneNode(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in moveFolderDownOneNode' + err);
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

module.exports.moveFolderUpOneNode = function (req, res) {

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
            bl.moveFolderUpOneNode(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in moveFolderUpOneNode' + err);
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

module.exports.moveFolderToParent = function (req, res) {

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
            bl.moveFolderToParent(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in moveFolderToParent' + err);
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

module.exports.moveFolderUnderExistingChild = function (req, res) {

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
            bl.moveFolderUnderExistingChild(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in moveFolderUnderExistingChild' + err);
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

module.exports.deleteSoftFromTreeFolder = function (req, res) {

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
            bl.deleteSoftFromTreeFolder(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in deleteSoftFromTreeFolder' + err);
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

module.exports.deleteHardFromTreeFolder = function (req, res) {

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
            bl.deleteHardFromTreeFolder(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in deleteHardFromTreeFolder' + err);
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

module.exports.RetrieveTreeIDByFolderID = function (req, res) {

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
            bl.RetrieveTreeIDByFolderID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveTreeIDByFolderID' + err);
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

module.exports.RetrieveFolderTree = function (req, res) {

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
            bl.RetrieveFolderTree(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveFolderTree' + err);
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

module.exports.retrieveAllChildFoldersByFolderID = function (req, res) {

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
            bl.retrieveAllChildFoldersByFolderID(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in retrieveAllChildFoldersByFolderID' + err);
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

module.exports.RetrieveFolderByFolderId = function (req, res) {

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
            bl.RetrieveFolderByFolderId(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveFolderByFolderId' + err);
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

module.exports.RetrieveFileCountUnderParentFolders = function (req, res) {

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
            bl.RetrieveFileCountUnderParentFolders(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RetrieveFileCountUnderParentFolders' + err);
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

module.exports.RenameFolder = function (req, res) {

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
            bl.RenameFolder(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in RenameFolder' + err);
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

module.exports.LogSystemMessage = function (req, res) {

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
            bl.LogSystemMessage(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in LogSystemMessage' + err);
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

module.exports.moveFolderToNewParent = function (req, res) {

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
            bl.moveFolderToNewParent(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in moveFolderToNewParent' + err);
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

module.exports.CheckFileIntegrity = function (req, res) {

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
            bl.CheckFileIntegrity(jsonObjectReceived, function (err, result, outData) {

                if (err) {
                    console.log('error in CheckFileIntegrity' + err);
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

module.exports.loadRoutes = function(app, ajaj) {
    app.post('/ajaj/IsCurrentClientVersionValid', ajaj.IsCurrentClientVersionValid);
    app.post('/ajaj/ActivateService', ajaj.ActivateService);
    app.post('/ajaj/DeactivateService', ajaj.DeactivateService);
    app.post('/ajaj/LoginSystemUser', ajaj.LoginSystemUser);
    app.post('/ajaj/IsHandleInUse', ajaj.IsHandleInUse);
    app.post('/ajaj/RetrieveSecurityUserHandle', ajaj.RetrieveSecurityUserHandle);
    app.post('/ajaj/SetSecurityUserHandle', ajaj.SetSecurityUserHandle);
    app.post('/ajaj/RetrieveSecurityUserIDByHandle', ajaj.RetrieveSecurityUserIDByHandle);
    app.post('/ajaj/AddFilePod', ajaj.AddFilePod);
    app.post('/ajaj/ModifyFilePod', ajaj.ModifyFilePod);
    app.post('/ajaj/DeleteFilePod', ajaj.DeleteFilePod);
    app.post('/ajaj/RetrieveFilePodsByOwnerSecurityUserID', ajaj.RetrieveFilePodsByOwnerSecurityUserID);
    app.post('/ajaj/RetrieveFilePodsSharedWithMe', ajaj.RetrieveFilePodsSharedWithMe);
    app.post('/ajaj/RetrieveFilePodsArchived', ajaj.RetrieveFilePodsArchived);
    app.post('/ajaj/ArchiveFilePod', ajaj.ArchiveFilePod);
    app.post('/ajaj/UnarchiveFilePod', ajaj.UnarchiveFilePod);
    app.post('/ajaj/RetrieveFilePodRootFolder', ajaj.RetrieveFilePodRootFolder);
    app.post('/ajaj/CreateFilePodRootFolder', ajaj.CreateFilePodRootFolder);
    app.post('/ajaj/RetrieveFilePodInformation', ajaj.RetrieveFilePodInformation);
    app.post('/ajaj/RetrieveFilePodFilesByParentFolderID', ajaj.RetrieveFilePodFilesByParentFolderID);
    app.post('/ajaj/RetrievePodFileByPodFileID', ajaj.RetrievePodFileByPodFileID);
    app.post('/ajaj/RetrieveFilePodSecurityUserAccess', ajaj.RetrieveFilePodSecurityUserAccess);
    app.post('/ajaj/GrantHandleAccessToFilePod', ajaj.GrantHandleAccessToFilePod);
    app.post('/ajaj/RevokeHandleAccessToFilePod', ajaj.RevokeHandleAccessToFilePod);
    app.post('/ajaj/RetrieveSecurityUserAccessLevelToFilePod', ajaj.RetrieveSecurityUserAccessLevelToFilePod);
    app.post('/ajaj/SetHandleWritePermissionsToFilePod', ajaj.SetHandleWritePermissionsToFilePod);
    app.post('/ajaj/LockFilePodForEditing', ajaj.LockFilePodForEditing);
    app.post('/ajaj/UnlockFilePod', ajaj.UnlockFilePod);
    app.post('/ajaj/IsFilePodLocked', ajaj.IsFilePodLocked);
    app.post('/ajaj/GetLastFilePodLockTime', ajaj.GetLastFilePodLockTime);
    app.post('/ajaj/UpdatePodLastChangeTime', ajaj.UpdatePodLastChangeTime);
    app.post('/ajaj/RetrievePodLastChangeTime', ajaj.RetrievePodLastChangeTime);
    app.post('/ajaj/AddShortcut', ajaj.AddShortcut);
    app.post('/ajaj/ModifyShortcut', ajaj.ModifyShortcut);
    app.post('/ajaj/DeleteShortcut', ajaj.DeleteShortcut);
    app.post('/ajaj/RetrieveShortcutsByFilePod', ajaj.RetrieveShortcutsByFilePod);
    app.post('/ajaj/AddTag', ajaj.AddTag);
    app.post('/ajaj/ModifyTag', ajaj.ModifyTag);
    app.post('/ajaj/DeleteTag', ajaj.DeleteTag);
    app.post('/ajaj/RetrieveTagsByOwnerSecurityUserIDAndObject', ajaj.RetrieveTagsByOwnerSecurityUserIDAndObject);
    app.post('/ajaj/RetrieveAllPreUsedTagsByOwnerSecurityUserID', ajaj.RetrieveAllPreUsedTagsByOwnerSecurityUserID);
    app.post('/ajaj/StartFileUpload', ajaj.StartFileUpload);
    app.post('/ajaj/UploadFilePart', ajaj.UploadFilePart);
    app.post('/ajaj/FlagFileUploadComplete', ajaj.FlagFileUploadComplete);
    app.post('/ajaj/RetrieveExternalFileIDByPodFileID', ajaj.RetrieveExternalFileIDByPodFileID);
    app.post('/ajaj/RetrieveTopRevisionFilePodIDByExistingPodFileIDFamily', ajaj.RetrieveTopRevisionFilePodIDByExistingPodFileIDFamily);
    app.post('/ajaj/RetrieveAllPodFileRevisions', ajaj.RetrieveAllPodFileRevisions);
    app.post('/ajaj/RetrieveAllPodFileRevisionsForListOfFiles', ajaj.RetrieveAllPodFileRevisionsForListOfFiles);
    app.post('/ajaj/StartFileDownload', ajaj.StartFileDownload);
    app.post('/ajaj/DownloadFilePart', ajaj.DownloadFilePart);
    app.post('/ajaj/RenameFile', ajaj.RenameFile);
    app.post('/ajaj/DeleteFile', ajaj.DeleteFile);
    app.post('/ajaj/MoveFileToNewParentFolder', ajaj.MoveFileToNewParentFolder);
    app.post('/ajaj/RetrieveAllPodFileSharesByOwnerSecurityID', ajaj.RetrieveAllPodFileSharesByOwnerSecurityID);
    app.post('/ajaj/RetrieveAllPodFileSharesByPodID', ajaj.RetrieveAllPodFileSharesByPodID);
    app.post('/ajaj/RetrievePodFileShareByPodFileID', ajaj.RetrievePodFileShareByPodFileID);
    app.post('/ajaj/RetrievePodFileShareByPodFileShareID', ajaj.RetrievePodFileShareByPodFileShareID);
    app.post('/ajaj/IsAlwaysHighestRevisionForPodFileID', ajaj.IsAlwaysHighestRevisionForPodFileID);
    app.post('/ajaj/AddPodFileShare', ajaj.AddPodFileShare);
    app.post('/ajaj/ModifyPodFileShare', ajaj.ModifyPodFileShare);
    app.post('/ajaj/DeletePodFileShare', ajaj.DeletePodFileShare);

    app.post('/ajaj/RetrieveAllPodFolderSharesByOwnerSecurityID', ajaj.RetrieveAllPodFolderSharesByOwnerSecurityID);
    app.post('/ajaj/RetrieveAllPodFolderSharesByPodID', ajaj.RetrieveAllPodFolderSharesByPodID);
    app.post('/ajaj/RetrievePodFolderShareByPodFolderID', ajaj.RetrievePodFolderShareByPodFolderID);
    app.post('/ajaj/RetrievePodFolderShareByPodFolderShareID', ajaj.RetrievePodFolderShareByPodFolderShareID);
    app.post('/ajaj/AddPodFolderShare', ajaj.AddPodFolderShare);
    app.post('/ajaj/ModifyPodFolderShare', ajaj.ModifyPodFolderShare);
    app.post('/ajaj/DeletePodFolderShare', ajaj.DeletePodFolderShare);
    app.post('/ajaj/IsPodFolderShareUsernameInUse', ajaj.IsPodFolderShareUsernameInUse);

    app.post('/ajaj/RetrieveAllPodFolderImportsByOwnerSecurityID', ajaj.RetrieveAllPodFolderImportsByOwnerSecurityID);
    app.post('/ajaj/RetrieveAllPodFolderImportsByPodID', ajaj.RetrieveAllPodFolderImportsByPodID);
    app.post('/ajaj/RetrievePodFolderImportByPodFolderID', ajaj.RetrievePodFolderImportByPodFolderID);
    app.post('/ajaj/RetrievePodFolderImportByPodFolderImportID', ajaj.RetrievePodFolderImportByPodFolderImportID);
    app.post('/ajaj/AddPodFolderImport', ajaj.AddPodFolderImport);
    app.post('/ajaj/ModifyPodFolderImport', ajaj.ModifyPodFolderImport);
    app.post('/ajaj/DeletePodFolderImport', ajaj.DeletePodFolderImport);
    app.post('/ajaj/IsPodFolderImportUsernameInUse', ajaj.IsPodFolderImportUsernameInUse);

    app.post('/ajaj/RetrieveAllPodFileShortcutsBySecurityUserID', ajaj.RetrieveAllPodFileShortcutsBySecurityUserID);
    app.post('/ajaj/RetrievePodFileShortcutByPodFileShortcutID', ajaj.RetrievePodFileShortcutByPodFileShortcutID);
    app.post('/ajaj/AddPodFileShortcut', ajaj.AddPodFileShortcut);
    app.post('/ajaj/ModifyPodFileShortcutName', ajaj.ModifyPodFileShortcutName);
    app.post('/ajaj/DeletePodFileShortcut', ajaj.DeletePodFileShortcut);
    app.post('/ajaj/RetrieveAllPodFolderShortcutsBySecurityUserID', ajaj.RetrieveAllPodFolderShortcutsBySecurityUserID);
    app.post('/ajaj/RetrievePodFolderShortcutByPodFolderShortcutID', ajaj.RetrievePodFolderShortcutByPodFolderShortcutID);
    app.post('/ajaj/AddPodFolderShortcut', ajaj.AddPodFolderShortcut);
    app.post('/ajaj/ModifyPodFolderShortcutName', ajaj.ModifyPodFolderShortcutName);
    app.post('/ajaj/DeletePodFolderShortcut', ajaj.DeletePodFolderShortcut);
    app.post('/ajaj/SearchForFiles', ajaj.SearchForFiles);
    app.post('/ajaj/SearchForFolders', ajaj.SearchForFolders);
    app.post('/ajaj/RetrievePodByFolderID', ajaj.RetrievePodByFolderID);
    app.post('/ajaj/InsertRootFolder', ajaj.insertRootFolder);
    app.post('/ajaj/InsertFolderAboveExistingFolder', ajaj.insertFolderAboveExistingFolder);
    app.post('/ajaj/InsertFolderBelowExistingFolder', ajaj.insertFolderBelowExistingFolder);
    app.post('/ajaj/InsertFolderChildOfExistingFolder', ajaj.insertFolderChildOfExistingFolder);
    app.post('/ajaj/MoveFolderDownOneNode', ajaj.moveFolderDownOneNode);
    app.post('/ajaj/MoveFolderUpOneNode', ajaj.moveFolderUpOneNode);
    app.post('/ajaj/MoveFolderToParent', ajaj.moveFolderToParent);
    app.post('/ajaj/MoveFolderUnderExistingChild', ajaj.moveFolderUnderExistingChild);
    app.post('/ajaj/DeleteFolder', ajaj.deleteSoftFromTreeFolder);
    app.post('/ajaj/DeleteFolderWithAllChildren', ajaj.deleteHardFromTreeFolder);
    app.post('/ajaj/RetrieveTreeIDByFolderID', ajaj.RetrieveTreeIDByFolderID);
    app.post('/ajaj/RetrieveFolderTree', ajaj.RetrieveFolderTree);
    app.post('/ajaj/RetrieveAllChildFoldersByFolderID', ajaj.retrieveAllChildFoldersByFolderID);
    app.post('/ajaj/RetrieveFolderByFolderId', ajaj.RetrieveFolderByFolderId);
    app.post('/ajaj/RetrieveFileCountUnderParentFolders', ajaj.RetrieveFileCountUnderParentFolders);
    app.post('/ajaj/renameFolder', ajaj.RenameFolder);
    app.post('/ajaj/LogSystemMessage', ajaj.LogSystemMessage);
    app.post('/ajaj/moveFolderToNewParent', ajaj.moveFolderToNewParent);
    app.post('/ajaj/CheckFileIntegrity', ajaj.CheckFileIntegrity);
};