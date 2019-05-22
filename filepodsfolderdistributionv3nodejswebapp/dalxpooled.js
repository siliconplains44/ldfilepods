var config = require('./config');
var nodeMariaDb = require('mysql');
var fs = require('fs');

function dataAccessLayerX(connectionPool) {
    var self = this;
    self.serviceConnectionPool = connectionPool;
    var connection = null;
};

dataAccessLayerX.prototype.initializeConnectionPoolExtended = function(poolConfig) {
    var self = this;
    self.serviceConnectionPool = nodeMariaDb.createPool(poolConfig);
};

dataAccessLayerX.prototype.openConnection = function(cb) {
    var self = this;
    self.serviceConnectionPool.getConnection(function (err, connection) {
        if (!err) {
            self.connection = connection;
        }
        cb(err);
    });
};

dataAccessLayerX.prototype.closeConnection = function() {
    var self = this;
    self.connection.release();
};


dataAccessLayerX.prototype.escape = function(value) {
    var self = this;
    return self.connection.escape(value);
}

dataAccessLayerX.prototype.startTransaction = function(cb) {
    var self = this;
    self.executeStatement('START TRANSACTION', cb);
};

dataAccessLayerX.prototype.rollbackTransaction = function(cb) {
    var self = this;
    self.executeStatement('ROLLBACK', cb);
};

dataAccessLayerX.prototype.commitTransaction = function(cb) {
    var self = this;
    self.executeStatement('COMMIT', cb);
};

