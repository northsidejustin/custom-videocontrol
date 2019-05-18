//icons
const playIcon = '<i class="fas fa-play"></i>'
const pauseIcon = '<i class="fas fa-pause"></i>'
const volumeUpIcon = '<i class="fas fa-volume-up"></i>'
const volumeDownIcon = '<i class="fas fa-volume-down"></i>'
const volumeMuteIcon = '<i class="fas fa-volume-mute"></i>'

function Class(param){
  return document.getElementsByClassName(param)[0]
}

//doms
const player = Class('all')
const controlPanel = Class('custom-control-container')
const video = Class('video')
const playButton = Class('play-toggle')
const muteButton = Class('mute-toggle')
const volumeControl = Class('volume-control')
const progressControl = Class('progress-control')
const timeIndicator = Class('time-indicator')
const fullscreenButton = Class('fullscreen')
const playButtonMiddle = Class('playbutton-middle')
//onload
setVolumeTrailWidth()
setProgressTrailWidth()

function calculateDuration(){
  let total = video.duration - video.currentTime
  let minutes = Math.floor(total / 60)
  let seconds = Math.round(total % 60)
  if(minutes < 10){
    minutes = `0${minutes}`
  }
  if (seconds < 10){
    seconds = `0${seconds}`
  }
  timeIndicator.textContent = `${minutes}:${seconds}`

  if (total == 0){
    console.log("done")
    playButton.innerHTML = playIcon
    playButtonMiddle.style.opacity = 1
  }
}

function playToggle(){
  video.paused ? video.play() : video.pause()
  const icon = video.paused ? playIcon : pauseIcon
  playButton.innerHTML = icon
  rotatePlayButton()
  toggleMiddlePlayButton()
}

function toggleMute(){
  video.muted = !video.muted

  if(video.muted){
    volumeControl.value = 0
  }
  else{
    volumeControl.value = video.volume
  }
  const icon = video.muted ? volumeMuteIcon : volumeUpIcon
  if(video.volume == 0){
    video.volume = 0.5
    volumeControl.value = 0.5
    muteButton.innerHTML = volumeDownIcon
  }
  else{
    muteButton.innerHTML = icon
  }
  setVolumeTrailWidth()
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&
    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else {
      console.log("not supported");
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

function changeVolume(){
  setVolumeTrailWidth()
  video.volume = this.value
  let icon = ''
  if(this.value == 0){
    video.muted = true
    icon = volumeMuteIcon
  }
  else{
    video.muted = false
    if(this.value <= 0.5){
      icon = volumeDownIcon
    }
    else{
      icon = volumeUpIcon
    }
  }
  muteButton.innerHTML = icon
}

function setVolumeTrailWidth(){
  Class('volume-control').style.setProperty('--volumeWidth', `${volumeControl.value*100}%`)
}

function setProgressTrailWidth(){
  Class('progress-control').style.setProperty('--progressWidth', `${progressControl.value*100}%`)
}

function updateProgressBar(){
  progressControl.value = (video.currentTime/video.duration)
  calculateDuration()
  setProgressTrailWidth()
}

function rotatePlayButton(){
  if(!playButton.style.transform){
    playButton.style.transform = 'rotate(360deg)'
  }
  else{
    if(playButton.style.transform == 'rotate(360deg)'){
      playButton.style.transform = 'rotate(-360deg)'
    }
    else{
      playButton.style.transform = 'rotate(360deg)'
    }
  }
}

function scrub(){
  setProgressTrailWidth()
  video.currentTime = (progressControl.value * video.duration)
}


function showVolumeControl(){
  volumeControl.style.opacity = '1'
  volumeControl.style.maxWidth = "20%"
}

function hideVolumeControl(){
  volumeControl.style.opacity = '0'
  volumeControl.style.maxWidth = "0"
}

function toggleMiddlePlayButton(){
  playButtonMiddle.style.opacity = video.paused ? 1 : 0;
}

let delay

function hideControlPanel(){
  if(!video.paused){
    delay = setTimeout(function(){
      controlPanel.style.bottom = '-30px'
      controlPanel.style.opacity = 0
      controlPanel.style.pointerEvents = 'none'
    }, 2000);
  }
}
function showControlPanel(){
  console.log("test")
  clearTimeout(delay)
  controlPanel.style.pointerEvents = 'auto'
  controlPanel.style.bottom = '5px'
  controlPanel.style.opacity = 1
}

playButton.addEventListener('click', playToggle)

video.addEventListener('loadedmetadata', calculateDuration)
video.addEventListener('click', playToggle)
video.addEventListener('dblclick', toggleFullScreen)
video.addEventListener('timeupdate', updateProgressBar)

player.addEventListener('mouseout', hideControlPanel)
player.addEventListener('mouseover', showControlPanel)

muteButton.addEventListener('click', toggleMute)
muteButton.addEventListener('mouseover', showVolumeControl)
muteButton.addEventListener('mouseout', hideVolumeControl)
volumeControl.addEventListener('input', changeVolume)
volumeControl.addEventListener('mouseover', showVolumeControl)
volumeControl.addEventListener('mouseout', hideVolumeControl)

progressControl.addEventListener('input', scrub)

fullscreenButton.addEventListener('click', toggleFullScreen)