
var mDataAccessLayerXPooled = require('./dalxpooled');
var async = require('async');
var requestenhanced = require('request-enhanced');
var config = require('./config');

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
        timeout: 250000
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

businessLogic.prototype.IsCurrentClientVersionValid = function (inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    dataAccessLayerX.openConnection(function(err) {
        if (!err) {
            dataAccessLayerX.executeQuery(
                ' SELECT * FROM CompatibleClients WHERE VersionMajor = ' + inData.majorversion +
                ' AND VersionMinor = ' + inData.minorversion,
                function (err, rows, fields) {

                    dataAccessLayerX.closeConnection();

                    if (rows.length > 0) {
                        if (rows[0].IsSupported == 1) {
                            cb(err, true, true);
                        }
                        else {
                            cb(err, true, false);
                        }
                    }
                    else {
                        cb(err, false, null);
                    }
                });
        }
        else {
            console.log(err);
            console.trace();
            cb(err, false, null);
        }
    });
};

businessLogic.prototype.ActivateService = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {

                var sqlQueryStatement = "SELECT * FROM SecurityUsers WHERE ExternalSecurityUserId = ";
                sqlQueryStatement += inData.securityuserid;

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {

                    if (rows.length == 0) {
                        var securityUser = {};
                        securityUser.ExternalSecurityUserId = inData.securityuserid;
                        securityUser.IsEnabled = 1;

                        dataAccessLayerX.addSecurityUser(securityUser, function(err, result) {
                            cb(err, null);
                        });
                    }
                    else {
                        var sqlStatement = "UPDATE SecurityUsers Set IsEnabled = 1 WHERE ExternalSecurityUserId = ";
                        sqlStatement += inData.securityuserid;

                        dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                            cb(err, null);
                        });
                    }
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.DeactivateService = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlStatement = "UPDATE SecurityUsers Set IsEnabled = 0 WHERE ExternalSecurityUserId = ";
                sqlStatement += inData.securityuserid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.LoginSystemUser = function (inData, cb) { // forward to security serice
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    var users = null;

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend.apiusername = config.securityserviceapiusername;
                objectToSend.apipassword = config.securityserviceapipassword;

                objectToSend.username = inData.username;
                objectToSend.password = inData.password;

                self.postAjaj(config.securityserviceapiurl + '/ajaj/AuthenticateSystemUser', objectToSend, function(err, res, body) {
                    var jsonObjectReceived = JSON.parse(body);

                    if (jsonObjectReceived.result == true) {
                        if (jsonObjectReceived.outData.loginresult == false) {
                            jsonObjectToReturn.loginresult = jsonObjectReceived.outData.loginresult;
                            cb('unable to login to security service', null);
                        }
                        else {
                            jsonObjectToReturn.loginresult = jsonObjectReceived.outData.loginresult;
                            jsonObjectToReturn.securityuserid = jsonObjectReceived.outData.securityuserid;
                            cb(null, null);
                        }
                    } else {
                        err = 'unable to login to security service';
                        jsonObjectToReturn.loginresult = false;
                        cb(err, null);
                    }
                });
            },
            function (cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlWhereClause = " ExternalSecurityUserId = " + jsonObjectToReturn.securityuserid + ' AND IsEnabled = 1 ';

                dataAccessLayerX.retrieveWithWhereClauseSecurityUser(sqlWhereClause, function(err, rows, fields) {
                    if (!err) {
                        dataAccessLayerX.closeConnection();

                        if (rows.length > 0) {
                            cb(null, null);
                        }
                        else {
                            cb('invalid is file share user', null);
                        }
                    }
                });
            },
            function (cb) {
                var objectToSend = {};

                objectToSend.apiusername = config.securityserviceapiusername;
                objectToSend.apipassword = config.securityserviceapipassword;

                objectToSend.SecurityUserInteraction =  { };

                objectToSend.SecurityUserInteraction.SystemComponentId = 5;
                objectToSend.SecurityUserInteraction.SecurityUserId = jsonObjectToReturn.securityuserid;
                objectToSend.SecurityUserInteraction.SecurityUserInteractionTypeId = 21;
                objectToSend.SecurityUserInteraction.Occurred = new Date().toISOString().slice(0, 19).replace('T', ' ');

                self.postAjaj(config.securityserviceapiurl + '/ajaj/LogSecurityUserInteraction', objectToSend, function(err, res, body) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err === true) {
                cb(null, true, jsonObjectToReturn);
            }
            else if (err) {

                if (err != 'unable to login to security service') {
                    console.log(err);
                    console.trace();

                    cb(err, false, jsonObjectToReturn);
                }
                else {
                    cb(null, true, jsonObjectToReturn);
                }

            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.IsHandleInUse = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT * FROM nicknames WHERE Nickname = '" + inData.handle + "'";

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.count = rows.length;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};


businessLogic.prototype.RetrieveSecurityUserHandle = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT * FROM nicknames WHERE SecurityUserID = " + inData.securityuserid;

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.nicknames = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.SetSecurityUserHandle = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT * FROM nicknames WHERE SecurityUserID = " + inData.securityuserid;

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    if (!err) {
                        if (rows.length > 0) {
                            var sqlStatement = "UPDATE nicknames SET Nickname = '" + inData.handle + "' WHERE SecurityUserID = " + inData.securityuserid;

                            dataAccessLayerX.executeStatement(sqlStatement, function (err, rows, fields) {
                                cb(err, null);
                            });
                        }
                        else {
                            var sqlStatement = "INSERT INTO nicknames (Nickname, SecurityUserID) values ('" + inData.handle + "', " + inData.securityuserid + ")";

                            dataAccessLayerX.executeStatement(sqlStatement, function (err, rows, fields) {
                                cb(err, null);
                            });
                        }
                    }
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveSecurityUserIDByHandle = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT * FROM nicknames WHERE Nickname = '" + inData.handle + "' ";

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.securityuserid = rows[0].SecurityUserID;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.AddFilePod = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var filePod = {};

                filePod.PodID = -1;
                filePod.OwnerSecurityUserID = inData.securityuserid;
                filePod.IsDeleted = 0;
                filePod.Created = new Date().toISOString().slice(0, 19).replace('T', ' ');
                filePod.Name = inData.name;
                filePod.Description = inData.description;
                filePod.IsLocked = 0;
                filePod.LastLockTime = null;
                filePod.LockedBySecurityUserID = null;
                filePod.LastChangeTime = null;
                filePod.IsArchived = 0;

                dataAccessLayerX.addPod(filePod, function(err, result) {
                    jsonObjectToReturn.newpodid = result.insertId;
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.ModifyFilePod = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlStatement = "UPDATE pods SET Name='" + inData.name + "', Description='" + inData.description + "'"
                sqlStatement += " WHERE PodID = " + inData.podid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.DeleteFilePod = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlStatement = "UPDATE pods SET IsDeleted = 1 WHERE PodID = " + inData.podid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveFilePodsByOwnerSecurityUserID = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT * FROM Pods WHERE OwnerSecurityUserID = ";
                sqlQueryStatement += inData.securityuserid;
                sqlQueryStatement += " AND IsDeleted = 0 AND IsArchived = 0 ";
                sqlQueryStatement += " ORDER BY Name ";

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    jsonObjectToReturn.pods = rows;
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveFilePodsSharedWithMe = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT * FROM podsecurityuseraccesses psua INNER JOIN pods p ON p.PodID = psua.PodID  WHERE SecurityUserID = ";
                sqlQueryStatement += inData.securityuserid;
                sqlQueryStatement += " AND p.IsDeleted = 0 ";
                sqlQueryStatement += " ORDER BY Name ";

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    jsonObjectToReturn.pods = rows;
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveFilePodsArchived = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT * FROM Pods WHERE OwnerSecurityUserID = ";
                sqlQueryStatement += inData.securityuserid;
                sqlQueryStatement += " AND IsDeleted = 0 AND IsArchived = 1 ";
                sqlQueryStatement += " ORDER BY Name ";

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    jsonObjectToReturn.pods = rows;
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.ArchiveFilePod = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlStatement = "UPDATE pods SET IsArchived = 1 WHERE PodID = " + inData.podid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.UnarchiveFilePod = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlStatement = "UPDATE pods SET IsArchived = 0 WHERE PodID = " + inData.podid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveFilePodInformation = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT * FROM pods WHERE PodID = ";
                sqlQueryStatement += inData.podid;

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    jsonObjectToReturn.pods = rows;
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT SUM(FileSizeInBytes) FROM podfiles WHERE PodID = ";
                sqlQueryStatement += inData.podid;

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    jsonObjectToReturn.datasize = rows;
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT COUNT(*) FROM podfiles WHERE PodID = ";
                sqlQueryStatement += inData.podid;

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    jsonObjectToReturn.countfiles = rows;
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT FolderID FROM podfolders WHERE PodID = ";
                sqlQueryStatement += inData.podid;

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    if (rows.length == 0) { // we are not attached to a remote folder yet for this pod
                        jsonObjectToReturn.countfolders = 0;
                        cb(err, null);
                    }
                    else {
                        var folderid = rows[0]["FolderID"];

                        var objectToSend = {};

                        objectToSend.apiusername = config.treesserviceapiusername;
                        objectToSend.apipassword = config.treesserviceapipassword;

                        objectToSend.treeid = folderid;

                        self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveTreeFolderCount', objectToSend, function (err, res, body) {
                            if (!err) {
                                var jsonReturnObject = JSON.parse(body);
                                jsonObjectToReturn.countfolders = jsonReturnObject.outData.foldercount;
                            }

                            cb(err, null);
                        });
                    }
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveFilePodFilesByParentFolderID = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlSelectStatement = "SELECT pf.PodFileID, pf.Revision, pf.Filename, pf.FileSizeInBytes, pf.Created, pf.ExternalFileID, pf.PodParentFolderID FROM podfiles pf JOIN ";
                sqlSelectStatement += " (SELECT PodFileID, MAX(Revision) AS Revision, Filename, FileSizeInBytes, Created, ExternalFileID, PodParentFolderID FROM podfiles ";
                sqlSelectStatement += " WHERE PodParentFolderID = " + inData.parentfolderid +  " AND UploadCompleted IS NOT NULL ";
                sqlSelectStatement += " AND PodID = " + inData.podid + " AND Deleted IS NULL GROUP BY Filename)  tbl ";
                sqlSelectStatement += " ON tbl.Revision = pf.Revision AND tbl.Filename = pf.Filename ";
                sqlSelectStatement += " WHERE Deleted IS NULL AND UploadCompleted IS NOT NULL AND pf.PodParentFolderID = " + inData.parentfolderid
                sqlSelectStatement += " AND pf.PodID = " + inData.podid;
                sqlSelectStatement += " GROUP BY Filename ";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfolderfiles = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrievePodFileByPodFileID = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlSelectStatement = "SELECT * FROM podfiles WHERE PodFileID = " + inData.podfileid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfile = rows[0];
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveFilePodSecurityUserAccess = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlSelectStatement = "SELECT * FROM podsecurityuseraccesses psua INNER JOIN nicknames n ON psua.SecurityUserID = n.SecurityUserID WHERE podid = " + inData.podid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podsecurityuseraccesses = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.GrantHandleAccessToFilePod = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlSelectStatement = "SELECT * FROM podsecurityuseraccesses psua WHERE PodID = " + inData.podid;
                sqlSelectStatement += " AND SecurityUserID = " + inData.securityuserid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        if (rows.length == 0) {
                            var PodSecurityUserAccess = { };

                            PodSecurityUserAccess.PodID = inData.podid;
                            PodSecurityUserAccess.SecurityUserID = inData.securityuserid;
                            PodSecurityUserAccess.AccessGiven = new Date().toISOString().slice(0, 19).replace('T', ' ');
                            PodSecurityUserAccess.CanWrite = 0;

                            dataAccessLayerX.addPodSecurityUserAccess(PodSecurityUserAccess, function(err, result) {
                                jsonObjectToReturn.newid = result.insertId;
                                cb(err, null);
                            });
                        }
                        else {
                            cb(err, null);
                        }
                    }
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RevokeHandleAccessToFilePod = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlStatement = "DELETE FROM podsecurityuseraccesses WHERE PodID = " + inData.podid;
                sqlStatement += " AND SecurityUserID = " + inData.securityuserid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveSecurityUserAccessLevelToFilePod = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlSelectStatement = "SELECT CanWrite FROM podsecurityuseraccesses psua INNER JOIN nicknames n ON psua.SecurityUserID = n.SecurityUserID WHERE podid = " + inData.podid;
                sqlSelectStatement += " AND psua.SecurityUserID = " + inData.securityuserid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.canwrite = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.SetHandleWritePermissionsToFilePod = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlStatement = "UPDATE podsecurityuseraccesses SET CanWrite = " + inData.canwrite + " WHERE SecurityUserID = " + inData.securityuserid;
                sqlStatement += " AND PodID = " + inData.podid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.LockFilePodForEditing = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                dataAccessLayerX.startTransaction(function(err, rows, fields) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlStatement = "SELECT * FROM pods WHERE IsLocked = 0 AND PodID = " + inData.podid;
                sqlStatement += " FOR UPDATE ";

                dataAccessLayerX.executeQuery(sqlStatement, function(err, rows, fields) {

                    if (rows.length > 0) {
                        jsonObjectToReturn.locksuccessful = 1;
                    }
                    else {
                        jsonObjectToReturn.locksuccessful = 0;
                    }

                    cb(err, null);
                });

            },
            function(cb) {
                var sqlStatement = "UPDATE pods SET IsLocked = 1, LockedBySecurityUserID = " + inData.securityuserid;
                sqlStatement += ", LastLockTime = '" + new Date().toISOString().slice(0, 19).replace('T', ' ') + "' "
                sqlStatement += " WHERE PodID = " + inData.podid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                dataAccessLayerX.rollbackTransaction(function(err, rows, fields) { });
                dataAccessLayerX.closeConnection();
                cb(err, false, null);
            }
            else {
                dataAccessLayerX.commitTransaction(function(err, rows, fields) {

                    if (err) {
                        dataAccessLayerX.rollbackTransaction(function(err, rows, fields) { });
                        dataAccessLayerX.closeConnection();
                        cb(err, false, null);
                    }
                    else {
                        dataAccessLayerX.closeConnection();
                        cb(null, true, jsonObjectToReturn);
                    }
                });
            }
        }
    );
};

