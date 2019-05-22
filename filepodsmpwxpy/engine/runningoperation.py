__author__ = 'Allan'

import os
import sys
import multiprocessing
from multiprocessing import Process, Manager
from multiprocessing.managers import BaseManager
import uuid
import time
import datetime
import Queue
from hashids import Hashids
from itertools import repeat
hashids = Hashids()

from businesslogic import bl

from classlibrary import enumerations
from classlibrary import compression

def operationThreadProc(proxyDictionary, queueOfFoldersToUpload, queueOfFilesUploading,
                        queueOfFilesUploaded, queueOfFoldersToDownload, queueOfFilesDownloading,
                        queueOfFilesDownloaded):

    try:
        proxyDictionary["Started"] = time.strftime("%c")
        proxyDictionary["Ended"] = ''
        proxyDictionary["IsRunning"] = True

        if proxyDictionary["OperationType"] == enumerations.DirectoryUpload:
            RunDirectoryUpload(proxyDictionary, queueOfFoldersToUpload)
        elif proxyDictionary["OperationType"] == enumerations.FileUpload:
            RunFileUpload(proxyDictionary, queueOfFilesUploading)
        elif proxyDictionary["OperationType"] == enumerations.DirectoryDownload:
            RunDirectoryDownload(proxyDictionary, queueOfFoldersToDownload)
        else:
            RunFileDownload(proxyDictionary, queueOfFilesDownloading)

        # wait for our files to finish uploading

        while (proxyDictionary["totalFilesFailed"] + proxyDictionary["totalFilesProcessed"]) < proxyDictionary["totalCountFiles"]:
            if proxyDictionary["shutdownNow"]:
                break
            time.sleep(.05)

        UnlockPod(proxyDictionary)
        SetPodLastChangeTime(proxyDictionary)

        proxyDictionary["processFolderDownloadsInThread"] = False
        proxyDictionary["processFilesDownloadingInThread"] = False
        proxyDictionary["processFolderUploadsInThread"] = False
        proxyDictionary["processFilesUploadingInThread"] = False

        proxyDictionary["IsRunning"] = False
        proxyDictionary["Ended"] = time.strftime("%c")
        proxyDictionary["CompletedSuccessfully"] = True  # assume we did if we get here

    except:
        print "Unexpected error:", sys.exc_info()[0]

def folderUploadQueueProcessorThreadProc(proxyDictionary, queueOfFoldersToUpload, queueOfFilesUploading):

    try:
         while proxyDictionary["processFolderUploadsInThread"] == True:
            try:
                folderToUpload = queueOfFoldersToUpload.get(False)
            except Queue.Empty:
                folderToUpload = None

            if folderToUpload != None:
                UploadFolder(folderToUpload, proxyDictionary, queueOfFilesUploading)
            else:
                time.sleep(.05)
    except:
        print "Unexpected error:", sys.exc_info()[0]

def fileUploadingProcessorThreadProc(proxyDictionary, queueOfFilesUploading, queueOfFilesUploaded):

    try:
        while proxyDictionary["processFilesUploadingInThread"] == True:

            try:
                fileToUpload = queueOfFilesUploading.get(False)
            except Queue.Empty:
                fileToUpload = None

            if fileToUpload != None:
                UploadFile(fileToUpload, proxyDictionary, queueOfFilesUploaded)

            time.sleep(.05)
    except:
        print "Unexpected error:", sys.exc_info()[0]


def fileUploadedProcessorThreadProc(proxyDictionary, queueOfFilesUploaded):

    try:
        while proxyDictionary["processFilesUploadingInThread"] == True:

            try:
                fileUploaded = queueOfFilesUploaded.get(False)
            except Queue.Empty:
                fileUploaded = None

            if fileUploaded != None:
                proxyDictionary["totalFilesProcessed"] += 1
                proxyDictionary["totalBytesProcessed"] += os.stat(fileUploaded.localFilePathToUpload).st_size

            time.sleep(.05)
    except:
        print "Unexpected error:", sys.exc_info()[0]


def folderDownloadQueueProcessorThreadProc(proxyDictionary, queueOfFoldersToDownload, queueOfFilesDownloading):

    try:
         while proxyDictionary["processFolderDownloadsInThread"] == True:
            try:
                folderToDownload = queueOfFoldersToDownload.get(False)
            except Queue.Empty:
                folderToDownload = None

            if folderToDownload != None:
                DownloadFolder(folderToDownload, proxyDictionary, queueOfFilesDownloading)
            else:
                time.sleep(.05)
    except:
        print "Unexpected error:", sys.exc_info()[0]


