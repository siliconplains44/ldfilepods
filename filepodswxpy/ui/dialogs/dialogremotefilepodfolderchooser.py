# -*- coding: utf-8 -*-

###########################################################################
## Python code generated with wxFormBuilder (version Jun 17 2015)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import wx
import wx.xrc

from classlibrary import treenodeinfo

from businesslogic import bl

###########################################################################
## Class DialogRemotePodFolderChooserDialog
###########################################################################

class DialogRemotePodFolderChooser(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=wx.EmptyString, pos=wx.DefaultPosition,
                           size=wx.DefaultSize, style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer77 = wx.BoxSizer(wx.VERTICAL)

        bSizer79 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer79.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText39 = wx.StaticText(self, wx.ID_ANY, u"Folder", wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText39.Wrap(-1)
        bSizer79.Add(self.m_staticText39, 0, wx.ALL, 5)

        self.m_treeCtrlFoldersAndFiles = wx.TreeCtrl(self, wx.ID_ANY, wx.DefaultPosition, wx.Size(800, 500), wx.TR_DEFAULT_STYLE)
        bSizer79.Add(self.m_treeCtrlFoldersAndFiles, 0, wx.ALL, 5)

        bSizer79.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer77.Add(bSizer79, 1, wx.EXPAND, 5)

        bSizer80 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer80.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_buttonOK = wx.Button(self, wx.ID_ANY, u"OK", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer80.Add(self.m_buttonOK, 0, wx.ALL, 5)

        self.m_buttonCancel = wx.Button(self, wx.ID_ANY, u"Cancel", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer80.Add(self.m_buttonCancel, 0, wx.ALL, 5)

        bSizer80.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer77.Add(bSizer80, 0, wx.EXPAND, 5)

        self.SetSizer(bSizer77)
        self.Layout()
        bSizer77.Fit(self)

        self.Centre(wx.BOTH)

        # Connect Events
        self.m_buttonOK.Bind(wx.EVT_BUTTON, self.OnButtonClickOK)
        self.m_buttonCancel.Bind(wx.EVT_BUTTON, self.OnButtonClickCancel)
        self.m_treeCtrlFoldersAndFiles.Bind(wx.EVT_TREE_SEL_CHANGED, self.m_treeCtrlFoldersAndFilesOnTreeSelChanged)

    def __del__(self):
        pass

    def FindChildFolders(self, folderParentId, folderTree):
        childFolders = []

        for folder in folderTree:
            if folder["FolderParentID"] == folderParentId:
                childFolders.append(folder)

        return childFolders

    def LoadFolderTree(self, folderParentId, folderTree, ParentTreeNode):
        childFolders = self.FindChildFolders(folderParentId, folderTree)

        for childFolder in childFolders:
            childTreeNode = self.m_treeCtrlFoldersAndFiles.AppendItem(ParentTreeNode, childFolder["Name"])
            self.m_treeCtrlFoldersAndFiles.SetItemData(childTreeNode,
                                            wx.TreeItemData(treenodeinfo.TreeNodeInfo('', childFolder["FolderID"])))
            self.m_treeCtrlFoldersAndFiles.SetItemImage(childTreeNode, 1, wx.TreeItemIcon_Normal)

            self.LoadFolderTree(childFolder["FolderID"], folderTree, childTreeNode)

    def LoadFilePodTree(self):

        self.m_treeCtrlFoldersAndFiles.DeleteAllItems()

        businessLogic = bl.BusinessLogic()

        FilePodRootFolders = businessLogic.RetrieveFilePodRootFolder(self.rightPaneInitData['podid'])[1]['podfolders']

        for filePodRootFolder in FilePodRootFolders:
            folderTree = businessLogic.RetrieveFolderTree(filePodRootFolder["FolderID"])

            rootFolder = businessLogic.RetrieveFolderByFolderId(filePodRootFolder["FolderID"])

            filePodRootTreeNode = self.m_treeCtrlFoldersAndFiles.AddRoot(rootFolder["Name"])
            self.m_treeCtrlFoldersAndFiles.SetItemData(filePodRootTreeNode,
                                            wx.TreeItemData(
                                                treenodeinfo.TreeNodeInfo('root', filePodRootFolder["FolderID"])))
            self.m_treeCtrlFoldersAndFiles.SetItemImage(filePodRootTreeNode, 1, wx.TreeItemIcon_Normal)

            self.LoadFolderTree(filePodRootFolder["FolderID"], folderTree, filePodRootTreeNode)

        if self.m_treeCtrlFoldersAndFiles.GetCount() > 0:
            self.m_treeCtrlFoldersAndFiles.SelectItem(self.m_treeCtrlFoldersAndFiles.GetRootItem())

    def loadFolders(self, rightPaneInitData):
        self.rightPaneInitData = rightPaneInitData

        self.treeImageList = wx.ImageList(16, 16, False, 11)

        self.imgfile = self.treeImageList.Add(wx.Image("graphics/filepodsicon_addfile.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())
        self.imgfolderclosed = self.treeImageList.Add(wx.Image("graphics/filepods-folderclosed.png", wx.BITMAP_TYPE_PNG).Scale(16,16).ConvertToBitmap())

        self.m_treeCtrlFoldersAndFiles.AssignImageList(self.treeImageList)

        self.LoadFilePodTree()

        self.m_buttonOK.Disable()

    # Virtual event handlers, overide them in your derived class
    def OnButtonClickOK(self, event):
        self.EndModal(1)

    def OnButtonClickCancel(self, event):
        self.EndModal(0)

    def m_treeCtrlFoldersAndFilesOnTreeSelChanged(self, event):

        selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
        treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

        self.selectedFolderID = treeNodeInfo.dbid

        self.m_buttonOK.Enable()