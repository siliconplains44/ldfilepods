__author__ = 'Allan'


import os
import threading
import time
import Queue
import multiprocessing

from classlibrary import compression

from businesslogic import bl

# threading dependencies

def filedownloaderthreadproc(fd):

        while fd.runDownloader == True:

            fileToDownload = None

            try:
                if fd.maxSimaltaneousDownloads > fd.currentSimaltaneousDownloads:
                    fileToDownload = fd.queueFilesToDownload.get(False)
            except Queue.Empty:
                fileToDownload = None

            if fileToDownload != None:
                fd.DownloadFileMultiThreaded(fileToDownload, 4)
            else:
                time.sleep(.1)


def workerthreadproc(fd,  fileToDownload):

    while fileToDownload.writeFinished == False:
        try:
            chunk = fileToDownload.chunkProcessQueue.get(False)
        except Queue.Empty:
            chunk = None

        if fd.runDownloader == False:
            return

        if (chunk != None):
            businessLogic = bl.BusinessLogic()

            chunk["data"] = businessLogic.DownloadFilePart(fileToDownload.fileId, chunk["index"], fileToDownload.securityUserId)

            if fileToDownload.isEncrypted == True:
                chunk["data"] = businessLogic.DecryptData(chunk["data"], fileToDownload.encryptionPassword, fileToDownload.securityUserId)

            chunk["data"] = compression.inflate(chunk["data"])

            fileToDownload.chunkWriteOutQueue.put(chunk)
            fileToDownload.chunkProcessQueue.task_done()
        else:
            time.sleep(.1)


def writerthreadproc(fd, fileToDownload, totalChunks):

        fileToWrite = open(fileToDownload.filePath, "wb")

        filepartidindex = 0
        currentChunkTargetIndex = 0

        dictChunksToWrite = {}

        while totalChunks > fileToDownload.currentFileDownloadingChunksCompleted:
            if fileToDownload.chunkWriteOutQueue.qsize() > 0:
                try:
                    chunk = fileToDownload.chunkWriteOutQueue.get(False)
                except Queue.Empty:
                    chunk = None

                if fd.runDownloader == False:
                    return

                if chunk != None:
                    dictChunksToWrite[chunk["index"]] = chunk
                    fileToDownload.chunkWriteOutQueue.task_done()

            if currentChunkTargetIndex in dictChunksToWrite:
                fileToWrite.write(dictChunksToWrite[currentChunkTargetIndex]["data"])
                del dictChunksToWrite[currentChunkTargetIndex]
                filepartidindex += 1
                if filepartidindex < totalChunks:
                    currentChunkTargetIndex = filepartidindex
                fileToDownload.currentFileDownloadingChunksCompleted += 1

            time.sleep(.1)

        fileToWrite.close()
        fileToDownload.completedSuccessfully = True
        fileToDownload.writeFinished = True


class FileToDownload():

    def __init__(self):

        self.queuedFileId = ''
        self.fileId = -1
        self.filePath = ''
        self.isEncrypted = False
        self.encryptionPassword = ''
        self.completedSuccessfully = False
        self.securityUserId = -1
        self.chunkProcessQueue = Queue.Queue()
        self.chunkWriteOutQueue = Queue.Queue()
        self.currentFileDownloadingTotalChunks = 0
        self.currentFileDownloadingChunksCompleted = 0
        self.writeFinished = False

class FileDownloader():

    def __init__(self):

        # file download thread

        self.queueFilesToDownload = Queue.Queue()
        self.listCompletedFiles = {}
        self.runDownloader = False
        self.fileDownloadThread = None

        # file downloader thread support

        self.maxChunksToPipeline = 100
        self.maxSimaltaneousDownloads = 2
        self.currentSimaltaneousDownloads = 0

    def Start(self):

        self.runDownloader = True
        self.fileDownloadThread = threading.Thread(target=filedownloaderthreadproc, args=(self,))
        self.fileDownloadThread.start()

    def Stop(self):

        self.runDownloader = False

    def QueueFileForDownload(self, queuedFileId, fileId, filePath, isEncrypted, encryptionPassword, securityUserId):

        fileToDownload = FileToDownload()

        fileToDownload.queuedFileId = str(queuedFileId)
        fileToDownload.fileId = fileId
        fileToDownload.filePath = filePath
        fileToDownload.isEncrypted = isEncrypted
        fileToDownload.encryptionPassword = encryptionPassword
        fileToDownload.securityUserId = securityUserId

        self.queueFilesToDownload.put(fileToDownload)

    def CheckForFileDownloadCompletion(self, queuedFileId):

        fileToDownload = self.listCompletedFiles.get(str(queuedFileId))

        if fileToDownload != None:
            return fileToDownload.completedSuccessfully
        else:
            return None

    def RetrieveCountFilesQueued(self):
        return self.queueFilesToDownload.qsize()

    def DownloadFileMultiThreaded(self, fileToDownload, countThreads):

        self.currentSimaltaneousDownloads += 1

        businessLogic = bl.BusinessLogic()

        if False == businessLogic.CheckFileIntegrity(fileToDownload.fileId):

            self.currentFileDownloadingChunksCompleted = 0

            filepartcount = businessLogic.StartFileDownload(fileToDownload.fileId)

            self.currentFileDownloadingTotalChunks = filepartcount

            currentChunk = 0

            threads = []

            writerThread = threading.Thread(target=writerthreadproc, args=(self, fileToDownload, filepartcount))
            threads.append(writerThread)
            writerThread.start()

            for i in range(countThreads):
                thread = threading.Thread(target=workerthreadproc, args=(self, fileToDownload))
                threads.append(thread)
                thread.start()

            for partindex in range(0, filepartcount):

                chunk = {}

                chunk["index"] = partindex

                waitForPipelineSpace = True

                while (waitForPipelineSpace == True) :

                    if (fileToDownload.chunkProcessQueue.qsize() < self.maxChunksToPipeline):
                        waitForPipelineSpace = False

                    if self.runDownloader == False:
                        return

                fileToDownload.chunkProcessQueue.put(chunk)

            while fileToDownload.writeFinished == False:
                if self.runDownloader == False:
                    return
                time.sleep(.1)

            self.listCompletedFiles[fileToDownload.queuedFileId] = fileToDownload
        else:
            self.listCompletedFiles[fileToDownload.queuedFileId] = fileToDownload

        self.currentSimaltaneousDownloads -= 1