def fileDownloadingProcessorThreadProc(proxyDictionary, queueOfFilesDownloading, queueOfFilesDownloaded):

    try:
        while proxyDictionary["processFilesDownloadingInThread"] == True:

            try:
                fileToDownload = queueOfFilesDownloading.get(False)
            except Queue.Empty:
                fileToDownload = None

            if fileToDownload != None:
                DownloadFile(proxyDictionary, fileToDownload, queueOfFilesDownloaded)

            time.sleep(.05)
    except:
        print "Unexpected error:", sys.exc_info()[0]


def fileDownloadedProcessorThreadProc(proxyDictionary, proxyQueueOfFilesDownloaded):

    try:
        while proxyDictionary["processFilesDownloadingInThread"] == True:

            try:
                fileDownloaded = proxyQueueOfFilesDownloaded.get(False)
            except Queue.Empty:
                fileDownloaded = None

            if fileDownloaded != None:
                proxyDictionary["totalFilesProcessed"] += 1
                proxyDictionary["totalBytesProcessed"] += os.stat(fileDownloaded.filePath).st_size

            time.sleep(.05)
    except:
        print "Unexpected error:", sys.exc_info()[0]


class FolderQueueItem:

    def __init__(self):

        self.path = None
        self.podId = -1
        self.podFolderId = -1
        self.folder = None

class fileUploadingItem:

    def __init__(self):

        self.path = None

class fileDownloadingItem:

    def __init__(self):

        self.podFileId = -1
        self.ExternalFileId = -1
        self.path = None

