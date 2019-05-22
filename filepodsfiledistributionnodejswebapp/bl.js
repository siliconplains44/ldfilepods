
var mDataAccessLayerXPooled = require('./dalxpooled');
var async = require('async');

function businessLogic() {

};

businessLogic.prototype.DoesShareExist = function (inData, cb) {
    var self = this;

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

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
                var sqlSelectStatement = "SELECT * FROM PodFileShares pfs  WHERE Identifier = '" + inData.identifier +
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
            },
            function (cb) {
                GLOBAL.db.collection("files").findOne({ _id: jsonObjectToReturn.fileid }, function(err, docs) {
                    if (err) {
                        cb(err, false, null);
                    }
                    else {
                        jsonObjectToReturn.name = docs.Name;
                        cb(null, true, jsonObjectToReturn);
                    }
                });
            }
        ],
        function(err, results) {
            if (err) {
                dataAccessLayerX.closeConnection();
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

    var dataAccessLayerX = new mDataAccessLayerXPooled.dataAccessLayerX(GLOBAL.serviceConnectionPool);

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

                GLOBAL.db.collection("files").findOne({ _id: fileId }, function(err, document) {

                    response.setHeader('Content-disposition', 'attachment; filename=' + document.Name);
                    response.writeHead(200, {'Content-Type': 'application/octet-stream'});
                    response.connection.setTimeout(0);

                    GLOBAL.db.collection("fileparts").find({FileId: fileId}, {
                        _id: 1,
                        PartContent: 2,
                        PartIndex: 3
                    }, {"sort": [['PartIndex', 1]]}, function (err, docscursor) {
                        if (err) {
                            cb(err);
                        }
                        else {
                            var doc = null;

                            async.doWhilst(
                                function (callback) {

                                    docscursor.next(function (err, adoc) {
                                        doc = adoc;

                                        if (doc == null)
                                            callback(null);
                                        else {
                                            async.series([
                                                    function (callback) {
                                                        self.logTransfer(securityUserId, doc.PartContent.length(), function (err) {
                                                            callback(err);
                                                        });
                                                    },
                                                    function (callback) {
                                                        var partcontent = new Buffer(doc.PartContent.buffer);
                                                        response.write(partcontent, function () {
                                                            callback(null);
                                                        });
                                                    }
                                                ],
                                                function (err) {
                                                    callback(err);
                                                }
                                            );
                                        }
                                    });
                                },
                                function test() {
                                    if (doc == null)
                                        return false;
                                    else
                                        return true;
                                },
                                function (err) {
                                    if (!err) {
                                        response.end();
                                    }
                                    cb(err);
                                });
                        }
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