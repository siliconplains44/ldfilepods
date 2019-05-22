import json
import base64
import os.path

import stringcrypto

rememberusernameandpasswordfilename = 'rememberusernameandpassword.json'
autologinfilename = 'autologin.json'
encrytionkey = 'asdfopiuwe'

class RememberUsernameAndPasswordFileData():
    def __init__(self):
        self.IsOn = 0
        self.Username = ''
        self.Password = ''

    def __del__(self):
        pass

    def SaveFile(self):

        if len(self.Username) > 0:
            self.Username = stringcrypto.encrypt(self.Username)

        if len(self.Password) > 0:
            self.Password = stringcrypto.encrypt(self.Password)

        with open(rememberusernameandpasswordfilename, 'w') as outfile:
            json.dump(self.__dict__, outfile)

    def LoadFile(self):

        if False == os.path.isfile(rememberusernameandpasswordfilename):
            self.SaveFile()

        with open(rememberusernameandpasswordfilename) as data_file:
            jsonObject = json.load(data_file)
            self.Username = jsonObject['Username']
            self.Password = jsonObject['Password']
            self.IsOn = jsonObject['IsOn']

        if len(self.Username) > 0:
            self.Username = stringcrypto.decrypt(self.Username)

        if len(self.Password) > 0:
            self.Password = stringcrypto.decrypt(self.Password)


class AutoLoginFileData():
    def __init__(self):
        self.IsOn = 0

    def __del__(self):
        pass

    def SaveFile(self):
        with open(autologinfilename, 'w') as outfile:
            json.dump(self.__dict__, outfile)

    def LoadFile(self):

        if False == os.path.isfile(autologinfilename):
            self.SaveFile()

        with open(autologinfilename) as data_file:
            jsonObject = json.load(data_file)
            self.IsOn = jsonObject['IsOn']


class StartupLogic():
    def __init__(self):
        pass

    def __del__(self):
        pass

    def IsRememberUsernameAndPasswordEnabled(self):

        remUsernameAndPasswordFileData = RememberUsernameAndPasswordFileData()
        remUsernameAndPasswordFileData.LoadFile()
        return remUsernameAndPasswordFileData.IsOn

    def SetIsRememberUsernameAndPasswordSetting(self, isOn):

        remUsernameAndPasswordFileData = RememberUsernameAndPasswordFileData()
        remUsernameAndPasswordFileData.LoadFile()
        remUsernameAndPasswordFileData.IsOn = isOn
        remUsernameAndPasswordFileData.SaveFile()

    def IsAutoLoginEnabled(self):

        autoLoginFileData = AutoLoginFileData()
        autoLoginFileData.LoadFile()
        return autoLoginFileData.IsOn

    def SetAutoLoginSetting(self, isOn):

        autoLoginFileData = AutoLoginFileData()
        autoLoginFileData.LoadFile()
        autoLoginFileData.IsOn = isOn
        autoLoginFileData.SaveFile()