class RunningOperation:

    def __init__(self):

        self.manager = Manager()

        self.proxyDictionary = self.manager.dict()

        self.queueOfFoldersToUpload = self.manager.Queue()
        self.queueOfFilesUploading = self.manager.Queue()
        self.queueOfFilesUploaded = self.manager.Queue()

        self.queueOfFoldersToDownload = self.manager.Queue()
        self.queueOfFilesDownloading = self.manager.Queue()
        self.queueOfFilesDownloaded = self.manager.Queue()


    def InitializeRunningOperation(self, theRunningOperationParameters):

        self.proxyDictionary["OperationType"] = theRunningOperationParameters.OperationType
        self.proxyDictionary["PodID"] = theRunningOperationParameters.PodID
        self.proxyDictionary["TreeID"] = theRunningOperationParameters.TreeID
        self.proxyDictionary["RemoteParentPodFolderID"] = theRunningOperationParameters.RemoteParentPodFolderID
        self.proxyDictionary["LocalDirectoryPathToUpload"] = theRunningOperationParameters.LocalDirectoryPathToUpload
        self.proxyDictionary["LocalFilePathToUpload"] = theRunningOperationParameters.LocalFilePathToUpload
        self.proxyDictionary["RemoteFolderToDownloadID"] = theRunningOperationParameters.RemoteFolderToDownloadID
        self.proxyDictionary["DestinationPath"] = theRunningOperationParameters.DestinationPath
        self.proxyDictionary["RemoteFileToDownloadID"] = theRunningOperationParameters.RemoteFileToDownloadID
        self.proxyDictionary["Filename"] = theRunningOperationParameters.Filename
        self.proxyDictionary["IsDataEncrypted"] = theRunningOperationParameters.IsDataEncrypted
        self.proxyDictionary["DataEncryptionPassword"] = theRunningOperationParameters.DataEncryptionPassword
        self.proxyDictionary["LoggedInSecurityUserID"] = theRunningOperationParameters.LoggedInSecurityUserID
        self.proxyDictionary["IsRunning"] = False
        self.proxyDictionary["Name"] = ''
        self.proxyDictionary["shutdownNow"] = False
        self.proxyDictionary["Started"] = None
        self.proxyDictionary["Ended"] = None
        self.proxyDictionary["CompletedSuccessfully"] = False

        self.proxyDictionary["totalCountFiles"] = 0
        self.proxyDictionary["totalCountFolders"] = 0
        self.proxyDictionary["totalSizeInBytes"] = 0

        self.proxyDictionary["totalFilesProcessed"] = 0
        self.proxyDictionary["totalFilesFailed"] = 0
        self.proxyDictionary["totalFoldersProcessed"] = 0
        self.proxyDictionary["totalBytesProcessed"] = 0

        self.proxyDictionary["processFolderUploadsInThread"] = True
        self.proxyDictionary["processFilesUploadingInThread"] = True

        self.proxyDictionary["processFolderDownloadsInThread"] = True
        self.proxyDictionary["processFilesDownloadingInThread"] = True

        businessLogic = bl.BusinessLogic()

        podInformation = businessLogic.RetrieveFilePodInformation(self.proxyDictionary["PodID"])

        self.Name = podInformation["pods"][0]["Name"]

    def Run(self):

        self.proxyDictionary["IsRunning"] = True

        operationThread = multiprocessing.Process(target=operationThreadProc, args=(self.proxyDictionary, self.queueOfFoldersToUpload, self.queueOfFilesUploading,
                                                                                    self.queueOfFilesUploaded, self.queueOfFoldersToDownload, self.queueOfFilesDownloading,
                                                                                    self.queueOfFilesDownloaded))
        operationThread.start()

        folderProcThread = multiprocessing.Process(target=folderUploadQueueProcessorThreadProc, args=(self.proxyDictionary, self.queueOfFoldersToUpload, self.queueOfFilesUploading))
        folderProcThread.start()

        for i in repeat(None, 20):
            fileUploadingProcessorThread = multiprocessing.Process(target=fileUploadingProcessorThreadProc, args=(self.proxyDictionary, self.queueOfFilesUploading, self.queueOfFilesUploaded))
            fileUploadingProcessorThread.start()

        fileUploadedProcessorThread = multiprocessing.Process(target=fileUploadedProcessorThreadProc, args=(self.proxyDictionary, self.queueOfFilesUploaded))
        fileUploadedProcessorThread.start()

        folderDownloadProcThread = multiprocessing.Process(target=folderDownloadQueueProcessorThreadProc, args=(self.proxyDictionary, self.queueOfFoldersToDownload, self.queueOfFilesDownloading))
        folderDownloadProcThread.start()

        for i in repeat(None, 20):
            fileDownloadingProcessorThread = multiprocessing.Process(target=fileDownloadingProcessorThreadProc, args=(self.proxyDictionary, self.queueOfFilesDownloading, self.queueOfFilesDownloaded))
            fileDownloadingProcessorThread.start()

        fileDownloadedProcessorThread = multiprocessing.Process(target=fileDownloadedProcessorThreadProc, args=(self.proxyDictionary, self.queueOfFilesDownloaded))
        fileDownloadedProcessorThread.start()

    def ShutdownNow(self):

        UnlockPod(self.proxyDictionary)
        SetPodLastChangeTime(self.proxyDictionary)

        self.proxyDictionary["processFolderUploadsInThread"] = False
        self.proxyDictionary["processFilesUploadingInThread"] = False
        self.proxyDictionary["processFolderDownloadsInThread"] = False
        self.proxyDictionary["processFilesDownloadingInThread"] = False
        self.proxyDictionary["IsRunning"] = False
        self.proxyDictionary["shutdownNow"] = True

    def WasStoppedPrematurely(self):
        return self.proxyDictionary["shutdownNow"]

    def IsOperationRunning(self):
        return self.proxyDictionary["IsRunning"]


def UnlockPod(proxyDictionary):

        businessLogic = bl.BusinessLogic()
        businessLogic.UnlockFilePod(proxyDictionary["PodID"])

def SetPodLastChangeTime(proxyDictionary):

    businessLogic = bl.BusinessLogic()
    businessLogic.UpdatePodLastChangeTime(proxyDictionary["PodID"])

def UploadFolder(folderToUpload, proxyDictionary, queueOfFilesUploading):

    if True == os.path.isdir(folderToUpload.path):

        filesAndFolders = os.listdir(folderToUpload.path)

        # backup all files in this directory in parallel

        for file in filesAndFolders:

            path = os.path.join(folderToUpload.path, file)
            if False == os.path.isdir(path):

                try:
                    os.stat(path).st_size # fails if anything is weird with the file

                    fileUploading = fileUploadingItem()

                    fileUploading.remoteParentPodFolderID = folderToUpload.folder["FolderID"]
                    fileUploading.fileName = os.path.basename(path)
                    fileUploading.loggedInSecurityUserID = proxyDictionary["LoggedInSecurityUserID"]
                    fileUploading.localFilePathToUpload = path
                    fileUploading.isDataEncrypted = proxyDictionary["IsDataEncrypted"]
                    fileUploading.dataEncryptionPassword = proxyDictionary["DataEncryptionPassword"]
                    fileUploading.podID = proxyDictionary["PodID"]

                    queueOfFilesUploading.put(fileUploading)

                except:
                    logRunLogMessage(proxyDictionary["PodID"], error, 'File failed to upload', path)

