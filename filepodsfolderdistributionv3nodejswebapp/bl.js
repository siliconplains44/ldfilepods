
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
                var sqlSelectStatement = "SELECT * FROM podfoldershares WHERE Identifier = '" + inData.username + "'";
                sqlSelectStatement += " AND WebPasscode = '" + inData.password + "' ";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        if (rows.length > 0) {
                            jsonObjectToReturn.accountexists = true;
                            jsonObjectToReturn.podfoldershare = rows[0];
                        }
                        else {
                            jsonObjectToReturn.accountexists = false;
                        }
                    }
                    cb(err, null);
                });
            },
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

businessLogic.prototype.RetrieveTreeIDByPodFolderID = function (inData, cb) { // forward to security serice
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
                var sqlSelectStatement = "SELECT * FROM treesmaster.folders WHERE FolderID = " + inData.folderid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.treeid = rows[0].TreeID;
                    }
                    cb(err, null);
                });
            },
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

businessLogic.prototype.RetrieveTreeByTreeID = function (inData, cb) { // forward to security serice
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
                var sqlSelectStatement = "SELECT * FROM treesmaster.folders WHERE TreeID = " + inData.treeid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.folders = rows;
                    }
                    cb(err, null);
                });
            },
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

businessLogic.prototype.RetrievePodFilesByPodFolderParentID = function (inData, cb) { // forward to security serice
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
                var sqlSelectStatement = "SELECT PodFileID, MAX(Revision), Filename, FileSizeInBytes, Created, ExternalFileID, PodParentFolderID FROM podfiles ";
                sqlSelectStatement += " WHERE PodParentFolderID = " + inData.parentfolderid +  " AND UploadCompleted IS NOT NULL ";
                sqlSelectStatement += " AND Deleted IS NULL GROUP BY Filename ";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfiles = rows;
                    }
                    cb(err, null);
                });
            },
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

businessLogic.prototype.RetrieveAllPodFileRevisionsByPodFileID = function (inData, cb) { // forward to security serice
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
                var sqlSelectStatement = "SELECT * FROM podfiles WHERE Filename = '" + inData.filename + "' ";
                sqlSelectStatement += " AND PodParentFolderID = " + inData.podparentfolderid;
                sqlSelectStatement += " ORDER BY Revision "

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.podfilerevisions = rows;
                    }
                    cb(err, null);
                });
            },
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


