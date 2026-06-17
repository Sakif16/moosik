const playlistPanel = document.getElementById('playlist-panel');
const playlistList = document.getElementById('playlist-list');
const btnPl = document.getElementById('btn-pl');
const btnAddPlaylist = document.getElementById('btn-add-playlist');
const btnBack = document.getElementById('btn-back');

const audio = document.getElementById('audio-player');
const trackInfo = document.getElementById('track-info');
const timeDisplay = document.getElementById('time-display');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('progress-bar');

const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnStop = document.getElementById('btn-stop');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const btnShuffle = document.getElementById('btn-shuffle');
const btnRepeat = document.getElementById('btn-repeat');

const btnMinimize = document.getElementById('btn-minimize');
const btnClose = document.getElementById('btn-close');

let playlists = JSON.parse(localStorage.getItem('playlists') || '[]');
let currentPlaylistIndex = -1;
let currentTrackIndex = -1;
let isSeeking = false;

let shuffleOn = false;
let shuffleOrder = [];
let shufflePointer = 0;

const repeatModes = ['off', 'all', 'one'];
let repeatMode = 'off';

function savePlaylists() {
  localStorage.setItem('playlists', JSON.stringify(playlists));
}

function formatTime(seconds) {
  if (!isFinite(seconds) || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function toFileUrl(filePath) {
  let pathName = filePath.replace(/\\/g, '/');
  if (!pathName.startsWith('/')) {
    pathName = '/' + pathName;
  }
  return encodeURI('file://' + pathName);
}

function generateShuffleOrder(length) {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderPlaylists() {
  playlistList.innerHTML = '';

  if (playlists.length === 0) {
    playlistList.innerHTML = '<div class="empty-msg">No playlists yet. Click + ADD.</div>';
    return;
  }

  playlists.forEach((playlist, index) => {
    const item = document.createElement('div');
    item.className = 'playlist-item' + (index === currentPlaylistIndex ? ' active' : '');
    item.innerHTML = `<span>${playlist.name}</span><span>${playlist.tracks.length} tracks</span>`;
    item.addEventListener('click', () => {
      playPlaylist(index);
      playlistPanel.classList.add('hidden');
    });
    playlistList.appendChild(item);
  });
}

function playPlaylist(playlistIndex) {
  const playlist = playlists[playlistIndex];
  if (!playlist || playlist.tracks.length === 0) return;

  currentPlaylistIndex = playlistIndex;

  if (shuffleOn) {
    shuffleOrder = generateShuffleOrder(playlist.tracks.length);
    shufflePointer = 0;
    currentTrackIndex = shuffleOrder[shufflePointer];
  } else {
    currentTrackIndex = 0;
  }

  loadTrack();
  audio.play();
  renderPlaylists();
}

function loadTrack() {
  const playlist = playlists[currentPlaylistIndex];
  if (!playlist) return;

  const track = playlist.tracks[currentTrackIndex];
  audio.src = toFileUrl(track.filePath);
  trackInfo.textContent = `${currentTrackIndex + 1}. ${track.fileName}`;
}

function playCurrent() {
  if (currentPlaylistIndex === -1) {
    if (playlists.length > 0) {
      playPlaylist(0);
    }
    return;
  }
  audio.play();
}

function pauseCurrent() {
  audio.pause();
}

function stopCurrent() {
  audio.pause();
  audio.currentTime = 0;
}

function nextTrack() {
  const playlist = playlists[currentPlaylistIndex];
  if (!playlist) return;

  if (shuffleOn) {
    shufflePointer = (shufflePointer + 1) % shuffleOrder.length;
    currentTrackIndex = shuffleOrder[shufflePointer];
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.tracks.length;
  }

  loadTrack();
  audio.play();
}

function prevTrack() {
  const playlist = playlists[currentPlaylistIndex];
  if (!playlist) return;

  if (shuffleOn) {
    shufflePointer = (shufflePointer - 1 + shuffleOrder.length) % shuffleOrder.length;
    currentTrackIndex = shuffleOrder[shufflePointer];
  } else {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.tracks.length) % playlist.tracks.length;
  }

  loadTrack();
  audio.play();
}

function updateRepeatButton() {
  btnRepeat.classList.toggle('active', repeatMode !== 'off');
  btnRepeat.textContent = repeatMode === 'one' ? '⟲¹' : '⟲';
}

// ---- Playlist panel ----
btnPl.addEventListener('click', () => {
  playlistPanel.classList.toggle('hidden');
});

btnBack.addEventListener('click', () => {
  playlistPanel.classList.add('hidden');
});

btnAddPlaylist.addEventListener('click', async () => {
  const result = await window.api.selectFolder();
  if (!result) return;

  playlists.push({ name: result.folderName, tracks: result.tracks });
  savePlaylists();
  renderPlaylists();
});

// ---- Transport controls ----
btnPlay.addEventListener('click', playCurrent);
btnPause.addEventListener('click', pauseCurrent);
btnStop.addEventListener('click', stopCurrent);
btnNext.addEventListener('click', nextTrack);
btnPrev.addEventListener('click', prevTrack);

// ---- Shuffle ----
btnShuffle.addEventListener('click', () => {
  shuffleOn = !shuffleOn;
  btnShuffle.classList.toggle('active', shuffleOn);

  if (shuffleOn && currentPlaylistIndex !== -1) {
    const playlist = playlists[currentPlaylistIndex];
    shuffleOrder = generateShuffleOrder(playlist.tracks.length);
    const foundAt = shuffleOrder.indexOf(currentTrackIndex);
    shufflePointer = foundAt === -1 ? 0 : foundAt;
  }
});

// ---- Repeat ----
btnRepeat.addEventListener('click', () => {
  const idx = repeatModes.indexOf(repeatMode);
  repeatMode = repeatModes[(idx + 1) % repeatModes.length];
  updateRepeatButton();
});

// ---- Window controls ----
btnMinimize.addEventListener('click', () => {
  window.api.minimizeWindow();
});

btnClose.addEventListener('click', () => {
  window.api.closeWindow();
});

// ---- Audio element events ----
audio.addEventListener('play', () => {
  playIcon.textContent = '❙❙';
});

audio.addEventListener('pause', () => {
  playIcon.textContent = '▶';
});

audio.addEventListener('timeupdate', () => {
  timeDisplay.textContent = formatTime(audio.currentTime);
  if (!isSeeking && audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  }
});

audio.addEventListener('ended', () => {
  if (repeatMode === 'one') {
    audio.currentTime = 0;
    audio.play();
    return;
  }

  const playlist = playlists[currentPlaylistIndex];
  if (!playlist) return;

  if (repeatMode === 'off') {
    const isLastSequential = !shuffleOn && currentTrackIndex === playlist.tracks.length - 1;
    const isLastShuffled = shuffleOn && shufflePointer === shuffleOrder.length - 1;
    if (isLastSequential || isLastShuffled) {
      stopCurrent();
      return;
    }
  }

  nextTrack();
});

progressBar.addEventListener('input', () => {
  isSeeking = true;
});

progressBar.addEventListener('change', () => {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
  isSeeking = false;
});

renderPlaylists();
updateRepeatButton();