def DownloadFolder(folderToDownload, proxyDictionary, queueOfFilesDownloading):

    businessLogic = bl.BusinessLogic()

    podFiles = businessLogic.RetrieveFilePodFilesByParentFolderID(folderToDownload.podId, folderToDownload.podFolderId)

    for index, podFile in enumerate(podFiles):

        fileDownloading = fileDownloadingItem()

        fileDownloading.podFileId = podFile['PodFileID']
        fileDownloading.externalFileID = podFile['ExternalFileID']
        fileDownloading.filePath = folderToDownload.path + "/" + podFile['Filename']
        fileDownloading.isDataEncrypted = proxyDictionary["IsDataEncrypted"]
        fileDownloading.dataEncryptionPassword = proxyDictionary["DataEncryptionPassword"]
        fileDownloading.loggedInSecurityUserID = proxyDictionary["LoggedInSecurityUserID"]

        queueOfFilesDownloading.put(fileDownloading)

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

def UploadFolderToServer(businessLogic, proxyDictionary, filePath, folderId, TreeID, isRoot, queueOfFoldersToUpload):

    if isRoot:
        proxyDictionary["totalFoldersProcessed"] += 1

        newFolder = {}

        newFolder["Name"] = os.path.basename(filePath)
        newFolder["TreeID"] = TreeID
        newFolder["Created"] = datetime.datetime.now().isoformat()
        newFolder["IsDeleted"] = 0
        newFolder["ModifiedBySecurityUserID"] = proxyDictionary["LoggedInSecurityUserID"]
        newFolder["FolderID"] = folderId

        aFolder = FolderQueueItem()
        aFolder.path = filePath
        aFolder.folder = newFolder

        queueOfFoldersToUpload.put(aFolder)

    filesAndFolders = os.listdir(filePath)

    # now iterate over folders, add folders,

    for file in filesAndFolders:

        if proxyDictionary["shutdownNow"]:
            return

        path = os.path.join(filePath, file)
        if os.path.isdir(path):

            # create new folder for this folder here in tree

            newFolder = {}

            newFolder["Name"] = os.path.basename(path)
            newFolder["TreeID"] = TreeID
            newFolder["Created"] = datetime.datetime.now().isoformat()
            newFolder["IsDeleted"] = 0
            newFolder["ModifiedBySecurityUserID"] = proxyDictionary["LoggedInSecurityUserID"]

            newFolder = businessLogic.InsertFolderChildOfExistingFolder(folderId, newFolder)

            proxyDictionary["totalFoldersProcessed"] += 1

            aFolder = FolderQueueItem()
            aFolder.path = path
            aFolder.folder = newFolder

            queueOfFoldersToUpload.put(aFolder)

            UploadFolderToServer(businessLogic, proxyDictionary, path, newFolder["FolderID"], TreeID, False, queueOfFoldersToUpload)

            if proxyDictionary["shutdownNow"]:
                return

def RunDirectoryUpload(proxyDictionary, queueOfFoldersToUpload):

    # create our business logic

    businessLogic = bl.BusinessLogic()

    # Log initial message

    logRunLogMessage(proxyDictionary["PodID"], information, 'Folder upload starting', '')

    # count up how much work we have to do

    countResults = countSizeOfFoldersAndFiles(proxyDictionary["LocalDirectoryPathToUpload"])

    proxyDictionary["totalCountFiles"] += countResults[0]
    proxyDictionary["totalCountFolders"] += countResults[1]
    proxyDictionary["totalSizeInBytes"] += countResults[2]

    UploadFolderToServer(businessLogic, proxyDictionary, proxyDictionary["LocalDirectoryPathToUpload"], proxyDictionary["RemoteParentPodFolderID"], proxyDictionary["TreeID"], True, queueOfFoldersToUpload)

