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
## Class PanelFilePodSettings
###########################################################################

class PanelFilePodSettings(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent, id=wx.ID_ANY, pos=wx.DefaultPosition, size=wx.Size(760, 546),
                          style=wx.TAB_TRAVERSAL)

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

        self.m_buttonSave = wx.Button(self, wx.ID_ANY, u"Save", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer46.Add(self.m_buttonSave, 0, wx.ALIGN_CENTER | wx.ALIGN_CENTER_HORIZONTAL | wx.ALL, 5)

        bSizer46.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer41.Add(bSizer46, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer41)
        self.Layout()

        # Connect Events
        self.m_buttonSave.Bind(wx.EVT_BUTTON, self.OnButtonClickSave)

    def __del__(self):
        pass

    # Virtual event handlers, overide them in your derived class
    def OnButtonClickSave(self, event):
        if (self.m_textCtrlName.GetValue() == ''):
            wx.MessageBox('You must provide a valid name for your pod!', 'Leopard Data File Pods',
                          wx.OK | wx.ICON_ERROR)
            return

        businessLogic = bl.BusinessLogic()

        if True == businessLogic.ModifyFilePod(self.rightPaneInitData["podid"], self.m_textCtrlName.GetValue(),
                                    self.m_textCtrlDescription.GetValue()):
            self.mainWindow.treeManager.OnUpdatePodName(self.rightPaneInitData["podid"], self.m_textCtrlName.GetValue())
            wx.MessageBox('Pod information saved successfully!', 'Leopard Data File Pods',
                          wx.OK | wx.ICON_INFORMATION)
        else:
            wx.MessageBox('Unable to save pod information!', 'Leopard Data File Pods',
                          wx.OK | wx.ICON_ERROR)


    mainWindow = None


    def Initialize(self, mainWindow, rightPaneInitData):
        self.mainWindow = mainWindow
        self.rightPaneInitData = rightPaneInitData

        businessLogic = bl.BusinessLogic()

        podInformation = businessLogic.RetrieveFilePodInformation(self.rightPaneInitData["podid"])

        self.m_textCtrlName.SetValue(podInformation["pods"][0]["Name"])
        self.m_textCtrlDescription.SetValue(podInformation["pods"][0]["Description"])


    def Uninitialize(self):
        pass