businessLogic.prototype.LogModuleView = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPoolMothership);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {

                inData.moduleview.Occurred = new Date().toISOString().slice(0, 19).replace('T', ' ');

                dataAccessLayerX.addModuleView(inData.moduleview, function(err, result) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                logger.log('error', arguments.callee.toString(), err);
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

businessLogic.prototype.LogModuleInteraction = function(inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPoolMothership);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {

                inData.moduleinteraction.Occurred = new Date().toISOString().slice(0, 19).replace('T', ' ');

                dataAccessLayerX.addModuleInteraction(inData.moduleinteraction, function(err, result) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection();
            if (err) {
                logger.log('error', arguments.callee.toString(), err);
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

businessLogic.prototype.DoesShareExist = function (inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPoolMothership);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlSelectStatement = "SELECT * FROM Shares s INNER JOIN ShareFiles sf ON s.ShareId = sf.ShareId WHERE Identifier = '" + inData.identifier +
                    "' AND IsDecommmissioned = 0 AND UploadCompleted = 1";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (rows.length > 0) {
                        jsonObjectToReturn.shareexists = true;
                        jsonObjectToReturn.fileid = rows[0].FileId;
                        jsonObjectToReturn.securityuserid = rows[0].UploadedBySecurityUserID;
                    }
                    else {
                        jsonObjectToReturn.shareexists = false;
                    }
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                dataAccessLayerX.closeConnection();
                logger.log('error', arguments.callee.toString(), err);
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                dataAccessLayerX.closeConnection();
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.logTransfer = function(securityUserId, length, cb) {

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPoolMothership);

    dataAccessLayerX.openConnection(function(err) {

        if (!err) {
            var DataTransferLogEntry = {}

            DataTransferLogEntry.SecurityUserId = securityUserId;
            DataTransferLogEntry.IsDownload = 1;
            DataTransferLogEntry.TransferInBytes = length;

            dataAccessLayerX.addDataTransferLogEntry(DataTransferLogEntry, function (err, result) {
                dataAccessLayerX.closeConnection();
                cb(err);
            });
        }
        else {
            dataAccessLayerX.closeConnection();
            cb(err);
        }
    });

};

businessLogic.prototype.IncrementDownloadCount = function (inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPoolMothership);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlStatement = "UPDATE podfileshares SET DownloadCount = DownloadCount + 1 ";
                sqlStatement += " WHERE Identifier = '" + inData.identifier + "'";

                dataAccessLayerX.executeStatement(sqlStatement, function(err, rows, fields) {
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            if (err) {
                dataAccessLayerX.closeConnection();
                logger.log('error', arguments.callee.toString(), err);
                console.log(err);
                console.trace();
                cb(err, false, null);
            }
            else {
                dataAccessLayerX.closeConnection();
                cb(null, true, jsonObjectToReturn);
            }
        }
    );
};

businessLogic.prototype.RetrieveFile = function (inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPoolFileStorage);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlSelectStatement = "SELECT * FROM filestoragemaster.files WHERE fileid = " + inData.fileid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    jsonObjectToReturn.file = rows[0];
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection()
            if (err) {
                logger.log('error', arguments.callee.toString(), err);
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

businessLogic.prototype.RetrieveFilePartCount = function (inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPoolFileStorage);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlSelectStatement = "SELECT Count(*) AS FilePartCount FROM filestoragenode1.fileparts WHERE fileid = " + inData.fileid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    jsonObjectToReturn.filepartcount = rows[0].FilePartCount;
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection()
            if (err) {
                logger.log('error', arguments.callee.toString(), err);
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

businessLogic.prototype.RetrieveFilePartByFileIdAndPartIndex = function (inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPoolFileStorage);

    var jsonObjectToReturn = {};

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlSelectStatement = "SELECT PartContent FROM filestoragenode1.fileparts WHERE fileid = " + inData.fileid;
                sqlSelectStatement += " AND PartIndex = " + inData.partindex;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    jsonObjectToReturn.partcontent = rows[0].PartContent;
                    cb(err, null);
                });
            }
        ],
        function(err, results) {
            dataAccessLayerX.closeConnection()
            if (err) {
                logger.log('error', arguments.callee.toString(), err);
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

businessLogic.prototype.DownloadFile = function(inData, response, cb) {
    var self = this;

    var err = null;

    var filePartIds = [];
    var fileId = null;
    var securityUserId = null;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPoolMothership);

    dataAccessLayerX.openConnection(function(err) {

        var sqlSelectStatement = "SELECT * FROM podfiles pf INNER JOIN pods p ON p.PodID = pf.PodID ";
        sqlSelectStatement += " WHERE pf.PodFileID = " + inData;

        dataAccessLayerX.executeQuery(sqlSelectStatement, function (err, rows, fields) {

            dataAccessLayerX.closeConnection();
            fileId = rows[0].ExternalFileID;
            securityUserId = rows[0].OwnerSecurityUserID;

            inData = {};
            inData.fileid = fileId;

            self.RetrieveFile(inData, function(err, result, outData) {
                response.setHeader('Content-disposition', 'attachment; filename=' + outData.file.Name);
                response.setHeader('Content-Length', outData.file.SizeInBytes)
                response.writeHead(200, {'Content-Type': 'application/octet-stream'});
                response.connection.setTimeout(0);

                self.RetrieveFilePartCount(inData, function(err, result, outData) {

                    var partCount = outData.filepartcount;
                    var partContentLength = null;
                    var currentPartIndex = 0;

                    async.whilst(function() {
                            return currentPartIndex < partCount;
                        },
                        function(callback) {
                            async.series([
                                    function (callback) {
                                        inData.partindex = currentPartIndex;

                                        self.RetrieveFilePartByFileIdAndPartIndex(inData, function(err, result, outData) {
                                            var partcontent = new Buffer(outData.partcontent);
                                            partContentLength = partcontent.length;

                                            zlib.inflateRaw(partcontent, function(err, buffer) {
                                                if (!err) {
                                                    response.write(buffer, function () {
                                                        callback(null);
                                                    });
                                                }
                                            });
                                        });
                                    },
                                    function (callback) {
                                        self.logTransfer(securityUserId, partContentLength, function (err) {
                                            callback(err);
                                        });
                                    },
                                    function (callback) {
                                        currentPartIndex++;
                                        callback(null);
                                    }
                                ],
                                function (err) {
                                    if (!err) {
                                        callback(null);
                                    }
                                    else {
                                        cb(err);
                                    }
                                }
                            );
                        },
                        function (err) {
                            if (!err) {
                                response.end();

                                /*var param = {};
                                param.identifier = identifier;

                                self.IncrementDownloadCount(param, function(err, returnval, callback) { });*/
                            }

                            cb(err);
                        });
                });
            });
        });
    });
};

module.exports.businessLogic = businessLogic;