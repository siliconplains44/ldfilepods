__author__ = 'Allan'

import wx


class TreeNodeInfo():

    type = 'unassigned'
    dbid = -1

    def __init__(self, type, dbid):
        self.type = type
        self.dbid = dbid

    def __del__(self):
        pass

