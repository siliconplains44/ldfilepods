__author__ = 'Allan'

import wx
import wx.xrc
import time
import webbrowser
import os
import threading
import time
import Queue
import multiprocessing

from classlibrary import treenodeinfo

from businesslogic import bl

# threading dependencies

def filepodssharedwithmewatcherproc(treemanager):

    time.sleep(1)

    while treemanager.runFilePodsSharedWithMeWatcherThread:

            businessLogic = bl.BusinessLogic()

            podsFromServer = businessLogic.RetrieveFilePodsSharedWithMe(treemanager.mainWindow.loggedInSecurityUserID)['pods']

            # check for a pod that is on the server but not in our local list, means somebody shared with us

            refreshed = False

            for serverpod in podsFromServer:

                foundPodInBothSpots = False

                for localpod in treemanager.filePodsSharedWithMe:
                    if serverpod['PodID'] == localpod["PodID"]:
                        foundPodInBothSpots = True
                        break

                if False == foundPodInBothSpots:
                    treemanager.loadFilePodsSharedWithMe()
                    refreshed = True
                    break

            # now look for pods we have locally that are not in the remote list, means somebody unshared and
            # we need to remove it from our share list

            if refreshed == False:
                cid, child = treemanager.treeCtrl.GetFirstChild(treemanager.OthersFilePodsRoot)

                while cid.IsOk():

                    treenodeinfo = treemanager.treeCtrl.GetItemData(cid).GetData()

                    foundPodInBothSpots = False

                    for serverpod in podsFromServer:
                        if treenodeinfo.dbid == serverpod["PodID"]:
                            foundPodInBothSpots = True
                            break

                    if False == foundPodInBothSpots:
                        treemanager.loadFilePodsSharedWithMe()
                        break

                    cid, child = treemanager.treeCtrl.GetNextChild(treemanager.ArchivedFilePodsRoot, child)

            for i in range(0, 5):
                time.sleep(1)
                if treemanager.runFilePodsSharedWithMeWatcherThread == False:
                    return


def walk_branches(tree, root):

    item, cookie = tree.GetFirstChild(root)

    while item.IsOk():
        yield item

        itemData = tree.GetItemData(item).GetData()

        if True == tree.ItemHasChildren(item):
            for node in walk_branches(tree, item):
                yield node

        item, cookie = tree.GetNextChild(root, cookie)


