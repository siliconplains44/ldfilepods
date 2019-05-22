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
## Class DialogSendaSmile
###########################################################################

class DialogSendaSmile(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=u"Send a Smile", pos=wx.DefaultPosition,
                           size=wx.Size(600, 500), style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer26 = wx.BoxSizer(wx.VERTICAL)

        bSizer27 = wx.BoxSizer(wx.VERTICAL)

        bSizer27.AddSpacer(( 0, 0), 1, wx.EXPAND, 5)

        self.m_staticText12 = wx.StaticText(self, wx.ID_ANY, u"We appreciate your feedback.  What did you like?",
                                            wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText12.Wrap(-1)
        bSizer27.Add(self.m_staticText12, 0, wx.ALIGN_CENTER, 5)

        bSizer27.AddSpacer(( 0, 0), 1, wx.EXPAND, 5)

        bSizer26.Add(bSizer27, 1, wx.EXPAND, 5)

        bSizer28 = wx.BoxSizer(wx.VERTICAL)

        self.m_textCtrlFeedback = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.Size(500, 75),
                                              wx.TE_MULTILINE | wx.TE_WORDWRAP)
        bSizer28.Add(self.m_textCtrlFeedback, 0, wx.ALIGN_CENTER, 5)

        bSizer26.Add(bSizer28, 1, wx.EXPAND, 5)

        bSizer29 = wx.BoxSizer(wx.VERTICAL)

        bSizer29.AddSpacer(( 0, 10), 1, wx.EXPAND, 5)

        self.m_checkBoxIncludeEmailAddress = wx.CheckBox(self, wx.ID_ANY, u"Include email address", wx.DefaultPosition,
                                                         wx.DefaultSize, 0)
        bSizer29.Add(self.m_checkBoxIncludeEmailAddress, 0, wx.ALIGN_CENTER, 5)

        self.m_textCtrlEmailAddress = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.Size(300, -1),
                                                  0)
        bSizer29.Add(self.m_textCtrlEmailAddress, 0, wx.ALIGN_CENTER, 5)

        bSizer29.AddSpacer(( 0, 10), 1, wx.EXPAND, 5)

        bSizer26.Add(bSizer29, 1, wx.EXPAND, 5)

        bSizer30 = wx.BoxSizer(wx.VERTICAL)

        bSizer30.AddSpacer(( 0, 0), 1, wx.EXPAND, 5)

        self.m_staticText13 = wx.StaticText(self, wx.ID_ANY,
                                            u"Thank you for taking the time to send us feedback!  This information will remain private to Leopard Data and your information will not be shared with any third parties.  As well, we will respond to your feed back asap!",
                                            wx.DefaultPosition, wx.Size(500, 75), 0)
        self.m_staticText13.Wrap(-1)
        bSizer30.Add(self.m_staticText13, 0, wx.ALIGN_CENTER, 5)

        bSizer26.Add(bSizer30, 1, wx.EXPAND, 5)

        bSizer31 = wx.BoxSizer(wx.VERTICAL)

        self.m_buttonSendaSmile = wx.Button(self, wx.ID_ANY, u"Send a Smile", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer31.Add(self.m_buttonSendaSmile, 0, wx.ALIGN_BOTTOM | wx.ALIGN_CENTER, 5)

        bSizer26.Add(bSizer31, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer26)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.m_checkBoxIncludeEmailAddress.Bind(wx.EVT_CHECKBOX, self.OnCheckBoxIncludeEmailAddress)
        self.m_buttonSendaSmile.Bind(wx.EVT_BUTTON, self.OnButtonSendaSmile)


    def __del__(self):
        pass


    # Virtual event handlers, overide them in your derived class
    def OnCheckBoxIncludeEmailAddress(self, event):
        event.Skip()


    def OnButtonSendaSmile(self, event):
        self.EndModal(1);
	

