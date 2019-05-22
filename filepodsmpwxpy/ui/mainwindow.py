__author__ = 'Allan'

# -*- coding: utf-8 -*-

###########################################################################
## Python code generated with wxFormBuilder (version Jun  6 2014)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import wx
import wx.xrc
import time
import webbrowser
import os
import sys

from engine import transferengine

from ui.bl import rightpanemanager
from ui.bl import treemanager

from businesslogic import bl

from ui.dialogs import dialoglogin
from ui.dialogs import dialogabout
from ui.dialogs import dialogreportabug
from ui.dialogs import dialogsendafrown
from ui.dialogs import dialogsendasmile
from ui.dialogs import dialogupdateavailable
from ui.dialogs import dialogaddeditfilepod
from ui.dialogs import dialogmanagehandle

import customtaskbaricon

from classlibrary import startuplogic

###########################################################################
## Class MainFrame
###########################################################################

class MainWindow(wx.Frame):

    def __init__(self, parent):
        wx.Frame.__init__(self, parent, id=wx.ID_ANY, title=u"Leopard Data File Pods - 2015 r1", pos=wx.DefaultPosition,
                          size=wx.Size(800, 600), style=wx.DEFAULT_FRAME_STYLE | wx.TAB_TRAVERSAL)

        #sys.stdout = open('filepodslog.txt', 'w')

        self.rightPaneManager = rightpanemanager.RightPaneManager(None)
        self.treeManager = treemanager.TreeManager(None)
        self.transferEngine = transferengine.TransferEngine()

        self.RunRunningOperationsThread = True

        self.tbIcon = customtaskbaricon.CustomTaskBarIcon(self)

        self.Bind(wx.EVT_ICONIZE, self.onMinimize)

        self.icon = wx.Icon("icon.ico", wx.BITMAP_TYPE_ICO)
        self.SetIcon(self.icon)

        image = wx.Image("splash.png", wx.BITMAP_TYPE_PNG)
        splash = wx.SplashScreen(image.ConvertToBitmap(), wx.SPLASH_CENTER_ON_SCREEN | wx.SPLASH_TIMEOUT, 100, None)

        splash.Layout()
        wx.CallLater(100, splash.Destroy)
        wx.Yield()
        time.sleep(.1)
        #splash.Hide()

        businessLogic = bl.BusinessLogic()

        versionInformation = businessLogic.RetrieveLatestSoftwareVersion()

        if (True == versionInformation["newversionavailable"]):
            dialogUpdateAvailable = dialogupdateavailable.DialogUpdateAvailable(self)
            dialogUpdateAvailable.CentreOnScreen()
            dialogUpdateAvailable.SetUrl(versionInformation["newversionlink"])
            dialogUpdateAvailable.ShowModal()
            self.Close()
        else :

            loginDialog = dialoglogin.DialogLogin(self)
            loginDialog.CentreOnScreen()

            autoLoginFileData = startuplogic.AutoLoginFileData()
            rememberUsernameAndPasswordFileData = startuplogic.RememberUsernameAndPasswordFileData()

            autoLoginFileData.LoadFile()
            rememberUsernameAndPasswordFileData.LoadFile()

            if rememberUsernameAndPasswordFileData.IsOn == 1:
                loginDialog.m_checkBoxRememberLogin.SetValue(True)
                loginDialog.m_textCtrlUsername.SetValue(rememberUsernameAndPasswordFileData.Username)
                loginDialog.m_textCtrlPassword.SetValue(rememberUsernameAndPasswordFileData.Password)
            else:
                loginDialog.m_checkBoxRememberLogin.SetValue(False)

            if autoLoginFileData.IsOn == 1:
                loginDialog.m_checkBoxLoginAutomatiallyOnStart.SetValue(True)
            else:
                loginDialog.m_checkBoxLoginAutomatiallyOnStart.SetValue(False)

            if rememberUsernameAndPasswordFileData.IsOn == 1:
                loginDialog.m_textCtrlUsername.SetValue(rememberUsernameAndPasswordFileData.Username)
                loginDialog.m_textCtrlPassword.SetValue(rememberUsernameAndPasswordFileData.Password)

            if autoLoginFileData.IsOn == 1:

                loginWasSuccessful = False

                loginWasSuccessful = businessLogic.LoginSystemUser(rememberUsernameAndPasswordFileData.Username,
                                                                   rememberUsernameAndPasswordFileData.Password)

                if (False == loginWasSuccessful[0]):

                    wx.MessageBox('Login Failed, please delete the file autologin.json from your program install directory to allow credentials reset', 'Leopard Data filePODS',
                                  wx.OK | wx.ICON_ERROR)
                    self.ShutdownApplication()

            else:
                response = loginDialog.ShowModal()

                if 1 == response:
                    if loginDialog.m_checkBoxRememberLogin.GetValue() == True:
                        rememberUsernameAndPasswordFileData.IsOn = 1
                        rememberUsernameAndPasswordFileData.Username = loginDialog.m_textCtrlUsername.GetValue()
                        rememberUsernameAndPasswordFileData.Password = loginDialog.m_textCtrlPassword.GetValue()
                    else:
                        rememberUsernameAndPasswordFileData.IsOn = 0

                    if loginDialog.m_checkBoxLoginAutomatiallyOnStart.GetValue() == True:
                        autoLoginFileData.IsOn = 1
                    else:
                        autoLoginFileData.IsOn = 0

                    autoLoginFileData.SaveFile()
                    rememberUsernameAndPasswordFileData.SaveFile()

                    businessLogic = bl.BusinessLogic()

                    loginWasSuccessful = False

                    if (0 == response):
                        self.tbIcon.RemoveIcon()
                        self.tbIcon.Destroy()
                        self.Close()
                        return
                    else:
                        loginWasSuccessful = businessLogic.LoginSystemUser(loginDialog.m_textCtrlUsername.GetValue(),
                                                                           loginDialog.m_textCtrlPassword.GetValue())

                        if (False == loginWasSuccessful[0]):

                            wx.MessageBox('Login Failed', 'Leopard Data filePODS',
                                          wx.OK | wx.ICON_ERROR)
                            self.ShutdownApplication()
                            return

                else:
                    self.ShutdownApplication()
                    return

            self.loggedInSecurityUserID = loginWasSuccessful[1]

            # verify handle, and if not one get one from the user!

            nicknames = businessLogic.RetrieveSecurityUserHandle(self.loggedInSecurityUserID)

            if len(nicknames[1]) == 0:
                dlgmanagehandle = dialogmanagehandle.DialogManageHandle(self)
                dlgmanagehandle.CenterOnScreen()

                response = dlgmanagehandle.ShowModal()

                if 0 == response:
                    return
                else:
                    businessLogic.SetSecurityUserHandle(self.loggedInSecurityUserID, dlgmanagehandle.m_textCtrlHandle.GetValue())
                    self.handle = dlgmanagehandle.m_textCtrlHandle.GetValue()
            else:
                self.handle = nicknames[1][0]["Nickname"]

            self.SetTitle("Leopard Data File Pods - 2015 r1 - handle: " + self.handle)

            # now provision sandbox

            if getattr(sys, 'frozen', False):
                self.application_path = os.path.dirname(sys.executable)
            elif __file__:
                self.application_path = os.path.dirname(__file__)

            self.sandboxPath = self.application_path + "/sandbox"
            self.sandboxViewPath = self.application_path + "/sandboxview"
            self.recoveryPath = self.application_path + "/recovery"

            if not os.path.exists(self.sandboxPath):
                os.makedirs(self.sandboxPath)

            if not os.path.exists(self.sandboxViewPath):
                os.makedirs(self.sandboxViewPath)

            if not os.path.exists(self.recoveryPath):
                os.makedirs(self.recoveryPath)

            self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

            self.m_menubarMain = wx.MenuBar(0)
            self.m_menuFile = wx.Menu()
            self.m_menuItemExit = wx.MenuItem(self.m_menuFile, wx.ID_ANY, u"Exit", wx.EmptyString, wx.ITEM_NORMAL)
            self.m_menuFile.AppendItem(self.m_menuItemExit)

            self.m_menubarMain.Append(self.m_menuFile, u"File")

            self.m_menuHelp = wx.Menu()
            self.m_menuItemSendASmile = wx.MenuItem(self.m_menuHelp, wx.ID_ANY, u"Send a Smile...", wx.EmptyString,
                                                    wx.ITEM_NORMAL)
            self.m_menuHelp.AppendItem(self.m_menuItemSendASmile)

            self.m_menuItemSendAFrown = wx.MenuItem(self.m_menuHelp, wx.ID_ANY, u"Send a Frown...", wx.EmptyString,
                                                    wx.ITEM_NORMAL)
            self.m_menuHelp.AppendItem(self.m_menuItemSendAFrown)

            self.m_menuHelp.AppendSeparator()

            self.m_menuItemDocumentation = wx.MenuItem(self.m_menuHelp, wx.ID_ANY, u"Documentation...", wx.EmptyString,
                                                       wx.ITEM_NORMAL)
            self.m_menuHelp.AppendItem(self.m_menuItemDocumentation)

            self.m_menuHelp.AppendSeparator()

            self.m_menuItemReportABug = wx.MenuItem(self.m_menuHelp, wx.ID_ANY, u"Report a Bug...", wx.EmptyString,
                                                    wx.ITEM_NORMAL)
            self.m_menuHelp.AppendItem(self.m_menuItemReportABug)

            self.m_menuHelp.AppendSeparator()

            self.m_menuItemAbout = wx.MenuItem(self.m_menuHelp, wx.ID_ANY, u"About...", wx.EmptyString, wx.ITEM_NORMAL)
            self.m_menuHelp.AppendItem(self.m_menuItemAbout)

            self.m_menubarMain.Append(self.m_menuHelp, u"Help")

            self.SetMenuBar(self.m_menubarMain)

            bSizer1 = wx.BoxSizer(wx.HORIZONTAL)

            self.m_splitterMain = wx.SplitterWindow(self, wx.ID_ANY, wx.DefaultPosition, wx.Size(-1, -1), wx.SP_3D)
            self.m_splitterMain.Bind(wx.EVT_IDLE, self.m_splitterMainOnIdle)

            self.m_panelLeftPane = wx.Panel(self.m_splitterMain, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize,
                                            wx.TAB_TRAVERSAL)
            gSizer1 = wx.GridSizer(0, 0, 0, 0)

            self.m_treeCtrlMain = wx.TreeCtrl(self.m_panelLeftPane, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize,
                                              wx.TR_DEFAULT_STYLE)
            gSizer1.Add(self.m_treeCtrlMain, 0, wx.EXPAND, 5)

            self.m_panelLeftPane.SetSizer(gSizer1)
            self.m_panelLeftPane.Layout()
            gSizer1.Fit(self.m_panelLeftPane)
            self.m_panelRightPane = wx.Panel(self.m_splitterMain, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize,
                                             wx.SUNKEN_BORDER | wx.TAB_TRAVERSAL)
            #self.m_panelRightPane.SetBackgroundColour((0,0,0))
            gSizer2 = wx.GridSizer(0, 2, 0, 0)

            self.m_panelRightPane.SetSizer(gSizer2)
            self.m_panelRightPane.Layout()
            gSizer2.Fit(self.m_panelRightPane)
            self.m_splitterMain.SplitVertically(self.m_panelLeftPane, self.m_panelRightPane, 300)
            bSizer1.Add(self.m_splitterMain, 1, wx.EXPAND, 5)

            self.SetSizer(bSizer1)
            self.Layout()
            self.m_statusBar1 = self.CreateStatusBar(1, wx.ST_SIZEGRIP, wx.ID_ANY)
            self.m_toolBarMain = self.CreateToolBar(wx.TB_FLAT | wx.TB_HORIZONTAL, wx.ID_ANY)

            # Allan's toolbar additions

            self.tbbtnCreateFilePod = self.m_toolBarMain.AddLabelTool(5000, '', wx.Bitmap('graphics/filepodsicon_addfile.png'))
            self.m_toolBarMain.AddSeparator()
            self.tbbtnQuestion = self.m_toolBarMain.AddLabelTool(5002, '', wx.Bitmap('graphics/file-pods-question.png'))

            # til here

            self.m_toolBarMain.Realize()

            self.Centre(wx.BOTH)

            # Connect Events
            self.Bind(wx.EVT_CLOSE, self.OnClose)
            self.Bind(wx.EVT_MENU, self.OnMenuExit, id=self.m_menuItemExit.GetId())
            self.Bind(wx.EVT_MENU, self.OnMenuSendaSmile, id=self.m_menuItemSendASmile.GetId())
            self.Bind(wx.EVT_MENU, self.OnMenuSendaFrown, id=self.m_menuItemSendAFrown.GetId())
            self.Bind(wx.EVT_MENU, self.OnMenuDocumentation, id=self.m_menuItemDocumentation.GetId())
            self.Bind(wx.EVT_MENU, self.OnMenuReportaBug, id=self.m_menuItemReportABug.GetId())
            self.Bind(wx.EVT_MENU, self.OnMenuAbout, id=self.m_menuItemAbout.GetId())
            self.m_treeCtrlMain.Bind(wx.EVT_TREE_ITEM_EXPANDED, self.m_treeCtrlMainOnTreeItemExpanded)
            self.m_treeCtrlMain.Bind(wx.EVT_TREE_ITEM_MENU, self.m_treeCtrlMainOnTreeItemMenu)
            self.m_treeCtrlMain.Bind(wx.EVT_TREE_ITEM_RIGHT_CLICK, self.m_treeCtrlMainOnTreeItemRightClick)
            self.m_treeCtrlMain.Bind(wx.EVT_TREE_SEL_CHANGED, self.m_treeCtrlMainOnTreeSelChanged)

            # Allan's toolbar

            self.Bind(wx.EVT_TOOL, self.OnCreateFilePod, self.tbbtnCreateFilePod)
            self.Bind(wx.EVT_TOOL, self.OnMenuAbout, self.tbbtnQuestion)

            #

            self.rightPaneManager.initialize(self, self.m_panelRightPane)
            self.treeManager.initialize(self, self.m_treeCtrlMain)

            self.transferEngine.Start(self, self.loggedInSecurityUserID)

            rightPaneInitData = {}

            self.rightPaneManager.switchPanes('home', rightPaneInitData)

            self.CenterOnScreen()
            self.Show()


    def __del__(self):
        pass

    def ShutdownApplication(self):

        self.rightPaneManager.shutdown()
        self.treeManager.shutdown()
        self.transferEngine.Stop()
        self.tbIcon.RemoveIcon()
        self.tbIcon.Destroy()
        self.Destroy()
        #sys.exit(0)

    # Virtual event handlers, overide them in your derived class

    def m_treeCtrlMainOnTreeItemExpanded(self, event):
        self.treeManager.OnTreeItemExpanded(event)

    def m_treeCtrlMainOnTreeItemMenu(self, event):
        self.treeManager.OnTreeItemMenu(event)

    def m_treeCtrlMainOnTreeItemRightClick(self, event):
        self.treeManager.OnTreeItemRightClick(event)

    def m_treeCtrlMainOnTreeSelChanged(self, event):
        self.treeManager.OnTreeSelChanged(event)

    def OnMenuExit(self, event):
        self.ShutdownApplication()


    def OnMenuSendaSmile(self, event):
        sendaSmileDialog = dialogsendasmile.DialogSendaSmile(self)
        sendaSmileDialog.CenterOnScreen()
        response = sendaSmileDialog.ShowModal()

        if (1 == response):
            businessLogic = bl.BusinessLogic()

            if True == businessLogic.SendaSmile(sendaSmileDialog.m_textCtrlFeedback.GetValue(), self.loggedInSecurityUserID,
                                                sendaSmileDialog.m_checkBoxIncludeEmailAddress.GetValue(),
                                                sendaSmileDialog.m_textCtrlEmailAddress.GetValue()):
                wx.MessageBox('Smile Submission Succeeded', 'Smile Submission Succeeded',
                              wx.OK | wx.ICON_INFORMATION)
            else:
                wx.MessageBox('Smile Submission Failed', 'Smile Submission Failed',
                              wx.OK | wx.ICON_ERROR)


    def OnMenuSendaFrown(self, event):
        sendaFrownDialog = dialogsendafrown.DialogSendaFrown(self)
        sendaFrownDialog.CenterOnScreen()
        response = sendaFrownDialog.ShowModal()

        if (1 == response):
            businessLogic = bl.BusinessLogic()

            if True == businessLogic.SendaFrown(sendaFrownDialog.m_textCtrlFeedback.GetValue(), self.loggedInSecurityUserID,
                                                sendaFrownDialog.m_checkBoxIncludeEmailAddress.GetValue(),
                                                sendaFrownDialog.m_textCtrlEmailAddress.GetValue()):
                wx.MessageBox('Frown Submission Succeeded', 'Frown Submission Succeeded',
                              wx.OK | wx.ICON_INFORMATION)
            else:
                wx.MessageBox('Smile Submission Failed', 'Smile Submission Failed',
                              wx.OK | wx.ICON_ERROR)


    def OnMenuDocumentation(self, event):
        url = "https://servicesstore.leoparddata.com/#productfilepods"
        webbrowser.open(url)


    def OnMenuReportaBug(self, event):
        reportaBugDialog = dialogreportabug.DialogReportaBug(self)
        reportaBugDialog.CenterOnScreen()
        response = reportaBugDialog.ShowModal()

        if (1 == response):
            businessLogic = bl.BusinessLogic()

            if True == businessLogic.SendaBug(reportaBugDialog.m_textCtrlBugReport.GetValue(), self.loggedInSecurityUserID):
                wx.MessageBox('Bug Submission Succeeded', 'Sub Submission Succeeded',
                              wx.OK | wx.ICON_INFORMATION)
            else:
                wx.MessageBox('Bug Submission Failed', 'Bug Submission Failed',
                              wx.OK | wx.ICON_ERROR)


    def OnMenuAbout(self, event):
        aboutDialog = dialogabout.DialogAbout(self)
        aboutDialog.CenterOnScreen()
        aboutDialog.ShowModal()

    def m_splitterMainOnIdle(self, event):
        self.m_splitterMain.SetSashPosition(300)
        self.m_splitterMain.Unbind(wx.EVT_IDLE)

    def OnCreateFilePod(self, event):

        addEditFilePodDialog = dialogaddeditfilepod.DialogAddEditFilePod(self)
        addEditFilePodDialog.CenterOnScreen()

        response = addEditFilePodDialog.ShowModal()

        if (response == 1):
            businessLogic = bl.BusinessLogic()

            returnVal = businessLogic.AddFilePod(self.loggedInSecurityUserID, addEditFilePodDialog.m_textCtrlName.GetValue(),
                                     addEditFilePodDialog.m_textCtrlDescription.GetValue())
            if returnVal[0] == True:
                self.treeManager.loadMyFilePods()
            else:
                wx.MessageBox('For some reason your file pod add did not work!', 'Leopard Data File Pods',
                              wx.OK | wx.ICON_ERROR)

    def OnClose(self, evt):
        """
        Destroy the taskbar icon and the frame
        """
        self.ShutdownApplication()

    #----------------------------------------------------------------------
    def onMinimize(self, event):
        """
        When minimizing, hide the frame so it "minimizes to tray"
        """
        self.Hide()




