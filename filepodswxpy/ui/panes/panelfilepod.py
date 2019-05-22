# -*- coding: utf-8 -*-

###########################################################################
## Python code generated with wxFormBuilder (version Jun 17 2015)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import wx
import wx.xrc

from businesslogic import bl


###########################################################################
## Class PanelFilePod
###########################################################################

class PanelFilePod(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent, id=wx.ID_ANY, pos=wx.DefaultPosition, size=wx.Size(500, 453),
                          style=wx.TAB_TRAVERSAL)

        bSizer48 = wx.BoxSizer(wx.VERTICAL)

        self.m_staticTextName = wx.StaticText(self, wx.ID_ANY, u"Name:", wx.DefaultPosition, wx.Size(300, -1), 0)
        self.m_staticTextName.Wrap(-1)
        self.m_staticTextName.SetFont(wx.Font(10, 70, 90, 90, False, wx.EmptyString))

        bSizer48.Add(self.m_staticTextName, 0, wx.ALL, 5)

        self.m_staticTextDescription = wx.StaticText(self, wx.ID_ANY, u"Description:", wx.DefaultPosition,
                                                     wx.Size(300, 100), 0)
        self.m_staticTextDescription.Wrap(-1)
        bSizer48.Add(self.m_staticTextDescription, 0, wx.ALL, 5)

        self.m_staticTextFolderCount = wx.StaticText(self, wx.ID_ANY, u"Folder Count:", wx.DefaultPosition,
                                                     wx.Size(300, -1), 0)
        self.m_staticTextFolderCount.Wrap(-1)
        bSizer48.Add(self.m_staticTextFolderCount, 0, wx.ALL, 5)

        self.m_staticTextFileCount = wx.StaticText(self, wx.ID_ANY, u"File Count:", wx.DefaultPosition,
                                                   wx.Size(300, -1), 0)
        self.m_staticTextFileCount.Wrap(-1)
        bSizer48.Add(self.m_staticTextFileCount, 0, wx.ALL, 5)

        self.m_staticTextTotalBytesInStorage = wx.StaticText(self, wx.ID_ANY, u"Total Bytes In Storage:",
                                                             wx.DefaultPosition, wx.Size(300, -1), 0)
        self.m_staticTextTotalBytesInStorage.Wrap(-1)
        bSizer48.Add(self.m_staticTextTotalBytesInStorage, 0, wx.ALL, 5)

        self.SetSizer(bSizer48)
        self.Layout()


    def __del__(self):
        pass


    mainWindow = None


    def Initialize(self, mainWindow, rightPaneInitData):
        self.mainWindow = mainWindow
        self.rightPaneInitData = rightPaneInitData

        businessLogic = bl.BusinessLogic()

        podInformation = businessLogic.RetrieveFilePodInformation(self.rightPaneInitData["podid"])

        self.m_staticTextName.SetLabel('Name:  ' + podInformation["pods"][0]["Name"])
        self.m_staticTextDescription.SetLabel('Description:  ' + podInformation["pods"][0]["Description"])
        self.m_staticTextFileCount.SetLabel('File Count:  ' + str(podInformation["countfiles"][0]["COUNT(*)"]))
        self.m_staticTextFolderCount.SetLabel('Folder Count:  ' + str(podInformation["countfolders"]))

        dataSizeInBytes = podInformation["datasize"][0]["SUM(FileSizeInBytes)"]

        if dataSizeInBytes is None:
            dataSizeInBytes = 0

        self.m_staticTextTotalBytesInStorage.SetLabel('Total Bytes In Storage:  ' + str(dataSizeInBytes))

    def Uninitialize(self):
        pass