businessLogic.prototype.UnlockFilePod = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlStatement = "UPDATE pods SET IsLocked = 0 ";
                sqlStatement += " WHERE PodID = " + inData.podid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.IsFilePodLocked = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT IsLocked FROM pods WHERE PodID = " + inData.podid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    jsonObjectToReturn.islocked = rows[0]["IsLocked"];
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.GetLastFilePodLockTime = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT * FROM pods WHERE ";
                sqlQueryStatement += " AND PodID = " + inData.podid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    jsonObjectToReturn.pod = rows[0];
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.UpdatePodLastChangeTime = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {

                var changeTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

                var sqlStatement = "UPDATE pods SET LastChangeTime = '" + changeTime;
                sqlStatement += "' WHERE PodID = " + inData.podid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.lastchangetime = changeTime;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrievePodLastChangeTime = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT * FROM pods WHERE ";
                sqlQueryStatement += " PodID = " + inData.podid;

                dataAccessLayerX.executeStatement(sqlQueryStatement, function(err, rows, fields) {
                    if (!err) {
                        if (rows.length > 0) {
                            jsonObjectToReturn.lastchangetime = rows[0].LastChangeTime;
                        }
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};


businessLogic.prototype.RetrieveFilePodRootFolder = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT * FROM podfolders WHERE ";
                sqlQueryStatement += " PodID = " + inData.podid;

                dataAccessLayerX.executeStatement(sqlQueryStatement, function(err, rows, fields) {
                    jsonObjectToReturn.podfolders = rows;
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};


businessLogic.prototype.CreateFilePodRootFolder = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var podFolder = {};

                podFolder.PodID = inData.podid;
                podFolder.FolderID = inData.folderid;
                podFolder.Name = inData.name;

                dataAccessLayerX.addPodFolder(podFolder, function(err, result) {
                    if (!err) {
                        jsonObjectToReturn.podfolderid = result.insertId;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.AddShortcut = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {

            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.ModifyShortcut = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {

            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.DeleteShortcut = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {

            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveShortcutsByFilePod = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {

            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.AddTag = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {

                inData.tag.TagDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
                inData.tag.IsDeleted = 0;

                dataAccessLayerX.addSystemEntityTag(inData.tag, function(err, result) {
                    if (!err) {
                        jsonObjectToReturn.systementitytagid = result.insertId;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.ModifyTag = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                dataAccessLayerX.modifySystemEntityTag(inData.tag, function(err, result) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.DeleteTag = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlStatement = "UPDATE systementitytags SET IsDeleted = 1";
                sqlStatement += " WHERE SystemEntityTagId = " + inData.systementitytagid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveTagsByOwnerSecurityUserIDAndObject = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    var basePodFile = null;
    var podFileIds = [];

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                if (inData.systementitytypeid == 3) {
                    var sqlSelectStatement = " SELECT * FROM podFiles WHERE PodFileID = " + inData.systementityid;

                    dataAccessLayerX.executeQuery(sqlSelectStatement, function (err, rows, fields) {
                        if (!err) {
                            basePodFile = rows[0];
                        }
                        cb(err, null);
                    });
                }
                else {
                    cb(null, null);
                }
            },
            function(cb) {
                if (inData.systementitytypeid == 3) {
                    var sqlSelectStatement = " SELECT * FROM podFiles WHERE Filename = '" + basePodFile.Filename;
                    sqlSelectStatement += "' AND PodParentFolderID = " + basePodFile.PodParentFolderID;

                    dataAccessLayerX.executeQuery(sqlSelectStatement, function (err, rows, fields) {
                        if (!err) {
                            podFileIds = rows;
                        }
                        cb(err, null);
                    });
                }
                else {
                    cb(null, null);
                }
            },
            function(cb) {
                if (inData.systementitytypeid == 2) {
                    var sqlSelectStatement = "SELECT * FROM systementitytags WHERE ";
                    sqlSelectStatement += " SystemEntityTypeID  = " + inData.systementitytypeid;
                    sqlSelectStatement += " AND SystemEntityID = " + inData.systementityid;
                    sqlSelectStatement += " AND OwnerSecurityUserId = " + inData.ownersecurityuserid;
                    sqlSelectStatement += " AND IsDeleted = 0 ";

                    dataAccessLayerX.executeQuery(sqlSelectStatement, function (err, rows, fields) {
                        if (!err) {
                            jsonObjectToReturn.tags = rows;
                        }
                        cb(err, null);
                    });
                }
                else {
                    var inClause = "";

                    for (var i = 0; i < podFileIds.length; i++) {
                        inClause += podFileIds[i].PodFileID;

                        if (i < podFileIds.length - 1) {
                            inClause += ", ";
                        }
                    }

                    var sqlSelectStatement = "SELECT * FROM systementitytags WHERE ";
                    sqlSelectStatement += " SystemEntityTypeID  = " + inData.systementitytypeid;
                    sqlSelectStatement += " AND SystemEntityID IN (" + inData.systementityid;
                    sqlSelectStatement += ") AND OwnerSecurityUserId = " + inData.ownersecurityuserid;
                    sqlSelectStatement += " AND IsDeleted = 0 ";

                    dataAccessLayerX.executeQuery(sqlSelectStatement, function (err, rows, fields) {
                        if (!err) {
                            jsonObjectToReturn.tags = rows;
                        }
                        cb(err, null);
                    });
                }
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveAllPreUsedTagsByOwnerSecurityUserID = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlSelectStatement = "SELECT DISTINCT Tag FROM systementitytags WHERE ";
                sqlSelectStatement += " OwnerSecurityUserId = " + inData.ownersecurityuserid;
                sqlSelectStatement += " AND IsDeleted = 0 ";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.tags = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.StartFileUpload = function (inData, cb) { // forwrd to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};
    var fileid = null;

    async.series([
            function (cb) {
                var objectToSend = {};

                objectToSend.apiusername = config.filestorageserviceapiusername;
                objectToSend.apipassword = config.filestorageserviceapipassword;

                objectToSend.File = {};
                objectToSend.File.Name = inData.filename;
                objectToSend.File.SizeInBytes = inData.filesizeinbytes;

                self.postAjaj(config.filestorageserviceapiurl + '/ajaj/InitializeFileToStore', objectToSend, function(err, res, body) {
                    if (!err) {
                        var jsonReturnObject = JSON.parse(body);
                        fileid = jsonReturnObject.outData;
                        jsonObjectToReturn.fileid = fileid;
                    }

                    cb(err, null);
                });
            },
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {

                podFile = {};

                podFile.PodParentFolderID = inData.folderparentid;
                podFile.PodID = inData.podid;
                podFile.ExternalFileID = fileid;
                podFile.Filename = inData.filename;
                podFile.FileSizeInBytes = inData.filesizeinbytes;
                podFile.Created = new Date().toISOString().slice(0, 19).replace('T', ' ');
                podFile.UploadCompleted = null;
                podFile.Revision = 0;

                dataAccessLayerX.addPodFile(podFile, function(err, result) {
                    if (!err) {
                        jsonObjectToReturn.podfileid = result.insertId;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.UploadFilePart = function (inData, cb) { // forwward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend.apiusername = config.filestorageserviceapiusername;
                objectToSend.apipassword = config.filestorageserviceapipassword;

                objectToSend.fileid = inData.fileid;
                objectToSend.partindex = inData.partindex;
                objectToSend.partcontent = inData.partcontent;
                objectToSend.partoriginalsizeinbytes = inData.partoriginalsizeinbytes;
                objectToSend.partcompressedsizeinbytes = inData.partcompressedsizeinbytes;

                self.postAjaj(config.filestorageserviceapiurl + '/ajaj/StoreFilePart', objectToSend, function(err, res, body) {
                    cb(err, null);
                });
            },
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {

                    if (!err) {
                        var DataTransferLogEntry = {}

                        DataTransferLogEntry.SecurityUserId = inData.securityuserid;
                        DataTransferLogEntry.IsDownload = 0;
                        DataTransferLogEntry.TransferInBytes = inData.partcontent.length;
                        DataTransferLogEntry.TransferDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

                        dataAccessLayerX.addDataTransferLogEntry(DataTransferLogEntry, function (err, result) {
                            dataAccessLayerX.closeConnection();
                            cb(err, null);
                        });
                    }
                    else {
                        cb(err, null);
                    }
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, null);
            }
        }
    );
};

businessLogic.prototype.FlagFileUploadComplete = function (inData, cb) { // forward to file storage service and local
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    var podFileName = '';
    var podParentFolderID = -1;
    var currentMaxRevision = 0;

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT * FROM podfiles WHERE PodFileID = " + inData.podfileid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        var objectToSend = {};

                        objectToSend.apiusername = config.filestorageserviceapiusername;
                        objectToSend.apipassword = config.filestorageserviceapipassword;

                        objectToSend.fileid = rows[0].ExternalFileID;

                        podFileName = rows[0].Filename;
                        podParentFolderID = rows[0].PodParentFolderID;

                        self.postAjaj(config.filestorageserviceapiurl + '/ajaj/SpecifyFileUploadComplete', objectToSend, function (err, res, body) {
                            cb(err, null);
                        });
                    }
                    else {
                        cb(err, null);
                    }
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT MAX(Revision) AS MaxRevision FROM podfiles WHERE Filename = '" + podFileName + "' AND PodParentFolderID = " + podParentFolderID;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        currentMaxRevision = rows[0].MaxRevision;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                currentMaxRevision++;

                dataAccessLayerX.executeStatement("UPDATE podfiles SET UploadCompleted = '" + new Date().toISOString().slice(0, 19).replace('T', ' ') + "', Revision = " + currentMaxRevision +
                ' WHERE PodFileID = ' + inData.podfileid, function(err, rows, fields) {
                    cb(err, null);
                });
            },
            function (cb) {
                var objectToSend = {};

                objectToSend.apiusername = config.securityserviceapiusername;
                objectToSend.apipassword = config.securityserviceapipassword;

                objectToSend.SecurityUserInteraction =  { };

                objectToSend.SecurityUserInteraction.SystemComponentId = 5;
                objectToSend.SecurityUserInteraction.SecurityUserId = inData.securityuserid;
                objectToSend.SecurityUserInteraction.SecurityUserInteractionTypeId = 18;
                objectToSend.SecurityUserInteraction.Occurred = new Date().toISOString().slice(0, 19).replace('T', ' ');

                self.postAjaj(config.securityserviceapiurl + '/ajaj/LogSecurityUserInteraction', objectToSend, function(err, res, body) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(err, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveExternalFileIDByPodFileID = function (inData, cb) { // forward to file storage service and local
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT ExternalFileID FROM podfiles WHERE PodFileID = " + inData.podfileid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.externalfileid = rows[0].ExternalFileID;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(err, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveTopRevisionFilePodIDByExistingPodFileIDFamily = function (inData, cb) { // forward to file storage service and local
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    var Filename = '';
    var PodParentFolderID = -1;

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT Filename, PodParentFolderID FROM podfiles WHERE PodFileID = " + inData.podfileid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        Filename = rows[0].Filename;
                        PodParentFolderID = rows[0].PodParentFolderID;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT PodFileID FROM podfiles WHERE Filename = '" + Filename;
                sqlSelectStatement += "' AND PodParentFolderID = " + PodParentFolderID;
                sqlSelectStatement += " AND Deleted IS NULL AND UploadCompleted IS NOT NULL ";
                sqlSelectStatement += " ORDER BY Revision DESC LIMIT 1;"

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfileid = rows[0].PodFileID;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(err, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveAllPodFileRevisions = function (inData, cb) { // forward to file storage service and local
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT * FROM podfiles WHERE Filename = '" + inData.filename + "' ";
                sqlSelectStatement += " AND PodParentFolderID = " + inData.podparentfolderid;
                sqlSelectStatement += " ORDER BY Revision "

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfilerevisions = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(err, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveAllPodFileRevisionsForListOfFiles = function (inData, cb) { // forward to file storage service and local
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT * FROM ";
                sqlSelectStatement += "(";
                sqlSelectStatement += "    SELECT ";
                sqlSelectStatement += "     pf.PodFileID, ";
                sqlSelectStatement += "    pf.Filename, ";
                sqlSelectStatement += "    pf.Revision, ";
                sqlSelectStatement += "    pf.PodParentFolderID, ";
                sqlSelectStatement += "    pfs.IsAlwaysHighestRevision, ";
                sqlSelectStatement += "    pfs.IsDecommissioned "
                sqlSelectStatement += " FROM podfiles pf LEFT JOIN podfileshares pfs ON ";
                sqlSelectStatement += " pf.PodFileID = pfs.PodFileID ";
                sqlSelectStatement += " WHERE ";

                var inClause = "";

                for (var i = 0; i < inData.filesToPull.length; i++) {

                    inClause += "(Filename = '" + inData.filesToPull[i].Filename + "' AND PodParentFolderID = " + inData.filesToPull[i].PodParentFolderID + ")";

                    if (i < inData.filesToPull.length - 1) {
                        inClause += "OR ";
                    }
                }

                sqlSelectStatement += inClause;

                sqlSelectStatement += " ) tbl ";

                sqlSelectStatement += "WHERE IsAlwaysHighestRevision = 0 AND IsDecommissioned = 0 ";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfilerevisionshares = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(err, true, jsonObjectToReturn);
            }
        }
    );
};


businessLogic.prototype.StartFileDownload = function (inData, cb) { // forward to file storage service
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend.apiusername = config.filestorageserviceapiusername;
                objectToSend.apipassword = config.filestorageserviceapipassword;

                objectToSend.fileid = inData.fileid;

                self.postAjaj(config.filestorageserviceapiurl + '/ajaj/RetrieveFilePartCount', objectToSend, function (err, res, body) {
                    if (!err) {
                        jsonObjectToReturn.filepartcount = JSON.parse(body).outData.filepartcount;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.DownloadFilePart = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend.apiusername = config.filestorageserviceapiusername;
                objectToSend.apipassword = config.filestorageserviceapipassword;

                objectToSend.fileid = inData.fileid;
                objectToSend.partindex = inData.partindex;

                self.postAjaj(config.filestorageserviceapiurl + '/ajaj/RetrieveFilePartByFileIdAndPartIndex', objectToSend, function(err, res, body) {
                    if (!err) {
                        jsonObjectToReturn.partcontent = JSON.parse(body).outData.partcontent;

                        dataAccessLayerX.openConnection(function(err) {

                            if (!err) {
                                var DataTransferLogEntry = {};

                                DataTransferLogEntry.SecurityUserId = inData.securityuserid;
                                DataTransferLogEntry.IsDownload = 1;
                                DataTransferLogEntry.TransferInBytes = jsonObjectToReturn.partcontent.length;
                                DataTransferLogEntry.TransferDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

                                dataAccessLayerX.addDataTransferLogEntry(DataTransferLogEntry, function (err, result) {
                                    dataAccessLayerX.closeConnection();
                                    cb(err, null);
                                });
                            }
                            else {
                                cb(err, null);
                            }
                        });
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RenameFile = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    var Filename = '';
    var PodParentFolderID = -1;

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT Filename, PodParentFolderID FROM podfiles WHERE PodFileID = " + inData.podfileid;
                sqlSelectStatement += " AND Deleted IS NULL AND UploadCompleted IS NOT NULL";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        Filename = rows[0].Filename;
                        PodParentFolderID = rows[0].PodParentFolderID;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlStatement = "UPDATE podfiles SET Filename = '" + inData.newfilename + "' WHERE Filename = '" + Filename;
                sqlStatement += "' AND PodParentFolderID = " + PodParentFolderID;
                sqlStatement += " AND Deleted IS NULL AND UploadCompleted IS NOT NULL";

                dataAccessLayerX.executeQuery(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.DeleteFile = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    var Filename = '';
    var PodParentFolderID = -1;

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT Filename, PodParentFolderID FROM podfiles WHERE PodFileID = " + inData.podfileid;
                sqlSelectStatement += " AND Deleted IS NULL AND UploadCompleted IS NOT NULL";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        Filename = rows[0].Filename;
                        PodParentFolderID = rows[0].PodParentFolderID;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlStatement = "UPDATE podfiles SET Deleted = '" + new Date().toISOString().slice(0, 19).replace('T', ' ') + "' WHERE Filename = '" + Filename;
                sqlStatement += "' AND PodParentFolderID = " + PodParentFolderID;
                sqlStatement += " AND Deleted IS NULL AND UploadCompleted IS NOT NULL";

                dataAccessLayerX.executeQuery(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.MoveFileToNewParentFolder = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT Filename, PodParentFolderID FROM podfiles WHERE PodFileID = " + inData.podfileid;
                sqlSelectStatement += " AND Deleted IS NULL AND UploadCompleted IS NOT NULL";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        Filename = rows[0].Filename;
                        PodParentFolderID = rows[0].PodParentFolderID;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlStatement = "UPDATE podfiles SET PodParentFolderID = " + inData.newparentfolderid + " WHERE Filename = '" + Filename;
                sqlStatement += "' AND PodParentFolderID = " + PodParentFolderID;
                sqlStatement += " AND Deleted IS NULL AND UploadCompleted IS NOT NULL";

                dataAccessLayerX.executeQuery(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveAllPodFileSharesByOwnerSecurityID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT *, pfs.Description as Descr FROM podfileshares pfs INNER JOIN podfiles pf ON pfs.PodFileID = pf.PodFileID "
                sqlSelectStatement += " INNER JOIN pods p ON pfs.PodID = p.PodID"
                sqlSelectStatement += " WHERE pfs.OwnerSecurityUserID = " + inData.ownersecurityuserid;
                sqlSelectStatement += " AND pfs.IsDecommissioned = 0";
                sqlSelectStatement += " ORDER BY p.Name"

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfileshares = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveAllPodFileSharesByPodID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT * FROM podfileshares WHERE PodID = " + inData.podid;
                sqlSelectStatement += " AND IsDecommissioned = 0";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfileshares = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrievePodFileShareByPodFileID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT * FROM podfileshares WHERE PodFileID = " + inData.podfileid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfileshares = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrievePodFileShareByPodFileShareID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT * FROM podfileshares WHERE PodFileShareID = " + inData.podfileshareid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfileshares = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.IsAlwaysHighestRevisionForPodFileID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    var podfiles = null;
    var allpodfilerevisions = null;
    var highestrevisionrows = null;

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT * FROM podfiles WHERE PodFileID = " + inData.podfileid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        podfiles = rows;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT * FROM podfiles WHERE Filename = '" + podfiles[0].Filename + "' "
                sqlSelectStatement += " AND PodParentFolderID = " + podfiles[0].PodParentFolderID;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        allpodfilerevisions = rows;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                var inClause = "";

                for (var i = 0; i < allpodfilerevisions.length; i++) {
                    inClause += allpodfilerevisions[i].PodFileID;

                    if (i < allpodfilerevisions.length - 1) {
                        inClause += ", ";
                    }
                }

                var sqlSelectStatement = "SELECT * FROM podfileshares WHERE PodFileID IN (" + inClause + ")";
                sqlSelectStatement += " AND IsAlwaysHighestRevision = 1";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        highestrevisionrows = rows;
                        if (highestrevisionrows.length > 0) {
                            jsonObjectToReturn.isalwayshighestrevision = 1;
                        }
                        else {
                            jsonObjectToReturn.isalwayshighestrevision = 0;
                        }
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.AddPodFileShare = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                dataAccessLayerX.addPodFileShare(inData.podfileshare, function(err, result) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.ModifyPodFileShare = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                dataAccessLayerX.modifyPodFileShare(inData.podfileshare, function(err, result) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.DeletePodFileShare = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {

                var sqlStatement = "UPDATE podfileshares SET IsDecommissioned = 1, DecommissionDate = '" +
                    new Date().toISOString().slice(0, 19).replace('T', ' ') + "'";
                sqlStatement += " WHERE PodFileShareID = " + inData.podfileshareid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveAllPodFolderSharesByOwnerSecurityID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT *, pfs.Description as Descr, p.Name as PodName FROM podfoldershares pfs "
                sqlSelectStatement += " INNER JOIN pods p ON pfs.PodID = p.PodID"
                sqlSelectStatement += " WHERE pfs.OwnerSecurityUserID = " + inData.ownersecurityuserid;
                sqlSelectStatement += " AND pfs.IsDecommissioned = 0";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfoldershares = rows;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                if (jsonObjectToReturn.podfoldershares.length > 0) {
                    var objectToSend = {};

                    objectToSend.apiusername = config.treesserviceapiusername;
                    objectToSend.apipassword = config.treesserviceapipassword;

                    objectToSend.folderids = [];

                    for (var i = 0; i < jsonObjectToReturn.podfoldershares.length; i++) {
                        objectToSend.folderids.push(jsonObjectToReturn.podfoldershares[i].PodFolderID)
                    }

                    self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveFoldersByFolderIDs', objectToSend, function (err, res, body) {
                        if (!err) {
                            var folders = JSON.parse(body).outData.folders;

                            for (var i = 0; i < folders.length; i++) {
                                for (var t = 0; t < jsonObjectToReturn.podfoldershares.length; t++) {
                                    if (folders[i].FolderID == jsonObjectToReturn.podfoldershares[t].PodFolderID) {
                                        jsonObjectToReturn.podfoldershares[t].Name = folders[i].Name;
                                    }
                                }
                            }
                        }
                        cb(err, null);
                    });
                }
                else {
                    cb(null, null);
                }
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveAllPodFolderSharesByPodID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT * FROM podfoldershares pfs "
                sqlSelectStatement += " INNER JOIN pods p ON pfs.PodID = p.PodID"
                sqlSelectStatement += " WHERE pfs.PodID = " + inData.podid;
                sqlSelectStatement += " AND pfs.IsDecommissioned = 0";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfoldershares = rows;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                if (jsonObjectToReturn.podfoldershares.length > 0) {
                    var objectToSend = {};

                    objectToSend.apiusername = config.treesserviceapiusername;
                    objectToSend.apipassword = config.treesserviceapipassword;

                    objectToSend.folderids = [];

                    for (var i = 0; i < jsonObjectToReturn.podfoldershares.length; i++) {
                        objectToSend.folderids.push(jsonObjectToReturn.podfoldershares[i].PodFolderID)
                    }

                    self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveFoldersByFolderIDs', objectToSend, function (err, res, body) {
                        if (!err) {
                            var folders = JSON.parse(body).outData.folders;

                            for (var i = 0; i < folders.length; i++) {
                                for (var t = 0; t < jsonObjectToReturn.podfoldershares.length; t++) {
                                    if (folders[i].FolderID == jsonObjectToReturn.podfoldershares[t].PodFolderID) {
                                        jsonObjectToReturn.podfoldershares[t].Name = folders[i].Name;
                                    }
                                }
                            }
                        }
                        cb(err, null);
                    });
                }
                else {
                    cb(null, null);
                }
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrievePodFolderShareByPodFolderID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT *, pfs.Description as Descr FROM podfoldershares pfs "
                sqlSelectStatement += " INNER JOIN pods p ON pfs.PodID = p.PodID"
                sqlSelectStatement += " WHERE pfs.PodFolderID = " + inData.podfolderid;
                sqlSelectStatement += " AND pfs.IsDecommissioned = 0";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfoldershares = rows;
                    }
                    cb(err, null);
                });
            },
            function (cb) {

                if (jsonObjectToReturn.podfoldershares.length > 0) {

                    var objectToSend = {};

                    objectToSend.apiusername = config.treesserviceapiusername;
                    objectToSend.apipassword = config.treesserviceapipassword;

                    objectToSend.folderids = [];

                    for (var i = 0; i < jsonObjectToReturn.podfoldershares.length; i++) {
                        objectToSend.folderids.push(jsonObjectToReturn.podfoldershares[i].PodFolderID)
                    }

                    self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveFoldersByFolderIDs', objectToSend, function (err, res, body) {
                        if (!err) {
                            var folders = JSON.parse(body).outData.folders;

                            for (var i = 0; i < folders.length; i++) {
                                for (var t = 0; t < jsonObjectToReturn.podfoldershares.length; t++) {
                                    if (folders[i].FolderID == jsonObjectToReturn.podfoldershares[t].PodFolderID) {
                                        jsonObjectToReturn.podfoldershares[t].Name = folders[i].Name;
                                    }
                                }
                            }
                        }
                        cb(err, null);
                    });
                }
                else {
                    cb(null, null);
                }
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrievePodFolderShareByPodFolderShareID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT *, pfs.Description AS Descr FROM podfoldershares pfs "
                sqlSelectStatement += " INNER JOIN pods p ON pfs.PodID = p.PodID"
                sqlSelectStatement += " WHERE pfs.PodFolderShareID = " + inData.podfoldershareid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfoldershares = rows;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                if (jsonObjectToReturn.podfoldershares.length > 0) {
                    var objectToSend = {};

                    objectToSend.apiusername = config.treesserviceapiusername;
                    objectToSend.apipassword = config.treesserviceapipassword;

                    objectToSend.folderids = [];

                    for (var i = 0; i < jsonObjectToReturn.podfoldershares.length; i++) {
                        objectToSend.folderids.push(jsonObjectToReturn.podfoldershares[i].PodFolderID)
                    }

                    self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveFoldersByFolderIDs', objectToSend, function (err, res, body) {
                        if (!err) {
                            var folders = JSON.parse(body).outData.folders;

                            for (var i = 0; i < folders.length; i++) {
                                for (var t = 0; t < jsonObjectToReturn.podfoldershares.length; t++) {
                                    if (folders[i].FolderID == jsonObjectToReturn.podfoldershares[t].PodFolderID) {
                                        jsonObjectToReturn.podfoldershares[t].Name = folders[i].Name;
                                    }
                                }
                            }
                        }
                        cb(err, null);
                    });
                }
                else {
                    cb(null, null);
                }
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.AddPodFolderShare = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                dataAccessLayerX.addPodFolderShare(inData.podfoldershare, function(err, result) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.ModifyPodFolderShare = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                dataAccessLayerX.modifyPodFolderShare(inData.podfoldershare, function(err, result) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.DeletePodFolderShare = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlStatement = "UPDATE podfoldershares SET IsDecommissioned = 1, DecomissionDate = '" +
                    new Date().toISOString().slice(0, 19).replace('T', ' ') + "'";
                sqlStatement += " WHERE PodFolderShareID = " + inData.podfoldershareid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.IsPodFolderShareUsernameInUse = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "select COUNT(*) AS sharecount FROM podfoldershares WHERE Identifier = '";
                sqlSelectStatement += inData.identifier + "' ";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.sharecount = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveAllPodFolderImportsByOwnerSecurityID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT *, pfi.Description as Descr, p.Name as PodName FROM podfolderimports pfi "
                sqlSelectStatement += " INNER JOIN pods p ON pfi.PodID = p.PodID"
                sqlSelectStatement += " WHERE pfi.OwnerSecurityUserID = " + inData.ownersecurityuserid;
                sqlSelectStatement += " AND pfi.IsDecommissioned = 0";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfolderimports = rows;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                if (jsonObjectToReturn.podfolderimports.length > 0) {
                    var objectToSend = {};

                    objectToSend.apiusername = config.treesserviceapiusername;
                    objectToSend.apipassword = config.treesserviceapipassword;

                    objectToSend.folderids = [];

                    for (var i = 0; i < jsonObjectToReturn.podfolderimports.length; i++) {
                        objectToSend.folderids.push(jsonObjectToReturn.podfolderimports[i].PodFolderID)
                    }

                    self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveFoldersByFolderIDs', objectToSend, function (err, res, body) {
                        if (!err) {
                            var folders = JSON.parse(body).outData.folders;

                            for (var i = 0; i < folders.length; i++) {
                                for (var t = 0; t < jsonObjectToReturn.podfolderimports.length; t++) {
                                    if (folders[i].FolderID == jsonObjectToReturn.podfolderimports[t].PodFolderID) {
                                        jsonObjectToReturn.podfolderimports[t].Name = folders[i].Name;
                                    }
                                }
                            }
                        }
                        cb(err, null);
                    });
                }
                else {
                    cb(null, null);
                }
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveAllPodFolderImportsByPodID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT * FROM podfolderimports pfi "
                sqlSelectStatement += " INNER JOIN pods p ON pfi.PodID = p.PodID"
                sqlSelectStatement += " WHERE pfi.PodID = " + inData.podid;
                sqlSelectStatement += " AND pfi.IsDecommissioned = 0";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfolderimports = rows;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                if (jsonObjectToReturn.podfolderimports.length > 0) {
                    var objectToSend = {};

                    objectToSend.apiusername = config.treesserviceapiusername;
                    objectToSend.apipassword = config.treesserviceapipassword;

                    objectToSend.folderids = [];

                    for (var i = 0; i < jsonObjectToReturn.podfolderimports.length; i++) {
                        objectToSend.folderids.push(jsonObjectToReturn.podfolderimports[i].PodFolderID)
                    }

                    self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveFoldersByFolderIDs', objectToSend, function (err, res, body) {
                        if (!err) {
                            var folders = JSON.parse(body).outData.folders;

                            for (var i = 0; i < folders.length; i++) {
                                for (var t = 0; t < jsonObjectToReturn.podfolderimports.length; t++) {
                                    if (folders[i].FolderID == jsonObjectToReturn.podfolderimports[t].PodFolderID) {
                                        jsonObjectToReturn.podfolderimports[t].Name = folders[i].Name;
                                    }
                                }
                            }
                        }
                        cb(err, null);
                    });
                }
                else {
                    cb(null, null);
                }
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrievePodFolderImportByPodFolderID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT *, pfi.Description as Descr FROM podfolderimports pfi "
                sqlSelectStatement += " INNER JOIN pods p ON pfi.PodID = p.PodID"
                sqlSelectStatement += " WHERE pfi.PodFolderID = " + inData.podfolderid;
                sqlSelectStatement += " AND pfi.IsDecommissioned = 0";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfolderimports = rows;
                    }
                    cb(err, null);
                });
            },
            function (cb) {

                if (jsonObjectToReturn.podfolderimports.length > 0) {

                    var objectToSend = {};

                    objectToSend.apiusername = config.treesserviceapiusername;
                    objectToSend.apipassword = config.treesserviceapipassword;

                    objectToSend.folderids = [];

                    for (var i = 0; i < jsonObjectToReturn.podfolderimports.length; i++) {
                        objectToSend.folderids.push(jsonObjectToReturn.podfolderimports[i].PodFolderID)
                    }

                    self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveFoldersByFolderIDs', objectToSend, function (err, res, body) {
                        if (!err) {
                            var folders = JSON.parse(body).outData.folders;

                            for (var i = 0; i < folders.length; i++) {
                                for (var t = 0; t < jsonObjectToReturn.podfolderimports.length; t++) {
                                    if (folders[i].FolderID == jsonObjectToReturn.podfolderimports[t].PodFolderID) {
                                        jsonObjectToReturn.podfolderimports[t].Name = folders[i].Name;
                                    }
                                }
                            }
                        }
                        cb(err, null);
                    });
                }
                else {
                    cb(null, null);
                }
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrievePodFolderImportByPodFolderImportID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT *, pfi.Description AS Descr FROM podfolderimports pfi "
                sqlSelectStatement += " INNER JOIN pods p ON pfi.PodID = p.PodID"
                sqlSelectStatement += " WHERE pfi.PodFolderImportID = " + inData.podfolderimportid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfolderimports = rows;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                if (jsonObjectToReturn.podfolderimports.length > 0) {
                    var objectToSend = {};

                    objectToSend.apiusername = config.treesserviceapiusername;
                    objectToSend.apipassword = config.treesserviceapipassword;

                    objectToSend.folderids = [];

                    for (var i = 0; i < jsonObjectToReturn.podfolderimports.length; i++) {
                        objectToSend.folderids.push(jsonObjectToReturn.podfolderimports[i].PodFolderID)
                    }

                    self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveFoldersByFolderIDs', objectToSend, function (err, res, body) {
                        if (!err) {
                            var folders = JSON.parse(body).outData.folders;

                            for (var i = 0; i < folders.length; i++) {
                                for (var t = 0; t < jsonObjectToReturn.podfolderimports.length; t++) {
                                    if (folders[i].FolderID == jsonObjectToReturn.podfolderimports[t].PodFolderID) {
                                        jsonObjectToReturn.podfolderimports[t].Name = folders[i].Name;
                                    }
                                }
                            }
                        }
                        cb(err, null);
                    });
                }
                else {
                    cb(null, null);
                }
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.AddPodFolderImport = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                dataAccessLayerX.addPodFolderImport(inData.podfolderimport, function(err, result) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.ModifyPodFolderImport = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                dataAccessLayerX.modifyPodFolderImport(inData.podfolderimport, function(err, result) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.DeletePodFolderImport = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlStatement = "UPDATE podfolderimports SET IsDecommissioned = 1, DecomissionDate = '" +
                    new Date().toISOString().slice(0, 19).replace('T', ' ') + "'";
                sqlStatement += " WHERE PodFolderImportID = " + inData.podfolderimportid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.IsPodFolderImportUsernameInUse = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "select COUNT(*) AS importcount FROM podfolderimports WHERE Identifier = '";
                sqlSelectStatement += inData.identifier + "' ";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.importcount = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveAllPodFileShortcutsBySecurityUserID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT *, p.Name AS PodName, pfs.Name as ShortcutName FROM podfileshortcuts pfs INNER JOIN Pods p ON pfs.PodID = p.PodID ";
                sqlSelectStatement += " INNER JOIN PodFiles pf ON pfs.PodFileID = pf.PodFileID "
                sqlSelectStatement += " WHERE pfs.SecurityUserID = " + inData.securityuserid;
                sqlSelectStatement += " AND pfs.IsDeleted = 0 AND pfs.IsGlobal = " + inData.isglobal;

                if (inData.podid != null) {
                    sqlSelectStatement += " AND pfs.podID = " + inData.podid;
                }

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfileshortcuts = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrievePodFileShortcutByPodFileShortcutID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT *, p.Name AS PodName, pfs.Name as ShortcutName FROM podfileshortcuts pfs INNER JOIN Pods p ON pfs.PodID = p.PodID ";
                sqlSelectStatement += " INNER JOIN PodFiles pf ON pfs.PodFileID = pf.PodFileID "
                sqlSelectStatement += " WHERE pfs.PodFileShortcutID = " + inData.podfileshortcutid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfileshortcuts = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.AddPodFileShortcut = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                dataAccessLayerX.addPodFileShortcut(inData.podfileshortcut, function(err, result) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.ModifyPodFileShortcutName = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlStatement = "UPDATE podfileshortcuts SET Name = '" + inData.name + "' ";
                sqlStatement += " WHERE PodFileShortcutID = " + inData.podfileshortcutid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.DeletePodFileShortcut = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlStatement = "UPDATE podfileshortcuts SET IsDeleted = 1";
                sqlStatement += " WHERE PodFileShortcutID = " + inData.podfileshortcutid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveAllPodFolderShortcutsBySecurityUserID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT *, p.Name AS PodName, pfs.Name AS ShortcutName FROM podfoldershortcuts pfs INNER JOIN Pods p ON pfs.PodID = p.PodID ";
                sqlSelectStatement += " WHERE pfs.SecurityUserID = " + inData.securityuserid;
                sqlSelectStatement += " AND pfs.IsDeleted = 0 AND pfs.IsGlobal = " + inData.isglobal;

                if (inData.podid != null) {
                    sqlSelectStatement += " AND pfs.podID = " + inData.podid;
                }

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfoldershortcuts = rows;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                if (jsonObjectToReturn.podfoldershortcuts.length > 0) {
                    var objectToSend = {};

                    objectToSend.apiusername = config.treesserviceapiusername;
                    objectToSend.apipassword = config.treesserviceapipassword;

                    objectToSend.folderids = [];

                    for (var i = 0; i < jsonObjectToReturn.podfoldershortcuts.length; i++) {
                        objectToSend.folderids.push(jsonObjectToReturn.podfoldershortcuts[i].PodFolderID)
                    }

                    self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveFoldersByFolderIDs', objectToSend, function (err, res, body) {
                        if (!err) {
                            var folders = JSON.parse(body).outData.folders;

                            for (var i = 0; i < folders.length; i++) {
                                for (var t = 0; t < jsonObjectToReturn.podfoldershortcuts.length; t++) {
                                    if (folders[i].FolderID == jsonObjectToReturn.podfoldershortcuts[t].PodFolderID) {
                                        jsonObjectToReturn.podfoldershortcuts[t].FolderName = folders[i].Name;
                                    }
                                }
                            }
                        }
                        cb(err, null);
                    });
                }
                else {
                    cb(null, null);
                }
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrievePodFolderShortcutByPodFolderShortcutID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT *, p.Name AS PodName, pfs.Name as ShortcutName FROM podfileshortcuts pfs INNER JOIN Pods p ON pfs.PodID = p.PodID ";
                sqlSelectStatement += " INNER JOIN PodFiles pf ON pfs.PodFileID = pf.PodFileID "
                sqlSelectStatement += " WHERE pfs.PodFileShortcutID = " + inData.podfoldershortcutid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfoldershortcuts = rows;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};


businessLogic.prototype.AddPodFolderShortcut = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                dataAccessLayerX.addPodFolderShortCut(inData.podfoldershortcut, function(err, result) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.ModifyPodFolderShortcutName = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlStatement = "UPDATE podfoldershortcuts SET Name = '" + inData.name + "' ";
                sqlStatement += " WHERE PodFolderShortcutID = " + inData.podfoldershortcutid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.DeletePodFolderShortcut = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlStatement = "UPDATE podfoldershortcuts SET IsDeleted = 1";
                sqlStatement += " WHERE PodFolderShortcutID = " + inData.podfoldershortcutid;

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.SearchForFiles = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    var mypods = null;
    var podssharedwithme = null;

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT * FROM Pods WHERE OwnerSecurityUserID = ";
                sqlQueryStatement += inData.securityuserid;
                sqlQueryStatement += " AND IsDeleted = 0";

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    mypods = rows;
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlQueryStatement = "SELECT * FROM podsecurityuseraccesses psua INNER JOIN pods p ON p.PodID = psua.PodID  WHERE SecurityUserID = ";
                sqlQueryStatement += inData.securityuserid;
                sqlQueryStatement += " AND p.IsDeleted = 0 ";

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    podssharedwithme = rows;
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlQueryStatement = "SELECT *, p.Name AS podName FROM podfiles pf INNER JOIN pods p ON pf.PodID = p.PodID ";
                sqlQueryStatement += " LEFT JOIN systementitytags sets ON pf.PodFileId = sets.SystemEntityID ";

                var hasWhereStarted = false;

                if (inData.includename == 1) {

                    if (hasWhereStarted == false) {
                        sqlQueryStatement += " WHERE ";
                        hasWhereStarted = true;
                    }

                    if (inData.iscasesensitive == 1){
                        sqlQueryStatement += " Filename LIKE '%" + inData.name + "%' COLLATE utf8_bin ";
                    }
                    else {
                        sqlQueryStatement += " Filename LIKE '%" + inData.name + "%' ";
                    }
                }

                if (inData.includefilesize == 1) {

                    if (hasWhereStarted == false) {
                        sqlQueryStatement += " WHERE ";
                        hasWhereStarted = true;
                    }
                    else {
                        sqlQueryStatement += " AND "
                    }

                    sqlQueryStatement += " FileSizeInBytes > " + inData.sizefrominbytes;
                    sqlQueryStatement += " AND FileSizeInBytes < " + inData.sizetoinbytes;
                }

                if (inData.includecreated == 1) {

                    if (hasWhereStarted == false) {
                        sqlQueryStatement += " WHERE ";
                        hasWhereStarted = true;
                    }
                    else {
                        sqlQueryStatement += " AND "
                    }

                    sqlQueryStatement += " pf.Created BETWEEN '" + inData.createdfromdate;
                    sqlQueryStatement += "' AND '" + inData.createdtodate + "' ";
                }

                if (inData.includepod == 1) {

                    if (hasWhereStarted == false) {
                        sqlQueryStatement += " WHERE ";
                        hasWhereStarted = true;
                    }
                    else {
                        sqlQueryStatement += " AND "
                    }

                    sqlQueryStatement += " p.PodID =  " + inData.podid;
                }
                else {

                    if (hasWhereStarted == false) {
                        sqlQueryStatement += " WHERE ";
                        hasWhereStarted = true;
                    }
                    else {
                        sqlQueryStatement += " AND "
                    }

                    var inClause = "";

                    for (var i = 0; i < mypods.length; i++) {
                        inClause += "'" + mypods[i].PodID + "'";

                        if (i < mypods.length - 1) {
                            inClause += ", ";
                        }
                    }

                    sqlQueryStatement += " p.PodID IN (" + inClause + " ) ";

                    var inClause = "";

                    for (var i = 0; i < podssharedwithme.length; i++) {
                        inClause += podssharedwithme[i].PodID;

                        if (i < podssharedwithme.length - 1) {
                            inClause += ", ";
                        }
                    }

                    if (inClause.length < 0) {
                        sqlQueryStatement += " OR p.PodID IN (" + inClause + " ) ";
                    }
                }

                if (inData.includetags == 1) {

                    var inClause = "";

                    for (var i = 0; i < inData.listtags.length; i++) {
                        inClause += "'" + inData.listtags[i] + "'";

                        if (i < inData.listtags.length - 1) {
                            inClause += ", ";
                        }
                    }

                    if (inClause.length > 0) {

                        if (hasWhereStarted == false) {
                            sqlQueryStatement += " WHERE ";
                            hasWhereStarted = true;
                        }
                        else {
                            sqlQueryStatement += " AND "
                        }

                        sqlQueryStatement += " sets.Tag IN (" + inClause + " ) ";
                    }
                }

                if (hasWhereStarted == false) {
                    sqlQueryStatement += " WHERE ";
                    hasWhereStarted = true;
                }
                else {
                    sqlQueryStatement += " AND "
                }

                sqlQueryStatement += " pf.UploadCompleted IS NOT NULL AND pf.Deleted IS NULL ";
                sqlQueryStatement += " ORDER BY p.Name, pf.Filename, pf.Revision ";

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.searchresults = [];

                        for (var i = 0; i < rows.length; i++) {
                            var searchResult = {};
                            searchResult.id = rows[i].PodFileID;
                            searchResult.object = rows[i].Filename;
                            searchResult.pod = rows[i].podName;
                            searchResult.revision = rows[i].Revision;
                            jsonObjectToReturn.searchresults.push(searchResult);
                        }
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};


businessLogic.prototype.SearchForFolders = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    var mypods = null;
    var podssharedwithme = null;

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = "SELECT * FROM Pods WHERE OwnerSecurityUserID = ";
                sqlQueryStatement += inData.securityuserid;
                sqlQueryStatement += " AND IsDeleted = 0";

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    mypods = rows;
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlQueryStatement = "SELECT * FROM podsecurityuseraccesses psua INNER JOIN pods p ON p.PodID = psua.PodID  WHERE SecurityUserID = ";
                sqlQueryStatement += inData.securityuserid;
                sqlQueryStatement += " AND p.IsDeleted = 0 ";

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    podssharedwithme = rows;
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlQueryStatement = "SELECT *, p.Name AS podName, fldrs.Name as folderName FROM treesmaster.folders fldrs "
                sqlQueryStatement += " INNER JOIN podfolders pfldrs ON fldrs.TreeID = pfldrs.FolderID "
                sqlQueryStatement += " INNER JOIN pods p ON pfldrs.PodID = p.PodID ";
                sqlQueryStatement += " LEFT JOIN systementitytags sets ON fldrs.FolderID = sets.SystemEntityID ";

                var hasWhereStarted = false;

                if (inData.includename == 1) {

                    if (hasWhereStarted == false) {
                        sqlQueryStatement += " WHERE ";
                        hasWhereStarted = true;
                    }

                    if (inData.iscasesensitive == 1){
                        sqlQueryStatement += " fldrs.Name LIKE '%" + inData.name + "%' COLLATE utf8_bin ";
                    }
                    else {
                        sqlQueryStatement += " fldrs.Name LIKE '%" + inData.name + "%' ";
                    }
                }

                if (inData.includecreated == 1) {

                    if (hasWhereStarted == false) {
                        sqlQueryStatement += " WHERE ";
                        hasWhereStarted = true;
                    }
                    else {
                        sqlQueryStatement += " AND "
                    }

                    sqlQueryStatement += " fldrs.Created BETWEEN '" + inData.createdfromdate;
                    sqlQueryStatement += "' AND '" + inData.createdtodate + "' ";
                }

                if (inData.includepod == 1) {

                    if (hasWhereStarted == false) {
                        sqlQueryStatement += " WHERE ";
                        hasWhereStarted = true;
                    }
                    else {
                        sqlQueryStatement += " AND "
                    }

                    sqlQueryStatement += " p.PodID =  " + inData.podid;
                }
                else {

                    if (hasWhereStarted == false) {
                        sqlQueryStatement += " WHERE ";
                        hasWhereStarted = true;
                    }
                    else {
                        sqlQueryStatement += " AND "
                    }

                    var inClause = "";

                    for (var i = 0; i < mypods.length; i++) {
                        inClause += "'" + mypods[i].PodID + "'";

                        if (i < mypods.length - 1) {
                            inClause += ", ";
                        }
                    }

                    sqlQueryStatement += " p.PodID IN (" + inClause + " ) ";

                    var inClause = "";

                    for (var i = 0; i < podssharedwithme.length; i++) {
                        inClause += podssharedwithme[i].PodID;

                        if (i < podssharedwithme.length - 1) {
                            inClause += ", ";
                        }
                    }

                    if (inClause.length > 0) {
                        sqlQueryStatement += " OR p.PodID IN (" + inClause + " ) ";
                    }
                }

                if (inData.includetags == 1) {

                    var inClause = "";

                    for (var i = 0; i < inData.listtags.length; i++) {
                        inClause += "'" + inData.listtags[i] + "'";

                        if (i < inData.listtags.length - 1) {
                            inClause += ", ";
                        }
                    }

                    if (inClause.length > 0) {
                        if (hasWhereStarted == false) {
                            sqlQueryStatement += " WHERE ";
                            hasWhereStarted = true;
                        }
                        else {
                            sqlQueryStatement += " AND "
                        }

                        sqlQueryStatement += " sets.Tag IN (" + inClause + " ) ";
                    }
                }

                if (hasWhereStarted == false) {
                    sqlQueryStatement += " WHERE ";
                    hasWhereStarted = true;
                }
                else {
                    sqlQueryStatement += " AND "
                }

                sqlQueryStatement += " fldrs.IsDeleted = 0";
                sqlQueryStatement += " ORDER BY fldrs.Name";

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.searchresults = [];

                        for (var i = 0; i < rows.length; i++) {
                            var searchResult = {};
                            searchResult.id = rows[i].FolderID;
                            searchResult.object = rows[i].folderName;
                            searchResult.pod = rows[i].podName;
                            searchResult.revision = null;
                            jsonObjectToReturn.searchresults.push(searchResult);
                        }
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrievePodByFolderID = function (inData, cb) { // forward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveFolderByFolderId', objectToSend, function (err, res, body) {
                    if (!err) {
                        jsonObjectToReturn.folder = JSON.parse(body).outData.folder
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlQueryStatement = " SELECT * FROM podfolders ";
                sqlQueryStatement += " WHERE FolderID = " + jsonObjectToReturn.folder.TreeID;

                dataAccessLayerX.executeStatement(sqlQueryStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podid = rows[0].PodID;
                    }
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlQueryStatement = " SELECT * FROM pods ";
                sqlQueryStatement += " WHERE PodID = " + jsonObjectToReturn.podid;

                dataAccessLayerX.executeStatement(sqlQueryStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.pod = rows[0];
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.insertRootFolder = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/insertRootFolder', objectToSend, function (err, res, body) {
                    if (!err) {
                        jsonObjectToReturn.newFolder = JSON.parse(body).outData
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.insertFolderAboveExistingFolder = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/insertFolderAboveExistingFolder', objectToSend, function (err, res, body) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.insertFolderBelowExistingFolder = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/insertFolderBelowExistingFolder', objectToSend, function (err, res, body) {
                    if (!err) {
                        jsonObjectToReturn.newFolder = JSON.parse(body).outData
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.insertFolderChildOfExistingFolder = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/insertFolderChildOfExistingFolder', objectToSend, function (err, res, body) {
                    if (!err) {
                        jsonObjectToReturn.newFolder = JSON.parse(body).outData
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.moveFolderDownOneNode = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/moveFolderDownOneNode', objectToSend, function (err, res, body) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.moveFolderUpOneNode = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/moveFolderUpOneNode', objectToSend, function (err, res, body) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.moveFolderToParent = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/moveFolderToParent', objectToSend, function (err, res, body) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.moveFolderUnderExistingChild = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/moveFolderUnderExistingChild', objectToSend, function (err, res, body) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.deleteSoftFromTreeFolder = function (inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/deleteSoftFromTreeFolder', objectToSend, function (err, res, body) {
                    cb(err, null);
                });
            },
            function(cb) {

                var sqlStatement = "INSERT INTO podfolderstopurge (FolderID) VALUES (" + inData.existingFolderID + ") ";

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.deleteHardFromTreeFolder = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/deleteHardFromTreeFolder', objectToSend, function (err, res, body) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveTreeIDByFolderID = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend.folderid = inData.folderid;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveTreeIDByFolderID', objectToSend, function (err, res, body) {
                    if (!err) {
                        jsonObjectToReturn.treeid = JSON.parse(body).outData.treeid;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveFolderTree = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveFolderTree', objectToSend, function (err, res, body) {
                    if (!err) {
                        jsonObjectToReturn.treefolders = JSON.parse(body).outData.treefolders;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.retrieveAllChildFoldersByFolderID = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveAllChildFoldersByFolderID', objectToSend, function (err, res, body) {
                    if (!err) {
                        jsonObjectToReturn.folders = JSON.parse(body).outData.folders;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveFolderByFolderId = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/retrieveFolderByFolderId', objectToSend, function (err, res, body) {
                    if (!err) {
                        jsonObjectToReturn.folder = JSON.parse(body).outData.folder
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveFileCountUnderParentFolders = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {

                var inClause = '';

                for (var i = 0; i < inData.parentfolderids.length; i++) {
                    inClause += inData.parentfolderids[i];

                    if (i < inData.parentfolderids.length - 1) {
                        inClause += ", ";
                    }
                }

                var sqlQueryStatement = "SELECT COUNT(*) AS countfiles, SUM(FileSizeInBytes) AS totalsizeinbytes FROM ";
                sqlQueryStatement += " (SELECT Filename, FileSizeInBytes, MAX(Revision) FROM ";
                sqlQueryStatement += " podfiles WHERE PodParentFolderID IN (" + inClause + ") AND Deleted IS NULL AND UploadCompleted IS NOT NULL ";
                sqlQueryStatement += " GROUP BY  PodParentFolderID, Filename) d1";

                dataAccessLayerX.executeQuery(sqlQueryStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.countfiles = rows[0].countfiles;
                        jsonObjectToReturn.totalsizeinbytes = rows[0].totalsizeinbytes;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RenameFolder = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/renameFolder', objectToSend, function (err, res, body) {
                    if (!err) {
                        jsonObjectToReturn = JSON.parse(body).outData
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.LogSystemMessage = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {

                var logMessage = {};
                logMessage.LogMessageTypeID = inData.logmessagetypeid;
                logMessage.Title = inData.title;
                logMessage.Body = inData.body;
                logMessage.Created = new Date().toISOString().slice(0, 19).replace('T', ' ');
                logMessage.PodID = inData.podid

                dataAccessLayerX.addLogMessage(logMessage, function(err, result) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.moveFolderToNewParent = function (inData, cb) {
    var self = this;

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend = inData;

                objectToSend.apiusername = config.treesserviceapiusername;
                objectToSend.apipassword = config.treesserviceapipassword;

                self.postAjaj(config.treesserviceapiurl + '/ajaj/moveFolderToNewParent', objectToSend, function (err, res, body) {
                    if (!err) {
                        jsonObjectToReturn = JSON.parse(body).outData
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.CheckFileIntegrity = function (inData, cb) { // forwward to file storage service
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

    var fileid = -1

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                var objectToSend = {};

                objectToSend.apiusername = config.filestorageserviceapiusername;
                objectToSend.apipassword = config.filestorageserviceapipassword;

                objectToSend.fileid = inData.fileid;

                self.postAjaj(config.filestorageserviceapiurl + '/ajaj/CheckFileIntegrity', objectToSend, function(err, res, body) {
                    if (!err) {
                        jsonObjectToReturn = JSON.parse(body).outData;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

module.exports.businessLogic = businessLogic;