class TreeManager():

    # primary members

    mainWindow = None
    treeCtrl = None

    # tree nodes

    appRoot = None
    MyFilePodsRoot = None
    OthersFilePodsRoot = None
    FilesInEditRoot = None
    RunningOperationsRoot = None
    MyQuickShortcutsRoot = None
    FilesWebSharedRoot = None
    FoldersWebSharedRoot = None

    # popup menus

    popupMenuMyFilePodsRoot = None
    popupMenuMyFilePodRoot = None
    popupMenuOthersFilePodsRoot = None
    popupMenuOthersFilePodRoot = None

    # tree ctrl images

    imgfilepodsicons_browsers = None
    imgfilepodsicons_mypods = None
    imgfilepodsicons_othersshared = None
    imgfilepodsicons_pod = None
    imgfilepodsicons_root = None
    imgfilepodsicons_runningops = None
    imgfilepodsicons_settings = None
    imgfilepodsicons_sharing08 = None
    imgfilepodsicons_global = None
    imgfilepodsicons_search = None
    imgfilepodsicons_shortcut = None
    imgfilepodsicons_editfiles = None
    imgfilepodsicons_filewebsharing = None
    imgfilepodsicons_folderwebsharing = None

    def __init__(self, parent):
        pass

    def initialize(self, mainWindow, treeCtrl):
        self.mainWindow = mainWindow
        self.treeCtrl = treeCtrl
        self.filePodsSharedWithMe = []
        self.runFilePodsSharedWithMeWatcherThread = True

        self.FilePodsSharedWithMeWatcherThread = threading.Thread(target=filepodssharedwithmewatcherproc, args=(self, ))
        self.FilePodsSharedWithMeWatcherThread.start()

        self.treeImageList = wx.ImageList(16, 16, False, 11)

        imgfilepodsicons_browsers = self.treeImageList.Add(wx.Image("graphics/filepodsicons_browsers.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        imgfilepodsicons_mypods = self.treeImageList.Add(wx.Image("graphics/filepodsicons_mypods.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        imgfilepodsicons_othersshared = self.treeImageList.Add(wx.Image("graphics/filepodsicons_othersshared.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        imgfilepodsicons_pod = self.treeImageList.Add(wx.Image("graphics/filepodsicons_pod.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        imgfilepodsicons_root = self.treeImageList.Add(wx.Image("graphics/filepodsicons_root.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        imgfilepodsicons_runningops = self.treeImageList.Add(wx.Image("graphics/filepodsicons_runningops.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        imgfilepodsicons_settings = self.treeImageList.Add(wx.Image("graphics/filepodsicons_settings.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        imgfilepodsicons_sharing08 = self.treeImageList.Add(wx.Image("graphics/filepodsicons_sharing-08.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        imgfilepodsicons_global = self.treeImageList.Add(wx.Image("graphics/filepodsicons_global.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        imgfilepodsicons_search = self.treeImageList.Add(wx.Image("graphics/filepodsicons_search.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        imgfilepodsicons_shortcut = self.treeImageList.Add(wx.Image("graphics/filepodsicons_shortcut.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        imgfilepodsicons_editfiles = self.treeImageList.Add(wx.Image("graphics/filepods-editfiles.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        imgfilepodsicons_filewebsharing = self.treeImageList.Add(wx.Image("graphics/filepods-filewebsharing.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        imgfilepodsicons_folderwebsharing = self.treeImageList.Add(wx.Image("graphics/filepods-folderclosedwebsharing.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        imgfilepodsicons_folderwebimports = self.treeImageList.Add(wx.Image("graphics/filepodsicons_webshare.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())

        self.treeCtrl.AssignImageList(self.treeImageList)

        self.loadInitialTreeNodes()

        # default item expansion

        item = self.treeCtrl.GetRootItem()
        self.treeCtrl.Expand(item)
        item, cookie = self.treeCtrl.GetFirstChild(item)
        self.treeCtrl.Expand(item)
        item, cookie = self.treeCtrl.GetNextChild(item, cookie)
        #self.treeCtrl.Expand(item)

        # load popup menus

        self.popupMenuMyFilePodsRoot = wx.Menu()
        self.popupMenuMyFilePodsRoot.Append(100, "Create File Pod")

        self.mainWindow.Bind(wx.EVT_MENU, self.OnMenuItemCreateFilePod, id=100)

        self.popupMenuMyFilePodRoot = wx.Menu()
        self.popupMenuMyFilePodRoot.Append(200, "Create File Pod...")
        self.popupMenuMyFilePodRoot.AppendSeparator()
        self.popupMenuMyFilePodRoot.Append(400, "Archive")
        self.popupMenuMyFilePodRoot.AppendSeparator()
        self.popupMenuMyFilePodRoot.Append(600, "Delete...")

        self.mainWindow.Bind(wx.EVT_MENU, self.OnMenuItemCreateFilePod, id=200)

        self.mainWindow.Bind(wx.EVT_MENU, self.OnMenuItemArchive, id=400)
        self.mainWindow.Bind(wx.EVT_MENU, self.OnMenuItemDelete, id=600)

    def shutdown(self):

        self.runFilePodsSharedWithMeWatcherThread = False

    def loadInitialTreeNodes(self):

        self.appRoot = self.treeCtrl.AddRoot('File Pods')
        self.treeCtrl.SetItemData(self.appRoot, wx.TreeItemData(treenodeinfo.TreeNodeInfo('root', -1)))
        self.treeCtrl.SetItemImage(self.appRoot, 4, wx.TreeItemIcon_Normal)

        self.QuickShortcutsRoot = self.treeCtrl.AppendItem(self.appRoot, 'Quick Shortcuts')
        self.treeCtrl.SetItemData(self.QuickShortcutsRoot, wx.TreeItemData(treenodeinfo.TreeNodeInfo('quickshortcutsroot', -1)))
        self.treeCtrl.SetItemImage(self.QuickShortcutsRoot, 8, wx.TreeItemIcon_Normal)

        self.SearchPods = self.treeCtrl.AppendItem(self.appRoot, 'Search Pods')
        self.treeCtrl.SetItemData(self.SearchPods, wx.TreeItemData(treenodeinfo.TreeNodeInfo('searchpodsroot', -1)))
        self.treeCtrl.SetItemImage(self.SearchPods, 9, wx.TreeItemIcon_Normal)

        self.MyFilePodsRoot = self.treeCtrl.AppendItem(self.appRoot, 'My File Pods')
        self.treeCtrl.SetItemData(self.MyFilePodsRoot, wx.TreeItemData(treenodeinfo.TreeNodeInfo('myfilepods', -1)))
        self.treeCtrl.SetItemImage(self.MyFilePodsRoot, 1, wx.TreeItemIcon_Normal)

        self.OthersFilePodsRoot = self.treeCtrl.AppendItem(self.appRoot, 'Others File Pods Shared with Me')
        self.treeCtrl.SetItemData(self.OthersFilePodsRoot, wx.TreeItemData(treenodeinfo.TreeNodeInfo('othersfilepods', -1)))
        self.treeCtrl.SetItemImage(self.OthersFilePodsRoot, 2, wx.TreeItemIcon_Normal)

        self.ArchivedFilePodsRoot = self.treeCtrl.AppendItem(self.appRoot, 'My Archived File Pods')
        self.treeCtrl.SetItemData(self.ArchivedFilePodsRoot, wx.TreeItemData(treenodeinfo.TreeNodeInfo('archivefilepods', -1)))
        self.treeCtrl.SetItemImage(self.ArchivedFilePodsRoot, 1, wx.TreeItemIcon_Normal)

        self.FilesWebSharedRoot = self.treeCtrl.AppendItem(self.appRoot, 'Web Shared Files')
        self.treeCtrl.SetItemData(self.FilesWebSharedRoot, wx.TreeItemData(treenodeinfo.TreeNodeInfo('fileswebsharedroot', -1)))
        self.treeCtrl.SetItemImage(self.FilesWebSharedRoot, 12, wx.TreeItemIcon_Normal)

        self.FoldersWebSharedRoot = self.treeCtrl.AppendItem(self.appRoot, 'Web Shared Folders')
        self.treeCtrl.SetItemData(self.FoldersWebSharedRoot, wx.TreeItemData(treenodeinfo.TreeNodeInfo('folderswebsharedroot', -1)))
        self.treeCtrl.SetItemImage(self.FoldersWebSharedRoot, 13, wx.TreeItemIcon_Normal)

        self.FoldersWebImportsRoot = self.treeCtrl.AppendItem(self.appRoot, 'Web Import Folders')
        self.treeCtrl.SetItemData(self.FoldersWebImportsRoot, wx.TreeItemData(treenodeinfo.TreeNodeInfo('folderswebimportsroot', -1)))
        self.treeCtrl.SetItemImage(self.FoldersWebImportsRoot, 13, wx.TreeItemIcon_Normal)

        self.FilesInEditRoot = self.treeCtrl.AppendItem(self.appRoot, 'Files Being Edited')
        self.treeCtrl.SetItemData(self.FilesInEditRoot, wx.TreeItemData(treenodeinfo.TreeNodeInfo('filesinedit', -1)))
        self.treeCtrl.SetItemImage(self.FilesInEditRoot, 11, wx.TreeItemIcon_Normal)

        self.RunningOperationsRoot = self.treeCtrl.AppendItem(self.appRoot, 'Running Operations')
        self.treeCtrl.SetItemData(self.RunningOperationsRoot, wx.TreeItemData(treenodeinfo.TreeNodeInfo('runningoperations', -1)))
        self.treeCtrl.SetItemImage(self.RunningOperationsRoot, 5, wx.TreeItemIcon_Normal)

        self.loadMyFilePods()
        self.loadFilePodsSharedWithMe()
        self.loadArchivedFilePods()

    def loadMyFilePods(self):

        self.treeCtrl.DeleteChildren(self.MyFilePodsRoot)

        businessLogic = bl.BusinessLogic()

        pods = businessLogic.RetrieveFilePodsByOwnerSecurityUserID(self.mainWindow.loggedInSecurityUserID)

        if False != pods:
            for pod in pods["pods"]:

                filePodNode = self.treeCtrl.AppendItem(self.MyFilePodsRoot, pod['Name'])
                self.treeCtrl.SetItemData(filePodNode, wx.TreeItemData(treenodeinfo.TreeNodeInfo('myfilepod', pod['PodID'])))
                self.treeCtrl.SetItemImage(filePodNode, 3, wx.TreeItemIcon_Normal)

                filePodSettingsNode = self.treeCtrl.AppendItem(filePodNode, 'Settings');
                self.treeCtrl.SetItemData(filePodSettingsNode, wx.TreeItemData(treenodeinfo.TreeNodeInfo('myfilepodsettings', pod['PodID'])))
                self.treeCtrl.SetItemImage(filePodSettingsNode, 6, wx.TreeItemIcon_Normal)

                filePodBrowserNode = self.treeCtrl.AppendItem(filePodNode, 'Browser');
                self.treeCtrl.SetItemData(filePodBrowserNode, wx.TreeItemData(treenodeinfo.TreeNodeInfo('myfilepodbrowser', pod['PodID'])))
                self.treeCtrl.SetItemImage(filePodBrowserNode, 0, wx.TreeItemIcon_Normal)

                filePodSharingNode = self.treeCtrl.AppendItem(filePodNode, 'Sharing');
                self.treeCtrl.SetItemData(filePodSharingNode, wx.TreeItemData(treenodeinfo.TreeNodeInfo('myfilepodsharing', pod['PodID'])))
                self.treeCtrl.SetItemImage(filePodSharingNode, 7, wx.TreeItemIcon_Normal)

                filePodQuickShortcuts = self.treeCtrl.AppendItem(filePodNode, 'Shortcuts');
                self.treeCtrl.SetItemData(filePodQuickShortcuts, wx.TreeItemData(treenodeinfo.TreeNodeInfo('quickshortcuts', pod['PodID'])))
                self.treeCtrl.SetItemImage(filePodQuickShortcuts, 10, wx.TreeItemIcon_Normal)


    def loadFilePodsSharedWithMe(self):

        self.treeCtrl.DeleteChildren(self.OthersFilePodsRoot)

        businessLogic = bl.BusinessLogic()

        pods = businessLogic.RetrieveFilePodsSharedWithMe(self.mainWindow.loggedInSecurityUserID)

        self.filePodsSharedWithMe = []

        if False != pods:
            for pod in pods["pods"]:

                filePodNode = self.treeCtrl.AppendItem(self.OthersFilePodsRoot, pod['Name'])
                self.treeCtrl.SetItemData(filePodNode, wx.TreeItemData(treenodeinfo.TreeNodeInfo('otherfilepod', pod['PodID'])))
                self.treeCtrl.SetItemImage(filePodNode, 3, wx.TreeItemIcon_Normal)

                filePodBrowserNode = self.treeCtrl.AppendItem(filePodNode, 'Browser')
                self.treeCtrl.SetItemData(filePodBrowserNode, wx.TreeItemData(treenodeinfo.TreeNodeInfo('otherfilepodbrowser', pod['PodID'])))
                self.treeCtrl.SetItemImage(filePodBrowserNode, 0, wx.TreeItemIcon_Normal)

                self.filePodsSharedWithMe.append(pod)

    def loadArchivedFilePods(self):

        self.treeCtrl.DeleteChildren(self.ArchivedFilePodsRoot)

        businessLogic = bl.BusinessLogic()

        pods = businessLogic.RetrieveFilePodsArchived(self.mainWindow.loggedInSecurityUserID)

        if False != pods:
            for pod in pods["pods"]:

                filePodNode = self.treeCtrl.AppendItem(self.ArchivedFilePodsRoot, pod['Name'])
                self.treeCtrl.SetItemData(filePodNode, wx.TreeItemData(treenodeinfo.TreeNodeInfo('myfilepod', pod['PodID'])))
                self.treeCtrl.SetItemImage(filePodNode, 3, wx.TreeItemIcon_Normal)

                filePodSettingsNode = self.treeCtrl.AppendItem(filePodNode, 'Settings');
                self.treeCtrl.SetItemData(filePodSettingsNode, wx.TreeItemData(treenodeinfo.TreeNodeInfo('myfilepodsettings', pod['PodID'])))
                self.treeCtrl.SetItemImage(filePodSettingsNode, 6, wx.TreeItemIcon_Normal)

                filePodBrowserNode = self.treeCtrl.AppendItem(filePodNode, 'Browser');
                self.treeCtrl.SetItemData(filePodBrowserNode, wx.TreeItemData(treenodeinfo.TreeNodeInfo('myfilepodbrowser', pod['PodID'])))
                self.treeCtrl.SetItemImage(filePodBrowserNode, 0, wx.TreeItemIcon_Normal)

                filePodSharingNode = self.treeCtrl.AppendItem(filePodNode, 'Sharing');
                self.treeCtrl.SetItemData(filePodSharingNode, wx.TreeItemData(treenodeinfo.TreeNodeInfo('myfilepodsharing', pod['PodID'])))
                self.treeCtrl.SetItemImage(filePodSharingNode, 7, wx.TreeItemIcon_Normal)

                filePodQuickShortcuts = self.treeCtrl.AppendItem(filePodNode, 'Shortcuts');
                self.treeCtrl.SetItemData(filePodQuickShortcuts, wx.TreeItemData(treenodeinfo.TreeNodeInfo('quickshortcuts', pod['PodID'])))
                self.treeCtrl.SetItemImage(filePodQuickShortcuts, 10, wx.TreeItemIcon_Normal)


    def OnTreeItemExpanded(self, event):
        pass

    def OnTreeItemMenu(self, event):
        pass

    def OnTreeItemRightClick(self, event):

        treeItemInfo = self.treeCtrl.GetItemData(self.treeCtrl.GetSelection()).GetData()

        if treeItemInfo.type == 'myfilepod':
            self.mainWindow.PopupMenu(self.popupMenuMyFilePodRoot, event.GetPoint())
        elif treeItemInfo.type == 'root':
            pass
        elif treeItemInfo.type == 'myfilepods':
            self.mainWindow.PopupMenu(self.popupMenuMyFilePodsRoot, event.GetPoint())
        elif treeItemInfo.type == 'othersfilepods':
            pass
            #self.mainWindow.PopupMenu(self.popupMenuOthersFilePodsRoot, event.GetPoint())
        else:
            pass

    def OnTreeSelChanged(self, event):

        selTreeItem = self.treeCtrl.GetSelection()
        treeNodeInfo = self.treeCtrl.GetItemData(selTreeItem).GetData()

        rightPaneInitData = {}

        if (treeNodeInfo.type == 'root'):
            self.mainWindow.rightPaneManager.switchPanes('home', rightPaneInitData)
        elif (treeNodeInfo.type == 'quickshortcutsroot'):
            self.mainWindow.rightPaneManager.switchPanes('quickshortcutsroot', rightPaneInitData)
        elif (treeNodeInfo.type == 'searchpodsroot'):
            self.mainWindow.rightPaneManager.switchPanes('searchpodsroot', rightPaneInitData)
        elif (treeNodeInfo.type == 'myfilepods'):
            self.mainWindow.rightPaneManager.switchPanes('myfilepods', rightPaneInitData)
        elif (treeNodeInfo.type == 'othersfilepods'):
            self.mainWindow.rightPaneManager.switchPanes('othersfilepods', rightPaneInitData)
        elif (treeNodeInfo.type == 'fileswebsharedroot'):
            self.mainWindow.rightPaneManager.switchPanes('fileswebsharedroot', rightPaneInitData)
        elif (treeNodeInfo.type == 'folderswebsharedroot'):
            self.mainWindow.rightPaneManager.switchPanes('folderswebsharedroot', rightPaneInitData)
        elif (treeNodeInfo.type == 'folderswebimportsroot'):
            self.mainWindow.rightPaneManager.switchPanes('folderswebimportsroot', rightPaneInitData)
        elif (treeNodeInfo.type == 'filesinedit'):
            self.mainWindow.rightPaneManager.switchPanes('filesinedit', rightPaneInitData)
        elif (treeNodeInfo.type == 'runningoperations'):
            self.mainWindow.rightPaneManager.switchPanes('runningoperations', rightPaneInitData)
        elif (treeNodeInfo.type == 'myfilepod'):
            rightPaneInitData["podid"] = treeNodeInfo.dbid
            self.mainWindow.rightPaneManager.switchPanes('myfilepod', rightPaneInitData)
        elif (treeNodeInfo.type == 'myfilepodsettings'):
            rightPaneInitData["podid"] = treeNodeInfo.dbid
            self.mainWindow.rightPaneManager.switchPanes('myfilepodsettings', rightPaneInitData)
        elif (treeNodeInfo.type == 'myfilepodbrowser'):
            rightPaneInitData["canwrite"] = 1
            rightPaneInitData["podid"] = treeNodeInfo.dbid
            self.mainWindow.rightPaneManager.switchPanes('myfilepodbrowser', rightPaneInitData)
        elif (treeNodeInfo.type == 'myfilepodsharing'):
            rightPaneInitData["podid"] = treeNodeInfo.dbid
            self.mainWindow.rightPaneManager.switchPanes('myfilepodsharing', rightPaneInitData)
        elif (treeNodeInfo.type == 'quickshortcuts'):
            rightPaneInitData["podid"] = treeNodeInfo.dbid
            self.mainWindow.rightPaneManager.switchPanes('quickshortcuts', rightPaneInitData)
        elif (treeNodeInfo.type == 'otherfilepod'):
            rightPaneInitData["podid"] = treeNodeInfo.dbid
            self.mainWindow.rightPaneManager.switchPanes('otherfilepod', rightPaneInitData)
        elif (treeNodeInfo.type == 'otherfilepodbrowser'):
            rightPaneInitData["podid"] = treeNodeInfo.dbid
            businessLogic = bl.BusinessLogic()
            rightPaneInitData['canwrite'] = businessLogic.RetrieveSecurityUserAccessLevelToFilePod(self.mainWindow.loggedInSecurityUserID, treeNodeInfo.dbid)['canwrite'][0]['CanWrite']
            self.mainWindow.rightPaneManager.switchPanes('otherfilepodbrowser', rightPaneInitData)
        if treeNodeInfo.type == 'myfilepod':
            selParent = self.treeCtrl.GetItemParent(selTreeItem)
            treenodeinfo = self.treeCtrl.GetItemData(selParent).GetData()

            if treenodeinfo.type == 'archivefilepods':
                self.popupMenuMyFilePodRoot.SetLabel(400, 'Unarchive')
            else:
                self.popupMenuMyFilePodRoot.SetLabel(400, 'Archive')



    def OnMenuItemCreateFilePod(self, event):
        self.mainWindow.OnCreateFilePod(None)

    def OnMenuItemArchive(self, event):

        selTreeItem = self.treeCtrl.GetSelection()

        selParent = self.treeCtrl.GetItemParent(selTreeItem)

        treenodeinfo = self.treeCtrl.GetItemData(selParent).GetData()

        businessLogic = bl.BusinessLogic()

        if treenodeinfo.type == 'archivefilepods':
            treenodeinfo = self.treeCtrl.GetItemData(selTreeItem).GetData()
            businessLogic.UnarchiveFilePod(treenodeinfo.dbid)
        else:
            treenodeinfo = self.treeCtrl.GetItemData(selTreeItem).GetData()
            businessLogic.ArchiveFilePod(treenodeinfo.dbid)

        self.loadMyFilePods()
        self.loadFilePodsSharedWithMe()
        self.loadArchivedFilePods()

    def OnMenuItemDelete(self, event):

        selTreeItem = self.treeCtrl.GetSelection()
        treeNodeInfo = self.treeCtrl.GetItemData(selTreeItem).GetData()

        businessLogic = bl.BusinessLogic()

        businessLogic.DeleteFilePod(treeNodeInfo.dbid)

        self.loadMyFilePods()

    def OnChangeCurrentTreeItemText(self, newText):
        self.treeCtrl.SetItemText(self.treeCtrl.GetSelection(), newText)

    def __del__(self):
        pass



    def OnUpdatePodName(self, PodId, NewName):

        item = self.treeCtrl.GetRootItem()

        for node in walk_branches(self.treeCtrl, item):
            itemData = self.treeCtrl.GetItemData(node).GetData()

            if itemData.type == 'myfilepod':
                if itemData.dbid == PodId:
                    self.treeCtrl.SetItemText(node, NewName)
                    break

    def NavigateToPodFile(self, podID, parentFolderID, podFileID):

        item = self.treeCtrl.GetRootItem()

        for node in walk_branches(self.treeCtrl, item):
            itemData = self.treeCtrl.GetItemData(node).GetData()

            if itemData.type == 'myfilepodbrowser':
                if itemData.dbid == podID:
                    self.treeCtrl.SelectItem(node)
                    break

        self.mainWindow.rightPaneManager.currentPanel.OnSelectPodObject(parentFolderID, podFileID)



    def NavigateToPodFolder(self, podID, folderID):

        item = self.treeCtrl.GetRootItem()

        for node in walk_branches(self.treeCtrl, item):
            itemData = self.treeCtrl.GetItemData(node).GetData()

            if itemData.type == 'myfilepodbrowser':
                if itemData.dbid == podID:
                    self.treeCtrl.SelectItem(node)
                    break

        self.mainWindow.rightPaneManager.currentPanel.OnSelectPodObject(folderID, None)


