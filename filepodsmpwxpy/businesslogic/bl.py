__author__ = 'Allan'

import json
import urllib2
import os
import zipfile
import uuid
import base64
import wx
import time
import sys
import urllib3
import certifi
import platform
import datetime

from classlibrary import config


class ObjectToSend:
    def __init__(self):
        pass

pmanager = urllib3.PoolManager(
            num_pools=100,
            cert_reqs='CERT_REQUIRED',  # Force certificate check.
            ca_certs='gd_bundle-g2-g1.crt',  # Path to your certificate bundle.
        )

class BusinessLogic():
    def __init__(self):

        self.poolmanager = pmanager

    # Internal Helper Routines

    def zipdir(self, path, zip):
        for root, dirs, files in os.walk(path):
            for file in files:
                zip.write(os.path.join(root, file))

    def TransactWebApiJsonProtocol(self, url, data):

        data.apiusername = config.apiUsername
        data.apipassword = config.apiPassword

        response = None
        jsonReturnData = None

        attempts = 0

        while attempts < 120:
            try:
                response = self.poolmanager.urlopen('POST', url, headers={'Content-Type': 'application/json'},
                                                    body=json.dumps(data.__dict__))
                if response.status == 200:
                    jsonReturnData = json.loads(response.data)
                else:
                    raise Exception("wrong server response code!")
                response.close()
                break
            except Exception as e:
                exc_type, exc_obj, exc_tb = sys.exc_info()
                fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
                print(exc_type, fname, exc_tb.tb_lineno)
                print url
                attempts += 1
                time.sleep(.25)

        return jsonReturnData

    # Communications Protocol Routines

    def RetrieveLatestSoftwareVersion(self):

        objectToSend = ObjectToSend()

        objectToSend.serviceid = 4
        objectToSend.currentversion = {}
        objectToSend.currentversion["major"] = config.VersionMajor
        objectToSend.currentversion["minor"] = 'r' + str(config.VersionMinor)
        objectToSend.platform = platform.system()

        if (objectToSend.platform == 'Darwin'):
            objectToSend.platform = 'Mac OS X'

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrlSoftwareUpdate + '/ajaj/RetrieveLatestSoftwareVersion', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def IsCurrentClientVersionValid(self):

        objectToSend = ObjectToSend()

        objectToSend.majorversion = config.VersionMajor
        objectToSend.minorversion = config.VersionMinor

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/IsCurrentClientVersionValid',
                                                        objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def LoginSystemUser(self, username, password):

        objectToSend = ObjectToSend()

        objectToSend.username = username
        objectToSend.password = password

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/LoginSystemUser', objectToSend)

        if (receiveObject['result'] == True):
            outData = receiveObject['outData']

            if (False == outData['loginresult']):
                outData['securityuserid'] = -1

            return outData['loginresult'], outData['securityuserid']
        else:
            return False

    def IsHandleInUse(self, Handle):

        objectToSend = ObjectToSend()

        objectToSend.handle = Handle

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/IsHandleInUse', objectToSend)

        if (receiveObject['result'] == True):
            outData = receiveObject['outData']

            return True, outData['count']
        else:
            return False, -1

    def RetrieveSecurityUserHandle(self, SecurityUserID):

        objectToSend = ObjectToSend()

        objectToSend.securityuserid = SecurityUserID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveSecurityUserHandle',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            outData = receiveObject['outData']

            return True, outData['nicknames']
        else:
            return False, -1

    def RetrieveSecurityUserIDByHandle(self, Handle):

        objectToSend = ObjectToSend()

        objectToSend.handle = Handle

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveSecurityUserIDByHandle',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            outData = receiveObject['outData']
            return True, outData['securityuserid']
        else:
            return False, -1

    def SetSecurityUserHandle(self, SecurityUserID, Handle):

        objectToSend = ObjectToSend()

        objectToSend.securityuserid = SecurityUserID
        objectToSend.handle = Handle

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/SetSecurityUserHandle', objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def AddFilePod(self, SecurityUserID, Name, Description):

        objectToSend = ObjectToSend()

        objectToSend.securityuserid = SecurityUserID
        objectToSend.name = Name
        objectToSend.description = Description

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/AddFilePod', objectToSend)

        if (receiveObject['result'] == True):
            return True, receiveObject["outData"]["newpodid"]
        else:
            return False, -1

    def ModifyFilePod(self, PodID, Name, Description):

        objectToSend = ObjectToSend()

        objectToSend.podid = PodID
        objectToSend.name = Name
        objectToSend.description = Description

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/ModifyFilePod', objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def DeleteFilePod(self, PodID):

        objectToSend = ObjectToSend()

        objectToSend.podid = PodID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/DeleteFilePod', objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def RetrieveFilePodsByOwnerSecurityUserID(self, securityUserID):

        objectToSend = ObjectToSend()

        objectToSend.securityuserid = securityUserID

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/RetrieveFilePodsByOwnerSecurityUserID', objectToSend)

        if (receiveObject['result'] == True):
            return receiveObject['outData']
        else:
            return False

    def RetrieveFilePodsSharedWithMe(self, securityUserID):

        objectToSend = ObjectToSend()

        objectToSend.securityuserid = securityUserID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveFilePodsSharedWithMe',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            return receiveObject['outData']
        else:
            return False

    def RetrieveFilePodsArchived(self, securityUserID):

        objectToSend = ObjectToSend()

        objectToSend.securityuserid = securityUserID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveFilePodsArchived',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            return receiveObject['outData']
        else:
            return False

    def ArchiveFilePod(self, PodID):

        objectToSend = ObjectToSend()

        objectToSend.podid = PodID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/ArchiveFilePod', objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def UnarchiveFilePod(self, PodID):

        objectToSend = ObjectToSend()

        objectToSend.podid = PodID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/UnarchiveFilePod', objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def RetrieveFilePodInformation(self, podID):

        objectToSend = ObjectToSend()

        objectToSend.podid = podID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveFilePodInformation',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            return receiveObject['outData']
        else:
            return False

    def RetrieveFilePodFilesByParentFolderID(self, podID, parentFolderID):

        objectToSend = ObjectToSend()

        objectToSend.parentfolderid = parentFolderID
        objectToSend.podid = podID

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/RetrieveFilePodFilesByParentFolderID', objectToSend)

        if (receiveObject['result'] == True):
            return receiveObject['outData']['podfolderfiles']
        else:
            return False

    def RetrievePodFileByPodFileID(self, podFileId):

        objectToSend = ObjectToSend()

        objectToSend.podfileid = podFileId

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/RetrievePodFileByPodFileID', objectToSend)

        if (receiveObject['result'] == True):
            return receiveObject['outData']
        else:
            return False

    def RetrieveFilePodSecurityUserAccess(self, podID):

        objectToSend = ObjectToSend()

        objectToSend.podid = podID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveFilePodSecurityUserAccess',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            return receiveObject['outData']
        else:
            return False

    def GrantHandleAccessToFilePod(self, SecurityUserID, PodID):

        objectToSend = ObjectToSend()

        objectToSend.podid = PodID
        objectToSend.securityuserid = SecurityUserID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/GrantHandleAccessToFilePod',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def RevokeHandleAccessToFilePod(self, SecurityUserID, PodID):

        objectToSend = ObjectToSend()

        objectToSend.podid = PodID
        objectToSend.securityuserid = SecurityUserID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RevokeHandleAccessToFilePod',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def RetrieveSecurityUserAccessLevelToFilePod(self, SecurityUserID, PodID):

        objectToSend = ObjectToSend()

        objectToSend.podid = PodID
        objectToSend.securityuserid = SecurityUserID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveSecurityUserAccessLevelToFilePod',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            return receiveObject['outData']
        else:
            return False

    def SetHandleWritePermissionsToFilePod(self, SecurityUserID, PodId, CanWrite):

        objectToSend = ObjectToSend()

        objectToSend.securityuserid = SecurityUserID
        objectToSend.podid = PodId
        objectToSend.canwrite = CanWrite

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/SetHandleWritePermissionsToFilePod',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def LockFilePodForEditing(self, PodId, SecurityUserID):

        objectToSend = ObjectToSend()

        objectToSend.securityuserid = SecurityUserID
        objectToSend.podid = PodId

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/LockFilePodForEditing', objectToSend)

        if (receiveObject['result'] == True):
            if receiveObject['outData']['locksuccessful'] == 1:
                return True
            else:
                return False
        else:
            return False

    def UnlockFilePod(self, PodId):

        objectToSend = ObjectToSend()

        objectToSend.podid = PodId

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/UnlockFilePod', objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def IsFilePodLocked(self, PodId):

        objectToSend = ObjectToSend()

        objectToSend.podid = PodId

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/IsFilePodLocked', objectToSend)

        if (receiveObject['result'] == True):
            outData = receiveObject['outData']
            return True, outData['IsLocked']
        else:
            return False

    def GetLastFilePodLockTime(self, PodId):

        objectToSend = ObjectToSend()

        objectToSend.podid = PodId

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/GetLastFilePodLockTime',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            outData = receiveObject['outData']
            return True, outData
        else:
            return False

    def UpdatePodLastChangeTime(self, PodId):

        objectToSend = ObjectToSend()

        objectToSend.podid = PodId

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/UpdatePodLastChangeTime',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            return receiveObject['outData']['lastchangetime']
        else:
            return False

    def RetrievePodLastChangeTime(self, PodId):

        objectToSend = ObjectToSend()

        objectToSend.podid = PodId

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrievePodLastChangeTime',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            return receiveObject['outData']['lastchangetime']
        else:
            return False

    def RetrieveFilePodRootFolder(self, PodID):

        objectToSend = ObjectToSend()

        objectToSend.podid = PodID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveFilePodRootFolder',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            return True, receiveObject['outData']
        else:
            return False

    def CreateFilePodRootFolder(self, PodID, FolderID, Name):

        objectToSend = ObjectToSend()

        objectToSend.podid = PodID
        objectToSend.folderid = FolderID
        objectToSend.name = Name

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/CreateFilePodRootFolder',
                                                        objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def AddShortcut(self):

        objectToSend = ObjectToSend()

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/AddFilePod', objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def ModifyShortcut(self):

        objectToSend = ObjectToSend()

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/AddFilePod', objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def DeleteShortcut(self):

        objectToSend = ObjectToSend()

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/AddFilePod', objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def RetrieveShortcutsByFilePod(self):

        objectToSend = ObjectToSend()

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/AddFilePod', objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def AddTag(self, systemEntityTypeId, SystemEntityId, tag, securityuserid):

        objectToSend = ObjectToSend()

        objectToSend.tag = {}
        objectToSend.tag['SystemEntityTypeID'] = systemEntityTypeId
        objectToSend.tag['SystemEntityID'] = SystemEntityId
        objectToSend.tag['Tag'] = tag
        objectToSend.tag['OwnerSecurityUserID'] = securityuserid

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/AddTag', objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def ModifyTag(self, systemEntityTagId, systemEntityTypeId, SystemEntityId, tag, tagDateTime, securityuserid):

        objectToSend = ObjectToSend()

        objectToSend.tag = {}
        objectToSend.tag['SystemEntityTagID'] = systemEntityTagId
        objectToSend.tag['SystemEntityTypeID'] = systemEntityTypeId
        objectToSend.tag['SystemEntityID'] = systemEntityTypeId
        objectToSend.tag['Tag'] = tag
        objectToSend.tag['OwnerSecurityUserID'] = securityuserid

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/ModifyTag', objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def DeleteTag(self, systementitytagid):

        objectToSend = ObjectToSend()

        objectToSend.systementitytagid = systementitytagid

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/DeleteTag', objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def RetrieveTagsByOwnerSecurityUserIDAndObject(self, systemEntityTypeId, systemEntityId, securtyuserid):

        objectToSend = ObjectToSend()

        objectToSend.systementitytypeid = systemEntityTypeId
        objectToSend.systementityid = systemEntityId
        objectToSend.ownersecurityuserid = securtyuserid

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveTagsByOwnerSecurityUserIDAndObject', objectToSend)

        if (receiveObject['result'] == True):
            return receiveObject['outData']
        else:
            return False

    def RetrieveAllPreUsedTagsByOwnerSecurityUserID(self, securtyuserid):

        objectToSend = ObjectToSend()

        objectToSend.ownersecurityuserid = securtyuserid

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveAllPreUsedTagsByOwnerSecurityUserID', objectToSend)

        if (receiveObject['result'] == True):
            return receiveObject['outData']
        else:
            return False

    def SearchPodObjectsByTag(self):

        objectToSend = ObjectToSend()

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/AddFilePod', objectToSend)

        if (receiveObject['result'] == True):
            return True
        else:
            return False

    def StartFileUpload(self, filename, filesizeinbytes, folderparentid, podid):

        objectToSend = ObjectToSend()

        objectToSend.filename = filename
        objectToSend.filesizeinbytes = filesizeinbytes
        objectToSend.folderparentid = folderparentid
        objectToSend.podid = podid

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/StartFileUpload', objectToSend)

        if receiveObject['result'] == True:
            outData = receiveObject['outData']
            return outData['podfileid'], outData['fileid']
        else:
            return None

    def UploadFilePart(self, fileid, partindex, partcontent, partoriginalsizeinbytes, partcompressedsizeinbytes, securityuserid):

        objectToSend = ObjectToSend()

        objectToSend.fileid = fileid
        objectToSend.partindex = partindex
        objectToSend.partcontent = base64.b64encode(partcontent)
        objectToSend.partoriginalsizeinbytes = partoriginalsizeinbytes
        objectToSend.partcompressedsizeinbytes = partcompressedsizeinbytes
        objectToSend.securityuserid = securityuserid

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/UploadFilePart', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def FlagFileUploadComplete(self, podfileid, securityUserID):

        objectToSend = ObjectToSend()

        objectToSend.podfileid = podfileid
        objectToSend.securityuserid = securityUserID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/FlagFileUploadComplete',
                                                        objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return None

    def RetrieveExternalFileIDByPodFileID(self, podfileid):

        objectToSend = ObjectToSend()

        objectToSend.podfileid = podfileid

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveExternalFileIDByPodFileID',
                                                        objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return None

    def RetrieveTopRevisionFilePodIDByExistingPodFileIDFamily(self, podfileid):

        objectToSend = ObjectToSend()

        objectToSend.podfileid = podfileid

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/RetrieveTopRevisionFilePodIDByExistingPodFileIDFamily', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return None

    def RetrieveAllPodFileRevisions(self, filename, podparentfolderid):

        objectToSend = ObjectToSend()

        objectToSend.filename = filename
        objectToSend.podparentfolderid = podparentfolderid

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveAllPodFileRevisions',
                                                        objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return None

    def RetrieveAllPodFileRevisionsForListOfFiles(self, filesToPull):

        objectToSend = ObjectToSend()

        objectToSend.filesToPull = filesToPull

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveAllPodFileRevisionsForListOfFiles',
                                                        objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return None

    def StartFileDownload(self, fileid):

        objectToSend = ObjectToSend()

        objectToSend.fileid = fileid

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/StartFileDownload', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']['filepartcount']
        else:
            return None

    def DownloadFilePart(self, fileid, partindex, securityuserid):

        objectToSend = ObjectToSend()

        objectToSend.fileid = fileid
        objectToSend.partindex = partindex
        objectToSend.securityuserid = securityuserid

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/DownloadFilePart', objectToSend)

        if receiveObject['result'] == True:
            outData = receiveObject['outData']
            return base64.b64decode(outData['partcontent'])
        else:
            return False

    def RenameFile(self, podFileID, newFilename):

        objectToSend = ObjectToSend()

        objectToSend.podfileid = podFileID
        objectToSend.newfilename = newFilename

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RenameFile', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def DeleteFile(self, podFileID):

        objectToSend = ObjectToSend()

        objectToSend.podfileid = podFileID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/DeleteFile', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def MoveFileToNewParentFolder(self, podFileID, newParentFolderID):

        objectToSend = ObjectToSend()

        objectToSend.podfileid = podFileID
        objectToSend.newparentfolderid = newParentFolderID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/MoveFileToNewParentFolder',
                                                        objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def RetrieveAllPodFileSharesByOwnerSecurityID(self, securityUserID):

        objectToSend = ObjectToSend()

        objectToSend.ownersecurityuserid = securityUserID

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/RetrieveAllPodFileSharesByOwnerSecurityID', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def RetrieveAllPodFileSharesByPodID(self, podID):

        objectToSend = ObjectToSend()

        objectToSend.podid = podID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveAllPodFileSharesByPodID',
                                                        objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def RetrievePodFileShareByPodFileID(self, podFileID):

        objectToSend = ObjectToSend()

        objectToSend.podfileid = podFileID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrievePodFileShareByPodFileID',
                                                        objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def RetrievePodFileShareByPodFileShareID(self, podFileShareID):

        objectToSend = ObjectToSend()

        objectToSend.podfileshareid = podFileShareID

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/RetrievePodFileShareByPodFileShareID', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def IsAlwaysHighestRevisionForPodFileID(self, podFileID):

        objectToSend = ObjectToSend()

        objectToSend.podfileid = podFileID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/IsAlwaysHighestRevisionForPodFileID',
                                                        objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def AddPodFileShare(self, podID, podFileID, securityUserID, isAlwaysHighestRevision, identifier, description,
                        created, isDecommmissioned, decommissionDate):

        objectToSend = ObjectToSend()

        objectToSend.podfileshare = {}

        objectToSend.podfileshare['PodID'] = podID
        objectToSend.podfileshare['PodFileID'] = podFileID
        objectToSend.podfileshare['OwnerSecurityUserID'] = securityUserID
        objectToSend.podfileshare['IsAlwaysHighestRevision'] = isAlwaysHighestRevision
        objectToSend.podfileshare['Identifier'] = identifier
        objectToSend.podfileshare['Description'] = description
        objectToSend.podfileshare['Created'] = created
        objectToSend.podfileshare['IsDecommissioned'] = isDecommmissioned
        objectToSend.podfileshare['DecommissionDate'] = decommissionDate

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/AddPodFileShare', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def ModifyPodFileShare(self, podFileShareID, podID, podFileID, securityUserID, isAlwaysHighestRevision, identifier,
                           description, created, isDecommmissioned, decommissionDate):

        objectToSend = ObjectToSend()

        objectToSend.podfileshare = {}

        objectToSend.podfileshare['PodFileShareID'] = podFileShareID
        objectToSend.podfileshare['PodID'] = podID
        objectToSend.podfileshare['PodFileID'] = podFileID
        objectToSend.podfileshare['OwnerSecurityUserID'] = securityUserID
        objectToSend.podfileshare['IsAlwaysHighestRevision'] = isAlwaysHighestRevision
        objectToSend.podfileshare['Identifier'] = identifier
        objectToSend.podfileshare['Description'] = description
        objectToSend.podfileshare['Created'] = created
        objectToSend.podfileshare['IsDecommissioned'] = isDecommmissioned
        objectToSend.podfileshare['DecommissionDate'] = decommissionDate

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/ModifyPodFileShare', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def DeletePodFileShare(self, podFileShareID):

        objectToSend = ObjectToSend()

        objectToSend.podfileshareid = podFileShareID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/DeletePodFileShare', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def RetrieveAllPodFolderSharesByOwnerSecurityID(self, securityUserID):

        objectToSend = ObjectToSend()

        objectToSend.ownersecurityuserid = securityUserID

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/RetrieveAllPodFolderSharesByOwnerSecurityID', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def RetrieveAllPodFolderSharesByPodID(self, podID):

        objectToSend = ObjectToSend()

        objectToSend.podid = podID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveAllPodFolderSharesByPodID',
                                                        objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def RetrievePodFolderShareByPodFolderID(self, podFolderID):

        objectToSend = ObjectToSend()

        objectToSend.podfolderid = podFolderID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrievePodFolderShareByPodFolderID',
                                                        objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False


    def RetrievePodFolderShareByPodFolderShareID(self, podFolderShareID):

        objectToSend = ObjectToSend()

        objectToSend.podfoldershareid = podFolderShareID

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/RetrievePodFolderShareByPodFolderShareID', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def AddPodFolderShare(self, podID, podFolderID, securityUserID, identifier, description,
                        webPasscode, created, isDecommmissioned, decommissionDate):

        objectToSend = ObjectToSend()

        objectToSend.podfoldershare = {}

        objectToSend.podfoldershare['PodID'] = podID
        objectToSend.podfoldershare['PodFolderID'] = podFolderID
        objectToSend.podfoldershare['OwnerSecurityUserID'] = securityUserID
        objectToSend.podfoldershare['Identifier'] = identifier
        objectToSend.podfoldershare['Description'] = description
        objectToSend.podfoldershare['WebPasscode'] = webPasscode
        objectToSend.podfoldershare['Created'] = created
        objectToSend.podfoldershare['IsDecommissioned'] = isDecommmissioned
        objectToSend.podfoldershare['DecommissionDate'] = decommissionDate

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/AddPodFolderShare', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def ModifyPodFolderShare(self, podFolderShareID, podID, podFolderID, securityUserID, identifier, description,
                        webPasscode, created, isDecommmissioned, decommissionDate):

        objectToSend = ObjectToSend()

        objectToSend.podfoldershare = {}

        objectToSend.podfoldershare['PodFolderShareID'] = podFolderShareID
        objectToSend.podfoldershare['PodID'] = podID
        objectToSend.podfoldershare['PodFolderID'] = podFolderID
        objectToSend.podfoldershare['OwnerSecurityUserID'] = securityUserID
        objectToSend.podfoldershare['Identifier'] = identifier
        objectToSend.podfoldershare['Description'] = description
        objectToSend.podfoldershare['WebPasscode'] = webPasscode
        objectToSend.podfoldershare['Created'] = created
        objectToSend.podfoldershare['IsDecommissioned'] = isDecommmissioned
        objectToSend.podfoldershare['DecommissionDate'] = decommissionDate

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/ModifyPodFolderShare', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def DeletePodFolderShare(self, podFolderShareID):

        objectToSend = ObjectToSend()

        objectToSend.podfoldershareid = podFolderShareID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/DeletePodFolderShare', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def IsPodFolderShareUsernameInUse(self, identifier):

        objectToSend = ObjectToSend()

        objectToSend.identifier = identifier

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/IsPodFolderShareUsernameInUse', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def RetrieveAllPodFolderImportsByOwnerSecurityID(self, securityUserID):

        objectToSend = ObjectToSend()

        objectToSend.ownersecurityuserid = securityUserID

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/RetrieveAllPodFolderImportsByOwnerSecurityID', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def RetrieveAllPodFolderImportsByPodID(self, podID):

        objectToSend = ObjectToSend()

        objectToSend.podid = podID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveAllPodFolderImportsByPodID',
                                                        objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def RetrievePodFolderImportByPodFolderID(self, podFolderID):

        objectToSend = ObjectToSend()

        objectToSend.podfolderid = podFolderID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrievePodFolderImportByPodFolderID',
                                                        objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False


    def RetrievePodFolderImportByPodFolderImportID(self, podFolderImportID):

        objectToSend = ObjectToSend()

        objectToSend.podfolderimportid = podFolderImportID

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/RetrievePodFolderImportByPodFolderImportID', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def AddPodFolderImport(self, podID, podFolderID, securityUserID, identifier, description,
                        webPasscode, created, isDecommmissioned, decommissionDate):

        objectToSend = ObjectToSend()

        objectToSend.podfolderimport = {}

        objectToSend.podfolderimport['PodID'] = podID
        objectToSend.podfolderimport['PodFolderID'] = podFolderID
        objectToSend.podfolderimport['OwnerSecurityUserID'] = securityUserID
        objectToSend.podfolderimport['Identifier'] = identifier
        objectToSend.podfolderimport['Description'] = description
        objectToSend.podfolderimport['WebPasscode'] = webPasscode
        objectToSend.podfolderimport['Created'] = created
        objectToSend.podfolderimport['IsDecommissioned'] = isDecommmissioned
        objectToSend.podfolderimport['DecommissionDate'] = decommissionDate

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/AddPodFolderImport', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def ModifyPodFolderImport(self, podFolderImportID, podID, podFolderID, securityUserID, identifier, description,
                        webPasscode, created, isDecommmissioned, decommissionDate):

        objectToSend = ObjectToSend()

        objectToSend.podfolderimport = {}

        objectToSend.podfolderimport['PodFolderImportID'] = podFolderImportID
        objectToSend.podfolderimport['PodID'] = podID
        objectToSend.podfolderimport['PodFolderID'] = podFolderID
        objectToSend.podfolderimport['OwnerSecurityUserID'] = securityUserID
        objectToSend.podfolderimport['Identifier'] = identifier
        objectToSend.podfolderimport['Description'] = description
        objectToSend.podfolderimport['WebPasscode'] = webPasscode
        objectToSend.podfolderimport['Created'] = created
        objectToSend.podfolderimport['IsDecommissioned'] = isDecommmissioned
        objectToSend.podfolderimport['DecommissionDate'] = decommissionDate

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/ModifyPodFolderImport', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def DeletePodFolderImport(self, podFolderImportID):

        objectToSend = ObjectToSend()

        objectToSend.podfolderimportid = podFolderImportID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/DeletePodFolderImport', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def IsPodFolderImportUsernameInUse(self, identifier):

        objectToSend = ObjectToSend()

        objectToSend.identifier = identifier

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/IsPodFolderImportUsernameInUse', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def RetrieveAllPodFileShortcutsBySecurityUserID(self, securityUserID, isGlobal, podID):

        objectToSend = ObjectToSend()

        objectToSend.securityuserid = securityUserID
        objectToSend.isglobal = isGlobal
        objectToSend.podid = podID

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/RetrieveAllPodFileShortcutsBySecurityUserID', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def RetrievePodFileShortcutByPodFileShortcutID(self, podFileShortcutID):

        objectToSend = ObjectToSend()

        objectToSend.podfileshortcutid = podFileShortcutID

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/RetrievePodFileShortcutByPodFileShortcutID', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def AddPodFileShortcut(self, podFileID, name, securityUserID, podID, isGlobal):

        objectToSend = ObjectToSend()

        objectToSend.podfileshortcut = {}

        objectToSend.podfileshortcut['PodFileID'] = podFileID
        objectToSend.podfileshortcut['Name'] = name
        objectToSend.podfileshortcut['SecurityUserID'] = securityUserID
        objectToSend.podfileshortcut['PodID'] = podID
        objectToSend.podfileshortcut['IsGlobal'] = isGlobal
        objectToSend.podfileshortcut['Created'] = datetime.datetime.now().isoformat()
        objectToSend.podfileshortcut['IsDeleted'] = 0

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/AddPodFileShortcut', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def ModifyPodFileShortcutName(self, podFileShortcutID, name):

        objectToSend = ObjectToSend()

        objectToSend.podfileshortcutid = podFileShortcutID
        objectToSend.name = name

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/ModifyPodFileShortcutName', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def DeletePodFileShortcut(self, podFileShortcutID):

        objectToSend = ObjectToSend()

        objectToSend.podfileshortcutid = podFileShortcutID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/DeletePodFileShortcut', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def RetrieveAllPodFolderShortcutsBySecurityUserID(self, securityUserID, isGlobal, podID):

        objectToSend = ObjectToSend()

        objectToSend.securityuserid = securityUserID
        objectToSend.isglobal = isGlobal
        objectToSend.podid = podID

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/RetrieveAllPodFolderShortcutsBySecurityUserID', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def RetrievePodFolderShortcutByPodFolderShortcutID(self, podFolderShortcutID):

        objectToSend = ObjectToSend()

        objectToSend.podfoldershortcutid = podFolderShortcutID

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/RetrievePodFolderShortcutByPodFolderShortcutID', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def AddPodFolderShortcut(self, securityUserID, podFolderID, name, podID, isGlobal):

        objectToSend = ObjectToSend()

        objectToSend.podfoldershortcut = {}

        objectToSend.podfoldershortcut['SecurityUserID'] = securityUserID
        objectToSend.podfoldershortcut['PodFolderID'] = podFolderID
        objectToSend.podfoldershortcut['Name'] = name
        objectToSend.podfoldershortcut['PodID'] = podID
        objectToSend.podfoldershortcut['IsGlobal'] = isGlobal
        objectToSend.podfoldershortcut['Created'] = datetime.datetime.now().isoformat()
        objectToSend.podfoldershortcut['IsDeleted'] = 0

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/AddPodFolderShortcut', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def ModifyPodFolderShortcutName(self, podFolderShortcutID, name):

        objectToSend = ObjectToSend()

        objectToSend.podfoldershortcutid = podFolderShortcutID
        objectToSend.name = name

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/ModifyPodFolderShortcutName', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def DeletePodFolderShortcut(self, podFolderShortcutID):

        objectToSend = ObjectToSend()

        objectToSend.podfoldershortcutid = podFolderShortcutID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/DeletePodFolderShortcut', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def SearchForFiles(self, includeName, isCaseSensitive, name,
                       includeFizeSize, sizeFromInBytes, sizeToInBytes,
                       includeCreated, createdFromDate, createdToDate,
                       includePod, podId,
                       includeTags, listTags, securityUserId):

        objectToSend = ObjectToSend()

        objectToSend.includename = includeName
        objectToSend.iscasesensitive = isCaseSensitive
        objectToSend.name = name
        objectToSend.includefilesize = includeFizeSize
        objectToSend.sizefrominbytes = sizeFromInBytes
        objectToSend.sizetoinbytes = sizeToInBytes
        objectToSend.includecreated = includeCreated
        objectToSend.createdfromdate = createdFromDate
        objectToSend.createdtodate = createdToDate
        objectToSend.includepod = includePod
        objectToSend.podid = podId
        objectToSend.includetags = includeTags
        objectToSend.listtags = listTags
        objectToSend.securityuserid = securityUserId

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/SearchForFiles', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def SearchForFolders(self, includeName, isCaseSensitive, name,
                       includeCreated, createdFromDate, createdToDate,
                       includePod, podId,
                       includeTags, listTags,
                        securityUserId):

        objectToSend = ObjectToSend()

        objectToSend.includename = includeName
        objectToSend.iscasesensitive = isCaseSensitive
        objectToSend.name = name
        objectToSend.includecreated = includeCreated
        objectToSend.createdfromdate = createdFromDate
        objectToSend.createdtodate = createdToDate
        objectToSend.includepod = includePod
        objectToSend.podname = podId
        objectToSend.includetags = includeTags
        objectToSend.listtags = listTags
        objectToSend.securityuserid = securityUserId

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/SearchForFolders', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def RetrievePodByFolderID(self, folderId):

        objectToSend = ObjectToSend()

        objectToSend.folderid = folderId

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrievePodByFolderID', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']
        else:
            return False

    def InsertRootFolder(self, folder):

        objectToSend = ObjectToSend()

        objectToSend.newFolder = folder

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/InsertRootFolder', objectToSend)

        if receiveObject['result'] == True:
            outData = receiveObject['outData']
            return outData['newFolder']
        else:
            return False

    def InsertFolderBelowExistingFolder(self, existingfolderid, newFolder):

        objectToSend = ObjectToSend()

        objectToSend.existingFolderID = existingfolderid
        objectToSend.newFolder = newFolder

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/InsertFolderBelowExistingFolder',
                                                        objectToSend)

        if receiveObject['result'] == True:
            outData = receiveObject['outData']
            return outData['newFolder']
        else:
            return False

    def InsertFolderChildOfExistingFolder(self, existingfolderid, newFolder):

        objectToSend = ObjectToSend()

        objectToSend.existingFolderID = existingfolderid
        objectToSend.newFolder = newFolder

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/insertFolderChildOfExistingFolder',
                                                        objectToSend)

        if receiveObject['result'] == True:
            outData = receiveObject['outData']
            return outData['newFolder']
        else:
            return False

    def RetrieveTreeIDByFolderID(self, existingfolderid):

        objectToSend = ObjectToSend()

        objectToSend.folderid = existingfolderid

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/retrieveTreeIDByFolderID',
                                                        objectToSend)

        if receiveObject['result'] == True:
            outData = receiveObject['outData']
            return outData['treeid']
        else:
            return False

    def RetrieveFolderTree(self, treeid):

        objectToSend = ObjectToSend()

        objectToSend.treeid = treeid

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveFolderTree', objectToSend)

        if receiveObject['result'] == True:
            outData = receiveObject['outData']
            return outData['treefolders']
        else:
            return False

    def RetrieveAllChildFoldersByFolderID(self, folderID):

        objectToSend = ObjectToSend()

        objectToSend.folderid = folderID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/retrieveAllChildFoldersByFolderID',
                                                        objectToSend)

        if receiveObject['result'] == True:
            outData = receiveObject['outData']
            return outData['folders']
        else:
            return False

    def RetrieveFolderByFolderId(self, folderid):

        objectToSend = ObjectToSend()

        objectToSend.folderid = folderid

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveFolderByFolderId',
                                                        objectToSend)

        if receiveObject['result'] == True:
            outData = receiveObject['outData']
            return outData['folder']
        else:
            return False

    def RetrieveFileCountUnderParentFolders(self, parentfolderids):

        objectToSend = ObjectToSend()

        objectToSend.parentfolderids = parentfolderids

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/RetrieveFileCountUnderParentFolders',
                                                        objectToSend)

        if receiveObject['result'] == True:
            outData = receiveObject['outData']
            return outData['countfiles'], outData['totalsizeinbytes']
        else:
            return False

    def RenameFolder(self, folderid, newname):

        objectToSend = ObjectToSend()

        objectToSend.folderid = folderid
        objectToSend.newname = newname

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/renameFolder', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def MoveFolderToNewParent(self, folderId, newParentFolderID):

        objectToSend = ObjectToSend()

        objectToSend.existingFolder = {}
        objectToSend.existingFolder["FolderID"] = folderId

        objectToSend.newFolderParent = {}
        objectToSend.newFolderParent["FolderID"] = newParentFolderID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/MoveFolderUnderExistingChild', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def MoveFolderDownOneNode(self, existingFolderID):

        objectToSend = ObjectToSend()

        objectToSend.existingFolder = {}
        objectToSend.existingFolder["FolderID"] = existingFolderID

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/MoveFolderDownOneNode', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def MoveFolderUpOneNode(self, existingFolderID):

        objectToSend = ObjectToSend()

        objectToSend.existingFolder = {}
        objectToSend.existingFolder["FolderID"] = existingFolderID

        receiveObject = self.TransactWebApiJsonProtocol(
            config.serviceUrl + '/ajaj/MoveFolderUpOneNode', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def DeleteFolder(self, folderId, securityUserID):

        objectToSend = ObjectToSend()

        objectToSend.existingFolderID = folderId
        objectToSend.modifiedBySecurityUserID = securityUserID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/DeleteFolder', objectToSend)

        if receiveObject['result'] == True:
            return True
        else:
            return False

    def CheckFileIntegrity(self, fileID):

        objectToSend = ObjectToSend()

        objectToSend.fileid = fileID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/CheckFileIntegrity', objectToSend)

        if receiveObject['result'] == True:
            return receiveObject['outData']['fileinvalid']
        else:
            return False

    def LogSystemMessage(self, LogMessageTypeID, Title, Body, PodID):

        objectToSend = ObjectToSend()

        objectToSend.logmessagetypeid = LogMessageTypeID
        objectToSend.title = Title
        objectToSend.body = Body
        objectToSend.podid = PodID

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/LogSystemMessage', objectToSend)

        return receiveObject['result']

    def EncryptData(self, unencryptedData, encryptionPassword, securityUserID):

        objectToSend = ObjectToSend()

        objectToSend.unencrypteddata = base64.b64encode(unencryptedData)
        objectToSend.securityuserid = securityUserID
        objectToSend.encryptionpassword = encryptionPassword

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/encryptData', objectToSend)

        if receiveObject['result'] == True:
            outData = receiveObject['outData']
            return base64.b64decode(outData['encrypteddata'])
        else:
            return None

    def DecryptData(self, encryptedData, encryptionPassword, securityUserID):

        objectToSend = ObjectToSend()

        objectToSend.securityuserid = securityUserID
        objectToSend.encrypteddata = base64.b64encode(encryptedData)
        objectToSend.encryptionpassword = encryptionPassword

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrl + '/ajaj/decryptData', objectToSend)

        if receiveObject['result'] == True:
            outData = receiveObject['outData']
            return base64.b64decode(outData['unencrypteddata'])
        else:
            return None

    # Communications Protocol Routines for Marketing

    def SendaFrown(self, message, securityUserID, includeEmailAddress, emailAddress):

        objectToSend = ObjectToSend()

        objectToSend.Message = message
        objectToSend.SecurityUserID = securityUserID
        objectToSend.IncludeEmailAddress = includeEmailAddress
        objectToSend.EmailAddress = emailAddress
        objectToSend.Service = config.Service
        objectToSend.VersionMajor = config.VersionMajor
        objectToSend.VersionMinor = config.VersionMinor
        objectToSend.Created = datetime.datetime.now().isoformat();

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrlMarketing + '/ajaj/LogFrown', objectToSend)

        return receiveObject['result']

    def SendaSmile(self, message, securityUserID, includeEmailAddress, emailAddress):

        objectToSend = ObjectToSend()

        objectToSend.Message = message
        objectToSend.SecurityUserID = securityUserID
        objectToSend.IncludeEmailAddress = includeEmailAddress
        objectToSend.EmailAddress = emailAddress
        objectToSend.Service = config.Service
        objectToSend.VersionMajor = config.VersionMajor
        objectToSend.VersionMinor = config.VersionMinor
        objectToSend.Created = datetime.datetime.now().isoformat();

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrlMarketing + '/ajaj/LogSmile', objectToSend)

        return receiveObject['result']

    def SendaBug(self, report, securityUserID):

        objectToSend = ObjectToSend()

        objectToSend.Report = report
        objectToSend.SecurityUserID = securityUserID
        objectToSend.Service = config.Service
        objectToSend.VersionMajor = config.VersionMajor
        objectToSend.VersionMinor = config.VersionMinor

        receiveObject = self.TransactWebApiJsonProtocol(config.serviceUrlMarketing + '/ajaj/LogBug', objectToSend)

        return receiveObject['result']

    def SendEmail(self, fromaddress, to, subject, text, html):

        objectToSend = ObjectToSend()

        objectToSend.apiusername = config.apiUsernameEmailSender
        objectToSend.apipassword = config.apiPasswordEmailSender

        objectToSend.Email = {}
        objectToSend.Email["From"] = fromaddress
        objectToSend.Email["To"] = to
        objectToSend.Email["Subject"] = subject
        objectToSend.Email["Text"] = text
        objectToSend.Email["Html"] = html

        receiveObject = self.TransactWebApiJsonProtocol(config.emailSenderServiceUrl + '/ajaj/sendEmail', objectToSend)

        return receiveObject['result']

    def SendTextMessage(self, to, body):

        objectToSend = ObjectToSend()

        objectToSend.apiusername = config.apiUsernameTextMessageSender
        objectToSend.apipassword = config.apiPasswordTextMessageSender

        objectToSend.TextMessage = {}
        objectToSend.TextMessage["To"] = to
        objectToSend.TextMessage["Body"] = body

        receiveObject = self.TransactWebApiJsonProtocol(config.textMessageSenderServiceUrl + '/ajaj/sendTextMessage',
                                                        objectToSend)

        return receiveObject['result']
