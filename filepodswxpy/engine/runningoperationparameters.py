__author__ = 'allan'

class RunningOperationParameters:

    def __init__(self):
        self.TransferEngine = None
        self.OperationType = None
        self.PodID = None
        self.TreeID = None
        self.RemoteParentPodFolderID = None
        self.LocalDirectoryPathToUpload = None
        self.LocalFilePathToUpload = None
        self.RemoteFolderToDownloadID  = None
        self.DestinationPath = None
        self.RemoteFileToDownloadID = None
        self.Filename = None
        self.IsDataEncrypted = None
        self.DataEncryptionPassword = None
        self.LoggedInSecurityUserID = None
