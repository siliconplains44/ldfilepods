__author__ = 'Allan'

import os
import threading
import time
import Queue
import multiprocessing

from classlibrary import compression

from businesslogic import bl

# threading dependencies

def fileuploaderthreadproc(fu):

    fileToUpload= None

    while fu.runUploader == True:
        try:
            if fu.maxSimaltaneousFileUploads > fu.currentSimaltaneousFileUploads:
                fileToUpload = fu.queueFilesToUpload.get(False)
        except Queue.Empty:
            fileToUpload = None

        if fileToUpload != None:
            fu.UploadFileMultiThreaded(fileToUpload, 4)
        else:
            time.sleep(.1)


def workerthreadproc(fu, fileToUpload):

    while fileToUpload.writeFinished == False:
        try:
            chunk = fileToUpload.chunkProcessQueue.get(False)
        except Queue.Empty:
            chunk = None

        if fu.runUploader == False:
            return

        if chunk is not None:
            businessLogic = bl.BusinessLogic()

            beforecompression = len(chunk["data"])

            chunk["data"] = compression.deflate(chunk["data"])

            aftercompression = len(chunk["data"])

            if fileToUpload.isEncrypted == True:
                chunk["data"] = businessLogic.EncryptData(chunk["data"], fileToUpload.encryptionPassword, fileToUpload.securityUserId)

            businessLogic.UploadFilePart(fileToUpload.fileId, chunk["index"], chunk["data"], beforecompression, aftercompression,  fileToUpload.securityUserId)

            chunk["data"] = None

            fileToUpload.chunkWriteOutQueue.put(chunk)
            fileToUpload.chunkProcessQueue.task_done()
        else:
            time.sleep(.1)


def writerthreadproc(fu, fileToUpload, totalChunks):

        fileToUpload.currentFileUploadingChunksCompleted = 0

        while totalChunks > fileToUpload.currentFileUploadingChunksCompleted:
            if fileToUpload.chunkWriteOutQueue.qsize() > 0:
                try:
                    chunk = fileToUpload.chunkWriteOutQueue.get(False)
                except Queue.Empty:
                    chunk = None

                if fu.runUploader == False:
                    return

                if chunk != None:
                    fileToUpload.chunkWriteOutQueue.task_done()
                    fileToUpload.currentFileUploadingChunksCompleted += 1

            time.sleep(.1)

        businessLogic = bl.BusinessLogic()

        businessLogic.FlagFileUploadComplete(fileToUpload.PodFileID, fileToUpload.securityUserId)
        fileToUpload.completedSuccessfully = True

        fileToUpload.writeFinished = True


class FileToUpload():

    def __init__(self):

        self.PodFileID = -1
        self.folderParentId = -1
        self.PodID = -1
        self.fileId = -1
        self.queuedFileId = ''
        self.filePath = ''
        self.fileName = ''
        self.isEncrypted = False
        self.encryptionPassword = ''
        self.completedSuccessfully = False
        self.securityUserId = -1
        self.chunkProcessQueue = Queue.Queue()
        self.chunkWriteOutQueue = Queue.Queue()
        self.currentFileUploadingTotalChunks = 0
        self.currentFileUploadingChunksCompleted = 0
        self.writeFinished = False

class FileUploader():

    def __init__(self):

        # identification

        self.id = None

        # file upload thread

        self.queueFilesToUpload = Queue.Queue()
        self.listCompletedFiles = {}
        self.runUploader = False
        self.fileUploadThread = None

        # file uploader thread support

        self.maxChunksToPipeline = 100
        self.maxSimaltaneousFileUploads = 2
        self.currentSimaltaneousFileUploads = 0


    def Start(self):

        self.runUploader = True
        self.fileUploadThread = threading.Thread(target=fileuploaderthreadproc, args=(self,))
        self.fileUploadThread.start()

    def Stop(self):
        self.runUploader = False

    def QueueFileForUpload(self, folderParentId, fileName, securityUserId, queuedFileId, filePath, isEncrypted,
                           encryptionPassword, PodID):

        fileToUpload = FileToUpload()

        fileToUpload.PodFileID = -1
        fileToUpload.folderParentId = folderParentId
        fileToUpload.PodID = PodID
        fileToUpload.fileName = fileName
        fileToUpload.fileId = -1
        fileToUpload.queuedFileId = str(queuedFileId)
        fileToUpload.filePath = filePath
        fileToUpload.isEncrypted = isEncrypted
        fileToUpload.encryptionPassword = encryptionPassword
        fileToUpload.securityUserId = securityUserId

        self.queueFilesToUpload.put(fileToUpload)

    def CheckForFileUploadCompletion(self, queuedFileId):

        fileToUpload = self.listCompletedFiles.get(str(queuedFileId))

        if fileToUpload != None:
            return fileToUpload.completedSuccessfully
        else:
            return None

    def RetrieveCountFilesQueued(self):
        return self.queueFilesToUpload.qsize()

    def UploadFileMultiThreaded(self, fileToUpload, countThreads):

        self.currentSimaltaneousFileUploads += 1

        fileCheckSuccessful = False

        while fileCheckSuccessful == False: # we will upload this file until our integrity check comes back as a success

            fileToUpload.currentFileUploadingChunksCompleted = 0
            fileToUpload.writeFinished = False

            businessLogic = bl.BusinessLogic()

            chunkSize = 64 * 1024
            fileToUpload.currentFileUploadingTotalChunks = os.path.getsize(fileToUpload.filePath) / chunkSize
            if (os.path.getsize(fileToUpload.filePath) % chunkSize) > 0:
                fileToUpload.currentFileUploadingTotalChunks += 1
            currentChunk = 0

            uploadRet = businessLogic.StartFileUpload(fileToUpload.fileName, os.path.getsize(fileToUpload.filePath),
                                           fileToUpload.folderParentId, fileToUpload.PodID)

            fileToUpload.PodFileID = uploadRet[0]
            fileToUpload.fileId = uploadRet[1]

            threads = []

            writerThread = threading.Thread(target=writerthreadproc, args=(self, fileToUpload, fileToUpload.currentFileUploadingTotalChunks))
            threads.append(writerThread)
            writerThread.start()

            for i in range(countThreads):
                thread = threading.Thread(target=workerthreadproc, args=(self, fileToUpload))
                threads.append(thread)
                thread.start()

            fileToRead = open(fileToUpload.filePath, "rb")

            try:
                bytesRead = fileToRead.read(chunkSize)

                if (bytesRead != ""):

                    chunk = {}

                    chunk["index"] = currentChunk
                    chunk["data"] = bytesRead

                    fileToUpload.chunkProcessQueue.put(chunk)
                    currentChunk += 1

                while bytesRead != "":

                    bytesRead = fileToRead.read(chunkSize)

                    if bytesRead != "":

                        chunk = {}

                        chunk["index"] = currentChunk
                        chunk["data"] = bytesRead

                        waitForPipelineSpace = True

                        while waitForPipelineSpace == True:

                            if fileToUpload.chunkProcessQueue.qsize() < self.maxChunksToPipeline:
                                waitForPipelineSpace = False

                        fileToUpload.chunkProcessQueue.put(chunk)
                        currentChunk += 1

                    if self.runUploader == False:
                        return

                while fileToUpload.writeFinished == False:
                    if self.runUploader == False:
                        return
                    time.sleep(.05)

                if False == businessLogic.CheckFileIntegrity(fileToUpload.fileId):
                    self.listCompletedFiles[fileToUpload.queuedFileId] = fileToUpload
                    fileCheckSuccessful = True

            finally:
                fileToRead.close()
                self.currentSimaltaneousFileUploads -= 1

