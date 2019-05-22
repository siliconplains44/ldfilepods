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
## Class DialogSmsText
###########################################################################

class DialogSmsText(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=u"Sms Text", pos=wx.DefaultPosition,
                           size=wx.Size(779, 400), style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer131 = wx.BoxSizer(wx.VERTICAL)

        bSizer132 = wx.BoxSizer(wx.VERTICAL)

        bSizer132.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer131.Add(bSizer132, 1, wx.EXPAND, 5)

        bSizer133 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer133.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText39 = wx.StaticText(self, wx.ID_ANY, u"To", wx.DefaultPosition, wx.Size(100, -1), 0)
        self.m_staticText39.Wrap(-1)
        bSizer133.Add(self.m_staticText39, 0, wx.ALL, 5)

        self.m_textCtrlTo = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.Size(600, -1),
                                        wx.TE_MULTILINE)
        bSizer133.Add(self.m_textCtrlTo, 0, wx.ALL, 5)

        bSizer133.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer131.Add(bSizer133, 1, wx.EXPAND, 5)

        bSizer1351 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer1351.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText401 = wx.StaticText(self, wx.ID_ANY, u"Message", wx.DefaultPosition, wx.Size(100, -1), 0)
        self.m_staticText401.Wrap(-1)
        bSizer1351.Add(self.m_staticText401, 0, wx.ALL, 5)

        self.m_textCtrlMessage = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.Size(600, 150),
                                             wx.TE_MULTILINE)
        bSizer1351.Add(self.m_textCtrlMessage, 0, wx.ALL, 5)

        bSizer1351.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer131.Add(bSizer1351, 1, wx.EXPAND, 5)

        bSizer134 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer134.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_buttonSendText = wx.Button(self, wx.ID_ANY, u"Send", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer134.Add(self.m_buttonSendText, 0, wx.ALL, 5)

        self.m_buttonCancel = wx.Button(self, wx.ID_ANY, u"Cancel", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer134.Add(self.m_buttonCancel, 0, wx.ALL, 5)

        bSizer131.Add(bSizer134, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer131)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.m_buttonSendText.Bind(wx.EVT_BUTTON, self.OnButtonClickSendText)
        self.m_buttonCancel.Bind(wx.EVT_BUTTON, self.OnButtonClickCancel)

    def __del__(self):
        pass

    # Virtual event handlers, overide them in your derived class
    def OnButtonClickSendText(self, event):
        self.EndModal(1)

    def OnButtonClickCancel(self, event):
        self.EndModal(0)
