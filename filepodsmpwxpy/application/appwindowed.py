#!/usr/bin/env python

__author__ = 'Allan'


import wx

from ui import mainwindow

class ApplicationWindowed():
    def __init__(self):
        pass

    def InitializeApplication(self):
        pass

    def Run(self, argv):

        self.InitializeApplication()

        wsApp = wx.App(False)  # Create a new app, don't redirect stdout/stderr to a window.

        frame = mainwindow.MainWindow(None)

        wsApp.MainLoop()

        self.UnintializeApplication()

    def UnintializeApplication(self):
        pass

