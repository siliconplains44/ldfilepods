__author__ = 'Allan'

import os
import threading
import uuid
import time
import datetime
import Queue
from hashids import Hashids
hashids = Hashids()

from businesslogic import bl

from engine import fileuploader
from engine import filedownloader

from classlibrary import enumerations

def operationThreadProc(runningOperation):

    runningOperation.Started = time.strftime("%c")
    runningOperation.Ended = ''
    runningOperation.IsRunning = True

    if runningOperation.theRunningOperationParameters.OperationType == enumerations.DirectoryUpload:
        RunDirectoryUpload(runningOperation)
    elif runningOperation.theRunningOperationParameters.OperationType == enumerations.FileUpload:
        RunFileUpload(runningOperation)
    elif runningOperation.theRunningOperationParameters.OperationType == enumerations.DirectoryDownload:
        RunDirectoryDownload(runningOperation)
    else:
        RunFileDownload(runningOperation)

    runningOperation.IsRunning = False
    runningOperation.Ended = time.strftime("%c")
    runningOperation.CompletedSuccessfully = True  # assume we did if we get here

def folderUploadQueueProcessorThreadProc(runningOperation):

     while runningOperation.processFolderUploadsInThread == True:
        try:
            folderToUpload = runningOperation.queueOfFoldersToUpload.get(False)
        except Queue.Empty:
            folderToUpload = None

        if folderToUpload != None:
            runningOperation.UploadFolder(folderToUpload)
        else:
            time.sleep(.05)

def fileUploadingProcessorThreadProc(runningOperation):

    while runningOperation.processFilesUploadingInThread == True:

        for idx, fileUploading in enumerate(runningOperation.listFilesUploading):

            fileUploadResult = fileUploading.fileUploader.CheckForFileUploadCompletion(fileUploading.queuedFileId)

            if fileUploadResult is not None:
                if False == fileUploadResult:
                    logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, error, 'File failed to add', fileUploading.path)

                    runningOperation.totalFilesFailed += 1
                else:
                    logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, error, 'File successfully added to pod', fileUploading.path)

                    runningOperation.totalFilesProcessed += 1
                    runningOperation.totalBytesProcessed += os.stat(fileUploading.path).st_size

                    del runningOperation.listFilesUploading[idx]

        time.sleep(.05)

def folderDownloadQueueProcessorThreadProc(runningOperation):

     while runningOperation.processFolderDownloadsInThread == True:
        try:
            folderToDownload = runningOperation.queueOfFoldersToDownload.get(False)
        except Queue.Empty:
            folderToDownload = None

        if folderToDownload != None:
            runningOperation.DownloadFolder(folderToDownload)
        else:
            time.sleep(.05)

def fileDownloadingProcessorThreadProc(runningOperation):

    while runningOperation.processFilesDownloadingInThread == True:

        for idx, fileDownloading in enumerate(runningOperation.listFilesDownloading):

            fileDownloadResult = fileDownloading.fileDownloader.CheckForFileDownloadCompletion(fileDownloading.queuedFileId)

            if fileDownloadResult is not None:
                if False == fileDownloadResult:
                    logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, error, 'File failed to download', '')

                    runningOperation.totalFilesFailed += 1
                else:
                    logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, error, 'File successfully added to hard drive', '')

                    runningOperation.totalFilesProcessed += 1
                    runningOperation.totalBytesProcessed += os.stat(fileDownloading.path).st_size

                    del runningOperation.listFilesDownloading[idx]

        time.sleep(.05)

class FolderQueueItem:

    def __init__(self):

        self.path = None
        self.podId = -1
        self.podFolderId = -1
        self.folder = None

class fileUploadingItem:

    def __init__(self):

        self.fileUploader = None
        self.queuedFileId = None
        self.path = None

class fileDownloadingItem:

    def __init__(self):

        self.fileDownloader = None
        self.queuedFileId = None
        self.podFileId = -1
        self.ExternalFileId = -1
        self.path = None

