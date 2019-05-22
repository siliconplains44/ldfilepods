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
## Class DialogAccessLevel
###########################################################################

class DialogAccessLevel(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=u"What Access Level?", pos=wx.DefaultPosition,
                           size=wx.Size(999, 496), style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer77 = wx.BoxSizer(wx.VERTICAL)

        bSizer81 = wx.BoxSizer(wx.VERTICAL)

        bSizer81.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer77.Add(bSizer81, 1, wx.EXPAND, 5)

        bSizer78 = wx.BoxSizer(wx.VERTICAL)

        bSizer78.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_staticText31 = wx.StaticText(self, wx.ID_ANY,
                                            u"What access level would you like to provide?  Read Only means the user can not modify your pod.  If you give the user write acces they will be able to add, modify, and delete folders and files of your pod!",
                                            wx.DefaultPosition, wx.Size(700, 200), wx.ALIGN_CENTRE)
        self.m_staticText31.Wrap(-1)
        bSizer78.Add(self.m_staticText31, 0, wx.ALIGN_CENTER, 5)

        bSizer78.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer77.Add(bSizer78, 1, wx.EXPAND, 5)

        bSizer79 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer79.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_radioBtnReadOnly = wx.RadioButton(self, wx.ID_ANY, u"Read Only", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer79.Add(self.m_radioBtnReadOnly, 0, wx.ALL, 5)

        self.m_radioBtnReadAndWrite = wx.RadioButton(self, wx.ID_ANY, u"Read and Write", wx.DefaultPosition,
                                                     wx.DefaultSize, 0)
        bSizer79.Add(self.m_radioBtnReadAndWrite, 0, wx.ALL, 5)

        bSizer79.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer77.Add(bSizer79, 1, wx.EXPAND, 5)

        bSizer80 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer80.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_buttonOK = wx.Button(self, wx.ID_ANY, u"OK", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer80.Add(self.m_buttonOK, 0, wx.ALL, 5)

        bSizer80.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer77.Add(bSizer80, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer77)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.m_buttonOK.Bind(wx.EVT_BUTTON, self.OnButtonClickOK)

    def __del__(self):
        pass

    # Virtual event handlers, overide them in your derived class
    def OnButtonClickOK(self, event):
        self.EndModal(1)
