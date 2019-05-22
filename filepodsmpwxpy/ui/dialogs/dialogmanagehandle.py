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
## Class DialogManageHandle
###########################################################################

class DialogManageHandle(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=u"Manage Community Handle", pos=wx.DefaultPosition,
                           size=wx.Size(1196, 528), style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer77 = wx.BoxSizer(wx.VERTICAL)

        bSizer81 = wx.BoxSizer(wx.VERTICAL)

        bSizer81.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer77.Add(bSizer81, 1, wx.EXPAND, 5)

        bSizer78 = wx.BoxSizer(wx.VERTICAL)

        bSizer78.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText31 = wx.StaticText(self, wx.ID_ANY,
                                            u"To utilize filePODS you must have a community handle so that others can share pods with you.",
                                            wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText31.Wrap(-1)
        bSizer78.Add(self.m_staticText31, 0, wx.ALIGN_CENTER, 5)

        bSizer78.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText32 = wx.StaticText(self, wx.ID_ANY,
                                            u"To create a handle come up with a name you would like others to know you as.  We recommend using a nickname or other identifer mixed in with your real name.",
                                            wx.DefaultPosition, wx.Size(-1, 75), wx.ALIGN_CENTRE)
        self.m_staticText32.Wrap(-1)
        bSizer78.Add(self.m_staticText32, 0, wx.ALIGN_CENTER, 5)

        bSizer78.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer77.Add(bSizer78, 1, wx.EXPAND, 5)

        bSizer79 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer79.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText33 = wx.StaticText(self, wx.ID_ANY, u"Handle", wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText33.Wrap(-1)
        bSizer79.Add(self.m_staticText33, 0, wx.ALL, 5)

        self.m_textCtrlHandle = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.Size(400, -1), 0)
        bSizer79.Add(self.m_textCtrlHandle, 0, wx.ALL, 5)

        bSizer79.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer77.Add(bSizer79, 1, wx.EXPAND, 5)

        bSizer80 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer80.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_buttonOK = wx.Button(self, wx.ID_ANY, u"OK", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer80.Add(self.m_buttonOK, 0, wx.ALL, 5)

        self.m_buttonCancel = wx.Button(self, wx.ID_ANY, u"Cancel", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer80.Add(self.m_buttonCancel, 0, wx.ALL, 5)

        bSizer80.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer77.Add(bSizer80, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer77)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.m_buttonOK.Bind(wx.EVT_BUTTON, self.OnButtonClickOK)
        self.m_buttonCancel.Bind(wx.EVT_BUTTON, self.OnButtonClickCancel)

    def __del__(self):
        pass

    # Virtual event handlers, overide them in your derived class
    def OnButtonClickOK(self, event):

        businessLogic = bl.BusinessLogic()

        returnVal = businessLogic.IsHandleInUse(self.m_textCtrlHandle.GetValue())

        if returnVal[1] == 0:
            self.EndModal(1)
        else:
            wx.MessageBox('Handle is already in use, please try another one!', 'Leopard Data File Pods',
                              wx.OK | wx.ICON_ERROR)

    def OnButtonClickCancel(self, event):
        self.EndModal(0);