class RunningOperation:

    def __init__(self):

        self.theRunningOperationParameters = None

        self.IsRunning = False
        self.Name = ''
        self.operationThread = None
        self.shutdownNow = False
        self.Started = None
        self.Ended = None
        self.CompletedSuccessfully = False

        self.queueOfFoldersToUpload = Queue.Queue()
        self.queueOfFilesUploading = Queue.Queue()
        self.processFolderUploadsInThread = True
        self.processFilesUploadingInThread = True
        self.listFilesUploading = []

        self.queueOfFoldersToDownload = Queue.Queue()
        self.queueOfFilesToDownload = Queue.Queue()
        self.processFolderDownloadsInThread = True
        self.processFilesDownloadingInThread = True
        self.listFilesDownloading = []

        # Running Statistics

        self.totalCountFiles = 0
        self.totalCountFolders = 0
        self.totalSizeInBytes = 0

        self.totalFilesProcessed = 0
        self.totalFilesFailed = 0
        self.totalFoldersProcessed = 0
        self.totalBytesProcessed = 0

    def InitializeRunningOperation(self, theRunningOperationParameters):

        self.theRunningOperationParameters = theRunningOperationParameters

        businessLogic = bl.BusinessLogic()

        podInformation = businessLogic.RetrieveFilePodInformation(self.theRunningOperationParameters.PodID)

        self.Name = podInformation["pods"][0]["Name"]

    def Run(self):
        operationThread = threading.Thread(target=operationThreadProc, args=(self,))
        operationThread.start()

        folderProcThread = threading.Thread(target=folderUploadQueueProcessorThreadProc, args=(self,))
        folderProcThread.start()

        fileUploadingProcessorThread = threading.Thread(target=fileUploadingProcessorThreadProc, args=(self,))
        fileUploadingProcessorThread.start()

        folderDownloadProcThread = threading.Thread(target=folderDownloadQueueProcessorThreadProc, args=(self,))
        folderDownloadProcThread.start()

        fileDownloadingProcessorThread = threading.Thread(target=fileDownloadingProcessorThreadProc, args=(self,))
        fileDownloadingProcessorThread.start()

    def UnlockPod(self):

        businessLogic = bl.BusinessLogic()
        businessLogic.UnlockFilePod(self.theRunningOperationParameters.PodID)

    def SetPodLastChangeTime(self):

        businessLogic = bl.BusinessLogic()
        businessLogic.UpdatePodLastChangeTime(self.theRunningOperationParameters.PodID)

    def ShutdownNow(self):

        self.UnlockPod()
        self.SetPodLastChangeTime()

        self.processFolderUploadsInThread = False
        self.processFilesUploadingInThread = False
        self.processFolderDownloadsInThread = False
        self.processFilesDownloadingInThread = False
        self.IsRunning = False
        self.shutdownNow = True

    def WasStoppedPrematurely(self):
        return self.shutdownNow

    def IsOperationRunning(self):
        return self.IsRunning

    def FindLowestFileCountFileUploader(self):

        lowestFileCountUploader = None

        for fileUploaderService in self.theRunningOperationParameters.TransferEngine.mainWindow.bankfileUploaders:
            if (None == lowestFileCountUploader or
                lowestFileCountUploader.RetrieveCountFilesQueued() > fileUploaderService.RetrieveCountFilesQueued()):
                lowestFileCountUploader = fileUploaderService

        return lowestFileCountUploader

    def FindLowestFileCountFileDownloader(self):

        lowestFileCountDownloader = None

        for fileDownloaderService in self.theRunningOperationParameters.TransferEngine.mainWindow.bankfileDownloaders:
            if (None == lowestFileCountDownloader or
                lowestFileCountDownloader.RetrieveCountFilesQueued() > fileDownloaderService.RetrieveCountFilesQueued()):
                lowestFileCountDownloader = fileDownloaderService

        return lowestFileCountDownloader

    def UploadFolder(self, folderToUpload):

        filesAndFolders = os.listdir(folderToUpload.path)

        # backup all files in this directory in parallel

        for file in filesAndFolders:

            path = os.path.join(folderToUpload.path, file)
            if False == os.path.isdir(path):

                try:
                    os.stat(path).st_size # fails if anything is weird with the file

                    queuedFileId = uuid.uuid1()

                    lowestFileCountFileUploader = self.FindLowestFileCountFileUploader()

                    lowestFileCountFileUploader.QueueFileForUpload(
                        folderToUpload.folder["FolderID"], os.path.basename(path), self.theRunningOperationParameters.LoggedInSecurityUserID,
                        queuedFileId, path, self.theRunningOperationParameters.IsDataEncrypted,
                        self.theRunningOperationParameters.DataEncryptionPassword, self.theRunningOperationParameters.PodID)

                    fileUploading = fileUploadingItem()

                    fileUploading.fileUploader = lowestFileCountFileUploader
                    fileUploading.queuedFileId = queuedFileId
                    fileUploading.path = path

                    self.listFilesUploading.append(fileUploading)

                except:
                    logRunLogMessage(self.theRunningOperationParameters.PodID, error, 'File failed to upload', path)

    def DownloadFolder(self, folderToDownload):

        businessLogic = bl.BusinessLogic()

        podFiles = businessLogic.RetrieveFilePodFilesByParentFolderID(folderToDownload.podId, folderToDownload.podFolderId)

        for index, podFile in enumerate(podFiles):

            queuedFileId = uuid.uuid1()

            lowestFileCountFileDownloader = self.FindLowestFileCountFileDownloader()

            lowestFileCountFileDownloader.QueueFileForDownload(
                queuedFileId, podFile['ExternalFileID'], folderToDownload.path + "/" + podFile['Filename'],
                self.theRunningOperationParameters.IsDataEncrypted, self.theRunningOperationParameters.DataEncryptionPassword,
                self.theRunningOperationParameters.LoggedInSecurityUserID)

            fileDownloading = fileDownloadingItem()

            fileDownloading.fileDownloader = lowestFileCountFileDownloader
            fileDownloading.queuedFileId = queuedFileId
            fileDownloading.podFileId = podFile['PodFileID']
            fileDownloading.ExternalFileId = podFile['ExternalFileID']
            fileDownloading.path = folderToDownload.path + "/" + podFile['Filename']

            self.listFilesDownloading.append(fileDownloading)

