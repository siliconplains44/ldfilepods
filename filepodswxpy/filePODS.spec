# -*- mode: python -*-

block_cipher = None


a = Analysis(['main.py'],
             pathex=['/Users/allan/projects/filepodsg/filepodswxpy'],
             binaries=None,
             datas=None,
             hiddenimports=[],
             hookspath=None,
             runtime_hooks=None,
             excludes=None,
             win_no_prefer_redirects=None,
             win_private_assemblies=None,
             cipher=block_cipher)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          name='filePODS',
          debug=False,
          strip=None,
          upx=True,
          console=False , icon='icon.ico')
app = BUNDLE(exe,
             name='filePODS.app',
             icon='icon.ico',
             bundle_identifier=None)
