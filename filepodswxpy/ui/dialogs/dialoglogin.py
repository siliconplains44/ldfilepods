# -*- coding: utf-8 -*- 

###########################################################################
## Python code generated with wxFormBuilder (version Jun  6 2014)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import wx
import wx.xrc


###########################################################################
## Class DialogLogin
###########################################################################

class DialogLogin(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=u"Login", pos=wx.DefaultPosition, size=wx.Size(575, 303),
                           style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer41 = wx.BoxSizer(wx.VERTICAL)

        bSizer42 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer42.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer41.Add(bSizer42, 1, wx.EXPAND, 5)

        bSizer43 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer43.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText16 = wx.StaticText(self, wx.ID_ANY, u"Username", wx.DefaultPosition, wx.Size(100, -1), 0)
        self.m_staticText16.Wrap(-1)
        bSizer43.Add(self.m_staticText16, 0, wx.ALIGN_CENTER | wx.ALL, 5)

        self.m_textCtrlUsername = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.Size(300, -1), 0)
        bSizer43.Add(self.m_textCtrlUsername, 0, wx.ALIGN_CENTER | wx.ALL, 5)

        bSizer43.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer41.Add(bSizer43, 1, wx.EXPAND, 5)

        bSizer44 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer44.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText17 = wx.StaticText(self, wx.ID_ANY, u"Password", wx.DefaultPosition, wx.Size(100, -1), 0)
        self.m_staticText17.Wrap(-1)
        bSizer44.Add(self.m_staticText17, 0, wx.ALL, 5)

        self.m_textCtrlPassword = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.Size(300, -1), wx.TE_PASSWORD)
        bSizer44.Add(self.m_textCtrlPassword, 0, wx.ALL, 5)

        bSizer44.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer41.Add(bSizer44, 1, wx.EXPAND, 5)

        bSizer172 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer172.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_checkBoxRememberLogin = wx.CheckBox(self, wx.ID_ANY, u"Remember Login", wx.DefaultPosition,
                                                   wx.Size(400, -1), 0)
        bSizer172.Add(self.m_checkBoxRememberLogin, 0, wx.ALL, 5)

        bSizer172.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer41.Add(bSizer172, 1, wx.EXPAND, 5)

        bSizer173 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer173.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_checkBoxLoginAutomatiallyOnStart = wx.CheckBox(self, wx.ID_ANY, u"Login Automatically on Start",
                                                              wx.DefaultPosition, wx.Size(400, -1), 0)
        bSizer173.Add(self.m_checkBoxLoginAutomatiallyOnStart, 0, wx.ALL, 5)

        bSizer173.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer41.Add(bSizer173, 1, wx.EXPAND, 5)

        bSizer45 = wx.BoxSizer(wx.VERTICAL)

        bSizer45.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer41.Add(bSizer45, 1, wx.EXPAND, 5)

        bSizer46 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer46.AddSpacer((100, 0), 1, wx.EXPAND, 5)

        self.m_buttonLogin = wx.Button(self, wx.ID_ANY, u"Login", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer46.Add(self.m_buttonLogin, 0, wx.ALIGN_CENTER | wx.ALIGN_CENTER_HORIZONTAL | wx.ALL, 5)

        self.m_buttonCancel = wx.Button(self, wx.ID_ANY, u"Cancel", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer46.Add(self.m_buttonCancel, 0, wx.ALIGN_CENTER | wx.ALIGN_CENTER_HORIZONTAL | wx.ALL, 5)

        bSizer41.Add(bSizer46, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer41)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.m_checkBoxRememberLogin.Bind(wx.EVT_CHECKBOX, self.OnCheckBoxRememberLogin)
        self.m_checkBoxLoginAutomatiallyOnStart.Bind(wx.EVT_CHECKBOX, self.OnCheckBoxLoginAutomaticallyOnStart)
        self.m_buttonLogin.Bind(wx.EVT_BUTTON, self.OnButtonClickLogin)
        self.m_buttonCancel.Bind(wx.EVT_BUTTON, self.OnButtonClickCancel)


    def __del__(self):
        pass


    # Virtual event handlers, overide them in your derived class

    def OnCheckBoxRememberLogin(self, event):
        if self.m_checkBoxRememberLogin.GetValue() == False:
            self.m_checkBoxLoginAutomatiallyOnStart.SetValue(False)

    def OnCheckBoxLoginAutomaticallyOnStart(self, event):
        event.Skip()


    def OnButtonClickLogin(self, event):
        self.EndModal(1)


    def OnButtonClickCancel(self, event):
        self.EndModal(0);