dataAccessLayerX.prototype.executeStatement = function(sqlStatement, cb) {
    var self = this;
    self.connection.query(sqlStatement, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.executeQuery = function(sqlQueryStatement, cb) {
    var self = this;
    self.connection.query(sqlQueryStatement, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addCompatibleClient = function(CompatibleClient, cb) {
    var self = this;
    var sqlInsertStatement = 'INSERT INTO CompatibleClients (';
    sqlInsertStatement += 'ReleaseDateTime, ';
    sqlInsertStatement += 'VersionMajor, ';
    sqlInsertStatement += 'VersionMinor, ';
    sqlInsertStatement += 'IsSupported';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
        CompatibleClient.ReleaseDateTime,
        CompatibleClient.VersionMajor,
        CompatibleClient.VersionMinor,
        CompatibleClient.IsSupported];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) {
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyCompatibleClient = function(CompatibleClient, cb) {
    var self = this;
    var sqlUpdateStatement = 'UPDATE CompatibleClients ';
    sqlUpdateStatement += ' SET ReleaseDateTime = ?, ';
    sqlUpdateStatement += ' VersionMajor = ?, ';
    sqlUpdateStatement += ' VersionMinor = ?, ';
    sqlUpdateStatement += ' IsSupported = ?';
    sqlUpdateStatement += ' WHERE CompatibleClientID = ?';
    var dataValues = [
        CompatibleClient.ReleaseDateTime,
        CompatibleClient.VersionMajor,
        CompatibleClient.VersionMinor,
        CompatibleClient.IsSupported,
        CompatibleClient.CompatibleClientID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardCompatibleClient = function(CompatibleClient, cb) {
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM CompatibleClients WHERE CompatibleClientID = ?';
    var dataValues = [
        CompatibleClient.CompatibleClientID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftCompatibleClient = function(CompatibleClient, cb) {
    var self = this;
    var sqlDeleteStatement = ' UPDATE CompatibleClients SET IsDeleted = 1 WHERE CompatibleClientID = ?';
    var dataValues = [
        CompatibleClient.CompatibleClientID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllCompatibleClient = function(cb) {
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM CompatibleClients';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClauseCompatibleClient = function(whereClause, cb) {
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM CompatibleClients WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addSecurityUser = function(SecurityUser, cb) {
    var self = this;
    var sqlInsertStatement = 'INSERT INTO SecurityUsers (';
    sqlInsertStatement += 'IsEnabled, ';
    sqlInsertStatement += 'LastName, ';
    sqlInsertStatement += 'FirstName, ';
    sqlInsertStatement += 'ExternalSecurityUserId';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
        SecurityUser.IsEnabled,
        SecurityUser.LastName,
        SecurityUser.FirstName,
        SecurityUser.ExternalSecurityUserId];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) {
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifySecurityUser = function(SecurityUser, cb) {
    var self = this;
    var sqlUpdateStatement = 'UPDATE SecurityUsers ';
    sqlUpdateStatement += ' SET IsEnabled = ?, ';
    sqlUpdateStatement += ' LastName = ?, ';
    sqlUpdateStatement += ' FirstName = ?, ';
    sqlUpdateStatement += ' ExternalSecurityUserId = ?';
    sqlUpdateStatement += ' WHERE SecurityUserID = ?';
    var dataValues = [
        SecurityUser.IsEnabled,
        SecurityUser.LastName,
        SecurityUser.FirstName,
        SecurityUser.ExternalSecurityUserId,
        SecurityUser.SecurityUserID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardSecurityUser = function(SecurityUser, cb) {
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM SecurityUsers WHERE SecurityUserID = ?';
    var dataValues = [
        SecurityUser.SecurityUserID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftSecurityUser = function(SecurityUser, cb) {
    var self = this;
    var sqlDeleteStatement = ' UPDATE SecurityUsers SET IsDeleted = 1 WHERE SecurityUserID = ?';
    var dataValues = [
        SecurityUser.SecurityUserID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllSecurityUser = function(cb) {
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM SecurityUsers';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClauseSecurityUser = function(whereClause, cb) {
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM SecurityUsers WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addSecurityUserApi = function(SecurityUserApi, cb) {
    var self = this;
    var sqlInsertStatement = 'INSERT INTO SecurityUsersApi (';
    sqlInsertStatement += 'Username, ';
    sqlInsertStatement += 'Password, ';
    sqlInsertStatement += 'IsEnabled, ';
    sqlInsertStatement += 'Created, ';
    sqlInsertStatement += 'Modified';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
        SecurityUserApi.Username,
        SecurityUserApi.Password,
        SecurityUserApi.IsEnabled,
        SecurityUserApi.Created,
        SecurityUserApi.Modified];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) {
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifySecurityUserApi = function(SecurityUserApi, cb) {
    var self = this;
    var sqlUpdateStatement = 'UPDATE SecurityUsersApi ';
    sqlUpdateStatement += ' SET Username = ?, ';
    sqlUpdateStatement += ' Password = ?, ';
    sqlUpdateStatement += ' IsEnabled = ?, ';
    sqlUpdateStatement += ' Created = ?, ';
    sqlUpdateStatement += ' Modified = ?';
    sqlUpdateStatement += ' WHERE SecurityUserApiID = ?';
    var dataValues = [
        SecurityUserApi.Username,
        SecurityUserApi.Password,
        SecurityUserApi.IsEnabled,
        SecurityUserApi.Created,
        SecurityUserApi.Modified,
        SecurityUserApi.SecurityUserApiID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardSecurityUserApi = function(SecurityUserApi, cb) {
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM SecurityUsersApi WHERE SecurityUserApiID = ?';
    var dataValues = [
        SecurityUserApi.SecurityUserApiID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftSecurityUserApi = function(SecurityUserApi, cb) {
    var self = this;
    var sqlDeleteStatement = ' UPDATE SecurityUsersApi SET IsDeleted = 1 WHERE SecurityUserApiID = ?';
    var dataValues = [
        SecurityUserApi.SecurityUserApiID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllSecurityUserApi = function(cb) {
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM SecurityUsersApi';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClauseSecurityUserApi = function(whereClause, cb) {
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM SecurityUsersApi WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addShareFile = function(ShareFile, cb) {
    var self = this;
    var sqlInsertStatement = 'INSERT INTO ShareFiles (';
    sqlInsertStatement += 'ShareId, ';
    sqlInsertStatement += 'FileId';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
        ShareFile.ShareId,
        ShareFile.FileId];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) {
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyShareFile = function(ShareFile, cb) {
    var self = this;
    var sqlUpdateStatement = 'UPDATE ShareFiles ';
    sqlUpdateStatement += ' SET ShareId = ?, ';
    sqlUpdateStatement += ' FileId = ?';
    sqlUpdateStatement += ' WHERE ShareFileId = ?';
    var dataValues = [
        ShareFile.ShareId,
        ShareFile.FileId,
        ShareFile.ShareFileId
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardShareFile = function(ShareFile, cb) {
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM ShareFiles WHERE ShareFileId = ?';
    var dataValues = [
        ShareFile.ShareFileId
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftShareFile = function(ShareFile, cb) {
    var self = this;
    var sqlDeleteStatement = ' UPDATE ShareFiles SET IsDeleted = 1 WHERE ShareFileId = ?';
    var dataValues = [
        ShareFile.ShareFileId
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllShareFile = function(cb) {
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM ShareFiles';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClauseShareFile = function(whereClause, cb) {
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM ShareFiles WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addShare = function(Share, cb) {
    var self = this;
    var sqlInsertStatement = 'INSERT INTO Shares (';
    sqlInsertStatement += 'Identifier, ';
    sqlInsertStatement += 'Created, ';
    sqlInsertStatement += 'Description, ';
    sqlInsertStatement += 'UploadCompleted, ';
    sqlInsertStatement += 'IsDecommmissioned, ';
    sqlInsertStatement += 'ShareSizeInBytes, ';
    sqlInsertStatement += 'UploadedBySecurityUserID';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
        Share.Identifier,
        Share.Created,
        Share.Description,
        Share.UploadCompleted,
        Share.IsDecommmissioned,
        Share.ShareSizeInBytes,
        Share.UploadedBySecurityUserID];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) {
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyShare = function(Share, cb) {
    var self = this;
    var sqlUpdateStatement = 'UPDATE Shares ';
    sqlUpdateStatement += ' SET Identifier = ?, ';
    sqlUpdateStatement += ' Created = ?, ';
    sqlUpdateStatement += ' Description = ?, ';
    sqlUpdateStatement += ' UploadCompleted = ?, ';
    sqlUpdateStatement += ' IsDecommmissioned = ?, ';
    sqlUpdateStatement += ' ShareSizeInBytes = ?, ';
    sqlUpdateStatement += ' UploadedBySecurityUserID = ?';
    sqlUpdateStatement += ' WHERE ShareId = ?';
    var dataValues = [
        Share.Identifier,
        Share.Created,
        Share.Description,
        Share.UploadCompleted,
        Share.IsDecommmissioned,
        Share.ShareSizeInBytes,
        Share.UploadedBySecurityUserID,
        Share.ShareId
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardShare = function(Share, cb) {
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM Shares WHERE ShareId = ?';
    var dataValues = [
        Share.ShareId
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftShare = function(Share, cb) {
    var self = this;
    var sqlDeleteStatement = ' UPDATE Shares SET IsDeleted = 1 WHERE ShareId = ?';
    var dataValues = [
        Share.ShareId
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllShare = function(cb) {
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM Shares';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClauseShare = function(whereClause, cb) {
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM Shares WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllFileStorageDatabaseNodeRegistration = function(cb) {
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM FileStorageDatabaseNodeRegistrations';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) {
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addDataTransferLogEntry = function(DataTransferLogEntry, cb) {
    var self = this;
    var sqlInsertStatement = 'INSERT INTO DataTransferLogEntries (';
    sqlInsertStatement += 'SecurityUserId, ';
    sqlInsertStatement += 'IsDownload, ';
    sqlInsertStatement += 'TransferInBytes ';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '? ';
    sqlInsertStatement += ')';
    var dataValues = [
        DataTransferLogEntry.SecurityUserId,
        DataTransferLogEntry.IsDownload,
        DataTransferLogEntry.TransferInBytes];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) {
        cb(err, result);
    });
};

module.exports.dataAccessLayerX = dataAccessLayerX;