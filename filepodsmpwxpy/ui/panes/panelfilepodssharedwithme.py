# -*- coding: utf-8 -*-

###########################################################################
## Python code generated with wxFormBuilder (version Jun 17 2015)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import wx
import wx.xrc


###########################################################################
## Class PanelFilePodsSharedWithMe
###########################################################################

class PanelFilePodsSharedWithMe(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent, id=wx.ID_ANY, pos=wx.DefaultPosition, size=wx.Size(713, 465),
                          style=wx.TAB_TRAVERSAL)

        bSizer62 = wx.BoxSizer(wx.VERTICAL)

        self.m_staticText24 = wx.StaticText(self, wx.ID_ANY,
                                            u"This node contains all file Pods that others own but that are shared with you for collaboration.",
                                            wx.DefaultPosition, wx.Size(400, 300), 0)
        self.m_staticText24.Wrap(-1)
        bSizer62.Add(self.m_staticText24, 0, wx.ALL, 5)

        self.SetSizer(bSizer62)
        self.Layout()

    def __del__(self):
        pass

    mainWindow = None


    def Initialize(self, mainWindow, rightPaneInitData):
        self.mainWindow = mainWindow
        self.rightPaneInitData = rightPaneInitData


    def Uninitialize(self):
        pass