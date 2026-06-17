import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 460,
    height: 300,
    resizable: false,
    frame: false,
    backgroundColor: '#f4ecdc',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
}

function getMp3FilesRecursive(dirPath) {
  let results = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getMp3FilesRecursive(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.mp3')) {
      results.push(fullPath);
    }
  }

  return results;
}

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const folderPath = result.filePaths[0];
  const folderName = path.basename(folderPath);
  const mp3Paths = getMp3FilesRecursive(folderPath);

  const tracks = mp3Paths.map((filePath) => ({
    filePath,
    fileName: path.basename(filePath, '.mp3'),
  }));

  return { folderName, tracks };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});