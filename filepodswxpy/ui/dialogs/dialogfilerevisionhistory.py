# -*- coding: utf-8 -*- 

###########################################################################
## Python code generated with wxFormBuilder (version Jun 17 2015)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import wx
import wx.xrc
import wx.grid

import os
import uuid
import datetime

from businesslogic import bl

from ui.dialogs import dialogmanagefilewebsharing

###########################################################################
## Class DialogFileRevisionHistory
###########################################################################

class DialogFileRevisionHistory(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=u"File Revision History", pos=wx.DefaultPosition,
                           size=wx.Size(1000, 700), style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer102 = wx.BoxSizer(wx.VERTICAL)

        bSizer103 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_buttonDownload = wx.Button(self, wx.ID_ANY, u"Download...", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer103.Add(self.m_buttonDownload, 0, wx.ALL, 5)

        self.m_buttonDownloadAll = wx.Button(self, wx.ID_ANY, u"Download All...", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer103.Add(self.m_buttonDownloadAll, 0, wx.ALL, 5)

        self.m_buttonWebSharing = wx.Button(self, wx.ID_ANY, u"Web Sharing...", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer103.Add(self.m_buttonWebSharing, 0, wx.ALL, 5)

        self.m_buttonClose = wx.Button(self, wx.ID_ANY, u"Close", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer103.Add(self.m_buttonClose, 0, wx.ALL, 5)

        bSizer102.Add(bSizer103, 0, wx.EXPAND, 5)

        bSizer104 = wx.BoxSizer(wx.VERTICAL)

        self.m_gridData = wx.grid.Grid(self, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize, 0)

        # Grid
        self.m_gridData.CreateGrid(5, 6)
        self.m_gridData.EnableEditing(True)
        self.m_gridData.EnableGridLines(True)
        self.m_gridData.EnableDragGridSize(False)
        self.m_gridData.SetMargins(0, 0)

        # Columns
        self.m_gridData.SetColSize(0, 20)
        self.m_gridData.SetColSize(1, 150)
        self.m_gridData.SetColSize(2, 250)
        self.m_gridData.SetColSize(3, 200)
        self.m_gridData.SetColSize(4, 200)
        self.m_gridData.SetColSize( 5, 100 )
        self.m_gridData.EnableDragColMove(False)
        self.m_gridData.EnableDragColSize(True)
        self.m_gridData.SetColLabelSize(30)
        self.m_gridData.SetColLabelValue(0, u"PodFileID")
        self.m_gridData.SetColLabelValue(1, u"Revision")
        self.m_gridData.SetColLabelValue(2, u"Filename")
        self.m_gridData.SetColLabelValue(3, u"Size")
        self.m_gridData.SetColLabelValue(4, u"Created")
        self.m_gridData.SetColLabelValue( 5, u"Web Shared" )
        self.m_gridData.SetColLabelAlignment(wx.ALIGN_CENTRE, wx.ALIGN_CENTRE)

        # Rows
        self.m_gridData.EnableDragRowSize(True)
        self.m_gridData.SetRowLabelSize(80)
        self.m_gridData.SetRowLabelAlignment(wx.ALIGN_CENTRE, wx.ALIGN_CENTRE)

        # Label Appearance

        # Cell Defaults
        self.m_gridData.SetDefaultCellAlignment(wx.ALIGN_LEFT, wx.ALIGN_TOP)
        bSizer104.Add(self.m_gridData, 1, wx.ALL, 5)

        bSizer102.Add(bSizer104, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer102)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.m_buttonDownload.Bind(wx.EVT_BUTTON, self.OnButtonClickDownload)
        self.m_buttonDownloadAll.Bind(wx.EVT_BUTTON, self.OnButtonClickDownloadAll)
        self.m_buttonWebSharing.Bind(wx.EVT_BUTTON, self.OnButtonClickWebSharing)
        self.m_buttonClose.Bind(wx.EVT_BUTTON, self.OnButtonClickClose)
        self.m_gridData.Bind(wx.grid.EVT_GRID_SELECT_CELL, self.m_gridDataOnGridCmdSelectCell)


    def __del__(self):
        pass


    # Virtual event handlers, overide them in your derived class
    def OnButtonClickDownload(self, event):
        dialog = wx.DirDialog(None, "Choose a destination directory:", style=wx.DD_DEFAULT_STYLE | wx.DD_NEW_DIR_BUTTON)
        if dialog.ShowModal() == wx.ID_OK:

            selectedRowIndex = self.m_gridData.SelectedRows[0]

            podFileId = self.m_gridData.GetCellValue(selectedRowIndex, 0)
            filename = self.m_gridData.GetCellValue(selectedRowIndex, 2)

            self.mainWindow.transferEngine.DownloadFile(podFileId, filename, dialog.GetPath(), self.podID)

        else:
            return


    def OnButtonClickDownloadAll(self, event):
        dialog = wx.DirDialog(None, "Choose a destination directory:", style=wx.DD_DEFAULT_STYLE | wx.DD_NEW_DIR_BUTTON)
        if dialog.ShowModal() == wx.ID_OK:

            businessLogic = bl.BusinessLogic()

            podFileRevisions = businessLogic.RetrieveAllPodFileRevisions(self.filename, self.podparentfolderid)[
                'podfilerevisions']

            for podFileRevision in podFileRevisions:
                destDir = dialog.GetPath() + '/Revision' + str(podFileRevision['Revision'])
                os.mkdir(destDir)
                self.mainWindow.transferEngine.DownloadFile(podFileRevision["PodFileID"], podFileRevision["Filename"],
                                                            destDir, self.podID)

        else:
            return


    def OnButtonClickClose(self, event):
        self.EndModal(0)


    def loadDataGrid(self):
        self.m_buttonDownload.Disable()
        self.m_buttonWebSharing.Disable()

        businessLogic = bl.BusinessLogic()

        podFileRevisions = businessLogic.RetrieveAllPodFileRevisions(self.filename, self.podparentfolderid)[
            'podfilerevisions']

        podFileShares = businessLogic.RetrieveAllPodFileSharesByPodID(self.podID)['podfileshares']

        self.m_gridData.DeleteRows(0, 100000)

        self.m_gridData.AppendRows(len(podFileRevisions))

        for index, podFile in enumerate(podFileRevisions):
            self.m_gridData.SetCellValue(index, 0, str(podFile['PodFileID']))
            self.m_gridData.SetCellValue(index, 1, str(podFile['Revision']))
            self.m_gridData.SetCellValue(index, 2, podFile['Filename'])
            self.m_gridData.SetCellValue(index, 3, str(podFile['FileSizeInBytes']))
            self.m_gridData.SetCellValue(index, 4, podFile['Created'])

            haveRevisionWebShare = False

            for podFileShare in podFileShares:
                if podFileShare['PodFileID'] == podFile['PodFileID']:
                    if podFileShare['IsAlwaysHighestRevision'] == 0:
                        haveRevisionWebShare = True

            if True == haveRevisionWebShare:
                self.m_gridData.SetCellValue(index, 5, 'Yes')
            else:
                self.m_gridData.SetCellValue(index, 5, 'No')

        self.m_gridData.SetSelectionMode(wx.grid.Grid.wxGridSelectRows)
        self.m_gridData.HideCol(0)


    def Initialize(self, filename, podparentfolderid, mainWindow, podID):
        self.filename = filename
        self.podparentfolderid = podparentfolderid
        self.mainWindow = mainWindow
        self.podID = podID

        self.loadDataGrid()


    def m_gridDataOnGridCmdSelectCell(self, event):
        if len(self.m_gridData.SelectedRows) > 0:
            self.m_buttonDownload.Enable()
            self.m_buttonWebSharing.Enable()

    def OnButtonClickWebSharing(self, event):

        selectedRowIndex = self.m_gridData.SelectedRows[0]

        podFileId = int(self.m_gridData.GetCellValue(selectedRowIndex, 0))

        businessLogic = bl.BusinessLogic()

        podFileShares = businessLogic.RetrieveAllPodFileSharesByPodID(self.podID)['podfileshares']

        haveExistingRevisionWebShare = False

        for podFileShare in podFileShares:
            if podFileShare['PodFileID'] == podFileId:
                if podFileShare['IsAlwaysHighestRevision'] == 0:
                    haveExistingRevisionWebShare = True

        # run the dialog

        DialogManageFileWebSharing = dialogmanagefilewebsharing.DialogManageFileWebSharing(self)
        DialogManageFileWebSharing.CenterOnScreen()

        DialogManageFileWebSharing.m_checkBoxAlwaysShareHighestRevision.Set3StateValue(False)
        DialogManageFileWebSharing.m_checkBoxAlwaysShareHighestRevision.Disable()

        if haveExistingRevisionWebShare == True:

            # if file is already shared

            podFileShare = businessLogic.RetrievePodFileShareByPodFileID(podFileId)['podfileshares'][0]

            DialogManageFileWebSharing.m_textCtrlIdentifer.SetValue(podFileShare['Identifier'])
            DialogManageFileWebSharing.m_textCtrlDescription.SetValue(podFileShare['Description'])

            result = DialogManageFileWebSharing.ShowModal()

            if result == 1:

                isAlwaysHighestRevision = None

                if DialogManageFileWebSharing.m_checkBoxAlwaysShareHighestRevision.GetValue() == True:
                    isAlwaysHighestRevision = 1
                else:
                    isAlwaysHighestRevision = 0

                businessLogic.ModifyPodFileShare(podFileShare['PodFileShareID'], self.podID, podFileId,
                                                 self.mainWindow.loggedInSecurityUserID,
                                                 isAlwaysHighestRevision,
                                                 DialogManageFileWebSharing.m_textCtrlIdentifer.GetValue(),
                                                 DialogManageFileWebSharing.m_textCtrlDescription.GetValue(),
                                                 datetime.datetime.now().isoformat(), 0, None)

                self.loadDataGrid()


        else:
            # if file is not shared

            DialogManageFileWebSharing.m_textCtrlIdentifer.SetValue(str(uuid.uuid1()))

            result = DialogManageFileWebSharing.ShowModal()

            if result == 1:
                isAlwaysHighestRevision = None

                if DialogManageFileWebSharing.m_checkBoxAlwaysShareHighestRevision.GetValue() == True:
                    isAlwaysHighestRevision = 1
                else:
                    isAlwaysHighestRevision = 0

                businessLogic.AddPodFileShare(self.podID, podFileId,
                                              self.mainWindow.loggedInSecurityUserID,
                                              isAlwaysHighestRevision,
                                              DialogManageFileWebSharing.m_textCtrlIdentifer.GetValue(),
                                              DialogManageFileWebSharing.m_textCtrlDescription.GetValue(),
                                              datetime.datetime.now().isoformat(), 0, None)

                self.loadDataGrid()