#############################################################################
# utilities

information = 1
warning = 2
error = 3

def logRunLogMessage(podID, logMessageType, title, body):

    businessLogic = bl.BusinessLogic()

    businessLogic.LogSystemMessage(logMessageType, title, body, podID)


def countSizeOfFoldersAndFiles(filePath):

    countFiles = sum([len(files) for root, dirs, files in os.walk(filePath)])

    countDirs  = 1 # don't forget the root
    for root, dirs, files in os.walk(filePath):
            countDirs += len(dirs)

    allFileSizesInBytes = 0
    for root, dirs, files in os.walk(filePath):
        for fn in files:
            path = os.path.join(root, fn)
            try:
                allFileSizesInBytes += os.stat(path).st_size # in bytes
            except:
                pass

    return countFiles, countDirs, allFileSizesInBytes

def retrieveAllChildNodes(treeFolders, parentFolderID):

    childNodes = []

    for treeFolder in treeFolders:
        if parentFolderID == treeFolder['FolderParentID']:
            childNodes.append(treeFolder)

    return childNodes

def parseTreeFoldersUnderGivenTreeFolder(treeFolders, parentFolderID, resultFolders):

    childNodes = retrieveAllChildNodes(treeFolders, parentFolderID)

    for childNode in childNodes:
        parseTreeFoldersUnderGivenTreeFolder(treeFolders, childNode['FolderID'], resultFolders)
        resultFolders.append(childNode)

def SplitList(list, chunk_size):
    return [list[offs:offs+chunk_size] for offs in range(0, len(list), chunk_size)]

def countSizeOfFoldersAndFilesRemote(podFolderID):

    businessLogic = bl.BusinessLogic()

    treeID = businessLogic.RetrieveTreeIDByFolderID(podFolderID)

    treeFolders = businessLogic.RetrieveFolderTree(treeID)

    resultFolders = []

    parseTreeFoldersUnderGivenTreeFolder(treeFolders, podFolderID, resultFolders)

    for treeFolder in treeFolders:
        if treeFolder['FolderID'] == podFolderID:
            resultFolders.append(treeFolder)
            break

    parentfolderids = []

    for treeFolder in resultFolders:
        parentfolderids.append(treeFolder['FolderID'])


    countFiles = 0
    allFileSizesInBytes = 0

    listParentIds = SplitList(parentfolderids, 500)

    for parentidlist in listParentIds:
        countFilesLocal, allFileSizesInBytesLocal = businessLogic.RetrieveFileCountUnderParentFolders(parentidlist)
        countFiles += countFilesLocal
        allFileSizesInBytes += allFileSizesInBytesLocal

    countDirs = len(resultFolders)

    return countFiles, countDirs, allFileSizesInBytes, treeFolders

