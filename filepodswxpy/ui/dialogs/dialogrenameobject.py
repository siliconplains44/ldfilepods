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
## Class DialogRenameFolder
###########################################################################

class DialogRenameObject(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=u"Rename Folder", pos=wx.DefaultPosition,
                           size=wx.Size(711, 299), style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer77 = wx.BoxSizer(wx.VERTICAL)

        bSizer81 = wx.BoxSizer(wx.VERTICAL)

        bSizer81.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer77.Add(bSizer81, 1, wx.EXPAND, 5)

        bSizer79 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer79.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText39 = wx.StaticText(self, wx.ID_ANY, u"New Folder Name", wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText39.Wrap(-1)
        bSizer79.Add(self.m_staticText39, 0, wx.ALL, 5)

        self.m_textCtrlNewFolderName = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                                   wx.Size(400, -1), 0)
        bSizer79.Add(self.m_textCtrlNewFolderName, 0, wx.ALL, 5)

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

    def OnButtonClickOK(self, event):
        self.EndModal(1)

    def OnButtonClickCancel(self, event):
        self.EndModal(0)