def RunFileUpload(proxyDictionary, queueOfFilesUploading):

    # Log initial message

    logRunLogMessage(proxyDictionary["PodID"], information, 'File upload starting', '')

    # count up how much work we have to do

    proxyDictionary["totalCountFiles"] = 1
    proxyDictionary["totalCountFolders"] = 0
    proxyDictionary["totalSizeInBytes"] = os.stat(proxyDictionary["LocalFilePathToUpload"]).st_size

    try:
        os.stat(proxyDictionary["LocalFilePathToUpload"]).st_size # fails if anything is weird with the file

        newFileToUpload = fileUploadingItem()

        newFileToUpload.remoteParentPodFolderID = proxyDictionary["RemoteParentPodFolderID"]
        newFileToUpload.fileName = os.path.basename(proxyDictionary["LocalFilePathToUpload"])
        newFileToUpload.loggedInSecurityUserID = proxyDictionary["LoggedInSecurityUserID"]
        newFileToUpload.localFilePathToUpload = proxyDictionary["LocalFilePathToUpload"]
        newFileToUpload.isDataEncrypted = proxyDictionary["IsDataEncrypted"]
        newFileToUpload.dataEncryptionPassword = proxyDictionary["DataEncryptionPassword"]
        newFileToUpload.podID = proxyDictionary["PodID"]

        queueOfFilesUploading.put(newFileToUpload)

    except:
        logRunLogMessage(proxyDictionary["PodID"], error, 'File failed to upload', proxyDictionary["LocalDirectoryPathToUpload"])

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

def DownloadFolderFromServer(proxyDictionary, path, podFolderID, treeFolders, queueOfFoldersDownloading):

    childFolders = retrieveAllChildNodes(treeFolders, podFolderID)

    # now iterate over folders, add folders,

    for childFolder in childFolders:

        if proxyDictionary["shutdownNow"]:
            return

        # create folder on destination drive

        newPath = MakeDirectoryHelper(path, childFolder['Name'])

        proxyDictionary["totalFoldersProcessed"] += 1

        aFolder = FolderQueueItem()
        aFolder.path = newPath
        aFolder.podId = proxyDictionary["PodID"]
        aFolder.podFolderId = childFolder["FolderID"]

        queueOfFoldersDownloading.put(aFolder)

        DownloadFolderFromServer(proxyDictionary, newPath, childFolder["FolderID"], treeFolders, queueOfFoldersDownloading)

        SetPodLastChangeTime(proxyDictionary)

        if proxyDictionary["shutdownNow"]:
            return

def RunDirectoryDownload(proxyDictionary, queueOfFoldersToDownload):

    # Log initial message

    logRunLogMessage(proxyDictionary["PodID"], information, 'Directory download starting', '')

    # count up how much work we have to do

    countResults = countSizeOfFoldersAndFilesRemote(proxyDictionary["RemoteFolderToDownloadID"])

    proxyDictionary["totalCountFiles"] += countResults[0]
    proxyDictionary["totalCountFolders"] += countResults[1]
    proxyDictionary["totalSizeInBytes"] += countResults[2]

    treeFolders = countResults[3] # we already parsed out the entire tree to download, don't go back to server for this

    # find and add our root

    childFolder = None

    for achildFolder in treeFolders:
        if achildFolder["FolderID"] == proxyDictionary["RemoteFolderToDownloadID"]:
            childFolder = achildFolder
            break

    newPath = MakeDirectoryHelper(proxyDictionary["DestinationPath"], childFolder['Name'])

    proxyDictionary["totalFoldersProcessed"] += 1

    aFolder = FolderQueueItem()
    aFolder.path = newPath
    aFolder.podId = proxyDictionary["PodID"]
    aFolder.podFolderId = childFolder["FolderID"]

    queueOfFoldersToDownload.put(aFolder)

    # now recursively add all other folders

    DownloadFolderFromServer(proxyDictionary, newPath,
                             proxyDictionary["RemoteFolderToDownloadID"],
                         treeFolders, queueOfFoldersToDownload)

    if proxyDictionary["shutdownNow"]:
        return


