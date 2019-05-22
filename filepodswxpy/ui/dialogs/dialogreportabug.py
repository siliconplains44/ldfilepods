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
## Class DialogReportaBug
###########################################################################

class DialogReportaBug(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=u"Report a Bug", pos=wx.DefaultPosition,
                           size=wx.Size(600, 370), style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer45 = wx.BoxSizer(wx.VERTICAL)

        bSizer47 = wx.BoxSizer(wx.VERTICAL)

        bSizer47.AddSpacer(( 0, 0), 1, wx.EXPAND, 5)

        self.m_staticText19 = wx.StaticText(self, wx.ID_ANY,
                                            u"Please type your problem below.  If possible include reproduction steps.",
                                            wx.DefaultPosition, wx.Size(-1, -1), 0)
        self.m_staticText19.Wrap(-1)
        bSizer47.Add(self.m_staticText19, 0, wx.ALIGN_CENTER, 5)

        bSizer47.AddSpacer(( 0, 0), 1, wx.EXPAND, 5)

        bSizer45.Add(bSizer47, 1, wx.EXPAND, 5)

        bSizer46 = wx.BoxSizer(wx.VERTICAL)

        bSizer46.AddSpacer(( 0, 0), 1, wx.EXPAND, 5)

        self.m_textCtrlBugReport = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.Size(500, 150),
                                               wx.TE_MULTILINE | wx.TE_WORDWRAP)
        bSizer46.Add(self.m_textCtrlBugReport, 0, wx.ALIGN_CENTER, 5)

        bSizer46.AddSpacer(( 0, 0), 1, wx.EXPAND, 5)

        bSizer45.Add(bSizer46, 1, wx.EXPAND, 5)

        bSizer48 = wx.BoxSizer(wx.VERTICAL)

        bSizer48.AddSpacer(( 0, 0), 1, wx.EXPAND, 5)

        self.m_buttonSubmit = wx.Button(self, wx.ID_ANY, u"Submit", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer48.Add(self.m_buttonSubmit, 0, wx.ALIGN_CENTER, 5)

        bSizer48.AddSpacer(( 0, 0), 1, wx.EXPAND, 5)

        bSizer45.Add(bSizer48, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer45)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.m_buttonSubmit.Bind(wx.EVT_BUTTON, self.OnButtonClickSubmit)


    def __del__(self):
        pass


    # Virtual event handlers, overide them in your derived class
    def OnButtonClickSubmit(self, event):
        self.EndModal(1);
	

