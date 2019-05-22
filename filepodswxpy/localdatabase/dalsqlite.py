__author__ = 'Allan'

import os
import sqlite3

from classlibrary import config

class DalSqlite:

    connection = None
    cursor = None

    def __init__(self):

        if False == os.path.isfile(config.localdatabasename):
            self.createSchema()

    def createSchema(self):
        self.runStatement('CREATE TABLE filesinedit (FileInEditID INTEGER PRIMARY KEY AUTOINCREMENT, Filename TEXT, LocalFolderName TEXT, ParentFolderID INTEGER, PodID INTEGER, PodName TEXT);', False)

    def openConnection(self):

        self.connection = sqlite3.connect(config.localdatabasename)

    def closeConnection(self):

        self.connection.close()

    def runQuery(self, query):

        returnList = []

        self.openConnection()

        cursor = self.connection.cursor()
        cursor.execute(query)

        returnList = cursor.fetchall()

        cursor.close()

        self.closeConnection()

        return returnList

    def runStatement(self, sqlStatement, returnInsertId):

        lastInsertId = None

        self.openConnection()
        cursor = self.connection.cursor()
        cursor.execute(sqlStatement)

        self.connection.commit()

        if (True == returnInsertId):
            lastInsertId = cursor.lastrowid

        cursor.close()
        self.closeConnection()

        if (True == returnInsertId):
            return lastInsertId

    def RetrieveAllFilesInEdit(self):

        return self.runQuery('SELECT * FROM filesinedit;');


    def AddFileInEdit(self, Filename, LocalFolderName, ParentFolderID, PodID, PodName):

        return self.runStatement("INSERT INTO filesinedit (Filename, LocalFolderName, ParentFolderID, PodID, PodName) VALUES ('" + Filename + "','" + LocalFolderName + "'," + str(ParentFolderID) + "," + str(PodID) + ",'" + PodName + "')", True)

    def RetrieveFileInEdit(self, FileInEditID):

        return self.runQuery('SELECT * FROM filesinedit WHERE FileInEditID = ' + str(FileInEditID))

    def DeleteFileInEdit(self, FileInEditID):

        self.runStatement('DELETE FROM filesinedit WHERE FileInEditID = ' + str(FileInEditID), False)
