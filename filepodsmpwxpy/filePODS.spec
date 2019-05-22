# -*- mode: python -*-

block_cipher = None


a = Analysis(['main.py'],
             pathex=['/Users/allan/projects/filepodsg/filepodsmpwxpy'],
             binaries=[],
             datas=[],
             hiddenimports=[],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
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
          strip=False,
          upx=True,
          console=False , icon='icon.ico')
app = BUNDLE(exe,
             name='filePODS.app',
             icon='icon.ico',
             bundle_identifier=None)
