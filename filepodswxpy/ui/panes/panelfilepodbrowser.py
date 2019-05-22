# -*- coding: utf-8 -*-

###########################################################################
## Python code generated with wxFormBuilder (version Jun  5 2014)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import os
import datetime
import uuid
import subprocess
import sys
import threading
import time
import urllib3

import wx
import wx.xrc
import wx.grid

from pipes import quote

from businesslogic import bl

from classlibrary import treenodeinfo

from localdatabase import dalsqlite

from ui.dialogs import dialogrenameobject
from ui.dialogs import dialogremotefilepodfolderchooser
from ui.dialogs import dialogfilerevisionhistory
from ui.dialogs import dialogmanagefilewebsharing
from ui.dialogs import dialogmanagefolderwebsharing
from ui.dialogs import dialogmanagefoldertags
from ui.dialogs import dialogmanagefiletags
from ui.dialogs import dialogcreatefolder
from ui.dialogs import dialogmanagefolderwebimport


def walk_branches(tree, root):
    item, cookie = tree.GetFirstChild(root)

    while item.IsOk():
        yield item

        itemData = tree.GetItemData(item).GetData()

        if True == tree.ItemHasChildren(item):
            for node in walk_branches(tree, item):
                yield node

        item, cookie = tree.GetNextChild(root, cookie)


###########################################################################
## Class PanelFilePodBrowser
###########################################################################

