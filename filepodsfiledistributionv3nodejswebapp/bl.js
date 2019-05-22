
var mDataAccessLayerXPooled = require('./dalxpooled');
var async = require('async');
var zlib = require('zlib');

var winston = require('winston');
require('winston-email');

winston.loggers.add('logger', {
    email: {
        from   : 'inquiries@leoparddata.com',
        to     : 'allan@leoparddata.com',
        service: 'Gmail',
        auth   : { user: 'inquiries@leoparddata.com', pass: 'anniswonderful00'},
        tags   : ['file share file distribution service'] //optional tags for the subject
    }
    // other transports
});

logger = winston.loggers.get('logger');

function businessLogic() {

};

businessLogic.prototype.DoesShareExist = function (inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPoolMothership);

    var jsonObjectToReturn = {};

    var IsAlwaysHighestRevision = 0;
    var Filename = null;
    var PodParentFolderID = null;

    async.series([
            function(cb) {
                dataAccessLayerX.openConnection(function(err) {
                    cb(err, null);
                });
            },
            function(cb) {
                var sqlSelectStatement = "SELECT * FROM filepods.podfileshares pfs  WHERE Identifier = '" + inData.identifier +
                    "' AND IsDecommissioned = 0";

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (rows.length > 0) {
                        jsonObjectToReturn.shareexists = true;
                        jsonObjectToReturn.podfileid = rows[0].PodFileID;
                        jsonObjectToReturn.securityuserid = rows[0].OwnerSecurityUserID;
                        IsAlwaysHighestRevision = rows[0].IsAlwaysHighestRevision;
                    }
                    else {
                        jsonObjectToReturn.shareexists = false;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                var sqlSelectStatement = "SELECT Filename, PodParentFolderID FROM podfiles WHERE PodFileID = " + jsonObjectToReturn.podfileid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        Filename = rows[0].Filename;
                        PodParentFolderID = rows[0].PodParentFolderID;
                    }
                    cb(err, null);
                });
            },
            function (cb) {
                if (1 == IsAlwaysHighestRevision) {

                    var sqlSelectStatement = "SELECT PodFileID FROM podfiles WHERE Filename = '" + Filename;
                    sqlSelectStatement += "' AND PodParentFolderID = " + PodParentFolderID;
                    sqlSelectStatement += " AND Deleted IS NULL AND UploadCompleted IS NOT NULL ";
                    sqlSelectStatement += " ORDER BY Revision DESC LIMIT 1;"

                    dataAccessLayerX.executeQuery(sqlSelectStatement, function (err, rows, fields) {
                        if (!err) {
                            jsonObjectToReturn.podfileid = rows[0].PodFileID;
                        }
                        cb(err, null);
                    });
                }
                else {
                    cb(null, null);
                }
            },
            function(cb) {
                var sqlSelectStatement = "SELECT ExternalFileID FROM podfiles WHERE PodFileID = " + jsonObjectToReturn.podfileid;

                dataAccessLayerX.executeQuery(sqlSelectStatement, function(err, rows, fields) {
                    if (!err) {
                        jsonObjectToReturn.fileid = rows[0].ExternalFileID;
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

businessLogic.prototype.downloadFile = function(identifier, response, cb) {
    var self = this;

    var err = null;

    var inData = {};
    inData.identifier = identifier;
    var filePartIds = [];
    var fileId = null;
    var securityUserId = null;

    self.DoesShareExist(inData, function(err, result, outData) {
        if (err || outData.shareexists == false) {
            if (err) {
                console.log(err);
                console.trace();
            }
            err = 'no share exists';
            cb(err, null);
        }
        else {
            if (outData.shareexists == true) {

                fileId = outData.fileid;
                securityUserId = outData.securityuserid;

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

                                    var param = {};
                                    param.identifier = identifier;

                                    self.IncrementDownloadCount(param, function(err, returnval, callback) { });
                                }

                                cb(err);
                            });
                    });
                });
            }
            else {
                cb('share does not exist!', '');
            }
        }
    });
};

module.exports.businessLogic = businessLogic;