#############################################################################
## Actual Upload and Download Algorithms

## UPLOAD

def UploadFolderToServer(businessLogic, runningOperation, filePath, folderId, TreeID, isRoot):

    if isRoot:
        runningOperation.totalFoldersProcessed += 1

        newFolder = {}

        newFolder["Name"] = os.path.basename(filePath)
        newFolder["TreeID"] = TreeID
        newFolder["Created"] = datetime.datetime.now().isoformat()
        newFolder["IsDeleted"] = 0
        newFolder["ModifiedBySecurityUserID"] = runningOperation.theRunningOperationParameters.LoggedInSecurityUserID
        newFolder["FolderID"] = folderId

        aFolder = FolderQueueItem()
        aFolder.path = filePath
        aFolder.folder = newFolder

        runningOperation.queueOfFoldersToUpload.put(aFolder)

    filesAndFolders = os.listdir(filePath)

    # now iterate over folders, add folders,

    for file in filesAndFolders:

        if runningOperation.shutdownNow:
            return

        path = os.path.join(filePath, file)
        if os.path.isdir(path):

            # create new folder for this folder here in tree

            newFolder = {}

            newFolder["Name"] = os.path.basename(path)
            newFolder["TreeID"] = TreeID
            newFolder["Created"] = datetime.datetime.now().isoformat()
            newFolder["IsDeleted"] = 0
            newFolder["ModifiedBySecurityUserID"] = runningOperation.theRunningOperationParameters.LoggedInSecurityUserID

            newFolder = businessLogic.InsertFolderChildOfExistingFolder(folderId, newFolder)

            runningOperation.totalFoldersProcessed += 1

            aFolder = FolderQueueItem()
            aFolder.path = path
            aFolder.folder = newFolder

            runningOperation.queueOfFoldersToUpload.put(aFolder)

            UploadFolderToServer(businessLogic, runningOperation, path, newFolder["FolderID"], TreeID, False)

            if runningOperation.shutdownNow:
                return

def RunDirectoryUpload(runningOperation):

    # create our business logic

    businessLogic = bl.BusinessLogic()

    # Log initial message

    logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, information, 'Folder upload starting', '')

    # count up how much work we have to do

    countResults = countSizeOfFoldersAndFiles(runningOperation.theRunningOperationParameters.LocalDirectoryPathToUpload)

    runningOperation.totalCountFiles += countResults[0]
    runningOperation.totalCountFolders += countResults[1]
    runningOperation.totalSizeInBytes += countResults[2]

    UploadFolderToServer(businessLogic, runningOperation, runningOperation.theRunningOperationParameters.LocalDirectoryPathToUpload,
                         runningOperation.theRunningOperationParameters.RemoteParentPodFolderID,
                         runningOperation.theRunningOperationParameters.TreeID, True)

    if runningOperation.shutdownNow:
        return

    # wait for our files to finish uploading

    while (runningOperation.totalFilesFailed + runningOperation.totalFilesProcessed) < runningOperation.totalCountFiles:
        if runningOperation.shutdownNow:
            return
        time.sleep(.05)

    runningOperation.processFolderUploadsInThread = False
    runningOperation.processFilesUploadingInThread = False
    runningOperation.processFolderDownloadsInThread = False
    runningOperation.processFilesDownloadingInThread = False

    if (True == runningOperation.shutdownNow):
        return

    # Log final message

    logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, information, 'Directory upload completed', '')

    # notify the file pod we are on when we are done

    runningOperation.theRunningOperationParameters.TransferEngine.mainWindow.rightPaneManager.NotifyFilePodBrowserPaneRefreshNecessary(runningOperation.theRunningOperationParameters.PodID)

    runningOperation.UnlockPod()
    runningOperation.SetPodLastChangeTime()

