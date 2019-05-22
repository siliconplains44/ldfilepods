__author__ = 'Allan'

import sys
import logging

import application

from application import appwindowed

def main():
    if len(sys.argv) > 1:
        if sys.argv[1] == 'w':
            appWindows = appwindowed.ApplicationWindowed()
            appWindows.Run(sys.argv)
    else:
        appWindows = appwindowed.ApplicationWindowed()
        appWindows.Run(sys.argv)

if __name__ == '__main__':

    #logging.basicConfig(level=logging.DEBUG, filename='filepods.log')

    try:
        main()
    except:
        logging.exception("Oops:")