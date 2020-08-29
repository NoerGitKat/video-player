// Select DOM elements
const videoPlayer = document.querySelector(".player");
const video = document.querySelector("video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const playBtn = document.getElementById("play-btn");
const volumeIcon = document.getElementById("volume-icon");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const currentTime = document.querySelector(".time-elapsed");
const duration = document.querySelector(".time-duration");
const fullscreenBtn = document.querySelector(".fullscreen");
const playbackRateBtn = document.querySelector("select");

// Play & Pause ----------------------------------- //
function togglePlayIcon(initialState, nextState, title) {
  playBtn.classList.replace(initialState, nextState);
  playBtn.setAttribute("title", title);
}

function togglePlay() {
  if (video.paused) {
    video.play();
    togglePlayIcon("fa-play", "fa-pause", "Pause");
  } else {
    video.pause();
    togglePlayIcon("fa-pause", "fa-play", "Play");
  }
}

// Progress Bar ---------------------------------- //
function displayTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  seconds = seconds > 9 ? seconds : `0${seconds}`;

  return `${minutes}:${seconds}`;
}

function updateVideoProgress() {
  progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
  currentTime.textContent = `${displayTime(video.currentTime)} / `;
  duration.textContent = `${displayTime(video.duration)} `;
}

function getBarPosition(element, event) {
  const barTotalWidth = element.offsetWidth;
  const clickpointBar = event.offsetX;

  return {
    barTotalWidth,
    clickpointBar,
  };
}

function setVideoProgress(event) {
  // 1. Get positions
  const { barTotalWidth, clickpointBar } = getBarPosition(progressRange, event);

  // 2. Identify new time
  const newTime = clickpointBar / barTotalWidth;

  // 3. Set current time of video
  video.currentTime = newTime * video.duration;

  // 4. Update progress bar position
  progressBar.style.width = `${newTime * 100}%`;
}

// Volume Controls --------------------------- //
let lastVolume = 1;

function setVolume(event) {
  // 1. Get positions
  const { barTotalWidth, clickpointBar } = getBarPosition(volumeRange, event);

  // 2. Identify new volume level
  let newVolume = clickpointBar / barTotalWidth;

  if (newVolume < 0.1) {
    newVolume = 0;
  }
  if (newVolume > 0.9) {
    newVolume = 1;
  }

  // 3. Update volume bar position
  volumeBar.style.width = `${newVolume * 100}%`;

  // 4. Update volume
  video.volume = newVolume;

  // 5. Change icon depending on volume
  volumeIcon.className = "";
  if (newVolume > 0.7) {
    volumeIcon.classList.add("fas", "fa-volume-up");
  } else if (newVolume < 0.7 && newVolume > 0.2) {
    volumeIcon.classList.add("fas", "fa-volume-down");
  } else {
    volumeIcon.classList.add("fas", "fa-volume-off");
  }

  lastVolume = newVolume;
}

function toggleMute() {
  if (video.volume !== 0) {
    // Toggles to mute
    lastVolume = video.volume;
    video.volume = 0;
    volumeBar.style.width = 0;
    volumeIcon.className = "";
    volumeIcon.setAttribute("title", "Unmute");
    volumeIcon.classList.add("fas", "fa-volume-mute");
  } else {
    // Toggles to unmute
    video.volume = lastVolume;
    volumeIcon.setAttribute("title", "Mute");
    volumeBar.style.width = `${lastVolume * 100}%`;
    volumeIcon.className = "";
    if (lastVolume < 0.2) {
      volumeIcon.classList.add("fas", "fa-volume-up");
      video.volume = 1;
      volumeBar.style.width = "100%";
    } else if (lastVolume > 0.7) {
      volumeIcon.classList.add("fas", "fa-volume-up");
    } else if (lastVolume < 0.7 && lastVolume > 0.2) {
      volumeIcon.classList.add("fas", "fa-volume-down");
    }
  }
}

// Change Playback Speed -------------------- //
function changePlaybackRate(event) {
  const speed = event.target.value;
  video.playbackRate = speed;
}

// Fullscreen ------------------------------- //
let isFullscreen = false;

/* Open fullscreen */
function openFullscreen(player) {
  if (player.requestFullscreen) {
    player.requestFullscreen();
  } else if (player.mozRequestFullScreen) {
    /* Firefox */
    player.mozRequestFullScreen();
  } else if (player.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    player.webkitRequestFullscreen();
  } else if (player.msRequestFullscreen) {
    /* IE/Edge */
    player.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}

function toggleFullScreen() {
  if (!isFullscreen) {
    openFullscreen(videoPlayer);
    video.classList.add("video-fullscreen");
  } else {
    closeFullscreen();
    video.classList.remove("video-fullscreen");
  }
  isFullscreen = !isFullscreen;
}

// Event Listeners
playBtn.addEventListener("click", togglePlay);

video.addEventListener("click", togglePlay);
video.addEventListener("ended", () => {
  togglePlayIcon("fa-pause", "fa-play", "Play");
});
// Fires when the current playback position has changed
video.addEventListener("timeupdate", updateVideoProgress);
// 	Fires when the browser can start playing the audio/video
video.addEventListener("canplay", updateVideoProgress);

progressRange.addEventListener("click", setVideoProgress);

volumeRange.addEventListener("click", setVolume);

volumeIcon.addEventListener("click", toggleMute);

playbackRateBtn.addEventListener("change", changePlaybackRate);

fullscreenBtn.addEventListener("click", toggleFullScreen);