class PanelFilePodBrowser(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent, id=wx.ID_ANY, pos=wx.DefaultPosition, size=wx.Size(1024, 651),
                          style=wx.TAB_TRAVERSAL)

        bSizer85 = wx.BoxSizer(wx.VERTICAL)

        self.m_splitterMain = wx.SplitterWindow(self, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize, wx.SP_3D)
        self.m_splitterMain.Bind(wx.EVT_IDLE, self.m_splitterMainOnIdle)

        self.m_panel3 = wx.Panel(self.m_splitterMain, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize, wx.TAB_TRAVERSAL)
        bSizer86 = wx.BoxSizer(wx.VERTICAL)

        bSizer88 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_buttonUploadFolders = wx.Button(self.m_panel3, wx.ID_ANY, u"Upload Folder...", wx.DefaultPosition,
                                               wx.Size(-1, 30), 0)
        self.m_buttonUploadFolders.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer88.Add(self.m_buttonUploadFolders, 0, wx.ALL, 5)

        self.m_buttonDownloadFolder = wx.Button(self.m_panel3, wx.ID_ANY, u"Download Folder...", wx.DefaultPosition,
                                                wx.Size(-1, 30), 0)
        self.m_buttonDownloadFolder.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer88.Add(self.m_buttonDownloadFolder, 0, wx.ALL, 5)

        self.m_buttonRenameFolderOrFile = wx.Button(self.m_panel3, wx.ID_ANY, u"Rename...", wx.DefaultPosition,
                                                    wx.Size(-1, 30), 0)
        self.m_buttonRenameFolderOrFile.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer88.Add(self.m_buttonRenameFolderOrFile, 0, wx.ALL, 5)

        self.m_buttonMoveFolderOrFile = wx.Button(self.m_panel3, wx.ID_ANY, u"Move...", wx.DefaultPosition,
                                                  wx.Size(-1, 30), 0)
        self.m_buttonMoveFolderOrFile.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer88.Add(self.m_buttonMoveFolderOrFile, 0, wx.ALL, 5)

        self.m_buttonDeleteFolderOrFile = wx.Button(self.m_panel3, wx.ID_ANY, u"Delete...", wx.DefaultPosition,
                                                    wx.Size(-1, 30), 0)
        self.m_buttonDeleteFolderOrFile.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer88.Add(self.m_buttonDeleteFolderOrFile, 0, wx.ALL, 5)

        self.m_buttonFolderWebSharing = wx.Button(self.m_panel3, wx.ID_ANY, u"Web Sharing...", wx.DefaultPosition,
                                                  wx.Size(-1, 30), 0)
        self.m_buttonFolderWebSharing.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer88.Add(self.m_buttonFolderWebSharing, 0, wx.ALL, 5)

        bSizer86.Add(bSizer88, 0, wx.EXPAND, 5)

        bSizer89 = wx.BoxSizer(wx.VERTICAL)

        self.m_treeCtrlFoldersAndFiles = wx.TreeCtrl(self.m_panel3, wx.ID_ANY, wx.DefaultPosition, wx.Size(-1, -1),
                                                     wx.TR_DEFAULT_STYLE)
        bSizer89.Add(self.m_treeCtrlFoldersAndFiles, 1, wx.EXPAND, 5)

        bSizer86.Add(bSizer89, 1, wx.EXPAND, 5)

        self.m_panel3.SetSizer(bSizer86)
        self.m_panel3.Layout()
        bSizer86.Fit(self.m_panel3)
        self.m_panel4 = wx.Panel(self.m_splitterMain, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize, wx.TAB_TRAVERSAL)
        bSizer87 = wx.BoxSizer(wx.VERTICAL)

        bSizer90 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_buttonUploadFile = wx.Button(self.m_panel4, wx.ID_ANY, u"Upload File...", wx.DefaultPosition,
                                            wx.Size(-1, 30),
                                            0)
        self.m_buttonUploadFile.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer90.Add(self.m_buttonUploadFile, 0, wx.ALL, 5)

        self.m_buttonDownloadFile = wx.Button(self.m_panel4, wx.ID_ANY, u"Download File...", wx.DefaultPosition,
                                              wx.Size(-1, 30), 0)
        self.m_buttonDownloadFile.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer90.Add(self.m_buttonDownloadFile, 0, wx.ALL, 5)

        self.m_buttonRenameFile = wx.Button(self.m_panel4, wx.ID_ANY, u"Rename...", wx.DefaultPosition, wx.Size(-1, 30),
                                            0)
        self.m_buttonRenameFile.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer90.Add(self.m_buttonRenameFile, 0, wx.ALL, 5)

        self.m_buttonMoveFile = wx.Button(self.m_panel4, wx.ID_ANY, u"Move...", wx.DefaultPosition, wx.Size(-1, 30), 0)
        self.m_buttonMoveFile.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer90.Add(self.m_buttonMoveFile, 0, wx.ALL, 5)

        self.m_buttonDeleteFile = wx.Button(self.m_panel4, wx.ID_ANY, u"Delete...", wx.DefaultPosition, wx.Size(-1, 30),
                                            0)
        self.m_buttonDeleteFile.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer90.Add(self.m_buttonDeleteFile, 0, wx.ALL, 5)

        self.m_buttonEditFile = wx.Button(self.m_panel4, wx.ID_ANY, u"Edit...", wx.DefaultPosition, wx.Size(-1, 30), 0)
        self.m_buttonEditFile.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer90.Add(self.m_buttonEditFile, 0, wx.ALL, 5)

        self.m_buttonViewFile = wx.Button(self.m_panel4, wx.ID_ANY, u"View...", wx.DefaultPosition, wx.Size(-1, 30), 0)
        self.m_buttonViewFile.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer90.Add(self.m_buttonViewFile, 0, wx.ALL, 5)

        self.m_buttonHistory = wx.Button(self.m_panel4, wx.ID_ANY, u"History...", wx.DefaultPosition, wx.Size(-1, 30),
                                         0)
        self.m_buttonHistory.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer90.Add(self.m_buttonHistory, 0, wx.ALL, 5)

        self.m_buttonFileWebSharing = wx.Button(self.m_panel4, wx.ID_ANY, u"Web Sharing...", wx.DefaultPosition,
                                                wx.Size(-1, 30), 0)
        self.m_buttonFileWebSharing.SetFont(wx.Font(7, 70, 90, 90, False, wx.EmptyString))

        bSizer90.Add(self.m_buttonFileWebSharing, 0, wx.ALL, 5)

        bSizer87.Add(bSizer90, 0, wx.EXPAND, 5)

        bSizer91 = wx.BoxSizer(wx.VERTICAL)

        self.m_gridFiles = wx.grid.Grid(self.m_panel4, wx.ID_ANY, wx.DefaultPosition, wx.Size(-1, -1), 0)

        # Grid
        self.m_gridFiles.CreateGrid(5, 6)
        self.m_gridFiles.EnableEditing(True)
        self.m_gridFiles.EnableGridLines(True)
        self.m_gridFiles.EnableDragGridSize(False)
        self.m_gridFiles.SetMargins(0, 0)

        # Columns
        self.m_gridFiles.SetColSize(0, 150)
        self.m_gridFiles.SetColSize(1, 350)
        self.m_gridFiles.SetColSize(2, 250)
        self.m_gridFiles.SetColSize(3, 250)
        self.m_gridFiles.SetColSize(4, 100)
        self.m_gridFiles.SetColSize(5, 150)
        self.m_gridFiles.EnableDragColMove(False)
        self.m_gridFiles.EnableDragColSize(True)
        self.m_gridFiles.SetColLabelSize(30)
        self.m_gridFiles.SetColLabelValue(0, u"PodFileID")
        self.m_gridFiles.SetColLabelValue(1, u"Name")
        self.m_gridFiles.SetColLabelValue(2, u"Size")
        self.m_gridFiles.SetColLabelValue(3, u"Created")
        self.m_gridFiles.SetColLabelValue(4, u"Web Shared")
        self.m_gridFiles.SetColLabelValue(5, u"Revision Web Shared")
        self.m_gridFiles.SetColLabelAlignment(wx.ALIGN_CENTRE, wx.ALIGN_CENTRE)

        # Rows
        self.m_gridFiles.EnableDragRowSize(True)
        self.m_gridFiles.SetRowLabelSize(80)
        self.m_gridFiles.SetRowLabelAlignment(wx.ALIGN_CENTRE, wx.ALIGN_CENTRE)

        # Label Appearance

        # Cell Defaults
        self.m_gridFiles.SetDefaultCellAlignment(wx.ALIGN_LEFT, wx.ALIGN_TOP)
        bSizer91.Add(self.m_gridFiles, 1, wx.EXPAND, 5)

        bSizer87.Add(bSizer91, 1, wx.EXPAND, 5)

        self.m_panel4.SetSizer(bSizer87)
        self.m_panel4.Layout()
        bSizer87.Fit(self.m_panel4)
        self.m_splitterMain.SplitHorizontally(self.m_panel3, self.m_panel4, 0)
        bSizer85.Add(self.m_splitterMain, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer85)
        self.Layout()

        # Connect Events
        self.m_buttonUploadFolders.Bind(wx.EVT_BUTTON, self.OnButtonClickUploadFolders)
        self.m_buttonDownloadFolder.Bind(wx.EVT_BUTTON, self.OnButtonClickDownloadFolder)
        self.m_buttonRenameFolderOrFile.Bind(wx.EVT_BUTTON, self.OnButtonClickRenameFolder)
        self.m_buttonMoveFolderOrFile.Bind(wx.EVT_BUTTON, self.OnButtonClickMoveFolder)
        self.m_buttonDeleteFolderOrFile.Bind(wx.EVT_BUTTON, self.OnButtonDeleteFolder)
        self.m_buttonFolderWebSharing.Bind(wx.EVT_BUTTON, self.OnButtonClickFolderWebSharing)
        self.m_buttonUploadFile.Bind(wx.EVT_BUTTON, self.OnButtonClickUploadFile)
        self.m_buttonDownloadFile.Bind(wx.EVT_BUTTON, self.OnButtonClickDownloadFile)
        self.m_buttonRenameFile.Bind(wx.EVT_BUTTON, self.OnButtonClickRenameFile)
        self.m_buttonMoveFile.Bind(wx.EVT_BUTTON, self.OnButtonClickMoveFile)
        self.m_buttonDeleteFile.Bind(wx.EVT_BUTTON, self.OnButtonDeleteFile)
        self.m_buttonEditFile.Bind(wx.EVT_BUTTON, self.OnButtonClickEditFile)
        self.m_buttonViewFile.Bind( wx.EVT_BUTTON, self.OnButtonClickView )
        self.m_buttonHistory.Bind(wx.EVT_BUTTON, self.OnButtonClickHistory)
        self.m_buttonFileWebSharing.Bind(wx.EVT_BUTTON, self.OnButtonClickFileWebSharing)
        self.m_gridFiles.Bind(wx.grid.EVT_GRID_SELECT_CELL, self.m_gridFilesOnGridCmdSelectCell)
        self.m_gridFiles.Bind(wx.grid.EVT_GRID_CELL_RIGHT_CLICK, self.m_gridFilesOnGridCmdCellRightClick)

        self.m_treeCtrlFoldersAndFiles.Bind(wx.EVT_TREE_ITEM_EXPANDED, self.m_treeCtrlFoldersAndFilesOnTreeItemExpanded)
        self.m_treeCtrlFoldersAndFiles.Bind(wx.EVT_TREE_ITEM_MENU, self.m_treeCtrlFoldersAndFilesOnTreeItemMenu)
        self.m_treeCtrlFoldersAndFiles.Bind(wx.EVT_TREE_ITEM_RIGHT_CLICK,
                                            self.m_treeCtrlFoldersAndFilesOnTreeItemRightClick)
        self.m_treeCtrlFoldersAndFiles.Bind(wx.EVT_TREE_SEL_CHANGED, self.m_treeCtrlFoldersAndFilesOnTreeSelChanged)

        # popup menus

        self.popupMenuFilePodRootFolder = wx.Menu()

        self.popupMenuFilePodRootFolder.Append(205, "Upload Folder...")
        self.popupMenuFilePodRootFolder.AppendSeparator()
        self.popupMenuFilePodRootFolder.Append(207, "Create Child Folder...")
        self.popupMenuFilePodRootFolder.AppendSeparator()
        self.popupMenuFilePodRootFolder.Append(210, "Rename Folder...")
        self.popupMenuFilePodRootFolder.AppendSeparator()
        self.popupMenuFilePodRootFolder.Append(405, "Upload File...")
        self.popupMenuFilePodRootFolder.AppendSeparator()
        self.popupMenuFilePodRootFolder.Append(605, "Web Sharing...")
        self.popupMenuFilePodRootFolder.Append(606, "Web Import...")
        self.popupMenuFilePodRootFolder.AppendSeparator()
        self.popupMenuFilePodRootFolder.Append(805, "Create global shortcut")
        self.popupMenuFilePodRootFolder.Append(1005, "Create pod shortcut")
        self.popupMenuFilePodRootFolder.AppendSeparator()
        self.popupMenuFilePodRootFolder.Append(1205, "Tags...")

        self.Bind(wx.EVT_MENU, self.OnMenuItemRootFolderUploadFolder, id=205)
        self.Bind(wx.EVT_MENU, self.OnMenuItemNormalFolderCreateChildFolder, id=207)
        self.Bind(wx.EVT_MENU, self.OnMenuItemNormalFolderRename, id=210)
        self.Bind(wx.EVT_MENU, self.OnMenuItemRootFolderUploadFile, id=405)
        self.Bind(wx.EVT_MENU, self.OnButtonClickFolderWebSharing, id=605)
        self.Bind(wx.EVT_MENU, self.OnButtonClickFolderWebImport, id=606)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFolderCreateGlobalShortcut, id=805)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFolderCreatePodShortcut, id=1005)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFolderTags, id=1205)

        self.popupMenuFilePodNormalFolder = wx.Menu()

        self.popupMenuFilePodNormalFolder.Append(600, "Upload Folder...")
        self.popupMenuFilePodNormalFolder.AppendSeparator()
        self.popupMenuFilePodNormalFolder.Append(800, "Upload File...")
        self.popupMenuFilePodNormalFolder.AppendSeparator()
        self.popupMenuFilePodNormalFolder.Append(810, "Create Child Folder...")
        self.popupMenuFilePodNormalFolder.AppendSeparator()
        self.popupMenuFilePodNormalFolder.Append(1000, "Rename...")
        self.popupMenuFilePodNormalFolder.Append(1200, "Move...")
        self.popupMenuFilePodNormalFolder.AppendSeparator()
        self.popupMenuFilePodNormalFolder.Append(1400, "Delete...")
        self.popupMenuFilePodNormalFolder.AppendSeparator()
        self.popupMenuFilePodNormalFolder.Append(1600, "Move Up")
        self.popupMenuFilePodNormalFolder.Append(1800, "Move Down")
        self.popupMenuFilePodNormalFolder.AppendSeparator()
        self.popupMenuFilePodNormalFolder.Append(2000, "Web Sharing...")
        self.popupMenuFilePodNormalFolder.Append(2100, "Web Import...")
        self.popupMenuFilePodNormalFolder.AppendSeparator()
        self.popupMenuFilePodNormalFolder.Append(2200, "Create global shortcut")
        self.popupMenuFilePodNormalFolder.Append(2400, "Create pod shortcut")
        self.popupMenuFilePodNormalFolder.AppendSeparator()
        self.popupMenuFilePodNormalFolder.Append(2600, "Tags...")

        self.Bind(wx.EVT_MENU, self.OnMenuItemNormalFolderUploadFolder, id=600)
        self.Bind(wx.EVT_MENU, self.OnMenuItemNormalFolderUploadFile, id=800)
        self.Bind(wx.EVT_MENU, self.OnMenuItemNormalFolderCreateChildFolder, id=810)
        self.Bind(wx.EVT_MENU, self.OnMenuItemNormalFolderRename, id=1000)
        self.Bind(wx.EVT_MENU, self.OnMenuItemNormalFolderMove, id=1200)
        self.Bind(wx.EVT_MENU, self.OnMenuItemNormalFolderDelete, id=1400)
        self.Bind(wx.EVT_MENU, self.OnMenuItemNormalFolderMoveUp, id=1600)
        self.Bind(wx.EVT_MENU, self.OnMenuItemNormalFolderMoveDown, id=1800)
        self.Bind(wx.EVT_MENU, self.OnButtonClickFolderWebSharing, id=2000)
        self.Bind(wx.EVT_MENU, self.OnButtonClickFolderWebImport, id=2100)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFolderCreateGlobalShortcut, id=2200)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFolderCreatePodShortcut, id=2400)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFolderTags, id=2600)

        self.popupMenuFile = wx.Menu()

        self.popupMenuFile.Append(4000, "Edit...")
        self.popupMenuFile.AppendSeparator()
        self.popupMenuFile.Append(4010, "Upload...")
        self.popupMenuFile.Append(4020, "Download...")
        self.popupMenuFile.AppendSeparator()
        self.popupMenuFile.Append(4030, "Rename...")
        self.popupMenuFile.Append(4040, "Move...")
        self.popupMenuFile.AppendSeparator()
        self.popupMenuFile.Append(4050, "Delete...")
        self.popupMenuFile.AppendSeparator()
        self.popupMenuFile.Append(4060, "History...")
        self.popupMenuFile.AppendSeparator()
        self.popupMenuFile.Append(4080, "Web Sharing...")
        self.popupMenuFile.AppendSeparator()
        self.popupMenuFile.Append(4100, "Create global shortcut")
        self.popupMenuFile.Append(4120, "Create pod shortcut")
        self.popupMenuFile.AppendSeparator()
        self.popupMenuFile.Append(4140, "Tags...")

        self.Bind(wx.EVT_MENU, self.OnMenuItemFileEdit, id=4000)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFileUpload, id=4010)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFileDownload, id=4020)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFileRename, id=4030)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFileMove, id=4040)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFileDelete, id=4050)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFileHistory, id=4060)
        self.Bind(wx.EVT_MENU, self.OnButtonClickFileWebSharing, id=4080)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFileCreateGlobalShortcut, id=4100)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFileCreatePodShortcut, id=4120)
        self.Bind(wx.EVT_MENU, self.OnMenuItemFileTags, id=4140)


    def __del__(self):
        pass


    def FindChildFolders(self, folderParentId, folderTree):
        if folderParentId in folderTree:
            return folderTree[folderParentId]
        else:
            return None


    def getFirstChild(self, childFolders):

        for childFolder in childFolders:
            if childFolder["FolderPreviousSiblingID"] == None:
                return childFolder

        return None

    def getNextChild(self, curchildFolder, childFolders):

        for childFolder in childFolders:
            if curchildFolder["FolderNextSiblingID"] == childFolder["FolderID"]:
                return childFolder

        return None

    def LoadFolderTree(self, folderParentId, folderTree, ParentTreeNode, podFolderWebShares, podFolderWebImports):
        childFolders = self.FindChildFolders(folderParentId, folderTree)

        if None != childFolders:

            childFolder = self.getFirstChild(childFolders)

            while None != childFolder:

                childTreeNode = self.m_treeCtrlFoldersAndFiles.AppendItem(ParentTreeNode, childFolder["Name"])

                for podFolderWebShare in podFolderWebShares:
                    if podFolderWebShare['PodFolderID'] == childFolder['FolderID']:
                        self.m_treeCtrlFoldersAndFiles.SetItemText(childTreeNode, self.m_treeCtrlFoldersAndFiles.GetItemText(
                            childTreeNode) + " - Web Shared")
                        break

                for podFolderWebImport in podFolderWebImports:
                    if podFolderWebImport['PodFolderID'] == childFolder['FolderID']:
                        self.m_treeCtrlFoldersAndFiles.SetItemText(childTreeNode,
                                                                   self.m_treeCtrlFoldersAndFiles.GetItemText(
                                                                       childTreeNode) + " - Web Import")
                        break

                self.m_treeCtrlFoldersAndFiles.SetItemData(childTreeNode,
                                                           wx.TreeItemData(
                                                               treenodeinfo.TreeNodeInfo('', childFolder["FolderID"])))
                self.m_treeCtrlFoldersAndFiles.SetItemImage(childTreeNode, 1, wx.TreeItemIcon_Normal)

                self.LoadFolderTree(childFolder["FolderID"], folderTree, childTreeNode, podFolderWebShares, podFolderWebImports)

                childFolder = self.getNextChild(childFolder, childFolders)



    def LoadFilePodTree(self, podFolderWebShares, podFolderWebImports):
        self.m_treeCtrlFoldersAndFiles.DeleteAllItems()

        businessLogic = bl.BusinessLogic()

        FilePodRootFolders = businessLogic.RetrieveFilePodRootFolder(self.rightPaneInitData['podid'])[1]['podfolders']

        for filePodRootFolder in FilePodRootFolders:
            folderTree = businessLogic.RetrieveFolderTree(filePodRootFolder["FolderID"])

            folderTreeHash = {}

            for folderTreeItem in folderTree:
                if folderTreeItem["FolderParentID"] in folderTreeHash:
                    folderTreeHash[folderTreeItem["FolderParentID"]].append(folderTreeItem)
                else:
                    folderTreeHash[folderTreeItem["FolderParentID"]] = []
                    folderTreeHash[folderTreeItem["FolderParentID"]].append(folderTreeItem)

            folderTree = folderTreeHash

            rootFolder = businessLogic.RetrieveFolderByFolderId(filePodRootFolder["FolderID"])

            filePodRootTreeNode = self.m_treeCtrlFoldersAndFiles.AddRoot(rootFolder["Name"])

            for podFolderWebShare in podFolderWebShares:
                if podFolderWebShare['PodFolderID'] == rootFolder['FolderID']:
                    self.m_treeCtrlFoldersAndFiles.SetItemText(filePodRootTreeNode,
                                                               self.m_treeCtrlFoldersAndFiles.GetItemText(
                                                                   filePodRootTreeNode) + " - Web Shared")
                    break

            for podFolderWebImport in podFolderWebImports:
                if podFolderWebImport['PodFolderID'] == rootFolder['FolderID']:
                    self.m_treeCtrlFoldersAndFiles.SetItemText(filePodRootTreeNode,
                                                               self.m_treeCtrlFoldersAndFiles.GetItemText(
                                                                   filePodRootTreeNode) + " - Web Import")
                    break

            self.m_treeCtrlFoldersAndFiles.SetItemData(filePodRootTreeNode,
                                                       wx.TreeItemData(
                                                           treenodeinfo.TreeNodeInfo('root',
                                                                                     filePodRootFolder["FolderID"])))
            self.m_treeCtrlFoldersAndFiles.SetItemImage(filePodRootTreeNode, 1, wx.TreeItemIcon_Normal)

            self.LoadFolderTree(filePodRootFolder["FolderID"], folderTree, filePodRootTreeNode, podFolderWebShares, podFolderWebImports)

        if self.m_treeCtrlFoldersAndFiles.GetCount() > 0:
            self.m_treeCtrlFoldersAndFiles.SelectItem(self.m_treeCtrlFoldersAndFiles.GetRootItem())

    def enableDisableMenus(self):

        if self.rightPaneInitData["canwrite"] == 0:

            self.popupMenuFilePodRootFolder.Enable(205, False) # "Upload Folder...")
            self.popupMenuFilePodRootFolder.Enable(207, False) # "Create Child Folder...")
            self.popupMenuFilePodRootFolder.Enable(210, False) # "Rename Folder...")
            self.popupMenuFilePodRootFolder.Enable(405, False) # "Upload File...")
            self.popupMenuFilePodRootFolder.Enable(605, False) # "Web Sharing...")
            self.popupMenuFilePodRootFolder.Enable(805, False) # "Create global shortcut")
            self.popupMenuFilePodRootFolder.Enable(1005, False) # "Create pod shortcut")
            self.popupMenuFilePodRootFolder.Enable(1205, False) # "Tags...")

            self.popupMenuFilePodNormalFolder.Enable(600, False) # "Upload Folder...")
            self.popupMenuFilePodNormalFolder.Enable(800, False) # "Upload File...")
            self.popupMenuFilePodNormalFolder.Enable(810, False) # "Create Child Folder...")
            self.popupMenuFilePodNormalFolder.Enable(1000, False) # "Rename...")
            self.popupMenuFilePodNormalFolder.Enable(1200, False) # "Move...")
            self.popupMenuFilePodNormalFolder.Enable(1400, False) # "Delete...")
            self.popupMenuFilePodNormalFolder.Enable(1600, False) # "Move Up")
            self.popupMenuFilePodNormalFolder.Enable(1800, False) # "Move Down")
            self.popupMenuFilePodNormalFolder.Enable(2000, False) # "Web Sharing...")
            self.popupMenuFilePodNormalFolder.Enable(2200,False) #  "Create global shortcut")
            self.popupMenuFilePodNormalFolder.Enable(2400, False) # "Create pod shortcut")
            self.popupMenuFilePodNormalFolder.Enable(2600, False) # "Tags...")

            self.popupMenuFile.Enable(4000, False) # "Edit...")
            self.popupMenuFile.Enable(4010, False) # "Upload...")
            self.popupMenuFile.Enable(4020, True) # "Download...")
            self.popupMenuFile.Enable(4030, False) # "Rename...")
            self.popupMenuFile.Enable(4040, False) # "Move...")
            self.popupMenuFile.Enable(4050, False) #  "Delete...")
            self.popupMenuFile.Enable(4060, False) # "History...")
            self.popupMenuFile.Enable(4080, False) # "Web Sharing...")
            self.popupMenuFile.Enable(4100, False) # "Create global shortcut")
            self.popupMenuFile.Enable(4120, False) # "Create pod shortcut")
            self.popupMenuFile.Enable(4140, False) # "Tags...")

    def ResetBrowserPane(self):

        if self.m_gridFiles.GetNumberRows() > 0:
            self.m_gridFiles.DeleteRows(0, 100000)

        # if we don't have a root folder for this pod, create one

        businessLogic = bl.BusinessLogic()

        podFolderWebShares = businessLogic.RetrieveAllPodFolderSharesByPodID(self.rightPaneInitData['podid'])['podfoldershares']
        podFolderWebImports = businessLogic.RetrieveAllPodFolderImportsByPodID(self.rightPaneInitData['podid'])['podfolderimports']

        rootPodFolder = businessLogic.RetrieveFilePodRootFolder(self.rightPaneInitData['podid'])

        podFolders = rootPodFolder[1]['podfolders']

        if len(podFolders) == 0:
            rootFolder = {}

            rootFolder["Name"] = "pod root"
            rootFolder["Created"] = datetime.datetime.now().isoformat()
            rootFolder["IsDeleted"] = 0
            rootFolder["ModifiedBySecurityUserID"] = self.mainWindow.loggedInSecurityUserID
            rootFolder["TreeID"] = -1

            rootFolder = businessLogic.InsertRootFolder(rootFolder)

            businessLogic.CreateFilePodRootFolder(self.rightPaneInitData['podid'], rootFolder["FolderID"], "pod root")

        self.LoadFilePodTree(podFolderWebShares, podFolderWebImports)

        self.m_treeCtrlFoldersAndFilesOnTreeSelChanged(None)


    def Initialize(self, mainWindow, rightPaneInitData):
        self.mainWindow = mainWindow
        self.rightPaneInitData = rightPaneInitData

        self.treeImageList = wx.ImageList(16, 16, False, 11)

        self.imgfile = self.treeImageList.Add(
            wx.Image("graphics/filepodsicon_addfile.png", wx.BITMAP_TYPE_PNG).Scale(16, 16).ConvertToBitmap())
        self.imgfolderclosed = self.treeImageList.Add(
            wx.Image("graphics/filepods-folderclosed.png", wx.BITMAP_TYPE_PNG).Scale(16, 16).ConvertToBitmap())

        self.m_treeCtrlFoldersAndFiles.AssignImageList(self.treeImageList)

        self.enableDisableMenus()

        businessLogic = bl.BusinessLogic()

        self.ResetBrowserPane()

        self.currentPodChangeTime = businessLogic.RetrievePodLastChangeTime(rightPaneInitData['podid'])

        self.runCheckerThread = True

        self.runningPodChangeCheckerThread = threading.Thread(target=podUpdateCheckerThreadProc, args=(self,))
        self.runningPodChangeCheckerThread.start()


    def Uninitialize(self):

        self.runCheckerThread = False


    def LockPodForWriting(self):

        businessLogic = bl.BusinessLogic()

        canWrite = businessLogic.LockFilePodForEditing(self.rightPaneInitData["podid"], self.mainWindow.loggedInSecurityUserID)

        if canWrite == False:
            wx.MessageBox('Another change to this pod is occuring so it is locked, please wait and try your modification again', 'Leopard Data filePODS',
                              wx.OK | wx.ICON_INFORMATION)

        return canWrite

    def UnlockPod(self):

        businessLogic = bl.BusinessLogic()
        businessLogic.UnlockFilePod(self.rightPaneInitData["podid"])

    def SetPodLastChangeTime(self):

        businessLogic = bl.BusinessLogic()
        businessLogic.UpdatePodLastChangeTime(self.rightPaneInitData["podid"])
        self.currentPodChangeTime = businessLogic.RetrievePodLastChangeTime(self.rightPaneInitData["podid"])

        # Virtual event handlers, overide them in your derived class

    def OnButtonClickUploadFolders(self, event):

        if True == self.LockPodForWriting():

            dialog = wx.DirDialog(None, "Choose a directory:", style=wx.DD_DEFAULT_STYLE | wx.DD_NEW_DIR_BUTTON)
            if dialog.ShowModal() == wx.ID_OK:

                selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
                treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

                parentFolderID = treeNodeInfo.dbid

                selTreeItem = self.m_treeCtrlFoldersAndFiles.GetRootItem()
                treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

                treeID = treeNodeInfo.dbid

                self.mainWindow.transferEngine.UploadDirectory(self.rightPaneInitData['podid'], treeID, parentFolderID,
                                                               dialog.GetPath())

            else:
                self.UnlockPod()


    def OnButtonClickRenameFolder(self, event):

        if True == self.LockPodForWriting():

            dialogRenameObject = dialogrenameobject.DialogRenameObject(self)

            dialogRenameObject.CenterOnScreen()

            selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
            treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()
            itemText = self.m_treeCtrlFoldersAndFiles.GetItemText(selTreeItem)

            dialogRenameObject.m_textCtrlNewFolderName.SetValue(itemText)

            response = dialogRenameObject.ShowModal()

            if response == 1:
                businessLogic = bl.BusinessLogic()

                if True == businessLogic.RenameFolder(treeNodeInfo.dbid,
                                                      dialogRenameObject.m_textCtrlNewFolderName.GetValue()):
                    self.m_treeCtrlFoldersAndFiles.SetItemText(selTreeItem,
                                                               dialogRenameObject.m_textCtrlNewFolderName.GetValue())

                    self.SetPodLastChangeTime()
                else:
                    pass  # oh crap!

            self.UnlockPod()



    def OnButtonClickMoveFolder(self, event):

        if True == self.LockPodForWriting():

            DialogRemoteFilePodFolderChooser = dialogremotefilepodfolderchooser.DialogRemotePodFolderChooser(self)

            DialogRemoteFilePodFolderChooser.loadFolders(self.rightPaneInitData)

            DialogRemoteFilePodFolderChooser.CenterOnScreen()

            DialogRemoteFilePodFolderChooser.Title = 'Choose Destionation Parent Folder'

            response = DialogRemoteFilePodFolderChooser.ShowModal()

            if response == 1:

                selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
                treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

                if treeNodeInfo.dbid == DialogRemoteFilePodFolderChooser.selectedFolderID:
                    wx.MessageBox('You can not set the parent of the selected folder to itself!', 'Leopard Data File Pods',
                                  wx.OK | wx.ICON_ERROR)
                else:
                    businessLogic = bl.BusinessLogic()

                    businessLogic.MoveFolderToNewParent(treeNodeInfo.dbid,
                                                        DialogRemoteFilePodFolderChooser.selectedFolderID)

                    podFolderWebShares = businessLogic.RetrieveAllPodFolderSharesByPodID(self.rightPaneInitData['podid'])[
                        'podfoldershares']

                    podFolderWebImports = businessLogic.RetrieveAllPodFolderImportsByPodID(self.rightPaneInitData['podid'])['podfolderimports']

                    self.LoadFilePodTree(podFolderWebShares, podFolderWebImports)
                    self.SetPodLastChangeTime()

            self.UnlockPod()



    def OnButtonDeleteFolder(self, event):

        if True == self.LockPodForWriting():

            response = wx.MessageBox('Are you sure you want to permanently delete the selected folder!?',
                                     'Leopard Data filePODS',
                                     wx.YES_NO | wx.ICON_QUESTION)

            if response == 2:

                selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
                treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

                businessLogic = bl.BusinessLogic()

                podFolderWebShares = businessLogic.RetrieveAllPodFolderSharesByPodID(self.rightPaneInitData['podid'])[
                    'podfoldershares']

                podFolderWebImports = businessLogic.RetrieveAllPodFolderImportsByPodID(self.rightPaneInitData['podid'])['podfolderimports']

                if True == businessLogic.DeleteFolder(treeNodeInfo.dbid, self.mainWindow.loggedInSecurityUserID):
                    self.LoadFilePodTree(podFolderWebShares, podFolderWebShares)

                    self.SetPodLastChangeTime()

            self.UnlockPod()


    def OnButtonClickFolderWebSharing(self, event):
        event.Skip()


    def OnButtonClickUploadFile(self, event):

        if True == self.LockPodForWriting():

            openFileDialog = wx.FileDialog(self, "Browse and Choose File", "", "",
                                           "All files (*.*)|*.*",
                                           wx.FD_OPEN | wx.FD_FILE_MUST_EXIST)
            if openFileDialog.ShowModal() == wx.ID_OK:
                fileToUploadPath = openFileDialog.GetPath()

                selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
                treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

                parentFolderID = treeNodeInfo.dbid

                self.mainWindow.transferEngine.UploadFile(self.rightPaneInitData['podid'], parentFolderID, fileToUploadPath)
            else:
                self.UnlockPod()


    def OnButtonClickRenameFile(self, event):

        if True == self.LockPodForWriting():

            dialogRenameObject = dialogrenameobject.DialogRenameObject(self)
            dialogRenameObject.Title = "Rename File"
            dialogRenameObject.m_staticText39.SetLabel('File Name')

            dialogRenameObject.CenterOnScreen()

            selectedRowIndex = self.m_gridFiles.SelectedRows[0]

            filename = self.m_gridFiles.GetCellValue(selectedRowIndex, 1)

            dialogRenameObject.m_textCtrlNewFolderName.SetValue(filename)

            response = dialogRenameObject.ShowModal()

            if response == 1:
                businessLogic = bl.BusinessLogic()

                if True == businessLogic.RenameFile(self.m_gridFiles.GetCellValue(selectedRowIndex, 0),
                                                    dialogRenameObject.m_textCtrlNewFolderName.GetValue()):
                    selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
                    treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

                    self.LoadAllFilesForSelectedFolder(treeNodeInfo.dbid)
                    self.SetPodLastChangeTime()
                else:
                    pass  # oh crap!

            self.UnlockPod()


    def OnButtonClickMoveFile(self, event):

        if True == self.LockPodForWriting():

            DialogRemoteFilePodFolderChooser = dialogremotefilepodfolderchooser.DialogRemotePodFolderChooser(self)

            DialogRemoteFilePodFolderChooser.loadFolders(self.rightPaneInitData)

            DialogRemoteFilePodFolderChooser.CenterOnScreen()

            DialogRemoteFilePodFolderChooser.Title = 'Choose Destination Parent Folder'

            response = DialogRemoteFilePodFolderChooser.ShowModal()

            if response == 1:

                selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
                treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

                if treeNodeInfo.dbid == DialogRemoteFilePodFolderChooser.selectedFolderID:
                    wx.MessageBox('You can not set the parent of the selected folder to itself!', 'Leopard Data File Pods',
                                  wx.OK | wx.ICON_ERROR)
                else:
                    businessLogic = bl.BusinessLogic()

                    selectedRowIndex = self.m_gridFiles.SelectedRows[0]

                    podFileID = self.m_gridFiles.GetCellValue(selectedRowIndex, 0)

                    businessLogic.MoveFileToNewParentFolder(podFileID, DialogRemoteFilePodFolderChooser.selectedFolderID)

                    self.LoadAllFilesForSelectedFolder(treeNodeInfo.dbid)

                    self.SetPodLastChangeTime()

            self.UnlockPod()


    def OnButtonDeleteFile(self, event):

        if True == self.LockPodForWriting():

            response = wx.MessageBox('Are you sure you want to permanently delete the selected file!?',
                                     'Leopard Data filePODS',
                                     wx.YES_NO | wx.ICON_QUESTION)

            if response == 2:

                businessLogic = bl.BusinessLogic()

                selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
                treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

                selectedRowIndex = self.m_gridFiles.SelectedRows[0]

                podFileID = self.m_gridFiles.GetCellValue(selectedRowIndex, 0)

                if True == businessLogic.DeleteFile(podFileID):
                    self.LoadAllFilesForSelectedFolder(treeNodeInfo.dbid)
                    self.SetPodLastChangeTime()

            self.UnlockPod()


    def OnButtonClickEditFile(self, event):

        if True == self.LockPodForWriting():

            selectedRowIndex = self.m_gridFiles.SelectedRows[0]

            podFileId = self.m_gridFiles.GetCellValue(selectedRowIndex, 0)
            filename = self.m_gridFiles.GetCellValue(selectedRowIndex, 1)

            businessLogic = bl.BusinessLogic()

            podFileId = businessLogic.RetrieveTopRevisionFilePodIDByExistingPodFileIDFamily(podFileId)['podfileid']

            uniquefolderid = str(uuid.uuid1())

            os.mkdir(self.mainWindow.sandboxPath + '/' + uniquefolderid)

            self.mainWindow.transferEngine.DownloadFileAndWaitForCompletion(podFileId, filename,
                                                                            self.mainWindow.sandboxPath + '/' + uniquefolderid)

            localDal = dalsqlite.DalSqlite()

            selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
            treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

            podInformation = businessLogic.RetrieveFilePodInformation(self.rightPaneInitData["podid"])

            localDal.AddFileInEdit(filename, uniquefolderid, treeNodeInfo.dbid, self.rightPaneInitData['podid'],
                                   podInformation["pods"][0]["Name"])

            if sys.platform == "win32":
                os.startfile(self.mainWindow.sandboxPath + '/' + uniquefolderid + '/' + filename)
            elif sys.platform == "darwin":
                subprocess.call(['open', self.mainWindow.sandboxPath + '/' + uniquefolderid + '/' + filename])
            else:
                subprocess.call(["xdg-open", self.mainWindow.sandboxPath + '/' + uniquefolderid + '/' + filename])

            self.UnlockPod()


    def OnButtonClickView(self, event):

        if True == self.LockPodForWriting():

            selectedRowIndex = self.m_gridFiles.SelectedRows[0]

            podFileId = self.m_gridFiles.GetCellValue(selectedRowIndex, 0)
            filename = self.m_gridFiles.GetCellValue(selectedRowIndex, 1)

            businessLogic = bl.BusinessLogic()

            podFileId = businessLogic.RetrieveTopRevisionFilePodIDByExistingPodFileIDFamily(podFileId)['podfileid']

            uniquefolderid = str(uuid.uuid1())

            os.mkdir(self.mainWindow.sandboxViewPath + '/' + uniquefolderid)

            self.mainWindow.transferEngine.DownloadFileAndWaitForCompletion(podFileId, filename,
                                                                            self.mainWindow.sandboxViewPath + '/' + uniquefolderid)

            if sys.platform == "win32":
                os.startfile(self.mainWindow.sandboxViewPath + '/' + uniquefolderid + '/' + filename)
            elif sys.platform == "darwin":
                subprocess.call(['open', self.mainWindow.sandboxViewPath + '/' + uniquefolderid + '/' + filename])
            else:
                subprocess.call(["xdg-open", self.mainWindow.sandboxViewPath + '/' + uniquefolderid + '/' + filename])

            self.UnlockPod()

    def m_gridFilesOnGridCmdSelectCell(self, event):

        if self.rightPaneInitData["canwrite"] == 1:
            self.m_buttonFileWebSharing.Enable()
            self.m_buttonDeleteFile.Enable()
            self.m_buttonEditFile.Enable()
            self.m_buttonRenameFile.Enable()
            self.m_buttonUploadFile.Enable()
            self.m_buttonMoveFile.Enable()
            self.m_buttonHistory.Enable()
        else:
            self.m_buttonDeleteFile.Disable()
            self.m_buttonEditFile.Disable()
            self.m_buttonFileWebSharing.Disable()
            self.m_buttonRenameFile.Disable()
            self.m_buttonUploadFile.Disable()
            self.m_buttonMoveFile.Disable()
            self.m_buttonHistory.Disable()

        self.m_buttonDownloadFile.Enable()
        self.m_buttonViewFile.Enable()



    def m_splitterMainOnIdle(self, event):
        self.m_splitterMain.SetSashPosition(0)
        self.m_splitterMain.Unbind(wx.EVT_IDLE)


    def m_treeCtrlFoldersAndFilesOnTreeItemExpanded(self, event):
        event.Skip()


    def m_treeCtrlFoldersAndFilesOnTreeItemMenu(self, event):
        selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
        treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

        if treeNodeInfo.type == 'root':
            self.m_treeCtrlFoldersAndFiles.PopupMenu(self.popupMenuFilePodRootFolder, event.GetPoint())
        else:
            self.m_treeCtrlFoldersAndFiles.PopupMenu(self.popupMenuFilePodNormalFolder, event.GetPoint())


    def m_treeCtrlFoldersAndFilesOnTreeItemRightClick(self, event):
        event.Skip()


    def m_treeCtrlFoldersAndFilesOnTreeSelChanged(self, event):
        selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
        treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

        if treeNodeInfo.type == 'root':
            self.m_buttonUploadFolders.Enable()
            self.m_buttonDeleteFolderOrFile.Disable()
            self.m_buttonRenameFolderOrFile.Disable()
            self.m_buttonMoveFolderOrFile.Disable()
            self.m_buttonFolderWebSharing.Enable()
            self.m_buttonUploadFile.Enable()
        else:
            self.m_buttonUploadFolders.Enable()
            self.m_buttonDeleteFolderOrFile.Enable()
            self.m_buttonRenameFolderOrFile.Enable()
            self.m_buttonMoveFolderOrFile.Enable()
            self.m_buttonFolderWebSharing.Enable()
            self.m_buttonUploadFile.Enable()

        if self.rightPaneInitData["canwrite"] == 0:
            self.m_buttonUploadFolders.Disable()
            self.m_buttonDeleteFolderOrFile.Disable()
            self.m_buttonRenameFolderOrFile.Disable()
            self.m_buttonMoveFolderOrFile.Disable()
            self.m_buttonFolderWebSharing.Disable()
            self.m_buttonUploadFile.Disable()

        businessLogic = bl.BusinessLogic()

        self.LoadAllFilesForSelectedFolder(treeNodeInfo.dbid)


    def OnMenuItemRootFolderUploadFolder(self, event):
        self.OnButtonClickUploadFolders(event)


    def OnMenuItemRootFolderUploadFile(self, event):
        self.OnButtonClickUploadFile(None)


    def OnMenuItemNormalFolderUploadFolder(self, event):
        self.OnButtonClickUploadFolders(event)


    def OnMenuItemNormalFolderUploadFile(self, event):
        self.OnButtonClickUploadFile(event)

    def OnMenuItemNormalFolderCreateChildFolder(self, event):

        if True == self.LockPodForWriting():

            selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
            treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

            DialogCreateFolder = dialogcreatefolder.DialogCreateFolder(self)

            DialogCreateFolder.CenterOnScreen()

            response = DialogCreateFolder.ShowModal()

            if response == 1:

                businessLogic = bl.BusinessLogic()

                newFolder = {}
                newFolder["FolderID"] = None
                newFolder["Name"] = DialogCreateFolder.m_textCtrlHandle.GetValue()
                newFolder["TreeID"] = 1
                newFolder["FolderParentID"] = None
                newFolder["FolderNextSiblingID"] = None
                newFolder["FolderPreviousSiblingID"] = None
                newFolder["Created"] = datetime.datetime.now().isoformat()
                newFolder["IsDeleted"] = 0
                newFolder["ModifiedBySecurityUserID"] = self.mainWindow.loggedInSecurityUserID

                newFolder = businessLogic.InsertFolderChildOfExistingFolder(treeNodeInfo.dbid, newFolder)

                childTreeNode = self.m_treeCtrlFoldersAndFiles.AppendItem(selTreeItem, DialogCreateFolder.m_textCtrlHandle.GetValue())

                self.m_treeCtrlFoldersAndFiles.SetItemData(childTreeNode,
                                                           wx.TreeItemData(
                                                               treenodeinfo.TreeNodeInfo('', newFolder["FolderID"])))
                self.m_treeCtrlFoldersAndFiles.SetItemImage(childTreeNode, 1, wx.TreeItemIcon_Normal)


                listTreeItemInfo = []

                (currentChild, cookie) = self.m_treeCtrlFoldersAndFiles.GetFirstChild(selTreeItem)

                while currentChild.IsOk():

                    childData = {}
                    childData['Name'] = self.m_treeCtrlFoldersAndFiles.GetItemText(currentChild)
                    childData['ItemData'] = self.m_treeCtrlFoldersAndFiles.GetItemData(currentChild).GetData()
                    childData['TreeItem'] = currentChild

                    listTreeItemInfo.append(childData)

                    currentChild = self.m_treeCtrlFoldersAndFiles.GetNextSibling(currentChild)

                if len(listTreeItemInfo) > 1:

                    self.m_treeCtrlFoldersAndFiles.SetItemData(listTreeItemInfo[0]['TreeItem'],
                                                               wx.TreeItemData(listTreeItemInfo[len(listTreeItemInfo) - 1]['ItemData']))
                    self.m_treeCtrlFoldersAndFiles.SetItemText(listTreeItemInfo[0]['TreeItem'], listTreeItemInfo[len(listTreeItemInfo) - 1]['Name'])

                    for i in range(1, len(listTreeItemInfo)):
                        self.m_treeCtrlFoldersAndFiles.SetItemData(listTreeItemInfo[i]['TreeItem'],
                                                                   wx.TreeItemData(listTreeItemInfo[i - 1]['ItemData']))
                        self.m_treeCtrlFoldersAndFiles.SetItemText(listTreeItemInfo[i]['TreeItem'], listTreeItemInfo[i - 1]['Name'])

                self.ResetBrowserPane()

                self.OnSelectPodObject(newFolder["FolderID"], None)

                self.SetPodLastChangeTime()


            self.UnlockPod()




    def OnMenuItemNormalFolderRename(self, event):
        self.OnButtonClickRenameFolder(None)


    def OnMenuItemNormalFolderMove(self, event):
        self.OnButtonClickMoveFolder(None)


    def OnMenuItemNormalFolderDelete(self, event):
        self.OnButtonDeleteFolder(None)


    def OnMenuItemNormalFolderMoveUp(self, event):

        if True == self.LockPodForWriting():

            selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()

            prevSiblingItem = self.m_treeCtrlFoldersAndFiles.GetPrevSibling(selTreeItem)

            if prevSiblingItem.IsOk():

                treeNodeInfoSelected = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

                businessLogic = bl.BusinessLogic()

                if True == businessLogic.MoveFolderUpOneNode(treeNodeInfoSelected.dbid):

                    treeNodeInfoPrevious = self.m_treeCtrlFoldersAndFiles.GetItemData(prevSiblingItem).GetData()

                    selectedName = self.m_treeCtrlFoldersAndFiles.GetItemText(selTreeItem)
                    previousName = self.m_treeCtrlFoldersAndFiles.GetItemText(prevSiblingItem)

                    self.m_treeCtrlFoldersAndFiles.SetItemText(selTreeItem, previousName)
                    self.m_treeCtrlFoldersAndFiles.SetItemText(prevSiblingItem, selectedName)

                    self.m_treeCtrlFoldersAndFiles.SetItemData(selTreeItem, wx.TreeItemData(treeNodeInfoPrevious))
                    self.m_treeCtrlFoldersAndFiles.SetItemData(prevSiblingItem, wx.TreeItemData(treeNodeInfoSelected))

                    self.ResetBrowserPane()

                    self.OnSelectPodObject(treeNodeInfoSelected.dbid, None)

                    self.SetPodLastChangeTime()

            self.UnlockPod()


    def OnMenuItemNormalFolderMoveDown(self, event):

        if True == self.LockPodForWriting():

            selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()

            nextSiblingItem = self.m_treeCtrlFoldersAndFiles.GetNextSibling(selTreeItem)

            if nextSiblingItem.IsOk():

                treeNodeInfoSelected = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

                businessLogic = bl.BusinessLogic()

                if True == businessLogic.MoveFolderDownOneNode(treeNodeInfoSelected.dbid):

                    treeNodeInfoPrevious = self.m_treeCtrlFoldersAndFiles.GetItemData(nextSiblingItem).GetData()

                    selectedName = self.m_treeCtrlFoldersAndFiles.GetItemText(selTreeItem)
                    previousName = self.m_treeCtrlFoldersAndFiles.GetItemText(nextSiblingItem)

                    self.m_treeCtrlFoldersAndFiles.SetItemText(selTreeItem, previousName)
                    self.m_treeCtrlFoldersAndFiles.SetItemText(nextSiblingItem, selectedName)

                    self.m_treeCtrlFoldersAndFiles.SetItemData(selTreeItem, wx.TreeItemData(treeNodeInfoPrevious))
                    self.m_treeCtrlFoldersAndFiles.SetItemData(nextSiblingItem, wx.TreeItemData(treeNodeInfoSelected))

                    self.ResetBrowserPane()

                    self.OnSelectPodObject(treeNodeInfoSelected.dbid, None)

                    self.SetPodLastChangeTime()

            self.UnlockPod()




    def LoadAllFilesForSelectedFolder(self, ParentFolderID):
        businessLogic = bl.BusinessLogic()

        podFiles = businessLogic.RetrieveFilePodFilesByParentFolderID(self.rightPaneInitData['podid'], ParentFolderID)

        podFileShares = businessLogic.RetrieveAllPodFileSharesByPodID(self.rightPaneInitData['podid'])['podfileshares']

        if (self.m_gridFiles.GetNumberRows() > 0):
            self.m_gridFiles.DeleteRows(0, 100000)

        self.m_gridFiles.AppendRows(len(podFiles))

        filesToPull = []

        for index, podFile in enumerate(podFiles):
            fileToPull = {}
            fileToPull["Filename"] = podFile["Filename"]
            fileToPull["PodParentFolderID"] = podFile["PodParentFolderID"]
            filesToPull.append(fileToPull)

        podFileRevisionShares = None

        if len(filesToPull) > 0:
            podFileRevisionShares = businessLogic.RetrieveAllPodFileRevisionsForListOfFiles(filesToPull)['podfilerevisionshares']

        for index, podFile in enumerate(podFiles):
            self.m_gridFiles.SetCellValue(index, 0, str(podFile['PodFileID']))
            self.m_gridFiles.SetCellValue(index, 1, podFile['Filename'])
            self.m_gridFiles.SetCellValue(index, 2, str(podFile['FileSizeInBytes']))
            self.m_gridFiles.SetCellValue(index, 3, podFile['Created'])

            haveAlwaysShareHighestRevision = False

            for podFileShare in podFileShares:
                if podFileShare['PodFileID'] == podFile['PodFileID']:
                    if podFileShare['IsAlwaysHighestRevision'] == 1:
                        haveAlwaysShareHighestRevision = True
                        break

            if True == haveAlwaysShareHighestRevision:
                self.m_gridFiles.SetCellValue(index, 4, 'Yes')
            else:
                self.m_gridFiles.SetCellValue(index, 4, 'No')

            haveRevisionWebShare = False

            if len(fileToPull) > 0:
                for podFileRevisionShare in podFileRevisionShares:
                    if podFileRevisionShare['Filename'] == podFile['Filename'] and \
                            podFileRevisionShare["PodParentFolderID"] == podFile["PodParentFolderID"]:
                        haveRevisionWebShare = True
                        break

                if True == haveRevisionWebShare:
                    self.m_gridFiles.SetCellValue(index, 5, 'Yes')
                else:
                    self.m_gridFiles.SetCellValue(index, 5, 'No')

        self.m_gridFiles.SetSelectionMode(wx.grid.Grid.wxGridSelectRows)
        self.m_gridFiles.HideCol(0)

        self.m_buttonDeleteFile.Disable()
        self.m_buttonDownloadFile.Disable()
        self.m_buttonViewFile.Disable()
        self.m_buttonEditFile.Disable()
        self.m_buttonFileWebSharing.Disable()
        self.m_buttonRenameFile.Disable()
        self.m_buttonUploadFile.Enable()
        self.m_buttonMoveFile.Disable()
        self.m_buttonHistory.Disable()

        if self.rightPaneInitData["canwrite"] == 0:
            self.m_buttonUploadFile.Disable()


    def OnButtonClickDownloadFolder(self, event):

        if True == self.LockPodForWriting():

            dialog = wx.DirDialog(None, "Choose a destination directory:", style=wx.DD_DEFAULT_STYLE | wx.DD_NEW_DIR_BUTTON)
            if dialog.ShowModal() == wx.ID_OK:

                selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
                treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

                parentFolderID = treeNodeInfo.dbid

                selTreeItem = self.m_treeCtrlFoldersAndFiles.GetRootItem()
                treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

                treeID = treeNodeInfo.dbid

                self.mainWindow.transferEngine.DownloadDirectory(self.rightPaneInitData['podid'], parentFolderID,
                                                                 dialog.GetPath())

                path = dialog.GetPath()

                if sys.platform == 'darwin':
                    subprocess.call(['open', '--', dialog.GetPath()])
                elif sys.platform == 'linux2':
                    subprocess.Popen(['xdg-open', path])
                elif sys.platform == 'win32':
                    subprocess.call(['explorer', dialog.GetPath()])

            else:
                self.UnlockPod()


    def OnButtonClickDownloadFile(self, event):

        if True == self.LockPodForWriting():

            dialog = wx.DirDialog(None, "Choose a destination directory:", style=wx.DD_DEFAULT_STYLE | wx.DD_NEW_DIR_BUTTON)
            if dialog.ShowModal() == wx.ID_OK:

                selectedRowIndex = self.m_gridFiles.SelectedRows[0]

                podFileId = self.m_gridFiles.GetCellValue(selectedRowIndex, 0)
                filename = self.m_gridFiles.GetCellValue(selectedRowIndex, 1)

                businessLogic = bl.BusinessLogic()

                podFileId = businessLogic.RetrieveTopRevisionFilePodIDByExistingPodFileIDFamily(podFileId)['podfileid']

                self.mainWindow.transferEngine.DownloadFile(podFileId, filename, dialog.GetPath(), self.rightPaneInitData["podid"])

                path = dialog.GetPath()

                if sys.platform == 'darwin':
                    subprocess.call(['open', '--', dialog.GetPath()])
                elif sys.platform == 'linux2':
                    subprocess.Popen(['xdg-open', path])
                elif sys.platform == 'win32':
                    subprocess.call(['explorer', dialog.GetPath()])

            else:
                self.UnlockPod()


    def m_gridFilesOnGridCmdCellRightClick(self, event):
        point = event.GetPosition()
        self.m_gridFiles.PopupMenu(self.popupMenuFile, point)


    def OnButtonClickHistory(self, event):
        dialogFileRevisionHistory = dialogfilerevisionhistory.DialogFileRevisionHistory(self)

        selectedRowIndex = self.m_gridFiles.SelectedRows[0]

        podFileId = self.m_gridFiles.GetCellValue(selectedRowIndex, 0)
        filename = self.m_gridFiles.GetCellValue(selectedRowIndex, 1)

        selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
        treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

        dialogFileRevisionHistory.CenterOnScreen()
        dialogFileRevisionHistory.Initialize(filename, treeNodeInfo.dbid, self.mainWindow, self.rightPaneInitData['podid'])

        dialogFileRevisionHistory.ShowModal()

        self.LoadAllFilesForSelectedFolder(treeNodeInfo.dbid)


    def OnButtonClickFileWebSharing(self, event):
        # check if file is already shared

        selectedRowIndex = self.m_gridFiles.SelectedRows[0]

        podFileId = self.m_gridFiles.GetCellValue(selectedRowIndex, 0)

        businessLogic = bl.BusinessLogic()

        isAlwaysHighestRevisionWebShared = businessLogic.IsAlwaysHighestRevisionForPodFileID(podFileId)[
            'isalwayshighestrevision']

        # run the dialog

        DialogManageFileWebSharing = dialogmanagefilewebsharing.DialogManageFileWebSharing(self)
        DialogManageFileWebSharing.CenterOnScreen()

        if isAlwaysHighestRevisionWebShared == 1:

            # if file is already shared

            podFileShare = businessLogic.RetrievePodFileShareByPodFileID(podFileId)['podfileshares'][0]

            DialogManageFileWebSharing.m_checkBoxAlwaysShareHighestRevision.Set3StateValue(True)
            DialogManageFileWebSharing.m_textCtrlIdentifer.SetValue(podFileShare['Identifier'])
            DialogManageFileWebSharing.m_textCtrlDescription.SetValue(podFileShare['Description'])

            result = DialogManageFileWebSharing.ShowModal()

            if result == 1:

                isAlwaysHighestRevision = None

                if DialogManageFileWebSharing.m_checkBoxAlwaysShareHighestRevision.GetValue() == True:
                    isAlwaysHighestRevision = 1
                else:
                    isAlwaysHighestRevision = 0

                businessLogic.ModifyPodFileShare(podFileShare['PodFileShareID'], self.rightPaneInitData['podid'], podFileId,
                                                 self.mainWindow.loggedInSecurityUserID,
                                                 isAlwaysHighestRevision,
                                                 DialogManageFileWebSharing.m_textCtrlIdentifer.GetValue(),
                                                 DialogManageFileWebSharing.m_textCtrlDescription.GetValue(),
                                                 datetime.datetime.now().isoformat(), 0, None)

                selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
                treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

                self.LoadAllFilesForSelectedFolder(treeNodeInfo.dbid)


        else:
            # if file is not shared

            DialogManageFileWebSharing.m_checkBoxAlwaysShareHighestRevision.Set3StateValue(True)
            DialogManageFileWebSharing.m_textCtrlIdentifer.SetValue(str(uuid.uuid1()))

            result = DialogManageFileWebSharing.ShowModal()

            if result == 1:
                isAlwaysHighestRevision = None

                if DialogManageFileWebSharing.m_checkBoxAlwaysShareHighestRevision.GetValue() == True:
                    isAlwaysHighestRevision = 1
                else:
                    isAlwaysHighestRevision = 0

                businessLogic.AddPodFileShare(self.rightPaneInitData['podid'], podFileId,
                                              self.mainWindow.loggedInSecurityUserID,
                                              isAlwaysHighestRevision,
                                              DialogManageFileWebSharing.m_textCtrlIdentifer.GetValue(),
                                              DialogManageFileWebSharing.m_textCtrlDescription.GetValue(),
                                              datetime.datetime.now().isoformat(), 0, None)

                selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
                treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

                self.LoadAllFilesForSelectedFolder(treeNodeInfo.dbid)


    def OnMenuItemFileEdit(self, event):
        self.OnButtonClickEditFile(event)


    def OnMenuItemFileUpload(self, event):
        self.OnButtonClickUploadFile(event)


    def OnMenuItemFileDownload(self, event):
        self.OnButtonClickDownloadFile(event)


    def OnMenuItemFileRename(self, event):
        self.OnButtonClickRenameFile(event)


    def OnMenuItemFileMove(self, event):
        self.OnButtonClickMoveFile(event)


    def OnMenuItemFileDelete(self, event):
        self.OnButtonDeleteFile(event)


    def OnMenuItemFileHistory(self, event):
        self.OnButtonClickHistory(event)


    def OnButtonClickFolderWebSharing(self, event):
        selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
        treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

        businessLogic = bl.BusinessLogic()

        podFolderShare = businessLogic.RetrievePodFolderShareByPodFolderID(treeNodeInfo.dbid)['podfoldershares']

        DialogManageFolderWebSharing = dialogmanagefolderwebsharing.DialogManageFolderWebSharing(self)

        DialogManageFolderWebSharing.CenterOnScreen()

        if len(podFolderShare) > 0:

            # this folder is already shared

            DialogManageFolderWebSharing.m_textCtrlIdentifer.SetValue(podFolderShare[0]['Identifier'])
            DialogManageFolderWebSharing.m_textCtrlIdentifer1.SetValue(podFolderShare[0]['WebPasscode'])
            DialogManageFolderWebSharing.m_textCtrlDescription.SetValue(podFolderShare[0]['Descr'])

            result = DialogManageFolderWebSharing.ShowModal()

            if result == 1:

                sharecount = businessLogic.IsPodFolderShareUsernameInUse(DialogManageFolderWebSharing.m_textCtrlIdentifer.GetValue())

                if sharecount["sharecount"][0]["sharecount"] > 0:
                    wx.MessageBox('Folder share username is already in use!  Please choose another!', 'Leopard Data filePODS',
                              wx.OK | wx.ICON_INFORMATION)
                else:
                    businessLogic.ModifyPodFolderShare(podFolderShare[0]['PodFolderShareID'], self.rightPaneInitData['podid'],
                                                       treeNodeInfo.dbid, self.mainWindow.loggedInSecurityUserID,
                                                       DialogManageFolderWebSharing.m_textCtrlIdentifer.GetValue(),
                                                       DialogManageFolderWebSharing.m_textCtrlDescription.GetValue(),
                                                       DialogManageFolderWebSharing.m_textCtrlIdentifer1.GetValue(),
                                                       datetime.datetime.now().isoformat(), 0, None)

        else:

            # this folder is not shared

            result = DialogManageFolderWebSharing.ShowModal()

            if result == 1:

                sharecount = businessLogic.IsPodFolderShareUsernameInUse(DialogManageFolderWebSharing.m_textCtrlIdentifer.GetValue())

                if sharecount["sharecount"][0]["sharecount"] > 0:
                    wx.MessageBox('Folder share username is already in use!  Please choose another!', 'Leopard Data filePODS',
                              wx.OK | wx.ICON_INFORMATION)
                else:
                    businessLogic.AddPodFolderShare(self.rightPaneInitData['podid'], treeNodeInfo.dbid,
                                                    self.mainWindow.loggedInSecurityUserID,
                                                    DialogManageFolderWebSharing.m_textCtrlIdentifer.GetValue(),
                                                    DialogManageFolderWebSharing.m_textCtrlDescription.GetValue(),
                                                    DialogManageFolderWebSharing.m_textCtrlIdentifer1.GetValue(),
                                                    datetime.datetime.now().isoformat(), 0, None)

                    self.m_treeCtrlFoldersAndFiles.SetItemText(selTreeItem, self.m_treeCtrlFoldersAndFiles.GetItemText(
                        selTreeItem) + " - Web Shared")

    def OnButtonClickFolderWebImport(self, event):

        selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
        treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

        businessLogic = bl.BusinessLogic()

        podFolderImport = businessLogic.RetrievePodFolderImportByPodFolderID(treeNodeInfo.dbid)['podfolderimports']

        DialogManageFolderWebImport = dialogmanagefolderwebimport.DialogManageFolderWebImport(self)

        DialogManageFolderWebImport.CenterOnScreen()

        if len(podFolderImport) > 0:

            # this folder is already shared

            DialogManageFolderWebImport.m_textCtrlUsername.SetValue(podFolderImport[0]['Identifier'])
            DialogManageFolderWebImport.m_textCtrlPassword.SetValue(podFolderImport[0]['WebPasscode'])
            DialogManageFolderWebImport.m_textCtrlDescription.SetValue(podFolderImport[0]['Descr'])

            result = DialogManageFolderWebImport.ShowModal()

            if result == 1:

                importcount = businessLogic.IsPodFolderImportUsernameInUse(DialogManageFolderWebImport.m_textCtrlUsername.GetValue())

                if importcount["importcount"][0]["importcount"] > 0:
                    wx.MessageBox('Folder import username is already in use!  Please choose another!', 'Leopard Data filePODS',
                              wx.OK | wx.ICON_INFORMATION)
                else:
                    businessLogic.ModifyPodFolderImport(podFolderImport[0]['PodFolderImportID'], self.rightPaneInitData['podid'],
                                                       treeNodeInfo.dbid, self.mainWindow.loggedInSecurityUserID,
                                                       DialogManageFolderWebImport.m_textCtrlUsername.GetValue(),
                                                       DialogManageFolderWebImport.m_textCtrlDescription.GetValue(),
                                                       DialogManageFolderWebImport.m_textCtrlPassword.GetValue(),
                                                       datetime.datetime.now().isoformat(), 0, None)

        else:

            # this folder is not shared

            result = DialogManageFolderWebImport.ShowModal()

            if result == 1:

                importcount = businessLogic.IsPodFolderImportUsernameInUse(DialogManageFolderWebImport.m_textCtrlUsername.GetValue())

                if importcount["importcount"][0]["importcount"] > 0:
                    wx.MessageBox('Folder import username is already in use!  Please choose another!', 'Leopard Data filePODS',
                              wx.OK | wx.ICON_INFORMATION)
                else:
                    businessLogic.AddPodFolderImport(self.rightPaneInitData['podid'], treeNodeInfo.dbid,
                                                    self.mainWindow.loggedInSecurityUserID,
                                                    DialogManageFolderWebImport.m_textCtrlUsername.GetValue(),
                                                    DialogManageFolderWebImport.m_textCtrlDescription.GetValue(),
                                                    DialogManageFolderWebImport.m_textCtrlPassword.GetValue(),
                                                    datetime.datetime.now().isoformat(), 0, None)

                    self.m_treeCtrlFoldersAndFiles.SetItemText(selTreeItem, self.m_treeCtrlFoldersAndFiles.GetItemText(
                        selTreeItem) + " - Web Import")


    def OnMenuItemFolderCreateGlobalShortcut(self, event):
        businessLogic = bl.BusinessLogic()

        selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
        treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

        businessLogic.AddPodFolderShortcut(self.mainWindow.loggedInSecurityUserID, treeNodeInfo.dbid,
                                           self.m_treeCtrlFoldersAndFiles.GetItemText(selTreeItem),
                                           self.rightPaneInitData['podid'], 1)


    def OnMenuItemFolderCreatePodShortcut(self, event):
        businessLogic = bl.BusinessLogic()

        selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
        treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

        businessLogic.AddPodFolderShortcut(self.mainWindow.loggedInSecurityUserID, treeNodeInfo.dbid,
                                           self.m_treeCtrlFoldersAndFiles.GetItemText(selTreeItem),
                                           self.rightPaneInitData['podid'], 0)


    def OnMenuItemFolderTags(self, event):
        DialogManageFolderTags = dialogmanagefoldertags.DialogManageFolderTags(self)

        DialogManageFolderTags.CenterOnScreen()

        selTreeItem = self.m_treeCtrlFoldersAndFiles.GetSelection()
        treeNodeInfo = self.m_treeCtrlFoldersAndFiles.GetItemData(selTreeItem).GetData()

        DialogManageFolderTags.Initialize(treeNodeInfo.dbid, self.mainWindow.loggedInSecurityUserID)

        DialogManageFolderTags.ShowModal()


    def OnMenuItemFileCreateGlobalShortcut(self, event):
        businessLogic = bl.BusinessLogic()

        selectedRowIndex = self.m_gridFiles.SelectedRows[0]

        podFileId = self.m_gridFiles.GetCellValue(selectedRowIndex, 0)
        filename = self.m_gridFiles.GetCellValue(selectedRowIndex, 1)

        businessLogic.AddPodFileShortcut(podFileId, filename, self.mainWindow.loggedInSecurityUserID,
                                         self.rightPaneInitData['podid'], 1)


    def OnMenuItemFileCreatePodShortcut(self, event):
        businessLogic = bl.BusinessLogic()

        selectedRowIndex = self.m_gridFiles.SelectedRows[0]

        podFileId = self.m_gridFiles.GetCellValue(selectedRowIndex, 0)
        filename = self.m_gridFiles.GetCellValue(selectedRowIndex, 1)

        businessLogic.AddPodFileShortcut(podFileId, filename, self.mainWindow.loggedInSecurityUserID,
                                         self.rightPaneInitData['podid'], 0)


    def OnMenuItemFileTags(self, event):
        DialogManageFileTags = dialogmanagefiletags.DialogManageFolderTags(self)

        DialogManageFileTags.CenterOnScreen()

        selectedRowIndex = self.m_gridFiles.SelectedRows[0]

        podFileId = self.m_gridFiles.GetCellValue(selectedRowIndex, 0)

        DialogManageFileTags.Initialize(podFileId, self.mainWindow.loggedInSecurityUserID)

        DialogManageFileTags.ShowModal()


    def OnSelectPodObject(self, podFolderId, podFileId):
        item = self.m_treeCtrlFoldersAndFiles.GetRootItem()

        for node in walk_branches(self.m_treeCtrlFoldersAndFiles, item):
            itemData = self.m_treeCtrlFoldersAndFiles.GetItemData(node).GetData()

            if itemData.dbid == podFolderId:
                self.m_treeCtrlFoldersAndFiles.SelectItem(node)
                break

        if podFileId is not None:
            for index in range(0, self.m_gridFiles.GetNumberRows()):
                if podFileId == int(self.m_gridFiles.GetCellValue(index, 0)):
                    self.m_gridFiles.SelectRow(index)
                    break


def podUpdateCheckerThreadProc(PanelFilePodBrowser):

        while PanelFilePodBrowser.runCheckerThread == True:

            businessLogic = bl.BusinessLogic()

            newPodChangeTime = businessLogic.RetrievePodLastChangeTime(PanelFilePodBrowser.rightPaneInitData['podid'])

            if newPodChangeTime != PanelFilePodBrowser.currentPodChangeTime:
                PanelFilePodBrowser.currentPodChangeTime = newPodChangeTime

                PanelFilePodBrowser.ResetBrowserPane()

            for i in range(0, 20):
                if PanelFilePodBrowser.runCheckerThread == False:
                    return
                time.sleep(.1)


