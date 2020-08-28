// Select DOM elements

const video = document.querySelector("video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const playBtn = document.getElementById("play-btn");
const volumeIcon = document.querySelector("volume-icon");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const currentTime = document.querySelector(".time-elapsed");
const duration = document.querySelector(".time-duration");
const fullscreenBtn = document.querySelector(".fullscreen");

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

// Volume Controls --------------------------- //

// Change Playback Speed -------------------- //

// Fullscreen ------------------------------- //

// Event Listeners
playBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);
video.addEventListener("ended", togglePlayIcon("fa-pause", "fa-play", "Play"));
// Fires when the current playback position has changed
video.addEventListener("timeupdate", updateVideoProgress);
// 	Fires when the browser can start playing the audio/video
video.addEventListener("canplay", updateVideoProgress);
