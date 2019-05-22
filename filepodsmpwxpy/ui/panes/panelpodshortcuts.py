# -*- coding: utf-8 -*- 

###########################################################################
## Python code generated with wxFormBuilder (version Jun 17 2015)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import sys
import os
import uuid
import subprocess

import wx
import wx.xrc
import wx.grid

from businesslogic import bl

from localdatabase import dalsqlite

from ui.dialogs import dialogmodifyshortcut

###########################################################################
## Class PanelPodShortcuts
###########################################################################

class PanelPodShortcuts(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent, id=wx.ID_ANY, pos=wx.DefaultPosition, size=wx.Size(977, 607),
                          style=wx.TAB_TRAVERSAL)

        bSizer66 = wx.BoxSizer(wx.VERTICAL)

        bSizer67 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_buttonModify = wx.Button(self, wx.ID_ANY, u"Modify...", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer67.Add(self.m_buttonModify, 0, wx.ALL, 5)

        self.m_buttonDelete = wx.Button(self, wx.ID_ANY, u"Delete...", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer67.Add(self.m_buttonDelete, 0, wx.ALL, 5)

        self.m_buttonOpen = wx.Button(self, wx.ID_ANY, u"Open", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer67.Add(self.m_buttonOpen, 0, wx.ALL, 5)

        self.m_buttonEditFile = wx.Button(self, wx.ID_ANY, u"Edit...", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer67.Add(self.m_buttonEditFile, 0, wx.ALL, 5)

        self.m_buttonViewFile = wx.Button(self, wx.ID_ANY, u"View...", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer67.Add(self.m_buttonViewFile, 0, wx.ALL, 5)

        bSizer67.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_checkBoxShowFileShortcuts = wx.CheckBox(self, wx.ID_ANY, u"Show File Shortcuts", wx.DefaultPosition,
                                                       wx.DefaultSize, 0)
        bSizer67.Add(self.m_checkBoxShowFileShortcuts, 0, wx.ALL, 5)

        self.m_checkBoxShowFolderShortcuts = wx.CheckBox(self, wx.ID_ANY, u"Show Folder Shortcuts", wx.DefaultPosition,
                                                         wx.DefaultSize, 0)
        bSizer67.Add(self.m_checkBoxShowFolderShortcuts, 0, wx.ALL, 5)

        bSizer67.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer66.Add(bSizer67, 0, wx.EXPAND, 5)

        bSizer68 = wx.BoxSizer(wx.VERTICAL)

        self.m_gridData = wx.grid.Grid(self, wx.ID_ANY, wx.DefaultPosition, wx.Size(-1, -1), 0)

        # Grid
        self.m_gridData.CreateGrid(0, 5)
        self.m_gridData.EnableEditing(False)
        self.m_gridData.EnableGridLines(True)
        self.m_gridData.EnableDragGridSize(False)
        self.m_gridData.SetMargins(0, 0)

        # Columns
        self.m_gridData.SetColSize(0, 20)
        self.m_gridData.SetColSize(1, 150)
        self.m_gridData.SetColSize(2, 150)
        self.m_gridData.SetColSize(3, 100)
        self.m_gridData.SetColSize(4, 75)
        self.m_gridData.EnableDragColMove(False)
        self.m_gridData.EnableDragColSize(True)
        self.m_gridData.SetColLabelSize(30)
        self.m_gridData.SetColLabelValue(0, u"ID")
        self.m_gridData.SetColLabelValue(1, u"Pod")
        self.m_gridData.SetColLabelValue(2, u"Name")
        self.m_gridData.SetColLabelValue(3, u"Filename")
        self.m_gridData.SetColLabelValue(4, u"Folder")
        self.m_gridData.SetColLabelAlignment(wx.ALIGN_CENTRE, wx.ALIGN_CENTRE)

        # Rows
        self.m_gridData.EnableDragRowSize(True)
        self.m_gridData.SetRowLabelSize(80)
        self.m_gridData.SetRowLabelAlignment(wx.ALIGN_CENTRE, wx.ALIGN_CENTRE)

        # Label Appearance

        # Cell Defaults
        self.m_gridData.SetDefaultCellAlignment(wx.ALIGN_LEFT, wx.ALIGN_TOP)
        bSizer68.Add(self.m_gridData, 1, wx.EXPAND, 5)

        bSizer66.Add(bSizer68, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer66)
        self.Layout()

        # Connect Events
        self.m_buttonModify.Bind(wx.EVT_BUTTON, self.OnButtonClickModify)
        self.m_buttonDelete.Bind(wx.EVT_BUTTON, self.OnButtonClickDelete)
        self.m_buttonOpen.Bind(wx.EVT_BUTTON, self.OnButtonClickOpen)
        self.m_buttonEditFile.Bind(wx.EVT_BUTTON, self.OnButtonClickEditFile)
        self.m_buttonViewFile.Bind(wx.EVT_BUTTON, self.OnButtonClickViewFile)
        self.m_checkBoxShowFileShortcuts.Bind(wx.EVT_CHECKBOX, self.OnCheckBoxClickShowFileShortcuts)
        self.m_checkBoxShowFolderShortcuts.Bind(wx.EVT_CHECKBOX, self.OnCheckboxShowFolderShortcuts)
        self.m_gridData.Bind(wx.grid.EVT_GRID_SELECT_CELL, self.m_gridDataOnGridSelectCell)

    def __del__(self):
        pass

    mainWindow = None


    def Initialize(self, mainWindow, rightPaneInitData):
        self.mainWindow = mainWindow
        self.rightPaneInitData = rightPaneInitData

        self.m_checkBoxShowFileShortcuts.SetValue(True)
        self.m_checkBoxShowFolderShortcuts.SetValue(True)

        self.LoadDataGrid()


    def Uninitialize(self):
        pass

    def LoadDataGrid(self):

        businessLogic = bl.BusinessLogic()

        self.m_buttonOpen.Disable()
        self.m_buttonModify.Disable()
        self.m_buttonDelete.Disable()
        self.m_buttonEditFile.Disable()
        self.m_buttonViewFile.Disable()

        if (self.m_gridData.GetNumberRows() > 0):
            self.m_gridData.DeleteRows(0, 100000)

        startingIndex = 0

        if self.m_checkBoxShowFileShortcuts.GetValue() == True:

            podFileShortcuts = businessLogic.RetrieveAllPodFileShortcutsBySecurityUserID(self.mainWindow.loggedInSecurityUserID, 0, self.rightPaneInitData['podid'])['podfileshortcuts']

            self.m_gridData.AppendRows(len(podFileShortcuts))

            for index, podFileShortcut in enumerate(podFileShortcuts):
                self.m_gridData.SetCellValue(index, 0, str(podFileShortcut['PodFileShortcutID']))
                self.m_gridData.SetCellValue(index, 1, podFileShortcut['PodName'])
                self.m_gridData.SetCellValue(index, 2, podFileShortcut['ShortcutName'])
                self.m_gridData.SetCellValue(index, 3, podFileShortcut['Filename'])
                self.m_gridData.SetCellValue(index, 4, '')

            startingIndex = len(podFileShortcuts)

        if self.m_checkBoxShowFolderShortcuts.GetValue() == True:

            podFolderShortcuts = businessLogic.RetrieveAllPodFolderShortcutsBySecurityUserID(self.mainWindow.loggedInSecurityUserID, 0, self.rightPaneInitData['podid'])['podfoldershortcuts']

            self.m_gridData.AppendRows(len(podFolderShortcuts))

            for index, podFolderShortcut in enumerate(podFolderShortcuts):
                index = index + startingIndex
                self.m_gridData.SetCellValue(index, 0, str(podFolderShortcut['PodFolderShortCutID']))
                self.m_gridData.SetCellValue(index, 1, podFolderShortcut['PodName'])
                self.m_gridData.SetCellValue(index, 2, podFolderShortcut['ShortcutName'])
                self.m_gridData.SetCellValue(index, 3, '')
                self.m_gridData.SetCellValue(index, 4, podFolderShortcut['FolderName'])

        self.m_gridData.SetSelectionMode(wx.grid.Grid.wxGridSelectRows)
        self.m_gridData.HideCol(0)

    # Virtual event handlers, override them in your derived class
    def OnButtonClickModify(self, event):

        selectedRowIndex = self.m_gridData.SelectedRows[0]

        itemID = int(self.m_gridData.GetCellValue(selectedRowIndex, 0))
        name = self.m_gridData.GetCellValue(selectedRowIndex, 3)

        businessLogic = bl.BusinessLogic()

        DialogModifyShortcut = dialogmodifyshortcut.DialogModifyShortcut(self)

        DialogModifyShortcut.CenterOnScreen()

        DialogModifyShortcut.m_textCtrlNewFolderName.SetValue(self.m_gridData.GetCellValue(selectedRowIndex, 2))

        result = DialogModifyShortcut.ShowModal()

        if result == 1:
            if len(name) > 0:  # this is a file short cut
                businessLogic.ModifyPodFileShortcutName(itemID, DialogModifyShortcut.m_textCtrlNewFolderName.GetValue())
            else:  # this is a folder shortcut
                businessLogic.ModifyPodFolderShortcutName(itemID, DialogModifyShortcut.m_textCtrlNewFolderName.GetValue())

            self.LoadDataGrid()


    def OnButtonClickDelete(self, event):

        response = wx.MessageBox('Are you sure you want to permanently delete the selected shortcut!?',
                                 'Leopard Data filePODS',
                                 wx.YES_NO | wx.ICON_QUESTION)

        if response == 2:

            selectedRowIndex = self.m_gridData.SelectedRows[0]

            itemID = int(self.m_gridData.GetCellValue(selectedRowIndex, 0))
            name = self.m_gridData.GetCellValue(selectedRowIndex, 3)

            businessLogic = bl.BusinessLogic()

            if len(name) > 0:
                businessLogic.DeletePodFileShortcut(itemID)
            else:
                businessLogic.DeletePodFolderShortcut(itemID)

            self.LoadDataGrid()


    def OnButtonClickOpen(self, event):

        selectedRowIndex = self.m_gridData.SelectedRows[0]

        itemID = int(self.m_gridData.GetCellValue(selectedRowIndex, 0))
        name = self.m_gridData.GetCellValue(selectedRowIndex, 3)

        businessLogic = bl.BusinessLogic()

        if len(name) > 0:
            podFileShortcut = businessLogic.RetrievePodFileShortcutByPodFileShortcutID(itemID)['podfileshortcuts'][0]
            self.mainWindow.treeManager.NavigateToPodFile(podFileShortcut['PodID'], podFileShortcut['PodParentFolderID'], podFileShortcut['PodFileID'])
        else:
            podFolderShortcut = businessLogic.RetrievePodFolderShortcutByPodFolderShortcutID(itemID)['podfoldershortcuts'][0]
            self.mainWindow.treeManager.NavigateToPodFolder(podFolderShortcut['PodID'], podFolderShortcut['PodParentFolderID'])

    def OnCheckBoxClickShowFileShortcuts(self, event):

        self.LoadDataGrid()

    def OnCheckboxShowFolderShortcuts(self, event):

        self.LoadDataGrid()

    def m_gridDataOnGridSelectCell(self, event):

         if len(self.m_gridData.SelectedRows) > 0:
            self.m_buttonOpen.Enable()
            self.m_buttonModify.Enable()
            self.m_buttonDelete.Enable()

            selectedRowIndex = self.m_gridData.SelectedRows[0]

            name = self.m_gridData.GetCellValue(selectedRowIndex, 3)

            if len(name) > 0:
                self.m_buttonEditFile.Enable()
                self.m_buttonViewFile.Enable()
            else:
                self.m_buttonEditFile.Disable()
                self.m_buttonViewFile.Disable()

    def OnButtonClickEditFile(self, event):

        selectedRowIndex = self.m_gridData.SelectedRows[0]

        itemID = int(self.m_gridData.GetCellValue(selectedRowIndex, 0))
        name = self.m_gridData.GetCellValue(selectedRowIndex, 3)

        businessLogic = bl.BusinessLogic()

        if len(name) > 0:
            podFileShortcut = businessLogic.RetrievePodFileShortcutByPodFileShortcutID(itemID)['podfileshortcuts'][0]

            if True == self.LockPodForWriting(podFileShortcut["PodID"]):

                podFileId = podFileShortcut["PodFileID"]
                filename = podFileShortcut["Filename"]

                businessLogic = bl.BusinessLogic()

                podFileId = businessLogic.RetrieveTopRevisionFilePodIDByExistingPodFileIDFamily(podFileId)['podfileid']

                uniquefolderid = str(uuid.uuid1())

                os.mkdir(self.mainWindow.sandboxPath + '/' + uniquefolderid)

                self.mainWindow.transferEngine.DownloadFileAndWaitForCompletion(podFileId, filename,
                                                                                self.mainWindow.sandboxPath + '/' + uniquefolderid)

                localDal = dalsqlite.DalSqlite()

                podFile = businessLogic.RetrievePodFileByPodFileID(podFileId)['podfile']

                podInformation = businessLogic.RetrieveFilePodInformation(podFileShortcut["PodID"])

                localDal.AddFileInEdit(filename, uniquefolderid, podFile["PodParentFolderID"], podFileShortcut["PodID"],
                                       podInformation["pods"][0]["Name"])

                if sys.platform == "win32":
                    os.startfile(self.mainWindow.sandboxPath + '/' + uniquefolderid + '/' + filename)
                elif sys.platform == "darwin":
                    subprocess.call(['open', self.mainWindow.sandboxPath + '/' + uniquefolderid + '/' + filename])
                else:
                    subprocess.call(["xdg-open", self.mainWindow.sandboxPath + '/' + uniquefolderid + '/' + filename])

                self.UnlockPod(podFileShortcut["PodID"])


    def OnButtonClickViewFile(self, event):

        selectedRowIndex = self.m_gridData.SelectedRows[0]

        itemID = int(self.m_gridData.GetCellValue(selectedRowIndex, 0))
        name = self.m_gridData.GetCellValue(selectedRowIndex, 3)

        businessLogic = bl.BusinessLogic()

        if len(name) > 0:
            podFileShortcut = businessLogic.RetrievePodFileShortcutByPodFileShortcutID(itemID)['podfileshortcuts'][0]

            if True == self.LockPodForWriting(podFileShortcut["PodID"]):

                podFileId = podFileShortcut["PodFileID"]
                filename = podFileShortcut["Filename"]

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

                self.UnlockPod(podFileShortcut["PodID"])

    def LockPodForWriting(self, podID):

        businessLogic = bl.BusinessLogic()

        canWrite = businessLogic.LockFilePodForEditing(podID, self.mainWindow.loggedInSecurityUserID)

        if canWrite == False:
            wx.MessageBox('Another change to this pod is occuring so it is locked, please wait and try your modification again', 'Leopard Data filePODS',
                              wx.OK | wx.ICON_INFORMATION)

        return canWrite

    def UnlockPod(self, podID):

        businessLogic = bl.BusinessLogic()
        businessLogic.UnlockFilePod(podID)
