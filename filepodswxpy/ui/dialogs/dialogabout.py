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
## Class DialogAbout
###########################################################################

class DialogAbout(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=u"About Leopard Data File Pods", pos=wx.DefaultPosition,
                           size=wx.Size(400, 400), style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer17 = wx.BoxSizer(wx.VERTICAL)

        bSizer18 = wx.BoxSizer(wx.VERTICAL)

        self.m_bitmap1 = wx.StaticBitmap(self, wx.ID_ANY, wx.NullBitmap, wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer18.Add(self.m_bitmap1, 0, wx.ALIGN_CENTER | wx.ALL, 5)

        bSizer17.Add(bSizer18, 1, wx.EXPAND, 5)

        bSizer19 = wx.BoxSizer(wx.VERTICAL)

        self.m_staticText8 = wx.StaticText(self, wx.ID_ANY, u"Leopard Data File Pods", wx.DefaultPosition,
                                           wx.DefaultSize, 0)
        self.m_staticText8.Wrap(-1)
        self.m_staticText8.SetFont(wx.Font(14, 70, 90, 90, False, wx.EmptyString))

        bSizer19.Add(self.m_staticText8, 0, wx.ALIGN_CENTER | wx.ALL, 5)

        bSizer17.Add(bSizer19, 1, wx.EXPAND, 5)

        bSizer20 = wx.BoxSizer(wx.VERTICAL)

        self.m_staticText9 = wx.StaticText(self, wx.ID_ANY, u"Version 2015 Release 1", wx.DefaultPosition,
                                           wx.DefaultSize, 0)
        self.m_staticText9.Wrap(-1)
        bSizer20.Add(self.m_staticText9, 0, wx.ALIGN_CENTER | wx.ALL, 5)

        bSizer17.Add(bSizer20, 1, wx.EXPAND, 5)

        bSizer21 = wx.BoxSizer(wx.VERTICAL)

        self.m_staticText10 = wx.StaticText(self, wx.ID_ANY,
                                            u"File Pods is a cloud solution from Leopard Data that allows you to keep all of your working files in the cloud securely.  If you need you can quickly share your pod files to other users across the internet.",
                                            wx.DefaultPosition, wx.Size(300, 100), wx.ALIGN_CENTRE)
        self.m_staticText10.Wrap(-1)
        bSizer21.Add(self.m_staticText10, 0, wx.ALIGN_CENTER, 5)

        bSizer17.Add(bSizer21, 1, wx.EXPAND, 5)

        bSizer22 = wx.BoxSizer(wx.VERTICAL)

        bSizer22.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText11 = wx.StaticText(self, wx.ID_ANY, u"c2015 Leopard Data Corporation", wx.DefaultPosition,
                                            wx.DefaultSize, 0)
        self.m_staticText11.Wrap(-1)
        bSizer22.Add(self.m_staticText11, 0, wx.ALIGN_CENTER | wx.ALL, 5)

        bSizer22.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer17.Add(bSizer22, 1, wx.EXPAND, 5)

        bSizer24 = wx.BoxSizer(wx.VERTICAL)

        self.m_hyperlink1 = wx.HyperlinkCtrl(self, wx.ID_ANY, u"http://www.leoparddata.com",
                                             u"http://www.leoparddata.com", wx.DefaultPosition, wx.DefaultSize,
                                             wx.HL_DEFAULT_STYLE)
        bSizer24.Add(self.m_hyperlink1, 0, wx.ALIGN_CENTER | wx.ALL, 5)

        bSizer17.Add(bSizer24, 1, wx.EXPAND, 5)

        bSizer25 = wx.BoxSizer(wx.VERTICAL)

        self.m_buttonClose = wx.Button(self, wx.ID_ANY, u"Close", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer25.Add(self.m_buttonClose, 0, wx.ALIGN_CENTER | wx.ALL, 5)

        bSizer17.Add(bSizer25, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer17)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.m_buttonClose.Bind(wx.EVT_BUTTON, self.OnButtonClickClose)

    def __del__(self):
        pass

    # Virtual event handlers, overide them in your derived class
    def OnButtonClickClose(self, event):
        self.Close()