def RunFileDownload(proxyDictionary, queueOfFilesDownloading):

    businessLogic = bl.BusinessLogic()

    logRunLogMessage(proxyDictionary["PodID"], information, 'File download starting', '')

    # count up how much work we have to do

    proxyDictionary["totalCountFiles"] = 1
    proxyDictionary["totalCountFolders"] = 0

    filePath = proxyDictionary["DestinationPath"] + "/" + proxyDictionary["Filename"]

    externalfileid = businessLogic.RetrieveExternalFileIDByPodFileID(proxyDictionary["RemoteFileToDownloadID"])['externalfileid']

    fileToDownload = fileDownloadingItem()

    fileToDownload.externalFileID = externalfileid
    fileToDownload.filePath = filePath
    fileToDownload.isDataEncrypted = proxyDictionary["IsDataEncrypted"]
    fileToDownload.dataEncryptionPassword = proxyDictionary["DataEncryptionPassword"]
    fileToDownload.loggedInSecurityUserID = proxyDictionary["LoggedInSecurityUserID"]

    queueOfFilesDownloading.put(fileToDownload)


def DownloadFile(proxyDictionary, fileToDownload, queueFilesDownloaded):

    businessLogic = bl.BusinessLogic()

    if False == businessLogic.CheckFileIntegrity(fileToDownload.externalFileID):

        fileToWrite = open(fileToDownload.filePath, "wb")

        filepartcount = businessLogic.StartFileDownload(fileToDownload.externalFileID)

        for partindex in range(0, filepartcount):

            chunk = {}

            chunk["index"] = partindex

            dataReturned = businessLogic.DownloadFilePart(fileToDownload.externalFileID, chunk["index"],
                                               fileToDownload.loggedInSecurityUserID)

            chunk["data"] = dataReturned

            if fileToDownload.isDataEncrypted == True:
                chunk["data"] = businessLogic.DecryptData(chunk["data"], fileToDownload.encryptionPassword,
                                               fileToDownload.loggedInSecurityUserID)

            chunk["data"] = compression.inflate(chunk["data"])

            fileToWrite.write(chunk["data"])

            if proxyDictionary["shutdownNow"] == True:
                return

        fileToWrite.close()

        queueFilesDownloaded.put(fileToDownload)


def UploadFile(fileToUpload, proxyDictionary, queueOfFilesUploaded):

    fileCheckSuccessful = False

    while fileCheckSuccessful == False:  # we will upload this file until our integrity check comes back as a success

        businessLogic = bl.BusinessLogic()

        chunkSize = 64 * 1024
        fileToUpload.currentFileUploadingTotalChunks = os.path.getsize(fileToUpload.localFilePathToUpload) / chunkSize
        if (os.path.getsize(fileToUpload.localFilePathToUpload) % chunkSize) > 0:
            fileToUpload.currentFileUploadingTotalChunks += 1
        currentChunk = 0

        uploadRet = businessLogic.StartFileUpload(fileToUpload.fileName, os.path.getsize(fileToUpload.localFilePathToUpload),
                                                  fileToUpload.remoteParentPodFolderID, fileToUpload.podID)

        fileToUpload.PodFileID = uploadRet[0]
        fileToUpload.fileId = uploadRet[1]

        fileToRead = open(fileToUpload.localFilePathToUpload, "rb")

        try:
            bytesRead = fileToRead.read(chunkSize)

            while bytesRead != "":

                chunk = {}

                chunk["index"] = currentChunk
                chunk["data"] = bytesRead

                if bytesRead != "":

                    beforecompression = len(chunk["data"])

                    chunk["data"] = compression.deflate(chunk["data"])

                    aftercompression = len(chunk["data"])

                    if fileToUpload.isDataEncrypted == True:
                        chunk["data"] = bl.EncryptData(chunk["data"], fileToUpload.encryptionPassword,
                                                       fileToUpload.loggedInSecurityUserID)

                    businessLogic.UploadFilePart(uploadRet[1], chunk["index"], chunk["data"], beforecompression,
                                  aftercompression, fileToUpload.loggedInSecurityUserID)

                    currentChunk = currentChunk + 1

                    if proxyDictionary["shutdownNow"] == True:
                        return

                    bytesRead = fileToRead.read(chunkSize)

            businessLogic.FlagFileUploadComplete(uploadRet[0], proxyDictionary["LoggedInSecurityUserID"])

            if False == businessLogic.CheckFileIntegrity(uploadRet[1]):
                fileCheckSuccessful = True
                queueOfFilesUploaded.put(fileToUpload)

        finally:
            fileToRead.close()