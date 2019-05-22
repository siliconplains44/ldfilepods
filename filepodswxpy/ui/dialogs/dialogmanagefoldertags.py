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

from businesslogic import bl

from ui.dialogs import dialogtagchooser

###########################################################################
## Class DialogManageFolderTags
###########################################################################

class DialogManageFolderTags(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=u"Manage Folder Tags", pos=wx.DefaultPosition,
                           size=wx.Size(970, 635), style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer102 = wx.BoxSizer(wx.VERTICAL)

        bSizer104 = wx.BoxSizer(wx.VERTICAL)

        self.m_gridData = wx.grid.Grid(self, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize, 0)

        # Grid
        self.m_gridData.CreateGrid(5, 2)
        self.m_gridData.EnableEditing(True)
        self.m_gridData.EnableGridLines(True)
        self.m_gridData.EnableDragGridSize(False)
        self.m_gridData.SetMargins(0, 0)

        # Columns
        self.m_gridData.SetColSize(0, 20)
        self.m_gridData.SetColSize(1, 750)
        self.m_gridData.EnableDragColMove(False)
        self.m_gridData.EnableDragColSize(True)
        self.m_gridData.SetColLabelSize(30)
        self.m_gridData.SetColLabelValue(0, u"SystemEntityTagID")
        self.m_gridData.SetColLabelValue(1, u"Tag")
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

        bSizer179 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer179.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_buttonAddTag = wx.Button(self, wx.ID_ANY, u"Add...", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer179.Add(self.m_buttonAddTag, 0, wx.ALL, 5)

        self.m_buttonDeleteTag = wx.Button(self, wx.ID_ANY, u"Delete...", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer179.Add(self.m_buttonDeleteTag, 0, wx.ALL, 5)

        self.m_buttonClose = wx.Button(self, wx.ID_ANY, u"Close", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer179.Add(self.m_buttonClose, 0, wx.ALL, 5)

        bSizer102.Add(bSizer179, 0, wx.EXPAND, 5)

        self.SetSizer(bSizer102)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.m_buttonAddTag.Bind(wx.EVT_BUTTON, self.OnButtonClickAddTag)
        self.m_buttonDeleteTag.Bind(wx.EVT_BUTTON, self.OnButtonClickDeleteTag)
        self.m_buttonClose.Bind(wx.EVT_BUTTON, self.OnButtonClickClose)
        self.m_gridData.Bind( wx.grid.EVT_GRID_SELECT_CELL, self.m_gridDataOnGridSelectCell )

    def __del__(self):
        pass

    def LoadDataGrid(self):

        businessLogic = bl.BusinessLogic()

        self.m_buttonDeleteTag.Disable()

        tags = businessLogic.RetrieveTagsByOwnerSecurityUserIDAndObject(2, self.podFolderId, self.securityUserId)['tags']

        if (self.m_gridData.GetNumberRows() > 0):
            self.m_gridData.DeleteRows(0, 100000)

        self.m_gridData.AppendRows(len(tags))

        for index, tag in enumerate(tags):
            self.m_gridData.SetCellValue(index, 0, str(tag['SystemEntityTagID']))
            self.m_gridData.SetCellValue(index, 1, tag['Tag'])

        self.m_gridData.SetSelectionMode(wx.grid.Grid.wxGridSelectRows)

        self.m_gridData.HideCol(0)

    def Initialize(self, podFolderId, securityUserId):
        self.podFolderId = podFolderId
        self.securityUserId = securityUserId

        self.LoadDataGrid()

    # Virtual event handlers, overide them in your derived class
    def OnButtonClickAddTag(self, event):

        DialogTagChooser = dialogtagchooser.DialogTagChooser(self)

        DialogTagChooser.Initialize(self.securityUserId)

        result = DialogTagChooser.ShowModal()

        if result == 1:

            businessLogic = bl.BusinessLogic()

            if DialogTagChooser.m_radioBtnAddFromExistingTags.GetValue() == True:
                businessLogic.AddTag(2, self.podFolderId, DialogTagChooser.m_gridData.GetCellValue(DialogTagChooser.m_gridData.GetSelectedRows()[0], 1),
                                     self.securityUserId)
            else:
                businessLogic.AddTag(2, self.podFolderId,
                                     DialogTagChooser.m_textCtrlNewTag.GetValue(), self.securityUserId)

            self.LoadDataGrid()

    def OnButtonClickDeleteTag(self, event):

        response = wx.MessageBox('Are you sure you want to permanently delete the selected tag!?',
                                 'Leopard Data filePODS',
                                 wx.YES_NO | wx.ICON_QUESTION)

        if response == 2:

            systemEntityTagId = self.m_gridData.GetCellValue(self.m_gridData.SelectedRows[0], 0)

            businessLogic = bl.BusinessLogic()

            businessLogic.DeleteTag(systemEntityTagId)
            self.LoadDataGrid()

    def OnButtonClickClose(self, event):
        self.EndModal(0)

    def m_gridDataOnGridSelectCell(self, event):

         if len(self.m_gridData.SelectedRows) > 0:
            self.m_buttonDeleteTag.Enable()
