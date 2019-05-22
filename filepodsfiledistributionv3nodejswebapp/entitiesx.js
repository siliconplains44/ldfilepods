function CompatibleClient (CompatibleClientID, ReleaseDateTime, VersionMajor, VersionMinor, IsSupported) {
    this.CompatibleClientID = null;
    this.ReleaseDateTime = null;
    this.VersionMajor = null;
    this.VersionMinor = null;
    this.IsSupported = null;
}

function SecurityUser (SecurityUserID, IsEnabled, LastName, FirstName, ExternalSecurityUserId) {
    this.SecurityUserID = null;
    this.IsEnabled = null;
    this.LastName = null;
    this.FirstName = null;
    this.ExternalSecurityUserId = null;
}

function SecurityUserApi (SecurityUserApiID, Username, Password, IsEnabled, Created, Modified) {
    this.SecurityUserApiID = null;
    this.Username = null;
    this.Password = null;
    this.IsEnabled = null;
    this.Created = null;
    this.Modified = null;
}

function ShareFile (ShareFileId, ShareId, FileId) {
    this.ShareFileId = null;
    this.ShareId = null;
    this.FileId = null;
}

function Share (ShareId, Identifier, Created, Description, UploadCompleted, IsDecommmissioned, ShareSizeInBytes, UploadedBySecurityUserID) {
    this.ShareId = null;
    this.Identifier = null;
    this.Created = null;
    this.Description = null;
    this.UploadCompleted = null;
    this.IsDecommmissioned = null;
    this.ShareSizeInBytes = null;
    this.UploadedBySecurityUserID = null;
}

module.exports.CompatibleClient = CompatibleClient;

module.exports.SecurityUser = SecurityUser;

module.exports.SecurityUserApi = SecurityUserApi;

module.exports.ShareFile = ShareFile;

module.exports.Share = Share;
