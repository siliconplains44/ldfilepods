var config = require('./config');
var nodeMariaDb = require('mysql');
var fs = require('fs')

function dataAccessLayerX(connectionPool) {
    var self = this;
    self.serviceConnectionPool = connectionPool
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
    if (self.connection) {
        self.connection.release();
    }
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

dataAccessLayerX.prototype.addDataTransferLogEntry = function(DataTransferLogEntry, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO datatransferlogentries (';
    sqlInsertStatement += 'SecurityUserId, ';
    sqlInsertStatement += 'IsDownload, ';
    sqlInsertStatement += 'TransferInBytes, ';
    sqlInsertStatement += 'TransferDate';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    DataTransferLogEntry.SecurityUserId,
    DataTransferLogEntry.IsDownload,
    DataTransferLogEntry.TransferInBytes,
    DataTransferLogEntry.TransferDate];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyDataTransferLogEntry = function(DataTransferLogEntry, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE datatransferlogentries ';
    sqlUpdateStatement += ' SET SecurityUserId = ?, ';
    sqlUpdateStatement += ' IsDownload = ?, ';
    sqlUpdateStatement += ' TransferInBytes = ?, ';
    sqlUpdateStatement += ' TransferDate = ?';
   sqlUpdateStatement += ' WHERE DataTransferLogEntryId = ?'; 
    var dataValues = [
    DataTransferLogEntry.SecurityUserId,
    DataTransferLogEntry.IsDownload,
    DataTransferLogEntry.TransferInBytes,
    DataTransferLogEntry.TransferDate,
    DataTransferLogEntry.DataTransferLogEntryId
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardDataTransferLogEntry = function(DataTransferLogEntry, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM datatransferlogentries WHERE DataTransferLogEntryId = ?';
    var dataValues = [
    DataTransferLogEntry.DataTransferLogEntryId
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftDataTransferLogEntry = function(DataTransferLogEntry, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE datatransferlogentries SET IsDeleted = 1 WHERE DataTransferLogEntryId = ?';
    var dataValues = [
    DataTransferLogEntry.DataTransferLogEntryId
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllDataTransferLogEntry = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM datatransferlogentries';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClauseDataTransferLogEntry = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM datatransferlogentries WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addLogMessage = function(LogMessage, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO logmessages (';
    sqlInsertStatement += 'LogMessageTypeID, ';
    sqlInsertStatement += 'Title, ';
    sqlInsertStatement += 'Body, ';
    sqlInsertStatement += 'Created, ';
    sqlInsertStatement += 'PodID';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    LogMessage.LogMessageTypeID,
    LogMessage.Title,
    LogMessage.Body,
    LogMessage.Created,
    LogMessage.PodID];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyLogMessage = function(LogMessage, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE logmessages ';
    sqlUpdateStatement += ' SET LogMessageTypeID = ?, ';
    sqlUpdateStatement += ' Title = ?, ';
    sqlUpdateStatement += ' Body = ?, ';
    sqlUpdateStatement += ' Created = ?, ';
    sqlUpdateStatement += ' PodID = ?';
   sqlUpdateStatement += ' WHERE LogMessageID = ?'; 
    var dataValues = [
    LogMessage.LogMessageTypeID,
    LogMessage.Title,
    LogMessage.Body,
    LogMessage.Created,
    LogMessage.PodID,
    LogMessage.LogMessageID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardLogMessage = function(LogMessage, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM logmessages WHERE LogMessageID = ?';
    var dataValues = [
    LogMessage.LogMessageID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftLogMessage = function(LogMessage, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE logmessages SET IsDeleted = 1 WHERE LogMessageID = ?';
    var dataValues = [
    LogMessage.LogMessageID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllLogMessage = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM logmessages';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClauseLogMessage = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM logmessages WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addLogMessageType = function(LogMessageType, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO logmessagetypes (';
    sqlInsertStatement += 'Name';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    LogMessageType.Name];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyLogMessageType = function(LogMessageType, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE logmessagetypes ';
    sqlUpdateStatement += ' SET Name = ?';
   sqlUpdateStatement += ' WHERE LogMessageTypeId = ?'; 
    var dataValues = [
    LogMessageType.Name,
    LogMessageType.LogMessageTypeId
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardLogMessageType = function(LogMessageType, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM logmessagetypes WHERE LogMessageTypeId = ?';
    var dataValues = [
    LogMessageType.LogMessageTypeId
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftLogMessageType = function(LogMessageType, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE logmessagetypes SET IsDeleted = 1 WHERE LogMessageTypeId = ?';
    var dataValues = [
    LogMessageType.LogMessageTypeId
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllLogMessageType = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM logmessagetypes';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClauseLogMessageType = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM logmessagetypes WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addNickname = function(Nickname, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO nicknames (';
    sqlInsertStatement += 'Nickname, ';
    sqlInsertStatement += 'SecurityUserID';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    Nickname.Nickname,
    Nickname.SecurityUserID];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyNickname = function(Nickname, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE nicknames ';
    sqlUpdateStatement += ' SET Nickname = ?, ';
    sqlUpdateStatement += ' SecurityUserID = ?';
   sqlUpdateStatement += ' WHERE NicknameID = ?'; 
    var dataValues = [
    Nickname.Nickname,
    Nickname.SecurityUserID,
    Nickname.NicknameID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardNickname = function(Nickname, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM nicknames WHERE NicknameID = ?';
    var dataValues = [
    Nickname.NicknameID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftNickname = function(Nickname, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE nicknames SET IsDeleted = 1 WHERE NicknameID = ?';
    var dataValues = [
    Nickname.NicknameID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllNickname = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM nicknames';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClauseNickname = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM nicknames WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addPodChange = function(PodChange, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO podchanges (';
    sqlInsertStatement += 'PodChangeTrackingTypeID, ';
    sqlInsertStatement += 'PodID, ';
    sqlInsertStatement += 'Occurred, ';
    sqlInsertStatement += 'SecurityUserID';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    PodChange.PodChangeTrackingTypeID,
    PodChange.PodID,
    PodChange.Occurred,
    PodChange.SecurityUserID];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyPodChange = function(PodChange, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE podchanges ';
    sqlUpdateStatement += ' SET PodChangeTrackingTypeID = ?, ';
    sqlUpdateStatement += ' PodID = ?, ';
    sqlUpdateStatement += ' Occurred = ?, ';
    sqlUpdateStatement += ' SecurityUserID = ?';
   sqlUpdateStatement += ' WHERE PodChangeID = ?'; 
    var dataValues = [
    PodChange.PodChangeTrackingTypeID,
    PodChange.PodID,
    PodChange.Occurred,
    PodChange.SecurityUserID,
    PodChange.PodChangeID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardPodChange = function(PodChange, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM podchanges WHERE PodChangeID = ?';
    var dataValues = [
    PodChange.PodChangeID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftPodChange = function(PodChange, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE podchanges SET IsDeleted = 1 WHERE PodChangeID = ?';
    var dataValues = [
    PodChange.PodChangeID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllPodChange = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podchanges';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClausePodChange = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podchanges WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addPodChangeTrackingType = function(PodChangeTrackingType, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO podchangetrackingtypes (';
    sqlInsertStatement += 'Name';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    PodChangeTrackingType.Name];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyPodChangeTrackingType = function(PodChangeTrackingType, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE podchangetrackingtypes ';
    sqlUpdateStatement += ' SET Name = ?';
   sqlUpdateStatement += ' WHERE PodChangeTrackingTypeID = ?'; 
    var dataValues = [
    PodChangeTrackingType.Name,
    PodChangeTrackingType.PodChangeTrackingTypeID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardPodChangeTrackingType = function(PodChangeTrackingType, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM podchangetrackingtypes WHERE PodChangeTrackingTypeID = ?';
    var dataValues = [
    PodChangeTrackingType.PodChangeTrackingTypeID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftPodChangeTrackingType = function(PodChangeTrackingType, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE podchangetrackingtypes SET IsDeleted = 1 WHERE PodChangeTrackingTypeID = ?';
    var dataValues = [
    PodChangeTrackingType.PodChangeTrackingTypeID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllPodChangeTrackingType = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podchangetrackingtypes';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClausePodChangeTrackingType = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podchangetrackingtypes WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addPodFile = function(PodFile, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO podfiles (';
    sqlInsertStatement += 'PodParentFolderID, ';
    sqlInsertStatement += 'PodID, ';
    sqlInsertStatement += 'Revision, ';
    sqlInsertStatement += 'Filename, ';
    sqlInsertStatement += 'FileSizeInBytes, ';
    sqlInsertStatement += 'Deleted, ';
    sqlInsertStatement += 'ExternalFileID, ';
    sqlInsertStatement += 'UploadCompleted, ';
    sqlInsertStatement += 'FileStoragePurgeCompleted, ';
    sqlInsertStatement += 'Created';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    PodFile.PodParentFolderID,
    PodFile.PodID,
    PodFile.Revision,
    PodFile.Filename,
    PodFile.FileSizeInBytes,
    PodFile.Deleted,
    PodFile.ExternalFileID,
    PodFile.UploadCompleted,
    PodFile.FileStoragePurgeCompleted,
    PodFile.Created];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyPodFile = function(PodFile, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE podfiles ';
    sqlUpdateStatement += ' SET PodParentFolderID = ?, ';
    sqlUpdateStatement += ' PodID = ?, ';
    sqlUpdateStatement += ' Revision = ?, ';
    sqlUpdateStatement += ' Filename = ?, ';
    sqlUpdateStatement += ' FileSizeInBytes = ?, ';
    sqlUpdateStatement += ' Deleted = ?, ';
    sqlUpdateStatement += ' ExternalFileID = ?, ';
    sqlUpdateStatement += ' UploadCompleted = ?, ';
    sqlUpdateStatement += ' FileStoragePurgeCompleted = ?, ';
    sqlUpdateStatement += ' Created = ?';
   sqlUpdateStatement += ' WHERE PodFileID = ?'; 
    var dataValues = [
    PodFile.PodParentFolderID,
    PodFile.PodID,
    PodFile.Revision,
    PodFile.Filename,
    PodFile.FileSizeInBytes,
    PodFile.Deleted,
    PodFile.ExternalFileID,
    PodFile.UploadCompleted,
    PodFile.FileStoragePurgeCompleted,
    PodFile.Created,
    PodFile.PodFileID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardPodFile = function(PodFile, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM podfiles WHERE PodFileID = ?';
    var dataValues = [
    PodFile.PodFileID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftPodFile = function(PodFile, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE podfiles SET IsDeleted = 1 WHERE PodFileID = ?';
    var dataValues = [
    PodFile.PodFileID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllPodFile = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfiles';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClausePodFile = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfiles WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addPodFileShare = function(PodFileShare, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO podfileshares (';
    sqlInsertStatement += 'PodID, ';
    sqlInsertStatement += 'PodFileID, ';
    sqlInsertStatement += 'OwnerSecurityUserID, ';
    sqlInsertStatement += 'IsAlwaysHighestRevision, ';
    sqlInsertStatement += 'Identifier, ';
    sqlInsertStatement += 'Description, ';
    sqlInsertStatement += 'Created, ';
    sqlInsertStatement += 'IsDecommissioned, ';
    sqlInsertStatement += 'DecommissionDate, ';
    sqlInsertStatement += 'DownloadCount';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    PodFileShare.PodID,
    PodFileShare.PodFileID,
    PodFileShare.OwnerSecurityUserID,
    PodFileShare.IsAlwaysHighestRevision,
    PodFileShare.Identifier,
    PodFileShare.Description,
    PodFileShare.Created,
    PodFileShare.IsDecommissioned,
    PodFileShare.DecommissionDate,
    PodFileShare.DownloadCount];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyPodFileShare = function(PodFileShare, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE podfileshares ';
    sqlUpdateStatement += ' SET PodID = ?, ';
    sqlUpdateStatement += ' PodFileID = ?, ';
    sqlUpdateStatement += ' OwnerSecurityUserID = ?, ';
    sqlUpdateStatement += ' IsAlwaysHighestRevision = ?, ';
    sqlUpdateStatement += ' Identifier = ?, ';
    sqlUpdateStatement += ' Description = ?, ';
    sqlUpdateStatement += ' Created = ?, ';
    sqlUpdateStatement += ' IsDecommissioned = ?, ';
    sqlUpdateStatement += ' DecommissionDate = ?, ';
    sqlUpdateStatement += ' DownloadCount = ?';
   sqlUpdateStatement += ' WHERE PodFileShareID = ?'; 
    var dataValues = [
    PodFileShare.PodID,
    PodFileShare.PodFileID,
    PodFileShare.OwnerSecurityUserID,
    PodFileShare.IsAlwaysHighestRevision,
    PodFileShare.Identifier,
    PodFileShare.Description,
    PodFileShare.Created,
    PodFileShare.IsDecommissioned,
    PodFileShare.DecommissionDate,
    PodFileShare.DownloadCount,
    PodFileShare.PodFileShareID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardPodFileShare = function(PodFileShare, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM podfileshares WHERE PodFileShareID = ?';
    var dataValues = [
    PodFileShare.PodFileShareID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftPodFileShare = function(PodFileShare, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE podfileshares SET IsDeleted = 1 WHERE PodFileShareID = ?';
    var dataValues = [
    PodFileShare.PodFileShareID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllPodFileShare = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfileshares';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClausePodFileShare = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfileshares WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addPodFileShortcut = function(PodFileShortcut, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO podfileshortcuts (';
    sqlInsertStatement += 'PodFileID, ';
    sqlInsertStatement += 'Name, ';
    sqlInsertStatement += 'SecurityUserID, ';
    sqlInsertStatement += 'PodID, ';
    sqlInsertStatement += 'IsGlobal, ';
    sqlInsertStatement += 'Created, ';
    sqlInsertStatement += 'IsDeleted';
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
    PodFileShortcut.PodFileID,
    PodFileShortcut.Name,
    PodFileShortcut.SecurityUserID,
    PodFileShortcut.PodID,
    PodFileShortcut.IsGlobal,
    PodFileShortcut.Created,
    PodFileShortcut.IsDeleted];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyPodFileShortcut = function(PodFileShortcut, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE podfileshortcuts ';
    sqlUpdateStatement += ' SET PodFileID = ?, ';
    sqlUpdateStatement += ' Name = ?, ';
    sqlUpdateStatement += ' SecurityUserID = ?, ';
    sqlUpdateStatement += ' PodID = ?, ';
    sqlUpdateStatement += ' IsGlobal = ?, ';
    sqlUpdateStatement += ' Created = ?, ';
    sqlUpdateStatement += ' IsDeleted = ?';
   sqlUpdateStatement += ' WHERE PodFileShortcutID = ?'; 
    var dataValues = [
    PodFileShortcut.PodFileID,
    PodFileShortcut.Name,
    PodFileShortcut.SecurityUserID,
    PodFileShortcut.PodID,
    PodFileShortcut.IsGlobal,
    PodFileShortcut.Created,
    PodFileShortcut.IsDeleted,
    PodFileShortcut.PodFileShortcutID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardPodFileShortcut = function(PodFileShortcut, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM podfileshortcuts WHERE PodFileShortcutID = ?';
    var dataValues = [
    PodFileShortcut.PodFileShortcutID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftPodFileShortcut = function(PodFileShortcut, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE podfileshortcuts SET IsDeleted = 1 WHERE PodFileShortcutID = ?';
    var dataValues = [
    PodFileShortcut.PodFileShortcutID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllPodFileShortcut = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfileshortcuts';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClausePodFileShortcut = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfileshortcuts WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addPodFolderImport = function(PodFolderImport, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO podfolderimports (';
    sqlInsertStatement += 'PodID, ';
    sqlInsertStatement += 'PodFolderID, ';
    sqlInsertStatement += 'OwnerSecurityUserID, ';
    sqlInsertStatement += 'Identifier, ';
    sqlInsertStatement += 'Description, ';
    sqlInsertStatement += 'WebPasscode, ';
    sqlInsertStatement += 'Created, ';
    sqlInsertStatement += 'IsDecommissioned, ';
    sqlInsertStatement += 'DecomissionDate';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    PodFolderImport.PodID,
    PodFolderImport.PodFolderID,
    PodFolderImport.OwnerSecurityUserID,
    PodFolderImport.Identifier,
    PodFolderImport.Description,
    PodFolderImport.WebPasscode,
    PodFolderImport.Created,
    PodFolderImport.IsDecommissioned,
    PodFolderImport.DecomissionDate];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyPodFolderImport = function(PodFolderImport, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE podfolderimports ';
    sqlUpdateStatement += ' SET PodID = ?, ';
    sqlUpdateStatement += ' PodFolderID = ?, ';
    sqlUpdateStatement += ' OwnerSecurityUserID = ?, ';
    sqlUpdateStatement += ' Identifier = ?, ';
    sqlUpdateStatement += ' Description = ?, ';
    sqlUpdateStatement += ' WebPasscode = ?, ';
    sqlUpdateStatement += ' Created = ?, ';
    sqlUpdateStatement += ' IsDecommissioned = ?, ';
    sqlUpdateStatement += ' DecomissionDate = ?';
   sqlUpdateStatement += ' WHERE PodFolderImportID = ?'; 
    var dataValues = [
    PodFolderImport.PodID,
    PodFolderImport.PodFolderID,
    PodFolderImport.OwnerSecurityUserID,
    PodFolderImport.Identifier,
    PodFolderImport.Description,
    PodFolderImport.WebPasscode,
    PodFolderImport.Created,
    PodFolderImport.IsDecommissioned,
    PodFolderImport.DecomissionDate,
    PodFolderImport.PodFolderImportID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardPodFolderImport = function(PodFolderImport, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM podfolderimports WHERE PodFolderImportID = ?';
    var dataValues = [
    PodFolderImport.PodFolderImportID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftPodFolderImport = function(PodFolderImport, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE podfolderimports SET IsDeleted = 1 WHERE PodFolderImportID = ?';
    var dataValues = [
    PodFolderImport.PodFolderImportID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllPodFolderImport = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfolderimports';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClausePodFolderImport = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfolderimports WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addPodFolder = function(PodFolder, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO podfolders (';
    sqlInsertStatement += 'PodID, ';
    sqlInsertStatement += 'FolderID, ';
    sqlInsertStatement += 'Name';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    PodFolder.PodID,
    PodFolder.FolderID,
    PodFolder.Name];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyPodFolder = function(PodFolder, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE podfolders ';
    sqlUpdateStatement += ' SET PodID = ?, ';
    sqlUpdateStatement += ' FolderID = ?, ';
    sqlUpdateStatement += ' Name = ?';
   sqlUpdateStatement += ' WHERE PodFolderID = ?'; 
    var dataValues = [
    PodFolder.PodID,
    PodFolder.FolderID,
    PodFolder.Name,
    PodFolder.PodFolderID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardPodFolder = function(PodFolder, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM podfolders WHERE PodFolderID = ?';
    var dataValues = [
    PodFolder.PodFolderID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftPodFolder = function(PodFolder, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE podfolders SET IsDeleted = 1 WHERE PodFolderID = ?';
    var dataValues = [
    PodFolder.PodFolderID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllPodFolder = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfolders';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClausePodFolder = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfolders WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addPodFolderShare = function(PodFolderShare, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO podfoldershares (';
    sqlInsertStatement += 'PodID, ';
    sqlInsertStatement += 'PodFolderID, ';
    sqlInsertStatement += 'OwnerSecurityUserID, ';
    sqlInsertStatement += 'Identifier, ';
    sqlInsertStatement += 'Description, ';
    sqlInsertStatement += 'WebPasscode, ';
    sqlInsertStatement += 'Created, ';
    sqlInsertStatement += 'IsDecommissioned, ';
    sqlInsertStatement += 'DecomissionDate';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    PodFolderShare.PodID,
    PodFolderShare.PodFolderID,
    PodFolderShare.OwnerSecurityUserID,
    PodFolderShare.Identifier,
    PodFolderShare.Description,
    PodFolderShare.WebPasscode,
    PodFolderShare.Created,
    PodFolderShare.IsDecommissioned,
    PodFolderShare.DecomissionDate];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyPodFolderShare = function(PodFolderShare, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE podfoldershares ';
    sqlUpdateStatement += ' SET PodID = ?, ';
    sqlUpdateStatement += ' PodFolderID = ?, ';
    sqlUpdateStatement += ' OwnerSecurityUserID = ?, ';
    sqlUpdateStatement += ' Identifier = ?, ';
    sqlUpdateStatement += ' Description = ?, ';
    sqlUpdateStatement += ' WebPasscode = ?, ';
    sqlUpdateStatement += ' Created = ?, ';
    sqlUpdateStatement += ' IsDecommissioned = ?, ';
    sqlUpdateStatement += ' DecomissionDate = ?';
   sqlUpdateStatement += ' WHERE PodFolderShareID = ?'; 
    var dataValues = [
    PodFolderShare.PodID,
    PodFolderShare.PodFolderID,
    PodFolderShare.OwnerSecurityUserID,
    PodFolderShare.Identifier,
    PodFolderShare.Description,
    PodFolderShare.WebPasscode,
    PodFolderShare.Created,
    PodFolderShare.IsDecommissioned,
    PodFolderShare.DecomissionDate,
    PodFolderShare.PodFolderShareID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardPodFolderShare = function(PodFolderShare, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM podfoldershares WHERE PodFolderShareID = ?';
    var dataValues = [
    PodFolderShare.PodFolderShareID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftPodFolderShare = function(PodFolderShare, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE podfoldershares SET IsDeleted = 1 WHERE PodFolderShareID = ?';
    var dataValues = [
    PodFolderShare.PodFolderShareID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllPodFolderShare = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfoldershares';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClausePodFolderShare = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfoldershares WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addPodFolderShortCut = function(PodFolderShortCut, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO podfoldershortcuts (';
    sqlInsertStatement += 'SecurityUserID, ';
    sqlInsertStatement += 'PodFolderID, ';
    sqlInsertStatement += 'Name, ';
    sqlInsertStatement += 'PodID, ';
    sqlInsertStatement += 'IsGlobal, ';
    sqlInsertStatement += 'Created, ';
    sqlInsertStatement += 'IsDeleted';
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
    PodFolderShortCut.SecurityUserID,
    PodFolderShortCut.PodFolderID,
    PodFolderShortCut.Name,
    PodFolderShortCut.PodID,
    PodFolderShortCut.IsGlobal,
    PodFolderShortCut.Created,
    PodFolderShortCut.IsDeleted];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyPodFolderShortCut = function(PodFolderShortCut, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE podfoldershortcuts ';
    sqlUpdateStatement += ' SET SecurityUserID = ?, ';
    sqlUpdateStatement += ' PodFolderID = ?, ';
    sqlUpdateStatement += ' Name = ?, ';
    sqlUpdateStatement += ' PodID = ?, ';
    sqlUpdateStatement += ' IsGlobal = ?, ';
    sqlUpdateStatement += ' Created = ?, ';
    sqlUpdateStatement += ' IsDeleted = ?';
   sqlUpdateStatement += ' WHERE PodFolderShortCutID = ?'; 
    var dataValues = [
    PodFolderShortCut.SecurityUserID,
    PodFolderShortCut.PodFolderID,
    PodFolderShortCut.Name,
    PodFolderShortCut.PodID,
    PodFolderShortCut.IsGlobal,
    PodFolderShortCut.Created,
    PodFolderShortCut.IsDeleted,
    PodFolderShortCut.PodFolderShortCutID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardPodFolderShortCut = function(PodFolderShortCut, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM podfoldershortcuts WHERE PodFolderShortCutID = ?';
    var dataValues = [
    PodFolderShortCut.PodFolderShortCutID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftPodFolderShortCut = function(PodFolderShortCut, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE podfoldershortcuts SET IsDeleted = 1 WHERE PodFolderShortCutID = ?';
    var dataValues = [
    PodFolderShortCut.PodFolderShortCutID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllPodFolderShortCut = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfoldershortcuts';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClausePodFolderShortCut = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfoldershortcuts WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addPodFoldersToPurge = function(PodFoldersToPurge, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO podfolderstopurge (';
    sqlInsertStatement += 'FolderID, ';
    sqlInsertStatement += 'PurgeDateTime';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    PodFoldersToPurge.FolderID,
    PodFoldersToPurge.PurgeDateTime];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyPodFoldersToPurge = function(PodFoldersToPurge, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE podfolderstopurge ';
    sqlUpdateStatement += ' SET FolderID = ?, ';
    sqlUpdateStatement += ' PurgeDateTime = ?';
   sqlUpdateStatement += ' WHERE PodFoldersToPurgeID = ?'; 
    var dataValues = [
    PodFoldersToPurge.FolderID,
    PodFoldersToPurge.PurgeDateTime,
    PodFoldersToPurge.PodFoldersToPurgeID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardPodFoldersToPurge = function(PodFoldersToPurge, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM podfolderstopurge WHERE PodFoldersToPurgeID = ?';
    var dataValues = [
    PodFoldersToPurge.PodFoldersToPurgeID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftPodFoldersToPurge = function(PodFoldersToPurge, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE podfolderstopurge SET IsDeleted = 1 WHERE PodFoldersToPurgeID = ?';
    var dataValues = [
    PodFoldersToPurge.PodFoldersToPurgeID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllPodFoldersToPurge = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfolderstopurge';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClausePodFoldersToPurge = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podfolderstopurge WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addPod = function(Pod, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO pods (';
    sqlInsertStatement += 'OwnerSecurityUserID, ';
    sqlInsertStatement += 'IsDeleted, ';
    sqlInsertStatement += 'Created, ';
    sqlInsertStatement += 'Name, ';
    sqlInsertStatement += 'Description, ';
    sqlInsertStatement += 'IsLocked, ';
    sqlInsertStatement += 'LastLockTime, ';
    sqlInsertStatement += 'LockedBySecurityUserID, ';
    sqlInsertStatement += 'LastChangeTime, ';
    sqlInsertStatement += 'IsArchived';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    Pod.OwnerSecurityUserID,
    Pod.IsDeleted,
    Pod.Created,
    Pod.Name,
    Pod.Description,
    Pod.IsLocked,
    Pod.LastLockTime,
    Pod.LockedBySecurityUserID,
    Pod.LastChangeTime,
    Pod.IsArchived];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyPod = function(Pod, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE pods ';
    sqlUpdateStatement += ' SET OwnerSecurityUserID = ?, ';
    sqlUpdateStatement += ' IsDeleted = ?, ';
    sqlUpdateStatement += ' Created = ?, ';
    sqlUpdateStatement += ' Name = ?, ';
    sqlUpdateStatement += ' Description = ?, ';
    sqlUpdateStatement += ' IsLocked = ?, ';
    sqlUpdateStatement += ' LastLockTime = ?, ';
    sqlUpdateStatement += ' LockedBySecurityUserID = ?, ';
    sqlUpdateStatement += ' LastChangeTime = ?, ';
    sqlUpdateStatement += ' IsArchived = ?';
   sqlUpdateStatement += ' WHERE PodID = ?'; 
    var dataValues = [
    Pod.OwnerSecurityUserID,
    Pod.IsDeleted,
    Pod.Created,
    Pod.Name,
    Pod.Description,
    Pod.IsLocked,
    Pod.LastLockTime,
    Pod.LockedBySecurityUserID,
    Pod.LastChangeTime,
    Pod.IsArchived,
    Pod.PodID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardPod = function(Pod, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM pods WHERE PodID = ?';
    var dataValues = [
    Pod.PodID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftPod = function(Pod, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE pods SET IsDeleted = 1 WHERE PodID = ?';
    var dataValues = [
    Pod.PodID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllPod = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM pods';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClausePod = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM pods WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addPodSecurityUserAccess = function(PodSecurityUserAccess, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO podsecurityuseraccesses (';
    sqlInsertStatement += 'PodID, ';
    sqlInsertStatement += 'SecurityUserID, ';
    sqlInsertStatement += 'AccessGiven, ';
    sqlInsertStatement += 'CanWrite';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    PodSecurityUserAccess.PodID,
    PodSecurityUserAccess.SecurityUserID,
    PodSecurityUserAccess.AccessGiven,
    PodSecurityUserAccess.CanWrite];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyPodSecurityUserAccess = function(PodSecurityUserAccess, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE podsecurityuseraccesses ';
    sqlUpdateStatement += ' SET PodID = ?, ';
    sqlUpdateStatement += ' SecurityUserID = ?, ';
    sqlUpdateStatement += ' AccessGiven = ?, ';
    sqlUpdateStatement += ' CanWrite = ?';
   sqlUpdateStatement += ' WHERE PodSecurityUserAccessID = ?'; 
    var dataValues = [
    PodSecurityUserAccess.PodID,
    PodSecurityUserAccess.SecurityUserID,
    PodSecurityUserAccess.AccessGiven,
    PodSecurityUserAccess.CanWrite,
    PodSecurityUserAccess.PodSecurityUserAccessID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardPodSecurityUserAccess = function(PodSecurityUserAccess, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM podsecurityuseraccesses WHERE PodSecurityUserAccessID = ?';
    var dataValues = [
    PodSecurityUserAccess.PodSecurityUserAccessID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftPodSecurityUserAccess = function(PodSecurityUserAccess, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE podsecurityuseraccesses SET IsDeleted = 1 WHERE PodSecurityUserAccessID = ?';
    var dataValues = [
    PodSecurityUserAccess.PodSecurityUserAccessID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllPodSecurityUserAccess = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podsecurityuseraccesses';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClausePodSecurityUserAccess = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM podsecurityuseraccesses WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addQueryDate = function(QueryDate, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO querydates (';
    sqlInsertStatement += 'Year, ';
    sqlInsertStatement += 'Month, ';
    sqlInsertStatement += 'Day, ';
    sqlInsertStatement += 'Week, ';
    sqlInsertStatement += 'QueryDate';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    QueryDate.Year,
    QueryDate.Month,
    QueryDate.Day,
    QueryDate.Week,
    QueryDate.QueryDate];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifyQueryDate = function(QueryDate, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE querydates ';
    sqlUpdateStatement += ' SET Year = ?, ';
    sqlUpdateStatement += ' Month = ?, ';
    sqlUpdateStatement += ' Day = ?, ';
    sqlUpdateStatement += ' Week = ?, ';
    sqlUpdateStatement += ' QueryDate = ?';
   sqlUpdateStatement += ' WHERE QueryDateID = ?'; 
    var dataValues = [
    QueryDate.Year,
    QueryDate.Month,
    QueryDate.Day,
    QueryDate.Week,
    QueryDate.QueryDate,
    QueryDate.QueryDateID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardQueryDate = function(QueryDate, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM querydates WHERE QueryDateID = ?';
    var dataValues = [
    QueryDate.QueryDateID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftQueryDate = function(QueryDate, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE querydates SET IsDeleted = 1 WHERE QueryDateID = ?';
    var dataValues = [
    QueryDate.QueryDateID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllQueryDate = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM querydates';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClauseQueryDate = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM querydates WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addSecurityUser = function(SecurityUser, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO securityusers (';
    sqlInsertStatement += 'IsEnabled, ';
    sqlInsertStatement += 'ExternalSecurityUserId';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    SecurityUser.IsEnabled,
    SecurityUser.ExternalSecurityUserId];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifySecurityUser = function(SecurityUser, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE securityusers ';
    sqlUpdateStatement += ' SET IsEnabled = ?, ';
    sqlUpdateStatement += ' ExternalSecurityUserId = ?';
   sqlUpdateStatement += ' WHERE SecurityUserID = ?'; 
    var dataValues = [
    SecurityUser.IsEnabled,
    SecurityUser.ExternalSecurityUserId,
    SecurityUser.SecurityUserID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardSecurityUser = function(SecurityUser, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM securityusers WHERE SecurityUserID = ?';
    var dataValues = [
    SecurityUser.SecurityUserID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftSecurityUser = function(SecurityUser, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE securityusers SET IsDeleted = 1 WHERE SecurityUserID = ?';
    var dataValues = [
    SecurityUser.SecurityUserID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllSecurityUser = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM securityusers';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClauseSecurityUser = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM securityusers WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addSystemEntityShortcut = function(SystemEntityShortcut, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO systementityshortcuts (';
    sqlInsertStatement += 'SystemEntityTypeID, ';
    sqlInsertStatement += 'SystemEntityID, ';
    sqlInsertStatement += 'PodID, ';
    sqlInsertStatement += 'OwnerSecurityUserID, ';
    sqlInsertStatement += 'Name, ';
    sqlInsertStatement += 'Description, ';
    sqlInsertStatement += 'Created, ';
    sqlInsertStatement += 'Modified';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    SystemEntityShortcut.SystemEntityTypeID,
    SystemEntityShortcut.SystemEntityID,
    SystemEntityShortcut.PodID,
    SystemEntityShortcut.OwnerSecurityUserID,
    SystemEntityShortcut.Name,
    SystemEntityShortcut.Description,
    SystemEntityShortcut.Created,
    SystemEntityShortcut.Modified];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifySystemEntityShortcut = function(SystemEntityShortcut, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE systementityshortcuts ';
    sqlUpdateStatement += ' SET SystemEntityTypeID = ?, ';
    sqlUpdateStatement += ' SystemEntityID = ?, ';
    sqlUpdateStatement += ' PodID = ?, ';
    sqlUpdateStatement += ' OwnerSecurityUserID = ?, ';
    sqlUpdateStatement += ' Name = ?, ';
    sqlUpdateStatement += ' Description = ?, ';
    sqlUpdateStatement += ' Created = ?, ';
    sqlUpdateStatement += ' Modified = ?';
   sqlUpdateStatement += ' WHERE SystemEntityShortcutID = ?'; 
    var dataValues = [
    SystemEntityShortcut.SystemEntityTypeID,
    SystemEntityShortcut.SystemEntityID,
    SystemEntityShortcut.PodID,
    SystemEntityShortcut.OwnerSecurityUserID,
    SystemEntityShortcut.Name,
    SystemEntityShortcut.Description,
    SystemEntityShortcut.Created,
    SystemEntityShortcut.Modified,
    SystemEntityShortcut.SystemEntityShortcutID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardSystemEntityShortcut = function(SystemEntityShortcut, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM systementityshortcuts WHERE SystemEntityShortcutID = ?';
    var dataValues = [
    SystemEntityShortcut.SystemEntityShortcutID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftSystemEntityShortcut = function(SystemEntityShortcut, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE systementityshortcuts SET IsDeleted = 1 WHERE SystemEntityShortcutID = ?';
    var dataValues = [
    SystemEntityShortcut.SystemEntityShortcutID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllSystemEntityShortcut = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM systementityshortcuts';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClauseSystemEntityShortcut = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM systementityshortcuts WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addSystemEntityTag = function(SystemEntityTag, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO systementitytags (';
    sqlInsertStatement += 'SystemEntityTypeID, ';
    sqlInsertStatement += 'SystemEntityID, ';
    sqlInsertStatement += 'Tag, ';
    sqlInsertStatement += 'TagDateTime, ';
    sqlInsertStatement += 'OwnerSecurityUserID, ';
    sqlInsertStatement += 'IsDeleted';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?, ';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    SystemEntityTag.SystemEntityTypeID,
    SystemEntityTag.SystemEntityID,
    SystemEntityTag.Tag,
    SystemEntityTag.TagDateTime,
    SystemEntityTag.OwnerSecurityUserID,
    SystemEntityTag.IsDeleted];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifySystemEntityTag = function(SystemEntityTag, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE systementitytags ';
    sqlUpdateStatement += ' SET SystemEntityTypeID = ?, ';
    sqlUpdateStatement += ' SystemEntityID = ?, ';
    sqlUpdateStatement += ' Tag = ?, ';
    sqlUpdateStatement += ' TagDateTime = ?, ';
    sqlUpdateStatement += ' OwnerSecurityUserID = ?, ';
    sqlUpdateStatement += ' IsDeleted = ?';
   sqlUpdateStatement += ' WHERE SystemEntityTagID = ?'; 
    var dataValues = [
    SystemEntityTag.SystemEntityTypeID,
    SystemEntityTag.SystemEntityID,
    SystemEntityTag.Tag,
    SystemEntityTag.TagDateTime,
    SystemEntityTag.OwnerSecurityUserID,
    SystemEntityTag.IsDeleted,
    SystemEntityTag.SystemEntityTagID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardSystemEntityTag = function(SystemEntityTag, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM systementitytags WHERE SystemEntityTagID = ?';
    var dataValues = [
    SystemEntityTag.SystemEntityTagID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftSystemEntityTag = function(SystemEntityTag, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE systementitytags SET IsDeleted = 1 WHERE SystemEntityTagID = ?';
    var dataValues = [
    SystemEntityTag.SystemEntityTagID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllSystemEntityTag = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM systementitytags';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClauseSystemEntityTag = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM systementitytags WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.addSystemEntityType = function(SystemEntityType, cb) { 
    var self = this;
    var sqlInsertStatement = 'INSERT INTO systementitytypes (';
    sqlInsertStatement += 'Name';
    sqlInsertStatement += ') VALUES (';
    sqlInsertStatement += '?';
    sqlInsertStatement += ')';
    var dataValues = [
    SystemEntityType.Name];
    self.connection.query(sqlInsertStatement, dataValues, function (err, result) { 
        cb(err, result);
    });
};

dataAccessLayerX.prototype.modifySystemEntityType = function(SystemEntityType, cb) { 
    var self = this;
    var sqlUpdateStatement = 'UPDATE systementitytypes ';
    sqlUpdateStatement += ' SET Name = ?';
   sqlUpdateStatement += ' WHERE SystemEntityTypeID = ?'; 
    var dataValues = [
    SystemEntityType.Name,
    SystemEntityType.SystemEntityTypeID
    ];
    self.connection.query(sqlUpdateStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteHardSystemEntityType = function(SystemEntityType, cb) { 
    var self = this;
    var sqlDeleteStatement = ' DELETE FROM systementitytypes WHERE SystemEntityTypeID = ?';
    var dataValues = [
    SystemEntityType.SystemEntityTypeID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.deleteSoftSystemEntityType = function(SystemEntityType, cb) { 
    var self = this;
    var sqlDeleteStatement = ' UPDATE systementitytypes SET IsDeleted = 1 WHERE SystemEntityTypeID = ?';
    var dataValues = [
    SystemEntityType.SystemEntityTypeID
    ];
    self.connection.query(sqlDeleteStatement, dataValues, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveAllSystemEntityType = function(cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM systementitytypes';
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};

dataAccessLayerX.prototype.retrieveWithWhereClauseSystemEntityType = function(whereClause, cb) { 
    var self = this;
    var sqlSelectStatement = ' SELECT * FROM systementitytypes WHERE ' + whereClause;
    self.connection.query(sqlSelectStatement, function (err, rows, fields) { 
        cb(err, rows, fields);
    });
};


module.exports.dataAccessLayerX = dataAccessLayerX;