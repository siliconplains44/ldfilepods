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
## Class PanelSearchPods
###########################################################################

class PanelSearchPods(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent, id=wx.ID_ANY, pos=wx.DefaultPosition, size=wx.Size(909, 722),
                          style=wx.TAB_TRAVERSAL)

        bSizer196 = wx.BoxSizer(wx.VERTICAL)

        bSizer198 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_radioBtnSearchingForFile = wx.RadioButton(self, wx.ID_ANY, u"I am searching for a file",
                                                         wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer198.Add(self.m_radioBtnSearchingForFile, 0, wx.ALL, 5)

        self.m_radioBtnSearchingForFolder = wx.RadioButton(self, wx.ID_ANY, u"I am searching for a folder",
                                                           wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer198.Add(self.m_radioBtnSearchingForFolder, 0, wx.ALL, 5)

        bSizer196.Add(bSizer198, 0, wx.EXPAND, 5)

        bSizer199 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_checkBoxIncludeName = wx.CheckBox(self, wx.ID_ANY, u"Include", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer199.Add(self.m_checkBoxIncludeName, 0, wx.ALL, 5)

        self.m_checkBoxCaseSensitive = wx.CheckBox(self, wx.ID_ANY, u"Case Sensitive", wx.DefaultPosition,
                                                   wx.DefaultSize, 0)
        bSizer199.Add(self.m_checkBoxCaseSensitive, 0, wx.ALL, 5)

        self.m_staticText51 = wx.StaticText(self, wx.ID_ANY, u"Name", wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText51.Wrap(-1)
        bSizer199.Add(self.m_staticText51, 0, wx.ALL, 5)

        self.m_textCtrlName = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.Size(600, -1), 0)
        bSizer199.Add(self.m_textCtrlName, 0, wx.ALL, 5)

        bSizer196.Add(bSizer199, 0, wx.EXPAND, 5)

        bSizer200 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_checkBoxIncludeFileSize = wx.CheckBox(self, wx.ID_ANY, u"Include", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer200.Add(self.m_checkBoxIncludeFileSize, 0, wx.ALL, 5)

        self.m_staticText52 = wx.StaticText(self, wx.ID_ANY, u"File Size", wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText52.Wrap(-1)
        bSizer200.Add(self.m_staticText52, 0, wx.ALL, 5)

        self.m_staticText53 = wx.StaticText(self, wx.ID_ANY, u"Between", wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText53.Wrap(-1)
        bSizer200.Add(self.m_staticText53, 0, wx.ALL, 5)

        self.m_textCtrlStartSize = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer200.Add(self.m_textCtrlStartSize, 0, wx.ALL, 5)

        self.m_staticText54 = wx.StaticText(self, wx.ID_ANY, u"and", wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText54.Wrap(-1)
        bSizer200.Add(self.m_staticText54, 0, wx.ALL, 5)

        self.m_textCtrlEndSize = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer200.Add(self.m_textCtrlEndSize, 0, wx.ALL, 5)

        self.m_staticText55 = wx.StaticText(self, wx.ID_ANY, u"kilobytes", wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText55.Wrap(-1)
        bSizer200.Add(self.m_staticText55, 0, wx.ALL, 5)

        bSizer196.Add(bSizer200, 0, wx.EXPAND, 5)

        bSizer201 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_checkBoxIncludeCreated = wx.CheckBox(self, wx.ID_ANY, u"Include", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer201.Add(self.m_checkBoxIncludeCreated, 0, wx.ALL, 5)

        self.m_staticText56 = wx.StaticText(self, wx.ID_ANY, u"Created", wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText56.Wrap(-1)
        bSizer201.Add(self.m_staticText56, 0, wx.ALL, 5)

        self.m_staticText57 = wx.StaticText(self, wx.ID_ANY, u"Between", wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText57.Wrap(-1)
        bSizer201.Add(self.m_staticText57, 0, wx.ALL, 5)

        self.m_datePickerCreatedFrom = wx.DatePickerCtrl(self, wx.ID_ANY, wx.DefaultDateTime, wx.DefaultPosition,
                                                         wx.DefaultSize, wx.DP_DEFAULT)
        bSizer201.Add(self.m_datePickerCreatedFrom, 0, wx.ALL, 5)

        self.m_staticText58 = wx.StaticText(self, wx.ID_ANY, u"and", wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText58.Wrap(-1)
        bSizer201.Add(self.m_staticText58, 0, wx.ALL, 5)

        self.m_datePickerCreatedTo = wx.DatePickerCtrl(self, wx.ID_ANY, wx.DefaultDateTime, wx.DefaultPosition,
                                                       wx.DefaultSize, wx.DP_DEFAULT)
        bSizer201.Add(self.m_datePickerCreatedTo, 0, wx.ALL, 5)

        bSizer196.Add(bSizer201, 0, wx.EXPAND, 5)

        bSizer202 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_checkBoxIncludePod = wx.CheckBox(self, wx.ID_ANY, u"Include", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer202.Add(self.m_checkBoxIncludePod, 0, wx.ALL, 5)

        self.m_staticText59 = wx.StaticText(self, wx.ID_ANY, u"Pod", wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText59.Wrap(-1)
        bSizer202.Add(self.m_staticText59, 0, wx.ALL, 5)

        m_comboBoxPodChoices = []
        self.m_comboBoxPod = wx.ComboBox(self, wx.ID_ANY, u"Combo!", wx.DefaultPosition, wx.Size(500, -1),
                                         m_comboBoxPodChoices, wx.CB_DROPDOWN)
        bSizer202.Add(self.m_comboBoxPod, 0, wx.ALL, 5)

        bSizer196.Add(bSizer202, 0, wx.EXPAND, 5)

        bSizer2021 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_checkBoxIncludeTags = wx.CheckBox(self, wx.ID_ANY, u"Include", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer2021.Add(self.m_checkBoxIncludeTags, 0, wx.ALL, 5)

        self.m_staticText591 = wx.StaticText(self, wx.ID_ANY, u"Tags", wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText591.Wrap(-1)
        bSizer2021.Add(self.m_staticText591, 0, wx.ALL, 5)

        m_checkListTagsChoices = []
        self.m_checkListTags = wx.CheckListBox(self, wx.ID_ANY, wx.DefaultPosition, wx.Size(600, 100),
                                               m_checkListTagsChoices, 0)
        bSizer2021.Add(self.m_checkListTags, 0, wx.ALL, 5)

        bSizer196.Add(bSizer2021, 0, wx.EXPAND, 5)

        bSizer211 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_buttonSearch = wx.Button(self, wx.ID_ANY, u"Search", wx.DefaultPosition, wx.Size(400, -1), 0)
        bSizer211.Add(self.m_buttonSearch, 0, wx.ALL, 5)

        bSizer196.Add(bSizer211, 0, wx.EXPAND, 5)

        bSizer2111 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_buttonOpen = wx.Button(self, wx.ID_ANY, u"Open...", wx.DefaultPosition, wx.Size(-1, -1), 0)
        bSizer2111.Add(self.m_buttonOpen, 0, wx.ALL, 5)

        bSizer196.Add(bSizer2111, 0, wx.EXPAND, 5)

        bSizer203 = wx.BoxSizer(wx.VERTICAL)

        self.m_gridData = wx.grid.Grid(self, wx.ID_ANY, wx.DefaultPosition, wx.Size(-1, -1), 0)

        # Grid
        self.m_gridData.CreateGrid(5, 4)
        self.m_gridData.EnableEditing(False)
        self.m_gridData.EnableGridLines(True)
        self.m_gridData.EnableDragGridSize(False)
        self.m_gridData.SetMargins(0, 0)

        # Columns
        self.m_gridData.SetColSize(0, 20)
        self.m_gridData.SetColSize(1, 350)
        self.m_gridData.SetColSize(2, 250)
        self.m_gridData.SetColSize(3, 150)
        self.m_gridData.EnableDragColMove(False)
        self.m_gridData.EnableDragColSize(True)
        self.m_gridData.SetColLabelSize(30)
        self.m_gridData.SetColLabelValue(0, u"ID")
        self.m_gridData.SetColLabelValue(1, u"Object")
        self.m_gridData.SetColLabelValue(2, u"Pod")
        self.m_gridData.SetColLabelValue(3, u"Revision")
        self.m_gridData.SetColLabelAlignment(wx.ALIGN_CENTRE, wx.ALIGN_CENTRE)

        # Rows
        self.m_gridData.EnableDragRowSize(True)
        self.m_gridData.SetRowLabelSize(80)
        self.m_gridData.SetRowLabelAlignment(wx.ALIGN_CENTRE, wx.ALIGN_CENTRE)

        # Label Appearance

        # Cell Defaults
        self.m_gridData.SetDefaultCellAlignment(wx.ALIGN_LEFT, wx.ALIGN_TOP)
        bSizer203.Add(self.m_gridData, 1, wx.ALL | wx.EXPAND, 5)

        bSizer196.Add(bSizer203, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer196)
        self.Layout()

        # Connect Events
        self.m_radioBtnSearchingForFile.Bind(wx.EVT_RADIOBUTTON, self.OnRadioButtonSearchingForFile)
        self.m_radioBtnSearchingForFolder.Bind(wx.EVT_RADIOBUTTON, self.OnRadioButtonSearchingForFolder)
        self.m_checkBoxIncludeName.Bind(wx.EVT_CHECKBOX, self.OnCheckBoxIncludeName)
        self.m_checkBoxIncludeFileSize.Bind(wx.EVT_CHECKBOX, self.OnCheckBoxIncludeFileSize)
        self.m_checkBoxIncludeCreated.Bind(wx.EVT_CHECKBOX, self.OnCheckBoxIncludeCreated)
        self.m_checkBoxIncludePod.Bind(wx.EVT_CHECKBOX, self.OnCheckBoxIncludePod)
        self.m_checkBoxIncludeTags.Bind(wx.EVT_CHECKBOX, self.OnCheckBoxIncludeTags)
        self.m_buttonSearch.Bind(wx.EVT_BUTTON, self.OnButtonClickSearch)
        self.m_buttonOpen.Bind(wx.EVT_BUTTON, self.OnButtonClickOpen)
        self.m_gridData.Bind(wx.grid.EVT_GRID_SELECT_CELL, self.m_gridDataOnGridSelectCell)

        self.theSizerToHide = bSizer200


    def __del__(self):
        pass


    def Initialize(self, mainWindow, rightPaneInitData):
        self.mainWindow = mainWindow
        self.rightPaneInitData = rightPaneInitData

        self.m_radioBtnSearchingForFile.SetValue(True)

        self.m_buttonOpen.Disable()

        businessLogic = bl.BusinessLogic()

        mypods = businessLogic.RetrieveFilePodsByOwnerSecurityUserID(self.mainWindow.loggedInSecurityUserID)['pods']
        podssharedwithme = businessLogic.RetrieveFilePodsSharedWithMe(self.mainWindow.loggedInSecurityUserID)['pods']

        self.m_comboBoxPod.Clear()

        for mypod in mypods:
            self.m_comboBoxPod.Append(mypod['Name'])

        for podsharedwithme in podssharedwithme:
            self.m_comboBoxPod.Append(podsharedwithme['Name'])

        tags = businessLogic.RetrieveAllPreUsedTagsByOwnerSecurityUserID(self.mainWindow.loggedInSecurityUserID)['tags']

        for tag in tags:
            self.m_checkListTags.Append(tag['Tag'])

        searchResults = []

        self.LoadDataGrid(searchResults)


    def Uninitialize(self):
        pass


    def LoadDataGrid(self, searchResults):
        businessLogic = bl.BusinessLogic()

        if (self.m_gridData.GetNumberRows() > 0):
            self.m_gridData.DeleteRows(0, 100000)

        self.m_gridData.AppendRows(len(searchResults))

        for index, searchResult in enumerate(searchResults):
            self.m_gridData.SetCellValue(index, 0, str(searchResult['id']))
            self.m_gridData.SetCellValue(index, 1, searchResult['object'])
            self.m_gridData.SetCellValue(index, 2, searchResult['pod'])
            self.m_gridData.SetCellValue(index, 3, str(searchResult['revision']))

        self.m_gridData.SetSelectionMode(wx.grid.Grid.wxGridSelectRows)
        self.m_gridData.HideCol(0)

        if self.m_radioBtnSearchingForFile.GetValue() == True:
            self.m_gridData.ShowCol(3)
        else:
            self.m_gridData.HideCol(3)


    # Virtual event handlers, overide them in your derived class
    def OnRadioButtonSearchingForFile(self, event):
        self.theSizerToHide.ShowItems(True)
        self.Layout()


    def OnRadioButtonSearchingForFolder(self, event):
        self.theSizerToHide.ShowItems(False)
        self.Layout()


    def OnCheckBoxIncludeName(self, event):
        event.Skip()


    def OnCheckBoxIncludeFileSize(self, event):
        event.Skip()


    def OnCheckBoxIncludeCreated(self, event):
        event.Skip()


    def OnCheckBoxIncludePod(self, event):
        event.Skip()


    def OnCheckBoxIncludeTags(self, event):
        event.Skip()


    def OnButtonClickSearch(self, event):
        businessLogic = bl.BusinessLogic()

        self.m_buttonOpen.Disable()

        if (self.m_radioBtnSearchingForFile.GetValue() == True):

            includeName = 0
            caseSensitive = 0
            name = ''
            includeFileSize = 0
            fromSizeInBytes = 0
            toSizeInBytes = 0
            includeCreated = 0
            fromCreated = ''
            toCreated = ''
            includePod = 0
            podId = -1
            includeTags = 0
            listTags = []

            if self.m_checkBoxIncludeName.GetValue() == True:
                includeName = 1
                name = self.m_textCtrlName.GetValue()

            if self.m_checkBoxCaseSensitive.GetValue() == True:
                caseSensitive = 1

            if self.m_checkBoxIncludeFileSize.GetValue() == True:
                includeFileSize = 1
                fromSizeInBytes = int(self.m_textCtrlStartSize.GetValue()) * 1000
                toSizeInBytes = int(self.m_textCtrlEndSize.GetValue()) * 1000

            if self.m_checkBoxIncludeCreated.GetValue() == True:
                includeCreated = 1
                fromCreated = self.m_datePickerCreatedFrom.GetValue().FormatISOCombined()
                toCreated = self.m_datePickerCreatedTo.GetValue().FormatISOCombined()

            if self.m_checkBoxIncludePod.GetValue() == True:
                includePod = 1
                podName = self.m_comboBoxPod.GetValue()

                pods = businessLogic.RetrieveFilePodsByOwnerSecurityUserID(self.mainWindow.loggedInSecurityUserID)

                for pod in pods["pods"]:
                    if pod['Name'] == podName:
                        podId = pod['PodID']
                        break

                if podId == -1:
                    pods = businessLogic.RetrieveFilePodsSharedWithMe(self.mainWindow.loggedInSecurityUserID)

                    for pod in pods["pods"]:
                        if pod['Name'] == podName:
                            podId = pod['PodID']
                            break

            if self.m_checkBoxIncludeTags.GetValue() == True:
                includeTags = 1

                listTags = self.m_checkListTags.GetCheckedStrings()

            searchResults = businessLogic.SearchForFiles(includeName, caseSensitive, name,
                                                         includeFileSize, fromSizeInBytes, toSizeInBytes,
                                                         includeCreated, fromCreated, toCreated,
                                                         includePod, podId,
                                                         includeTags, listTags, self.mainWindow.loggedInSecurityUserID)[
                'searchresults']
        else:

            includeName = 0
            caseSensitive = 0
            name = ''
            includeCreated = 0
            fromCreated = ''
            toCreated = ''
            includePod = 0
            podId = -1
            includeTags = 0
            listTags = []

            if self.m_checkBoxIncludeName.GetValue() == True:
                includeName = 1
                name = self.m_textCtrlName.GetValue()

            if self.m_checkBoxCaseSensitive.GetValue() == True:
                caseSensitive = 1

            if self.m_checkBoxIncludeCreated.GetValue() == True:
                includeCreated = 1
                fromCreated = self.m_datePickerCreatedFrom.GetValue().FormatISOCombined()
                toCreated = self.m_datePickerCreatedTo.GetValue().FormatISOCombined()

            if self.m_checkBoxIncludePod.GetValue() == True:
                includePod = 1
                podName = self.m_comboBoxPod.GetValue()

                pods = businessLogic.RetrieveFilePodsByOwnerSecurityUserID(self.mainWindow.loggedInSecurityUserID)

                for pod in pods["pods"]:
                    if pod['Name'] == podName:
                        podId = pod['PodID']
                        break

                if podId == -1:
                    pods = businessLogic.RetrieveFilePodsSharedWithMe(self.mainWindow.loggedInSecurityUserID)

                    for pod in pods["pods"]:
                        if pod['Name'] == podName:
                            podId = pod['PodID']
                            break

            if self.m_checkBoxIncludeTags.GetValue() == True:
                includeTags = 1

                listTags = self.m_checkListTags.GetCheckedStrings()

            searchResults = businessLogic.SearchForFolders(includeName, caseSensitive, name,
                                                           includeCreated, fromCreated, toCreated,
                                                           includePod, podId,
                                                           includeTags, listTags, self.mainWindow.loggedInSecurityUserID)[
                'searchresults']

        self.LoadDataGrid(searchResults)


    def OnButtonClickOpen(self, event):
        selectedRowIndex = self.m_gridData.SelectedRows[0]

        itemID = int(self.m_gridData.GetCellValue(selectedRowIndex, 0))

        businessLogic = bl.BusinessLogic()

        if self.m_radioBtnSearchingForFile.GetValue() == True:

            podFile = businessLogic.RetrievePodFileByPodFileID(itemID)['podfile']
            self.mainWindow.treeManager.NavigateToPodFile(podFile['PodID'], podFile['PodParentFolderID'], itemID)

        else:

            pod = businessLogic.RetrievePodByFolderID(itemID)['pod']
            self.mainWindow.treeManager.NavigateToPodFolder(pod['PodID'], itemID)


    def m_gridDataOnGridSelectCell(self, event):
        self.m_buttonOpen.Enable()
