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

from classlibrary import config

from ui.dialogs import dialogemail
from ui.dialogs import dialogsmstext

###########################################################################
## Class DialogFolderWebShareDownloadInformation
###########################################################################

class DialogFolderWebShareDownloadInformation(wx.Dialog):
    def __init__(self, parent):
        wx.Dialog.__init__(self, parent, id=wx.ID_ANY, title=wx.EmptyString, pos=wx.DefaultPosition,
                           size=wx.Size(671, 755), style=wx.DEFAULT_DIALOG_STYLE)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer116 = wx.BoxSizer(wx.VERTICAL)

        bSizer119 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer119.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_buttonCopyToClipboard = wx.Button(self, wx.ID_ANY, u"Copy To Clipboard", wx.DefaultPosition,
                                                 wx.DefaultSize, 0)
        bSizer119.Add(self.m_buttonCopyToClipboard, 0, wx.ALL, 5)

        self.m_buttonEmailNow = wx.Button(self, wx.ID_ANY, u"Email Now...", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer119.Add(self.m_buttonEmailNow, 0, wx.ALL, 5)

        self.m_buttonSmsTextNow = wx.Button(self, wx.ID_ANY, u"Sms Text Now...", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer119.Add(self.m_buttonSmsTextNow, 0, wx.ALL, 5)

        bSizer119.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        bSizer116.Add(bSizer119, 1, wx.EXPAND, 5)

        bSizer120 = wx.BoxSizer(wx.VERTICAL)

        self.m_textCtrlDownloadInformation = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                                         wx.Size(650, 580), wx.TE_MULTILINE)
        bSizer120.Add(self.m_textCtrlDownloadInformation, 0, wx.ALL, 5)

        bSizer116.Add(bSizer120, 1, wx.EXPAND, 5)

        bSizer121 = wx.BoxSizer(wx.VERTICAL)

        bSizer121.AddSpacer((0, 0), 1, wx.EXPAND, 5)

        self.m_buttonClose = wx.Button(self, wx.ID_ANY, u"Close", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer121.Add(self.m_buttonClose, 0, wx.ALIGN_CENTER | wx.ALL, 5)

        bSizer116.Add(bSizer121, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer116)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.m_buttonCopyToClipboard.Bind(wx.EVT_BUTTON, self.OnButtonClickCopyToClipboard)
        self.m_buttonEmailNow.Bind(wx.EVT_BUTTON, self.OnButtonClickEmailNow)
        self.m_buttonSmsTextNow.Bind(wx.EVT_BUTTON, self.OnButtonClickSmsNow)
        self.m_buttonClose.Bind(wx.EVT_BUTTON, self.OnButtonClickClose)

    def __del__(self):
        pass

    def Initialize(self, identifier, webpasscode):
        self.identifier = identifier
        self.webpasscode = webpasscode

        self.downloadInfoString = ''

        self.downloadInfoString = self.downloadInfoString + "You have access to a filePods Folder Web Share..." + "\n"
        self.downloadInfoString = self.downloadInfoString + "" + "\n"
        self.downloadInfoString = self.downloadInfoString + "(1)  Open a web browser of your choice (Internet Explorer, Chrome, Safari, or Firefox)" + "\n"
        self.downloadInfoString = self.downloadInfoString + "(2)  Navigate to " + config.serviceFolderShareDownloadRootURL + "/" + "\n"
        self.downloadInfoString = self.downloadInfoString + "(3)  Enter this username (by copying and pasting) into the username Text Box -> " + identifier + "\n"
        self.downloadInfoString = self.downloadInfoString + "(4)  Press the \"Login\" Button... Your folder browser dashboard will come up!" + "\n"

        self.m_textCtrlDownloadInformation.SetValue(self.downloadInfoString)

    # Virtual event handlers, overide them in your derived class
    def OnButtonClickCopyToClipboard(self, event):

        clipdata = wx.TextDataObject()
        clipdata.SetText(self.m_textCtrlDownloadInformation.GetValue())
        if wx.TheClipboard.Open():
            wx.TheClipboard.SetData(clipdata)
            wx.TheClipboard.Flush()
        else:
            wx.MessageBox("Unable to open the clipboard", "Error")

    def OnButtonClickEmailNow(self, event):

        DialogEmail = dialogemail.DialogEmail(self)

        DialogEmail.CenterOnScreen()

        DialogEmail.m_textCtrlSubject.SetValue('File Download Information from File Pods')
        DialogEmail.m_textCtrlMessage.SetValue(self.downloadInfoString)

        result = DialogEmail.ShowModal()

        if result == 1:

            businessLogic = bl.BusinessLogic()

            businessLogic.SendEmail('inquiries@leoparddata.com', DialogEmail.m_textCtrlTo.GetValue(),
                                    DialogEmail.m_textCtrlSubject.GetValue(), DialogEmail.m_textCtrlMessage.GetValue(),
                                    None)



    def OnButtonClickSmsNow(self, event):

        DialogText = dialogsmstext.DialogSmsText(self)

        DialogText.CenterOnScreen()

        message = 'You have a filePODS Folder Web Share waiting at... ' + config.serviceFolderShareDownloadRootURL

        DialogText.m_textCtrlMessage.SetValue(message)

        result = DialogText.ShowModal()

        if result == 1:

            businessLogic = bl.BusinessLogic()

            businessLogic.SendTextMessage(DialogText.m_textCtrlTo.GetValue(), DialogText.m_textCtrlMessage.GetValue())


    def OnButtonClickClose(self, event):
        self.EndModal(0)
