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

from ui.dialogs import dialoggrantuseraccesstofilepod
from ui.dialogs import dialogwhataccesslevel

from businesslogic import bl


###########################################################################
## Class PanelFilePodSharing
###########################################################################

class PanelFilePodSharing(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent, id=wx.ID_ANY, pos=wx.DefaultPosition, size=wx.Size(896, 727),
                          style=wx.TAB_TRAVERSAL)

        bSizer66 = wx.BoxSizer(wx.VERTICAL)

        bSizer67 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_buttonAddUser = wx.Button(self, wx.ID_ANY, u"Add User...", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer67.Add(self.m_buttonAddUser, 0, wx.ALL, 5)

        self.m_buttonModifyAccessLevel = wx.Button(self, wx.ID_ANY, u"Modify Access Level...", wx.DefaultPosition,
                                                   wx.DefaultSize, 0)
        bSizer67.Add(self.m_buttonModifyAccessLevel, 0, wx.ALL, 5)

        self.m_buttonDeleteUser = wx.Button(self, wx.ID_ANY, u"Delete User...", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer67.Add(self.m_buttonDeleteUser, 0, wx.ALL, 5)

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
        self.m_gridData.SetColLabelValue(0, u"ID")
        self.m_gridData.SetColLabelValue(1, u"Handle")
        self.m_gridData.SetColLabelValue(2, u"Access Level")
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
        self.m_buttonAddUser.Bind(wx.EVT_BUTTON, self.OnButtonClickAddUser)
        self.m_buttonModifyAccessLevel.Bind(wx.EVT_BUTTON, self.OnButtonClickModifyAccessLevel)
        self.m_buttonDeleteUser.Bind(wx.EVT_BUTTON, self.OnButtonClickDeleteUser)
        self.m_gridData.Bind(wx.grid.EVT_GRID_SELECT_CELL, self.m_gridDataOnGridSelectCell)


    def __del__(self):
        pass


    mainWindow = None


    def Initialize(self, mainWindow, rightPaneInitData):
        self.mainWindow = mainWindow
        self.rightPaneInitData = rightPaneInitData

        self.LoadDataGrid()

    def Uninitialize(self):
        pass

    def LoadDataGrid(self):
        businessLogic = bl.BusinessLogic()

        self.m_buttonDeleteUser.Disable()
        self.m_buttonModifyAccessLevel.Disable()

        useraccess = businessLogic.RetrieveFilePodSecurityUserAccess(self.rightPaneInitData["podid"])["podsecurityuseraccesses"]

        if (self.m_gridData.GetNumberRows() > 0):
            self.m_gridData.DeleteRows(0, 100000)

        self.m_gridData.AppendRows(len(useraccess))

        for index, useraccess in enumerate(useraccess):
            self.m_gridData.SetCellValue(index, 0, str(useraccess['PodSecurityUserAccessID']))
            self.m_gridData.SetCellValue(index, 1, useraccess['Nickname'])

            if useraccess["CanWrite"] == 0:
                self.m_gridData.SetCellValue(index, 2, 'Read-Only')
            else:
                self.m_gridData.SetCellValue(index, 2, 'Read and Write')

        self.m_gridData.SetSelectionMode(wx.grid.Grid.wxGridSelectRows)

        self.m_gridData.HideCol(0)


    # Virtual event handlers, overide them in your derived class
    def OnButtonClickAddUser(self, event):

        dialogGrantUser = dialoggrantuseraccesstofilepod.DialogGrantAccessToFilePod(self)

        dialogGrantUser.init(self.mainWindow)

        dialogGrantUser.CenterOnScreen()
        result = dialogGrantUser.ShowModal()

        if result == 1:
            dialogWhatLevel = dialogwhataccesslevel.DialogAccessLevel(self)

            dialogWhatLevel.CenterOnScreen()

            dialogWhatLevel.ShowModal()

            businessLogic = bl.BusinessLogic()

            securityUserID = businessLogic.RetrieveSecurityUserIDByHandle(dialogGrantUser.m_textCtrlHandle.GetValue())

            businessLogic.GrantHandleAccessToFilePod(securityUserID[1], self.rightPaneInitData["podid"])

            if dialogWhatLevel.m_radioBtnReadOnly.GetValue() == 1:
                businessLogic.SetHandleWritePermissionsToFilePod(securityUserID[1], self.rightPaneInitData["podid"], 0)
            else:
                businessLogic.SetHandleWritePermissionsToFilePod(securityUserID[1], self.rightPaneInitData["podid"], 1)

            self.LoadDataGrid()

    def OnButtonClickModifyAccessLevel(self, event):

        dialogWhatLevel = dialogwhataccesslevel.DialogAccessLevel(self)

        dialogWhatLevel.CenterOnScreen()

        dialogWhatLevel.ShowModal()

        businessLogic = bl.BusinessLogic()

        handle = self.m_gridData.GetCellValue(self.m_gridData.SelectedRows[0], 1)
        PodID = self.rightPaneInitData["podid"]

        securityUserID = businessLogic.RetrieveSecurityUserIDByHandle(handle)

        if dialogWhatLevel.m_radioBtnReadOnly.GetValue() == 1:
            businessLogic.SetHandleWritePermissionsToFilePod(securityUserID[1], PodID, 0)
        else:
            businessLogic.SetHandleWritePermissionsToFilePod(securityUserID[1], PodID, 1)

        self.LoadDataGrid()

    def OnButtonClickDeleteUser(self, event):

        businessLogic = bl.BusinessLogic()

        handle = self.m_gridData.GetCellValue(self.m_gridData.SelectedRows[0], 1)
        PodID = self.rightPaneInitData["podid"]

        response = wx.MessageBox('are you sure you want to stop sharing with the selected user!?', 'Leopard Data filePODS',
                                 wx.YES_NO | wx.ICON_QUESTION)

        if response == 2:
            SecurityUserID = businessLogic.RetrieveSecurityUserIDByHandle(handle)

            businessLogic.RevokeHandleAccessToFilePod(SecurityUserID[1], PodID)

            self.LoadDataGrid()

    def m_gridDataOnGridSelectCell(self, event):

        if len(self.m_gridData.SelectedRows) > 0:
            self.m_buttonDeleteUser.Enable()
            self.m_buttonModifyAccessLevel.Enable()
