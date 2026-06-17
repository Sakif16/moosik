

const { contextBridge, ipcRenderer } = require('electron');

console.log('[preload] loading preload.cjs, exposing window.api now');

contextBridge.exposeInMainWorld('api', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  closeWindow: () => ipcRenderer.send('window-close'),
});

console.log('[preload] window.api exposed successfully');