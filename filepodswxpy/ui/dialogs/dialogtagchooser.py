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


###########################################################################
## Class DialogTagChooser
###########################################################################

class DialogTagChooser(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=u"Select a Tag", pos=wx.DefaultPosition,
                           size=wx.Size(1021, 678), style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer102 = wx.BoxSizer(wx.VERTICAL)

        bSizer188 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_radioBtnAddNewTag = wx.RadioButton(self, wx.ID_ANY, u"Add New Tag", wx.DefaultPosition, wx.DefaultSize,
                                                  0)
        bSizer188.Add(self.m_radioBtnAddNewTag, 0, wx.ALL, 5)

        self.m_textCtrlNewTag = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.Size(600, -1), 0)
        bSizer188.Add(self.m_textCtrlNewTag, 0, wx.ALL, 5)

        bSizer102.Add(bSizer188, 0, wx.EXPAND, 5)

        bSizer104 = wx.BoxSizer(wx.VERTICAL)

        bSizer104.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_radioBtnAddFromExistingTags = wx.RadioButton(self, wx.ID_ANY, u"Add From Existing Tags",
                                                            wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer104.Add(self.m_radioBtnAddFromExistingTags, 0, wx.ALL, 5)

        self.m_gridData = wx.grid.Grid(self, wx.ID_ANY, wx.DefaultPosition, wx.Size(-1, 500), 0)

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
        bSizer104.Add(self.m_gridData, 0, wx.ALL, 5)

        bSizer102.Add(bSizer104, 1, wx.EXPAND, 5)

        bSizer187 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer187.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_buttonOK = wx.Button(self, wx.ID_ANY, u"OK", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer187.Add(self.m_buttonOK, 0, wx.ALL, 5)

        self.m_buttonCancel = wx.Button(self, wx.ID_ANY, u"Cancel", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer187.Add(self.m_buttonCancel, 0, wx.ALL, 5)

        bSizer102.Add(bSizer187, 0, wx.EXPAND, 5)

        self.SetSizer(bSizer102)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.m_radioBtnAddNewTag.Bind(wx.EVT_RADIOBUTTON, self.OnRadioButtonAddNewTag)
        self.m_radioBtnAddFromExistingTags.Bind(wx.EVT_RADIOBUTTON, self.OnRadioButtonAddFromExistingTags)
        self.m_buttonOK.Bind(wx.EVT_BUTTON, self.OnButtonClickClose)
        self.m_buttonCancel.Bind(wx.EVT_BUTTON, self.OnButtonClickCancel)
        self.m_gridData.Bind(wx.grid.EVT_GRID_SELECT_CELL, self.m_gridDataOnGridSelectCell)
        self.m_textCtrlNewTag.Bind(wx.EVT_TEXT, self.m_textCtrlNewTagOnText)

    def __del__(self):
        pass

    def Initialize(self, securityUserId):
        self.securityUserId = securityUserId

        self.LoadDataGrid()

    def LoadDataGrid(self):

        businessLogic = bl.BusinessLogic()

        self.m_buttonOK.Disable()

        tags = businessLogic.RetrieveAllPreUsedTagsByOwnerSecurityUserID(self.securityUserId)['tags']

        if (self.m_gridData.GetNumberRows() > 0):
            self.m_gridData.DeleteRows(0, 100000)

        self.m_gridData.AppendRows(len(tags))

        for index, tag in enumerate(tags):
            #self.m_gridData.SetCellValue(index, 0, str(tag['SystemEntityTagID']))
            self.m_gridData.SetCellValue(index, 1, tag['Tag'])

        self.m_gridData.SetSelectionMode(wx.grid.Grid.wxGridSelectRows)

        self.m_gridData.HideCol(0)

    # Virtual event handlers, overide them in your derived class
    def OnRadioButtonAddNewTag(self, event):

        self.m_buttonOK.Disable()

        if len(self.m_textCtrlNewTag.GetValue()) > 0:
            self.m_buttonOK.Enable()

    def OnRadioButtonAddFromExistingTags(self, event):

        self.m_buttonOK.Disable()

        if len(self.m_gridData.SelectedRows) > 0:
            self.m_buttonOK.Enable()

    def OnButtonClickClose(self, event):
        self.EndModal(1)

    def OnButtonClickCancel(self, event):
        self.EndModal(0)

    def m_gridDataOnGridSelectCell(self, event):

        if len(self.m_gridData.SelectedRows) > 0:
            self.m_buttonOK.Enable()

    def m_textCtrlNewTagOnText(self, event):

        self.m_buttonOK.Disable()

        if self.m_radioBtnAddNewTag.GetValue() == True and len(self.m_textCtrlNewTag.GetValue()) > 0:
            self.m_buttonOK.Enable()
