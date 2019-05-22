__author__ = 'Allan'

import sys
import logging
import multiprocessing

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

    multiprocessing.freeze_support()

    if sys.platform.startswith('win'):
        # First define a modified version of Popen.
        class _Popen(multiprocessing.forking.Popen):
            def __init__(self, *args, **kw):
                if hasattr(sys, 'frozen'):
                    # We have to set original _MEIPASS2 value from sys._MEIPASS
                    # to get --onefile mode working.
                    os.putenv('_MEIPASS2', sys._MEIPASS)
                try:
                    super(_Popen, self).__init__(*args, **kw)
                finally:
                    if hasattr(sys, 'frozen'):
                        # On some platforms (e.g. AIX) 'os.unsetenv()' is not
                        # available. In those cases we cannot delete the variable
                        # but only set it to the empty string. The bootloader
                        # can handle this case.
                        if hasattr(os, 'unsetenv'):
                            os.unsetenv('_MEIPASS2')
                        else:
                            os.putenv('_MEIPASS2', '')


        # Second override 'Popen' class with our modified version.
        multiprocessing.forking.Popen = _Popen

    #logging.basicConfig(level=logging.DEBUG, filename='filepods.log')

    try:
        main()
    except:
        logging.exception("Oops:")