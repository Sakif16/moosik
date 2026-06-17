const playlistPanel = document.getElementById('playlist-panel');
const playlistList = document.getElementById('playlist-list');
const btnPl = document.getElementById('btn-pl');
const btnAddPlaylist = document.getElementById('btn-add-playlist');

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

let playlists = JSON.parse(localStorage.getItem('playlists') || '[]');
let currentPlaylistIndex = -1;
let currentTrackIndex = -1;
let isSeeking = false;

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
    });
    playlistList.appendChild(item);
  });
}

function playPlaylist(playlistIndex) {
  const playlist = playlists[playlistIndex];
  if (!playlist || playlist.tracks.length === 0) return;

  currentPlaylistIndex = playlistIndex;
  currentTrackIndex = 0;
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

  currentTrackIndex = (currentTrackIndex + 1) % playlist.tracks.length;
  loadTrack();
  audio.play();
}

function prevTrack() {
  const playlist = playlists[currentPlaylistIndex];
  if (!playlist) return;

  currentTrackIndex = (currentTrackIndex - 1 + playlist.tracks.length) % playlist.tracks.length;
  loadTrack();
  audio.play();
}

// ---- Playlist panel ----
btnPl.addEventListener('click', () => {
  playlistPanel.classList.toggle('hidden');
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