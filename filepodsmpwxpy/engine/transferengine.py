__author__ = 'Allan'

import threading
import time

from engine import runningoperationparameters

from businesslogic import bl

import runningoperation

from classlibrary import enumerations

class TransferEngine():

    def __init__(self):

        self.mainWindow = None
        self.runningOperations = []
        self.loggedInSecurityUserId = -1

    def Start(self, mainWindow, loggedInSecurityUserId):

        self.mainWindow = mainWindow
        self.loggedInSecurityUserId = loggedInSecurityUserId

    def Stop(self):

        for runningOperation in self.runningOperations:
            runningOperation.shutdownNow = True
            runningOperation.ShutdownNow()

    def StartOperationNow(self, theRunningOperationParameters):

        aRunningOperation = None

        lock = threading.Lock()

        lock.acquire()
        try:
            theRunningOperationParameters.TransferEngine = self
            theRunningOperationParameters.LoggedInSecurityUserID = self.loggedInSecurityUserId

            aRunningOperation = runningoperation.RunningOperation()
            aRunningOperation.InitializeRunningOperation(theRunningOperationParameters)
            aRunningOperation.Run()
            self.runningOperations.append(aRunningOperation)

        finally:
            lock.release()

        return aRunningOperation

    def UploadDirectory(self, PodID, TreeID, RemoteParentPodFolderID, localDirectoryPathToUpload):

        theRunningOperationParameters = runningoperationparameters.RunningOperationParameters()

        theRunningOperationParameters.OperationType = enumerations.DirectoryUpload
        theRunningOperationParameters.PodID = PodID
        theRunningOperationParameters.TreeID = TreeID
        theRunningOperationParameters.RemoteParentPodFolderID = RemoteParentPodFolderID
        theRunningOperationParameters.LocalDirectoryPathToUpload = localDirectoryPathToUpload

        self.StartOperationNow(theRunningOperationParameters)

    def UploadFile(self, PodID, RemoteParentPodFolderID, localFilePathToUpload):

        theRunningOperationParameters = runningoperationparameters.RunningOperationParameters()

        theRunningOperationParameters.OperationType = enumerations.FileUpload
        theRunningOperationParameters.PodID = PodID
        theRunningOperationParameters.RemoteParentPodFolderID = RemoteParentPodFolderID
        theRunningOperationParameters.LocalFilePathToUpload = localFilePathToUpload

        self.StartOperationNow(theRunningOperationParameters)

    def UploadFileAndWaitForCompletion(self, PodID, RemoteParentPodFolderID, localFilePathToUpload):

        theRunningOperationParameters = runningoperationparameters.RunningOperationParameters()

        theRunningOperationParameters.OperationType = enumerations.FileUpload
        theRunningOperationParameters.PodID = PodID
        theRunningOperationParameters.RemoteParentPodFolderID = RemoteParentPodFolderID
        theRunningOperationParameters.LocalFilePathToUpload = localFilePathToUpload

        aRunningOperation = self.StartOperationNow(theRunningOperationParameters)

        while aRunningOperation.proxyDictionary["IsRunning"] == True:
            time.sleep(.25)

    def DownloadDirectory(self, PodID, RemoteFolderToDownloadID, DestinationPath):

        theRunningOperationParameters = runningoperationparameters.RunningOperationParameters()

        theRunningOperationParameters.OperationType = enumerations.DirectoryDownload
        theRunningOperationParameters.RemoteFolderToDownloadID = RemoteFolderToDownloadID
        theRunningOperationParameters.DestinationPath = DestinationPath
        theRunningOperationParameters.PodID = PodID

        self.StartOperationNow(theRunningOperationParameters)

    def DownloadFile(self, RemotePodFileID, filename, DestinationPath, PodID):

        theRunningOperationParameters = runningoperationparameters.RunningOperationParameters()

        theRunningOperationParameters.OperationType = enumerations.FileDownload
        theRunningOperationParameters.RemoteFileToDownloadID = RemotePodFileID
        theRunningOperationParameters.Filename = filename
        theRunningOperationParameters.DestinationPath = DestinationPath
        theRunningOperationParameters.PodID = PodID

        self.StartOperationNow(theRunningOperationParameters)

    def DownloadFileAndWaitForCompletion(self, RemotePodFileID, filename, DestinationPath):

        theRunningOperationParameters = runningoperationparameters.RunningOperationParameters()

        theRunningOperationParameters.OperationType = enumerations.FileDownload
        theRunningOperationParameters.RemoteFileToDownloadID = RemotePodFileID
        theRunningOperationParameters.Filename = filename
        theRunningOperationParameters.DestinationPath = DestinationPath

        businessLogic = bl.BusinessLogic()
        podFile = businessLogic.RetrievePodFileByPodFileID(RemotePodFileID)['podfile']

        theRunningOperationParameters.PodID = podFile["PodID"]

        aRunningOperation = self.StartOperationNow(theRunningOperationParameters)

        while aRunningOperation.proxyDictionary["IsRunning"] == True:
            time.sleep(.25)



    def RetrieveRunningOperations(self):
        return self.runningOperations


