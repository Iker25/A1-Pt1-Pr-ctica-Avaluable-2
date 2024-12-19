// Elements
const currentTimeElem = document.getElementById('current-time');
const countdownElem = document.getElementById('countdown');
const alarmTimeInput = document.getElementById('alarm-time');
const countdownInput = document.getElementById('countdown-duration');
const soundSelector = document.getElementById('sound-selector');
const startButton = document.getElementById('start-timer');
const stopButton = document.getElementById('stop-timer');
const alarmSound = document.getElementById('alarm-sound');

// Variables
let countdownInterval = null;
let alarmTimeout = null;

// Update current time
function updateCurrentTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('ca-CA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  currentTimeElem.textContent = timeString;
}

// Countdown timer logic
function startCountdown() {
  clearInterval(countdownInterval);
  clearTimeout(alarmTimeout);

  const alarmTime = alarmTimeInput.value;
  const countdownDuration = countdownInput.value;

  let endTime;
  if (alarmTime) {
    const [hours, minutes] = alarmTime.split(':');
    const now = new Date();
    endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  } else if (countdownDuration) {
    const [hours, minutes, seconds] = countdownDuration.split(':').map(Number);
    endTime = new Date(Date.now() + hours * 3600000 + minutes * 60000 + seconds * 1000);
  } else {
    alert('Si us plau, introdueix una hora o durada!');
    return;
  }

  countdownInterval = setInterval(() => {
    const now = new Date();
    const remaining = endTime - now;

    if (remaining <= 0) {
      clearInterval(countdownInterval);
      playAlarm();
      countdownElem.textContent = '00:00:00';
      return;
    }

    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    countdownElem.textContent = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

// Play alarm sound
function playAlarm() {
  const selectedSound = soundSelector.value;
  alarmSound.src = selectedSound; // Set the sound source based on the selection
  alarmSound.play(); // Play the selected sound
}

// Stop timer
function stopCountdown() {
  clearInterval(countdownInterval);
  clearTimeout(alarmTimeout);
  countdownElem.textContent = '';
  alarmSound.pause(); // Pause the sound if it's playing
  alarmSound.currentTime = 0; // Reset the sound to the beginning
}

// Event listeners
startButton.addEventListener('click', startCountdown);
stopButton.addEventListener('click', stopCountdown);

// Initialize clock
setInterval(updateCurrentTime, 1000);
updateCurrentTime();