def RunFileUpload(runningOperation):

    # create our business logic

    businessLogic = bl.BusinessLogic()

    # Log initial message

    logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, information, 'File upload starting', '')

    # count up how much work we have to do

    runningOperation.totalCountFiles = 1
    runningOperation.totalCountFolders = 0
    runningOperation.totalSizeInBytes = os.stat(runningOperation.theRunningOperationParameters.LocalFilePathToUpload).st_size

    try:
        os.stat(runningOperation.theRunningOperationParameters.LocalFilePathToUpload).st_size # fails if anything is weird with the file

        queuedFileId = uuid.uuid1()

        newfileUploader = fileuploader.FileUploader()
        newfileUploader.id = 0
        newfileUploader.Start()

        newfileUploader.QueueFileForUpload(
            runningOperation.theRunningOperationParameters.RemoteParentPodFolderID,
            os.path.basename(runningOperation.theRunningOperationParameters.LocalFilePathToUpload),
            runningOperation.theRunningOperationParameters.LoggedInSecurityUserID,
            queuedFileId,
            runningOperation.theRunningOperationParameters.LocalFilePathToUpload,
            runningOperation.theRunningOperationParameters.IsDataEncrypted,
            runningOperation.theRunningOperationParameters.DataEncryptionPassword,
            runningOperation.theRunningOperationParameters.PodID)

        waitingOnFileToFinish = True

        while waitingOnFileToFinish == True:
            fileUploadResult = newfileUploader.CheckForFileUploadCompletion(queuedFileId)

            if fileUploadResult is not None:
                if False == fileUploadResult:
                    logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, error, 'File failed to add', runningOperation.theRunningOperationParameters.LocalFilePathToUpload)

                    runningOperation.totalFilesFailed += 1
                else:
                    logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, error, 'File successfully added to pod', runningOperation.theRunningOperationParameters.LocalFilePathToUpload)

                    runningOperation.totalFilesProcessed += 1
                    runningOperation.totalBytesProcessed += os.stat(runningOperation.theRunningOperationParameters.LocalFilePathToUpload).st_size

                waitingOnFileToFinish = False

        newfileUploader.Stop()

    except:
        logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, error, 'File failed to upload', runningOperation.theRunningOperationParameters.LocalDirectoryPathToUpload)

    runningOperation.processFolderUploadsInThread = False
    runningOperation.processFilesUploadingInThread = False
    runningOperation.processFolderDownloadsInThread = False
    runningOperation.processFilesDownloadingInThread = False

    # Log final message

    logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, information, 'File upload completed', '')

    # notify the file pod we are on when we are done

    runningOperation.theRunningOperationParameters.TransferEngine.mainWindow.rightPaneManager.NotifyFilePodBrowserFileViewerRefreshNecessary(runningOperation.theRunningOperationParameters.RemoteParentPodFolderID)

    runningOperation.UnlockPod()
    runningOperation.SetPodLastChangeTime()

def MakeDirectoryHelper(rootPath, newDirectoryName):

    finalDirName = ''

    foundDuplicate = False

    for dir in os.listdir(rootPath):
        if os.path.isdir(rootPath + '/' + dir):
            if dir == newDirectoryName:
                foundDuplicate = True
                break

    if foundDuplicate == True:
        id = hashids.encode(int(round(time.time() * 1000)))
        finalDirName = newDirectoryName + ' (R)'  + str(id)
    else:
        finalDirName = newDirectoryName

    os.mkdir(rootPath + '/' + finalDirName)

    return rootPath + '/' + finalDirName

def DownloadFolderFromServer(businessLogic, runningOperation, path, podFolderID, treeFolders):

    childFolders = retrieveAllChildNodes(treeFolders, podFolderID)

    # now iterate over folders, add folders,

    for childFolder in childFolders:

        if runningOperation.shutdownNow:
            return

        # create folder on destination drive

        newPath = MakeDirectoryHelper(path, childFolder['Name'])

        runningOperation.totalFoldersProcessed += 1

        aFolder = FolderQueueItem()
        aFolder.path = newPath
        aFolder.podId = runningOperation.theRunningOperationParameters.PodID
        aFolder.podFolderId = childFolder["FolderID"]

        runningOperation.queueOfFoldersToDownload.put(aFolder)

        DownloadFolderFromServer(businessLogic, runningOperation, newPath, childFolder["FolderID"], treeFolders)

        runningOperation.SetPodLastChangeTime()

        if runningOperation.shutdownNow:
            return

