function DataTransferLogEntry (DataTransferLogEntryId, SecurityUserId, IsDownload, TransferInBytes, TransferDate) {
    this.DataTransferLogEntryId = null;
    this.SecurityUserId = null;
    this.IsDownload = null;
    this.TransferInBytes = null;
    this.TransferDate = null;
}

function LogMessage (LogMessageID, LogMessageTypeID, Title, Body, Created, PodID) {
    this.LogMessageID = null;
    this.LogMessageTypeID = null;
    this.Title = null;
    this.Body = null;
    this.Created = null;
    this.PodID = null;
}

function LogMessageType (LogMessageTypeId, Name) {
    this.LogMessageTypeId = null;
    this.Name = null;
}

function Nickname (NicknameID, Nickname, SecurityUserID) {
    this.NicknameID = null;
    this.Nickname = null;
    this.SecurityUserID = null;
}

function PodChange (PodChangeID, PodChangeTrackingTypeID, PodID, Occurred, SecurityUserID) {
    this.PodChangeID = null;
    this.PodChangeTrackingTypeID = null;
    this.PodID = null;
    this.Occurred = null;
    this.SecurityUserID = null;
}

function PodChangeTrackingType (PodChangeTrackingTypeID, Name) {
    this.PodChangeTrackingTypeID = null;
    this.Name = null;
}

function PodFile (PodFileID, PodParentFolderID, PodID, Revision, Filename, FileSizeInBytes, Deleted, ExternalFileID, UploadCompleted, FileStoragePurgeCompleted, Created) {
    this.PodFileID = null;
    this.PodParentFolderID = null;
    this.PodID = null;
    this.Revision = null;
    this.Filename = null;
    this.FileSizeInBytes = null;
    this.Deleted = null;
    this.ExternalFileID = null;
    this.UploadCompleted = null;
    this.FileStoragePurgeCompleted = null;
    this.Created = null;
}

function PodFileShare (PodFileShareID, PodID, PodFileID, OwnerSecurityUserID, IsAlwaysHighestRevision, Identifier, Description, Created, IsDecommissioned, DecommissionDate, DownloadCount) {
    this.PodFileShareID = null;
    this.PodID = null;
    this.PodFileID = null;
    this.OwnerSecurityUserID = null;
    this.IsAlwaysHighestRevision = null;
    this.Identifier = null;
    this.Description = null;
    this.Created = null;
    this.IsDecommissioned = null;
    this.DecommissionDate = null;
    this.DownloadCount = null;
}

function PodFileShortcut (PodFileShortcutID, PodFileID, Name, SecurityUserID, PodID, IsGlobal, Created, IsDeleted) {
    this.PodFileShortcutID = null;
    this.PodFileID = null;
    this.Name = null;
    this.SecurityUserID = null;
    this.PodID = null;
    this.IsGlobal = null;
    this.Created = null;
    this.IsDeleted = null;
}

function PodFolderImport (PodFolderImportID, PodID, PodFolderID, OwnerSecurityUserID, Identifier, Description, WebPasscode, Created, IsDecommissioned, DecomissionDate) {
    this.PodFolderImportID = null;
    this.PodID = null;
    this.PodFolderID = null;
    this.OwnerSecurityUserID = null;
    this.Identifier = null;
    this.Description = null;
    this.WebPasscode = null;
    this.Created = null;
    this.IsDecommissioned = null;
    this.DecomissionDate = null;
}

function PodFolder (PodFolderID, PodID, FolderID, Name) {
    this.PodFolderID = null;
    this.PodID = null;
    this.FolderID = null;
    this.Name = null;
}

function PodFolderShare (PodFolderShareID, PodID, PodFolderID, OwnerSecurityUserID, Identifier, Description, WebPasscode, Created, IsDecommissioned, DecomissionDate) {
    this.PodFolderShareID = null;
    this.PodID = null;
    this.PodFolderID = null;
    this.OwnerSecurityUserID = null;
    this.Identifier = null;
    this.Description = null;
    this.WebPasscode = null;
    this.Created = null;
    this.IsDecommissioned = null;
    this.DecomissionDate = null;
}

