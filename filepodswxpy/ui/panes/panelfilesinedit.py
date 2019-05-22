# -*- coding: utf-8 -*-

###########################################################################
## Python code generated with wxFormBuilder (version Jun 17 2015)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import os
import uuid
import shutil

import wx
import wx.xrc
import wx.grid

from localdatabase import dalsqlite

from businesslogic import bl

###########################################################################
## Class PanelFilesInEdit
###########################################################################

class PanelFilesInEdit(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent, id=wx.ID_ANY, pos=wx.DefaultPosition, size=wx.Size(892, 741),
                          style=wx.TAB_TRAVERSAL)

        bSizer66 = wx.BoxSizer(wx.VERTICAL)

        bSizer67 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_buttonEditingComplete = wx.Button(self, wx.ID_ANY, u"Editing Complete...", wx.DefaultPosition,
                                                 wx.DefaultSize, 0)
        bSizer67.Add(self.m_buttonEditingComplete, 0, wx.ALL, 5)

        self.m_buttonCancelEditing = wx.Button(self, wx.ID_ANY, u"Cancel Editing...", wx.DefaultPosition,
                                               wx.DefaultSize, 0)
        bSizer67.Add(self.m_buttonCancelEditing, 0, wx.ALL, 5)

        bSizer67.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer66.Add(bSizer67, 0, wx.EXPAND, 5)

        bSizer68 = wx.BoxSizer(wx.VERTICAL)

        self.m_gridData = wx.grid.Grid(self, wx.ID_ANY, wx.DefaultPosition, wx.Size(-1, -1), 0)

        # Grid
        self.m_gridData.CreateGrid(0, 3)
        self.m_gridData.EnableEditing(False)
        self.m_gridData.EnableGridLines(True)
        self.m_gridData.EnableDragGridSize(False)
        self.m_gridData.SetMargins(0, 0)

        # Columns
        self.m_gridData.SetColSize(0, 20)
        self.m_gridData.SetColSize(1, 350)
        self.m_gridData.SetColSize(2, 250)
        self.m_gridData.EnableDragColMove(False)
        self.m_gridData.EnableDragColSize(True)
        self.m_gridData.SetColLabelSize(30)
        self.m_gridData.SetColLabelValue(0, u"FileInEditID")
        self.m_gridData.SetColLabelValue(1, u"Filename")
        self.m_gridData.SetColLabelValue(2, u"Pod")
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
        self.m_buttonEditingComplete.Bind(wx.EVT_BUTTON, self.OnButtonClickEditingComplete)
        self.m_buttonCancelEditing.Bind(wx.EVT_BUTTON, self.OnButtonClickCancelEditing)
        self.m_gridData.Bind(wx.grid.EVT_GRID_SELECT_CELL, self.m_gridDataOnGridSelectCell)

    def __del__(self):
        pass

    # Virtual event handlers, overide them in your derived class
    def OnButtonClickEditingComplete(self, event):
        localdal = dalsqlite.DalSqlite()

        selectedRowIndex = self.m_gridData.SelectedRows[0]

        FileInEditID = self.m_gridData.GetCellValue(selectedRowIndex, 0)

        fileInEdit = localdal.RetrieveFileInEdit(FileInEditID)[0]

        podID = fileInEdit[4]
        parentFolderID = fileInEdit[3]
        uniquefolderid = fileInEdit[2]
        filename = fileInEdit[1]

        businessLogic = bl.BusinessLogic()

        folder = businessLogic.RetrieveFolderByFolderId(parentFolderID)

        if folder['IsDeleted'] == 0:

            self.mainWindow.transferEngine.UploadFileAndWaitForCompletion(podID, parentFolderID,
                                                                          self.mainWindow.sandboxPath + '/' + uniquefolderid + '/' + filename)

            localdal.DeleteFileInEdit(FileInEditID)

            self.loadGridData()

            wx.MessageBox('Your file has been re uploaded to its original file pod location', 'Leopard Data filePODS',
                          wx.OK | wx.ICON_INFORMATION)

        else:

            recoveryDir = str(uuid.uuid1())

            os.makedirs(self.mainWindow.recoveryPath + "/" + recoveryDir)

            shutil.move(self.mainWindow.sandboxPath + "/" + uniquefolderid + "/" + filename,
                        self.mainWindow.recoveryPath + "/" + recoveryDir + "/" + filename)

            localdal.DeleteFileInEdit(FileInEditID)

            self.loadGridData()

            wx.MessageBox('The folder your file was originally part of has been deleted, we have moved your edited file to '
                           + self.mainWindow.recoveryPath + "/" + recoveryDir + "/" + filename + ", please go to this location on your computer to recover your file", 'Leopard Data filePODS',
                          wx.OK | wx.ICON_INFORMATION)

    def m_gridDataOnGridSelectCell(self, event):
        if len(self.m_gridData.SelectedRows) > 0:
            self.m_buttonEditingComplete.Enable()
            self.m_buttonCancelEditing.Enable()

    mainWindow = None

    def loadGridData(self):
        localdal = dalsqlite.DalSqlite()

        filesInEdit = localdal.RetrieveAllFilesInEdit()

        self.m_buttonEditingComplete.Disable()
        self.m_buttonCancelEditing.Disable()

        if (self.m_gridData.GetNumberRows() > 0):
            self.m_gridData.DeleteRows(0, 100000)

        self.m_gridData.AppendRows(len(filesInEdit))

        for index, fileInEdit in enumerate(filesInEdit):
            self.m_gridData.SetCellValue(index, 0, str(fileInEdit[0]))
            self.m_gridData.SetCellValue(index, 1, fileInEdit[1])
            self.m_gridData.SetCellValue(index, 2, fileInEdit[5])

        self.m_gridData.SetSelectionMode(wx.grid.Grid.wxGridSelectRows)

        self.m_gridData.HideCol(0)

    def Initialize(self, mainWindow, rightPaneInitData):
        self.mainWindow = mainWindow
        self.rightPaneInitData = rightPaneInitData

        self.loadGridData()

    def Uninitialize(self):
        pass

    def OnButtonClickCancelEditing(self, event):

        localdal = dalsqlite.DalSqlite()

        selectedRowIndex = self.m_gridData.SelectedRows[0]

        FileInEditID = self.m_gridData.GetCellValue(selectedRowIndex, 0)

        localdal.DeleteFileInEdit(FileInEditID)

        self.loadGridData()