def RunDirectoryDownload(runningOperation):

    # create our business logic

    businessLogic = bl.BusinessLogic()

    # Log initial message

    logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, information, 'Directory download starting', '')

    # count up how much work we have to do

    countResults = countSizeOfFoldersAndFilesRemote(runningOperation.theRunningOperationParameters.RemoteFolderToDownloadID)

    runningOperation.totalCountFiles += countResults[0]
    runningOperation.totalCountFolders += countResults[1]
    runningOperation.totalSizeInBytes += countResults[2]

    treeFolders = countResults[3] # we already parsed out the entire tree to download, don't go back to server for this

    # find and add our root

    childFolder = None

    for achildFolder in treeFolders:
        if achildFolder["FolderID"] == runningOperation.theRunningOperationParameters.RemoteFolderToDownloadID:
            childFolder = achildFolder
            break

    newPath = MakeDirectoryHelper(runningOperation.theRunningOperationParameters.DestinationPath, childFolder['Name'])

    runningOperation.totalFoldersProcessed += 1

    aFolder = FolderQueueItem()
    aFolder.path = newPath
    aFolder.podId = runningOperation.theRunningOperationParameters.PodID
    aFolder.podFolderId = childFolder["FolderID"]

    runningOperation.queueOfFoldersToDownload.put(aFolder)

    # now recursively add all other folders

    DownloadFolderFromServer(businessLogic, runningOperation, newPath,
                         runningOperation.theRunningOperationParameters.RemoteFolderToDownloadID,
                         treeFolders)

    if runningOperation.shutdownNow:
        return

    # wait for our files to finish uploading

    while (runningOperation.totalFilesFailed + runningOperation.totalFilesProcessed) < runningOperation.totalCountFiles:
        time.sleep(.1)

    runningOperation.processFolderDownloadsInThread = False
    runningOperation.processFilesDownloadingInThread = False
    runningOperation.processFolderUploadsInThread = False
    runningOperation.processFilesUploadingInThread = False

    if runningOperation.shutdownNow:
        return

    # Log final message

    logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, information, 'Directory download completed', '')

    runningOperation.UnlockPod()
    runningOperation.SetPodLastChangeTime()


def RunFileDownload(runningOperation):

    businessLogic = bl.BusinessLogic()

    logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, information, 'File download starting', '')

    fileDownloaderService = filedownloader.FileDownloader()

    fileDownloaderService.Start()

    queuedFileId = uuid.uuid1()

    filePath = runningOperation.theRunningOperationParameters.DestinationPath + "/" + runningOperation.theRunningOperationParameters.Filename

    externalfileid = businessLogic.RetrieveExternalFileIDByPodFileID(runningOperation.theRunningOperationParameters.RemoteFileToDownloadID)['externalfileid']

    fileDownloaderService.QueueFileForDownload(queuedFileId,
                                                externalfileid,
                                                filePath,
                                                runningOperation.theRunningOperationParameters.IsDataEncrypted,
                                                runningOperation.theRunningOperationParameters.DataEncryptionPassword,
                                                runningOperation.theRunningOperationParameters.LoggedInSecurityUserID)

    while fileDownloaderService.CheckForFileDownloadCompletion(queuedFileId) == None:
        time.sleep(.05) # 1/20th of a second for most small uploads

    if False == fileDownloaderService.CheckForFileDownloadCompletion(queuedFileId):
        logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, information, 'File failed to download', '')
    else:
        logRunLogMessage(runningOperation.theRunningOperationParameters.PodID, information, 'File downloaded successfully', '')

    fileDownloaderService.Stop()

    runningOperation.processFolderDownloadsInThread = False
    runningOperation.processFilesDownloadingInThread = False
    runningOperation.processFolderUploadsInThread = False
    runningOperation.processFilesUploadingInThread = False

    runningOperation.UnlockPod()
    runningOperation.SetPodLastChangeTime()
