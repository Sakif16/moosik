# Moosik

## Intro
A simple retro-styled desktop music player built with Electron, where every folder of mp3s automatically becomes its own playlist.

---

## Description
Moosik is a lightweight Electron-based desktop app for playing your local mp3 collection. Instead of manually building playlists track by track, you just point it at a folder.

### What you can do:
- Import any folder of mp3s as a playlist with one click  
- Automatically scan subfolders for mp3 files  
- Play, pause, stop, skip, and rewind tracks    
- Cycle through repeat modes: off, repeat-all, repeat-one  
- Delete playlists you no longer need  
- Playlists persist automatically between launches  
- Custom retro-styled, frameless window with working minimize/close controls  

---

## Tech Stack
- Electron  
- Node.js  
- HTML / CSS / JavaScript   
- electron-builder  

---

## Installation & Usage

### 🔹 Step 1: Clone the repository
```bash
git clone https://github.com/Sakif16/moosik.git
```

### 🔹 Step 2: Enter directory
```bash
cd moosik
```

### 🔹 Step 3: Install the dependencies
```bash
pnpm install
```

### 🔹 Step 4: Run the app
```bash
pnpm start
```

### 🔹 Step 5 (optional): Build a Windows installer
```bash
pnpm run dist
```
The installer will be generated at `dist/Moosik Setup 1.0.0.exe`.

---

## Contributions
Contributions are welcome!

### You can contribute by:
- Reporting bugs or issues  
- Suggesting new features or improvements  
- Refactoring code for better performance or readability  
- Improving the retro UI and interaction design  
- Enhancing documentation  

### How to contribute:
### 1) Fork the repository
### 2) Clone your fork
```bash
git clone https://github.com/YOUR_USERNAME/moosik.git
```
### 3) Create a new branch
```bash
git checkout -b feature-name
```
### 4) Make your changes and commit
```bash
git commit -m "Add: your feature description"
```
### 5) Push to your fork
```bash
git push origin feature-name
```
### 6) Open a Pull Request on GitHub

## ⚠️ Known Issues
- Only `.mp3` files are detected; other audio formats are ignored  
- Track duration and metadata (artist, album, bitrate, etc.) are not read from the actual file, the Kbps/Khz display is decorative  
- The visualizer bars are static and not reactive to actual audio  
- Large folders with hundreds of mp3s may take a moment to scan on first import  
- Tested primarily on Windows; macOS and Linux behavior is unverified  
- No code-signing on the Windows installer, so SmartScreen may warn on first run  

## Future Development
- Read real ID3 metadata (title, artist, album, duration) instead of relying on filenames  
- Support additional audio formats (`.wav`, `.flac`, `.ogg`)  
- Real-time audio-reactive visualizer instead of static bars  
- Drag-and-drop track reordering within a playlist  
- Search/filter bar for large playlists  
- Auto-refresh a playlist if mp3s are added to or removed from its source folder  
- Volume control and a mute toggle  
- Cross-platform builds (macOS `.dmg`, Linux `.AppImage`)  
- Custom keyboard shortcuts (play/pause, next/prev)  
- Light/dark or alternate retro skin themes