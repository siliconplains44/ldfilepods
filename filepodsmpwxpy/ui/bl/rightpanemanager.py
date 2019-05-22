__author__ = 'Allan'

import wx
import wx.xrc
import time
import webbrowser
import os

from ui.panes import panelhome
from ui.panes import panelfilepod
from ui.panes import panelfilepodbrowser
from ui.panes import panelfilepodsettings
from ui.panes import panelfilepodsharing
from ui.panes import panelfilepodssharedwithme
from ui.panes import panelmyfilepods
from ui.panes import panelrunningoperations
from ui.panes import panelfilesinedit
from ui.panes import panelmanagefilewebshares
from ui.panes import panelmanagefolderwebshares
from ui.panes import panelglobalshortcuts
from ui.panes import panelpodshortcuts
from ui.panes import panelsearchpods
from ui.panes import panelmanagefolderwebimports

from businesslogic import bl

class RightPaneManager():

    def __init__(self, parent):
        pass

    def initialize(self, mainWindow, rightPanePanel):
        self.mainWindow = mainWindow
        self.rightPanePanel = rightPanePanel

        self.mainSizer = wx.BoxSizer(wx.VERTICAL)
        rightPanePanel.SetSizer(self.mainSizer)
        #rightPanePanel.SetBackgroundColour((0, 0, 0))

        self.currentPanel = None
        self.currentPanelType = None

        rightPanePanel.Bind(wx.EVT_SIZE, self.OnPanelSize)

    def unloadCurrentPane(self):
        if self.currentPanel != None:

            if self.currentPanelType == 'runningoperations':
                self.currentPanel.RunRunningOperationsThread = False

                while self.currentPanel.IsShutDown == False:
                    pass

            self.currentPanel.Uninitialize()
            self.currentPanel.Hide()
            self.mainSizer.Detach(self.currentPanel)
            self.mainSizer.Layout()

    def loadNewPane(self, newPane, rightPaneInitData):
        if newPane == 'home':
            self.currentPanel = panelhome.PanelHome(self.rightPanePanel)
        elif (newPane == 'quickshortcutsroot'):
            self.currentPanel = panelglobalshortcuts.PanelGlobalShortcuts(self.rightPanePanel)
        elif (newPane == 'searchpodsroot'):
            self.currentPanel = panelsearchpods.PanelSearchPods(self.rightPanePanel)
        elif (newPane == 'myfilepods'):
            self.currentPanel = panelmyfilepods.PanelMyFilePods(self.rightPanePanel)
        elif (newPane == 'othersfilepods'):
            self.currentPanel = panelhome.PanelHome(self.rightPanePanel)
        elif (newPane == 'fileswebsharedroot'):
            self.currentPanel = panelmanagefilewebshares.PanelManageFileWebShares(self.rightPanePanel)
        elif (newPane == 'folderswebsharedroot'):
            self.currentPanel = panelmanagefolderwebshares.PanelManageFolderWebShares(self.rightPanePanel)
        elif (newPane == 'folderswebimportsroot'):
            self.currentPanel = panelmanagefolderwebimports.PanelManageFolderWebImports(self.rightPanePanel)
        elif (newPane == 'filesinedit'):
            self.currentPanel = panelfilesinedit.PanelFilesInEdit(self.rightPanePanel)
        elif (newPane == 'runningoperations'):
            self.currentPanel = panelrunningoperations.PanelRunningOperations(self.rightPanePanel)
        elif (newPane == 'myfilepod'):
            self.currentPanel = panelfilepod.PanelFilePod(self.rightPanePanel)
        elif (newPane == 'myfilepodsettings'):
            self.currentPanel = panelfilepodsettings.PanelFilePodSettings(self.rightPanePanel)
        elif (newPane == 'myfilepodbrowser'):
            self.currentPanel = panelfilepodbrowser.PanelFilePodBrowser(self.rightPanePanel)
        elif (newPane == 'myfilepodsharing'):
            self.currentPanel = panelfilepodsharing.PanelFilePodSharing(self.rightPanePanel)
        elif (newPane == 'quickshortcuts'):
            self.currentPanel = panelpodshortcuts.PanelPodShortcuts(self.rightPanePanel)
        elif (newPane == 'otherfilepod'):
            self.currentPanel = panelfilepod.PanelFilePod(self.rightPanePanel)
        elif (newPane == 'otherfilepodbrowser'):
            self.currentPanel = panelfilepodbrowser.PanelFilePodBrowser(self.rightPanePanel)

        self.mainSizer.Add(self.currentPanel,  wx.ALL | wx.EXPAND, 0)
        self.mainSizer.Layout()
        self.currentPanel.SetBackgroundColour((255,255,255))

        self.currentPanelType = newPane
        self.currentPanel.Initialize(self.mainWindow, rightPaneInitData)

    def switchPanes(self, newPane, rightPaneInitData):
        self.unloadCurrentPane()
        self.loadNewPane(newPane, rightPaneInitData)

        self.currentPanel.Fit()
        self.currentPanel.Layout()
        self.currentPanel.Update()

        self.currentPanel.SetSize(self.rightPanePanel.GetSize())

    def shutdown(self):

        if hasattr(self, 'currentPanelType'):
            if self.currentPanelType == 'runningoperations':
                self.currentPanel.RunRunningOperationsThread = False

                while self.currentPanel.IsShutDown == False:
                    pass

            elif self.currentPanelType == 'myfilepodbrowser' or self.currentPanelType == 'otherfilepodbrowser':
                self.currentPanel.runCheckerThread = False


    def __del__(self):
        pass

    def OnPanelSize( self, event ):
        size = self.rightPanePanel.GetSize()
        self.currentPanel.SetSize(size)

    def NotifyFilePodBrowserPaneRefreshNecessary(self, PodID):

        businessLogic = bl.BusinessLogic()

        podFolderWebShares = businessLogic.RetrieveAllPodFolderSharesByPodID(PodID)['podfoldershares']

        if self.currentPanelType == 'myfilepodbrowser':
            self.currentPanel.LoadFilePodTree(podFolderWebShares)
        elif self.currentPanelType == 'otherfilepodbrowser':
            self.currentPanel.LoadFilePodTree(podFolderWebShares)

    def NotifyFilePodBrowserFileViewerRefreshNecessary(self, folderParentID):

        if self.currentPanelType == 'myfilepodbrowser':
            self.currentPanel.LoadAllFilesForSelectedFolder(folderParentID)
        elif self.currentPanelType == 'otherfilepodbrowser':
            self.currentPanel.LoadAllFilesForSelectedFolder(folderParentID)
