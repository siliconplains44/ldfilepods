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
## Class DialogGrantAccessToFilePod
###########################################################################

class DialogGrantAccessToFilePod(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=u"Grant User Access To File Pod", pos=wx.DefaultPosition,
                           size=wx.Size(700, 500), style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer77 = wx.BoxSizer(wx.VERTICAL)

        bSizer81 = wx.BoxSizer(wx.VERTICAL)

        bSizer81.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer77.Add(bSizer81, 1, wx.EXPAND, 5)

        bSizer78 = wx.BoxSizer(wx.VERTICAL)

        bSizer78.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText31 = wx.StaticText(self, wx.ID_ANY,
                                            u"Providing access to another user of the file pods community is easy!  Just enter their community handle below...",
                                            wx.DefaultPosition, wx.Size(500, 200), wx.ALIGN_CENTRE)
        self.m_staticText31.Wrap(-1)
        bSizer78.Add(self.m_staticText31, 0, wx.ALIGN_CENTER, 5)

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

    def init(self, mainWindow):
        self.mainWindow = mainWindow

    # Virtual event handlers, overide them in your derived class
    def OnButtonClickOK(self, event):

        # check if they entered their own handle!

        if self.mainWindow.handle == self.m_textCtrlHandle.GetValue():
            wx.MessageBox('You cant share a File Pod of your own with yourself silly!', 'Leoapard Data filePODS',
                              wx.OK | wx.ICON_ERROR)
            return

        # verify the handle they entered is valid

        businessLogic = bl.BusinessLogic()

        returnVal = businessLogic.IsHandleInUse(self.m_textCtrlHandle.GetValue())

        if returnVal[1] == 0:
            wx.MessageBox('Handle is not valid in the filePODS community!', 'Leopard Data filePODS',
                              wx.OK | wx.ICON_ERROR)
        else:
            self.EndModal(1)


    def OnButtonClickCancel(self, event):
        self.EndModal(0)
