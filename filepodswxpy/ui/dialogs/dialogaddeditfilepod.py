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
## Class DialogAddEditFilePod
###########################################################################

class DialogAddEditFilePod(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=u"Add/Edit File Pod", pos=wx.DefaultPosition,
                           size=wx.Size(575, 403), style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer41 = wx.BoxSizer(wx.VERTICAL)

        bSizer42 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer42.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer41.Add(bSizer42, 1, wx.EXPAND, 5)

        bSizer43 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer43.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText16 = wx.StaticText(self, wx.ID_ANY, u"Name", wx.DefaultPosition, wx.Size(80, -1), 0)
        self.m_staticText16.Wrap(-1)
        bSizer43.Add(self.m_staticText16, 0, wx.ALIGN_CENTER | wx.ALL, 5)

        self.m_textCtrlName = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.Size(300, -1), 0)
        bSizer43.Add(self.m_textCtrlName, 0, wx.ALIGN_CENTER | wx.ALL, 5)

        bSizer43.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer41.Add(bSizer43, 1, wx.EXPAND, 5)

        bSizer44 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer44.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText17 = wx.StaticText(self, wx.ID_ANY, u"Description", wx.DefaultPosition, wx.Size(80, -1), 0)
        self.m_staticText17.Wrap(-1)
        bSizer44.Add(self.m_staticText17, 0, wx.ALL, 5)

        self.m_textCtrlDescription = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.Size(300, 200),
                                                 0)
        bSizer44.Add(self.m_textCtrlDescription, 0, wx.ALL, 5)

        bSizer44.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer41.Add(bSizer44, 1, wx.EXPAND, 5)

        bSizer45 = wx.BoxSizer(wx.VERTICAL)

        bSizer45.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer41.Add(bSizer45, 1, wx.EXPAND, 5)

        bSizer46 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer46.AddSpacer((100, 0), 1, wx.EXPAND, 5)

        self.m_buttonOK = wx.Button(self, wx.ID_ANY, u"OK", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer46.Add(self.m_buttonOK, 0, wx.ALIGN_CENTER | wx.ALIGN_CENTER_HORIZONTAL | wx.ALL, 5)

        self.m_buttonCancel = wx.Button(self, wx.ID_ANY, u"Cancel", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer46.Add(self.m_buttonCancel, 0, wx.ALIGN_CENTER | wx.ALIGN_CENTER_HORIZONTAL | wx.ALL, 5)

        bSizer41.Add(bSizer46, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer41)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.m_buttonOK.Bind(wx.EVT_BUTTON, self.OnButtonClickOK)
        self.m_buttonCancel.Bind(wx.EVT_BUTTON, self.OnButtonClickCancel)


    def __del__(self):
        pass


    # Virtual event handlers, overide them in your derived class
    def OnButtonClickOK(self, event):

        if self.m_textCtrlName.GetValue() == '':
            wx.MessageBox('You must specify a valid file pod name before continuuing!', 'Leopard Data File Pods',
                          wx.OK | wx.ICON_ERROR)
            return

        self.EndModal(1);


    def OnButtonClickCancel(self, event):
        self.EndModal(0);
