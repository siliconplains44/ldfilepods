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
import datetime

from businesslogic import bl

from ui.dialogs import dialogmanagefolderwebimport


###########################################################################
## Class PanelManageFolderWebImports
###########################################################################

class PanelManageFolderWebImports(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent, id=wx.ID_ANY, pos=wx.DefaultPosition, size=wx.Size(500, 300),
                          style=wx.TAB_TRAVERSAL)

        bSizer66 = wx.BoxSizer(wx.VERTICAL)

        bSizer67 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_buttonModify = wx.Button(self, wx.ID_ANY, u"Modify", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer67.Add(self.m_buttonModify, 0, wx.ALL, 5)

        self.m_buttonDelete = wx.Button(self, wx.ID_ANY, u"Delete...", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer67.Add(self.m_buttonDelete, 0, wx.ALL, 5)

        bSizer67.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer66.Add(bSizer67, 0, wx.EXPAND, 5)

        bSizer68 = wx.BoxSizer(wx.VERTICAL)

        self.m_gridData = wx.grid.Grid(self, wx.ID_ANY, wx.DefaultPosition, wx.Size(-1, -1), 0)

        # Grid
        self.m_gridData.CreateGrid(0, 7)
        self.m_gridData.EnableEditing(False)
        self.m_gridData.EnableGridLines(True)
        self.m_gridData.EnableDragGridSize(False)
        self.m_gridData.SetMargins(0, 0)

        # Columns
        self.m_gridData.SetColSize(0, 20)
        self.m_gridData.SetColSize(1, 150)
        self.m_gridData.SetColSize(2, 150)
        self.m_gridData.SetColSize(3, 150)
        self.m_gridData.SetColSize(4, 150)
        self.m_gridData.SetColSize(5, 250)
        self.m_gridData.SetColSize(6, 400)
        self.m_gridData.EnableDragColMove(False)
        self.m_gridData.EnableDragColSize(True)
        self.m_gridData.SetColLabelSize(30)
        self.m_gridData.SetColLabelValue(0, u"PodFolderShareID")
        self.m_gridData.SetColLabelValue(1, u"Pod")
        self.m_gridData.SetColLabelValue(2, u"Folder")
        self.m_gridData.SetColLabelValue(3, u"Access Username")
        self.m_gridData.SetColLabelValue(4, u"Web Passcode")
        self.m_gridData.SetColLabelValue(5, u"Created")
        self.m_gridData.SetColLabelValue(6, u"Description")
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
        self.m_gridData.Bind(wx.grid.EVT_GRID_SELECT_CELL, self.m_gridDataOnGridSelectCell)

    def __del__(self):
        pass


    def Initialize(self, mainWindow, rightPaneInitData):
        self.mainWindow = mainWindow
        self.rightPaneInitData = rightPaneInitData

        self.LoadDataGrid()


    def Uninitialize(self):
        pass


    def LoadDataGrid(self):
        businessLogic = bl.BusinessLogic()

        podFolderImports = businessLogic.RetrieveAllPodFolderImportsByOwnerSecurityID(self.mainWindow.loggedInSecurityUserID)[
            'podfolderimports']

        if (self.m_gridData.GetNumberRows() > 0):
            self.m_gridData.DeleteRows(0, 100000)

        self.m_gridData.AppendRows(len(podFolderImports))

        for index, podFolderShare in enumerate(podFolderImports):
            self.m_gridData.SetCellValue(index, 0, str(podFolderShare['PodFolderImportID']))
            self.m_gridData.SetCellValue(index, 1, podFolderShare['PodName'])
            self.m_gridData.SetCellValue(index, 2, podFolderShare['Name'])
            self.m_gridData.SetCellValue(index, 3, str(podFolderShare['Identifier']))
            self.m_gridData.SetCellValue(index, 4, '**********')
            self.m_gridData.SetCellValue(index, 5, podFolderShare['Created'])
            self.m_gridData.SetCellValue(index, 6, podFolderShare['Descr'])

        self.m_gridData.SetSelectionMode(wx.grid.Grid.wxGridSelectRows)
        self.m_gridData.HideCol(0)

        self.m_buttonDelete.Disable()
        self.m_buttonModify.Disable()


        # Virtual event handlers, overide them in your derived class


    def OnButtonClickModify(self, event):
        selectedRowIndex = self.m_gridData.SelectedRows[0]

        podFolderImportID = int(self.m_gridData.GetCellValue(selectedRowIndex, 0))

        businessLogic = bl.BusinessLogic()

        # run the dialog

        DialogManageFolderWebImport = dialogmanagefolderwebimport.DialogManageFolderWebImport(self)
        DialogManageFolderWebImport.CenterOnScreen()

        # if file is already shared

        podFolderImport = businessLogic.RetrievePodFolderImportByPodFolderImportID(podFolderImportID)['podfolderimports'][0]

        DialogManageFolderWebImport.m_textCtrlUsername.SetValue(podFolderImport['Identifier'])
        DialogManageFolderWebImport.m_textCtrlPassword.SetValue(podFolderImport['WebPasscode'])
        DialogManageFolderWebImport.m_textCtrlDescription.SetValue(podFolderImport['Descr'])

        result = DialogManageFolderWebImport.ShowModal()

        if result == 1:
            businessLogic.ModifyPodFolderImport(podFolderImport['PodFolderImportID'], podFolderImport['PodID'],
                                               podFolderImport['PodFolderID'], self.mainWindow.loggedInSecurityUserID,
                                               DialogManageFolderWebImport.m_textCtrlUsername.GetValue(),
                                               DialogManageFolderWebImport.m_textCtrlDescription.GetValue(),
                                               DialogManageFolderWebImport.m_textCtrlPassword.GetValue(),
                                               datetime.datetime.now().isoformat(), 0, None)

            self.LoadDataGrid()


    def OnButtonClickDelete(self, event):
        response = wx.MessageBox('Are you sure you want to permanently delete the selected folder web share!?',
                                 'Leopard Data filePODS',
                                 wx.YES_NO | wx.ICON_QUESTION)

        if response == 2:
            selectedRowIndex = self.m_gridData.SelectedRows[0]

            podFolderImportID = int(self.m_gridData.GetCellValue(selectedRowIndex, 0))

            businessLogic = bl.BusinessLogic()

            businessLogic.DeletePodFolderImport(podFolderImportID)

            self.LoadDataGrid()


    def m_gridDataOnGridSelectCell(self, event):
        if len(self.m_gridData.SelectedRows) > 0:
            self.m_buttonDelete.Enable()
            self.m_buttonModify.Enable()