function PodFolderShortCut (PodFolderShortCutID, SecurityUserID, PodFolderID, Name, PodID, IsGlobal, Created, IsDeleted) {
    this.PodFolderShortCutID = null;
    this.SecurityUserID = null;
    this.PodFolderID = null;
    this.Name = null;
    this.PodID = null;
    this.IsGlobal = null;
    this.Created = null;
    this.IsDeleted = null;
}

function PodFoldersToPurge (PodFoldersToPurgeID, FolderID, PurgeDateTime) {
    this.PodFoldersToPurgeID = null;
    this.FolderID = null;
    this.PurgeDateTime = null;
}

function Pod (PodID, OwnerSecurityUserID, IsDeleted, Created, Name, Description, IsLocked, LastLockTime, LockedBySecurityUserID, LastChangeTime, IsArchived) {
    this.PodID = null;
    this.OwnerSecurityUserID = null;
    this.IsDeleted = null;
    this.Created = null;
    this.Name = null;
    this.Description = null;
    this.IsLocked = null;
    this.LastLockTime = null;
    this.LockedBySecurityUserID = null;
    this.LastChangeTime = null;
    this.IsArchived = null;
}

function PodSecurityUserAccess (PodSecurityUserAccessID, PodID, SecurityUserID, AccessGiven, CanWrite) {
    this.PodSecurityUserAccessID = null;
    this.PodID = null;
    this.SecurityUserID = null;
    this.AccessGiven = null;
    this.CanWrite = null;
}

function QueryDate (QueryDateID, Year, Month, Day, Week, QueryDate) {
    this.QueryDateID = null;
    this.Year = null;
    this.Month = null;
    this.Day = null;
    this.Week = null;
    this.QueryDate = null;
}

function SecurityUser (SecurityUserID, IsEnabled, ExternalSecurityUserId) {
    this.SecurityUserID = null;
    this.IsEnabled = null;
    this.ExternalSecurityUserId = null;
}

function SystemEntityShortcut (SystemEntityShortcutID, SystemEntityTypeID, SystemEntityID, PodID, OwnerSecurityUserID, Name, Description, Created, Modified) {
    this.SystemEntityShortcutID = null;
    this.SystemEntityTypeID = null;
    this.SystemEntityID = null;
    this.PodID = null;
    this.OwnerSecurityUserID = null;
    this.Name = null;
    this.Description = null;
    this.Created = null;
    this.Modified = null;
}

function SystemEntityTag (SystemEntityTagID, SystemEntityTypeID, SystemEntityID, Tag, TagDateTime, OwnerSecurityUserID, IsDeleted) {
    this.SystemEntityTagID = null;
    this.SystemEntityTypeID = null;
    this.SystemEntityID = null;
    this.Tag = null;
    this.TagDateTime = null;
    this.OwnerSecurityUserID = null;
    this.IsDeleted = null;
}

function SystemEntityType (SystemEntityTypeID, Name) {
    this.SystemEntityTypeID = null;
    this.Name = null;
}

module.exports.DataTransferLogEntry = DataTransferLogEntry;

module.exports.LogMessage = LogMessage;

module.exports.LogMessageType = LogMessageType;

module.exports.Nickname = Nickname;

module.exports.PodChange = PodChange;

module.exports.PodChangeTrackingType = PodChangeTrackingType;

module.exports.PodFile = PodFile;

module.exports.PodFileShare = PodFileShare;

module.exports.PodFileShortcut = PodFileShortcut;

module.exports.PodFolderImport = PodFolderImport;

module.exports.PodFolder = PodFolder;

module.exports.PodFolderShare = PodFolderShare;

module.exports.PodFolderShortCut = PodFolderShortCut;

module.exports.PodFoldersToPurge = PodFoldersToPurge;

module.exports.Pod = Pod;

module.exports.PodSecurityUserAccess = PodSecurityUserAccess;

module.exports.QueryDate = QueryDate;

module.exports.SecurityUser = SecurityUser;

module.exports.SystemEntityShortcut = SystemEntityShortcut;

module.exports.SystemEntityTag = SystemEntityTag;

module.exports.SystemEntityType = SystemEntityType;

