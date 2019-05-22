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

import threading
import time

from classlibrary import enumerations

from decimal import *

###########################################################################
## Class PanelRunningOperations
###########################################################################

class PanelRunningOperations(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent, id=wx.ID_ANY, pos=wx.DefaultPosition, size=wx.Size(1039, 743),
                          style=wx.TAB_TRAVERSAL)

        bSizer66 = wx.BoxSizer(wx.VERTICAL)

        bSizer67 = wx.BoxSizer(wx.VERTICAL)

        bSizer67.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_buttonStop = wx.Button(self, wx.ID_ANY, u"Stop", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer67.Add(self.m_buttonStop, 0, wx.ALL, 5)

        bSizer66.Add(bSizer67, 0, wx.EXPAND, 5)

        bSizer68 = wx.BoxSizer(wx.VERTICAL)

        self.m_gridData = wx.grid.Grid(self, wx.ID_ANY, wx.DefaultPosition, wx.Size(600, 1000), 0)

        # Grid
        self.m_gridData.CreateGrid(5, 13)
        self.m_gridData.EnableEditing(True)
        self.m_gridData.EnableGridLines(True)
        self.m_gridData.EnableDragGridSize(False)
        self.m_gridData.SetMargins(0, 0)

        # Columns
        self.m_gridData.EnableDragColMove(False)
        self.m_gridData.EnableDragColSize(True)
        self.m_gridData.SetColLabelSize(30)
        self.m_gridData.SetColLabelValue(0, u"Pod")
        self.m_gridData.SetColLabelValue(1, u"Type")
        self.m_gridData.SetColLabelValue(2, u"Status")
        self.m_gridData.SetColLabelValue(3, u"Started")
        self.m_gridData.SetColLabelValue(4, u"Ended")
        self.m_gridData.SetColLabelValue(5, u"Files")
        self.m_gridData.SetColLabelValue(6, u"Folders")
        self.m_gridData.SetColLabelValue(7, u"Bytes")
        self.m_gridData.SetColLabelValue(8, u"Processed Files")
        self.m_gridData.SetColLabelValue(9, u"Processed Folders")
        self.m_gridData.SetColLabelValue(10, u"Processed Bytes")
        self.m_gridData.SetColLabelValue(11, u"Percent Complete")
        self.m_gridData.SetColLabelValue(12, u"Completed Successfully")
        self.m_gridData.SetColLabelAlignment(wx.ALIGN_CENTRE, wx.ALIGN_CENTRE)

        # Rows
        self.m_gridData.EnableDragRowSize(True)
        self.m_gridData.SetRowLabelSize(80)
        self.m_gridData.SetRowLabelAlignment(wx.ALIGN_CENTRE, wx.ALIGN_CENTRE)

        # Label Appearance

        # Cell Defaults
        self.m_gridData.SetDefaultCellAlignment(wx.ALIGN_LEFT, wx.ALIGN_TOP)
        bSizer68.Add(self.m_gridData, 0, wx.EXPAND, 5)

        bSizer66.Add(bSizer68, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer66)
        self.Layout()

        # Connect Events
        self.m_buttonStop.Bind(wx.EVT_BUTTON, self.OnButtonClickStop)
        self.m_gridData.Bind(wx.grid.EVT_GRID_SELECT_CELL, self.m_gridDataOnGridSelectCell)


    def __del__(self):
        pass


    def Initialize(self, mainWindow, rightPaneInitData):
        self.mainWindow = mainWindow
        self.rightPaneInitData = rightPaneInitData

        self.RunRunningOperationsThread = True
        self.IsShutDown = False

        if self.m_gridData.GetNumberRows() > 0:
            self.m_gridData.DeleteRows(0, 100000)

        self.m_buttonStop.Disable()

        self.runningOperationCheckerThread = threading.Thread(target=runningOperationCheckerThread, args=(self,))
        self.runningOperationCheckerThread.start()

    def Uninitialize(self):
        pass

    def m_gridDataOnGridSelectCell(self, event):
        self.m_buttonStop.Enable()

    def OnButtonClickStop(self, event):
        selectedRowIndex = self.m_gridData.SelectedRows[0]

        self.mainWindow.transferEngine.runningOperations[selectedRowIndex].ShutdownNow()

        self.m_buttonStop.Disable()

    def UpdateGrid(self):

        selectedRowIndex = None

        try:
            selectedRowIndex = self.m_gridData.SelectedRows[0]
        except:
            pass

        if self.m_gridData.GetNumberRows() > 0:
            self.m_gridData.DeleteRows(0, 100000)

        self.m_gridData.AppendRows(len(self.runningOperations))

        for index, runningOperation in enumerate(self.runningOperations):
            self.m_gridData.SetCellValue(index, 0, runningOperation.Name)

            type = ''

            if runningOperation.proxyDictionary["OperationType"] == enumerations.DirectoryUpload:
                type = "Directory Upload"
            elif runningOperation.proxyDictionary["OperationType"] == enumerations.FileUpload:
                type = "File Upload"
            elif runningOperation.proxyDictionary["OperationType"] == enumerations.DirectoryDownload:
                type = "Directory Download"
            else:
                type = "File Download"

            self.m_gridData.SetCellValue(index, 1, type)

            status = ''

            if (runningOperation.proxyDictionary["IsRunning"] == True):
                status = 'Running'
            else:
                status = 'Stopped'

            self.m_gridData.SetCellValue(index, 2, status)

            self.m_gridData.SetCellValue(index, 3, runningOperation.proxyDictionary["Started"])
            self.m_gridData.SetCellValue(index, 4, runningOperation.proxyDictionary["Ended"])
            self.m_gridData.SetCellValue(index, 5, str(runningOperation.proxyDictionary["totalCountFiles"]))
            self.m_gridData.SetCellValue(index, 6, str(runningOperation.proxyDictionary["totalCountFolders"]))
            self.m_gridData.SetCellValue(index, 7, str(runningOperation.proxyDictionary["totalSizeInBytes"]))
            self.m_gridData.SetCellValue(index, 8, str(runningOperation.proxyDictionary["totalFilesProcessed"]))
            self.m_gridData.SetCellValue(index, 9, str(runningOperation.proxyDictionary["totalFoldersProcessed"]))
            self.m_gridData.SetCellValue(index, 10, str(runningOperation.proxyDictionary["totalBytesProcessed"]))

            percentComplete = "0"

            if runningOperation.proxyDictionary["totalSizeInBytes"] != 0:
                prevalue = Decimal(
                    Decimal(runningOperation.proxyDictionary["totalBytesProcessed"]) / Decimal(runningOperation.proxyDictionary["totalSizeInBytes"])) * 100
                prevalue = round(prevalue, 0)
                percentComplete = str(prevalue)

            self.m_gridData.SetCellValue(index, 11, percentComplete)

            completedSuccessfully = "No"

            if (runningOperation.proxyDictionary["CompletedSuccessfully"] == True):
                completedSuccessfully = "Yes"

            self.m_gridData.SetCellValue(index, 12, completedSuccessfully)

            self.m_gridData.SetSelectionMode(wx.grid.Grid.wxGridSelectRows)

        if None != selectedRowIndex:
            self.m_gridData.SelectRow(selectedRowIndex, False)


    # thread support

def runningOperationCheckerThread(PanelRunningOperations):

        while PanelRunningOperations.RunRunningOperationsThread == True:
            PanelRunningOperations.runningOperations = list(
                PanelRunningOperations.mainWindow.transferEngine.runningOperations)

            wx.CallAfter(PanelRunningOperations.UpdateGrid)

            time.sleep(1)

        PanelRunningOperations.IsShutDown = True