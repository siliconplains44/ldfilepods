# -*- coding: utf-8 -*-

###########################################################################
## Python code generated with wxFormBuilder (version Jun  5 2014)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import wx
import wx.xrc

import webbrowser

###########################################################################
## Class DialogUpdateAvailable
###########################################################################

class DialogUpdateAvailable(wx.Dialog):

    url = None

    def __init__(self, parent):
        wx.Dialog.__init__ ( self, parent, id = wx.ID_ANY, title = u"Leopard Data File Lock", pos = wx.DefaultPosition, size = wx.Size( 613,267 ), style = wx.DEFAULT_DIALOG_STYLE )

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer45 = wx.BoxSizer(wx.VERTICAL)

        bSizer47 = wx.BoxSizer(wx.VERTICAL)

        bSizer47.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText19 = wx.StaticText(self, wx.ID_ANY,
                                            u"We have detected that a new version of this software is available.  Press the \"Download...\" button below to grab a copy!",
                                            wx.DefaultPosition, wx.Size(500, 40), 0)
        self.m_staticText19.Wrap(500)
        bSizer47.Add(self.m_staticText19, 0, wx.ALIGN_CENTER, 5)

        bSizer47.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer45.Add(bSizer47, 1, wx.EXPAND, 5)

        bSizer48 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer48.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_buttonDownload = wx.Button(self, wx.ID_ANY, u"Download...", wx.DefaultPosition, wx.Size(300, 40), 0)
        bSizer48.Add(self.m_buttonDownload, 0, wx.ALIGN_CENTER, 5)

        bSizer48.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer45.Add(bSizer48, 1, wx.EXPAND, 5)

        bSizer57 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer57.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_buttonClose = wx.Button(self, wx.ID_ANY, u"Close", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer57.Add(self.m_buttonClose, 0, wx.ALIGN_CENTER, 5)

        bSizer57.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer45.Add(bSizer57, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer45)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.m_buttonDownload.Bind(wx.EVT_BUTTON, self.OnButtonClickDownload)
        self.m_buttonClose.Bind(wx.EVT_BUTTON, self.OnButtonClickClose)

    def __del__(self):
        pass

    def SetUrl(self, url):
        self.url = url

    # Virtual event handlers, overide them in your derived class
    def OnButtonClickDownload(self, event):
        webbrowser.open(self.url)

    def OnButtonClickClose(self, event):
        self.Destroy()
