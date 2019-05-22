# -*- coding: utf-8 -*-

###########################################################################
## Python code generated with wxFormBuilder (version Jun  5 2014)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import wx
import wx.xrc


###########################################################################
## Class PanelHome
###########################################################################

class PanelHome(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent, id=wx.ID_ANY, pos=wx.DefaultPosition, size=wx.Size(812, 478),
                          style=wx.TAB_TRAVERSAL)

        bSizer48 = wx.BoxSizer(wx.VERTICAL)

        self.m_staticText18 = wx.StaticText(self, wx.ID_ANY, u"Leopard Data File Pods", wx.DefaultPosition,
                                            wx.DefaultSize, 0)
        self.m_staticText18.Wrap(-1)
        self.m_staticText18.SetFont(wx.Font(18, 70, 90, 90, False, wx.EmptyString))

        bSizer48.Add(self.m_staticText18, 0, wx.ALL, 5)

        self.m_staticText19 = wx.StaticText(self, wx.ID_ANY, u"Welcome to Leopard Data File Pods!", wx.DefaultPosition,
                                            wx.DefaultSize, 0)
        self.m_staticText19.Wrap(-1)
        bSizer48.Add(self.m_staticText19, 0, wx.ALL, 5)

        self.m_buttonCreateAFilePod = wx.Button(self, wx.ID_ANY, u"Create a File Pod...", wx.DefaultPosition,
                                                wx.DefaultSize, 0)
        bSizer48.Add(self.m_buttonCreateAFilePod, 0, wx.ALL, 5)

        self.SetSizer(bSizer48)
        self.Layout()

        # Connect Events
        self.m_buttonCreateAFilePod.Bind(wx.EVT_BUTTON, self.OnButtonClickCreateAFilePod)

    def __del__(self):
        pass

    # Virtual event handlers, overide them in your derived class
    def OnButtonClickCreateAFilePod(self, event):
        self.mainWindow.OnCreateFilePod(None)

    mainWindow = None


    def Initialize(self, mainWindow, rightPaneInitData):
        self.mainWindow = mainWindow
        self.rightPaneInitData = rightPaneInitData


    def Uninitialize(self):
        pass
