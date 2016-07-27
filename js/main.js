// Import dependencies
import TheraPhone from './TheraPhone';
import AudioPad from './AudioPad';
// import { displayMotionValues } from './debug';

// Modernizr require
require('browsernizr/test/touchevents');
const Modernizr = require('browsernizr');

// Setup class instances
const theraPhone = new TheraPhone();
const audioPad = new AudioPad({
  elID: 'audioPad',
  useTouchEvents: Modernizr.touchevents,
  startEvent: theraPhone.startEvent,
  stopEvent: theraPhone.stopEvent,
  updateEvent: theraPhone.updateEvent,
  bindEventsTo: theraPhone,
});

// On DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Store elements
  const muteButton = document.getElementById('mute');
  const intro = document.getElementById('intro');
  const closeIntro = document.getElementById('closeIntro');

  // Intro Screen
  function hideIntro() {
    intro.style.display = 'none';
  }

  closeIntro.addEventListener('click', hideIntro); // Hide intro window on button click

  // iOS Fix (use intro closing button to allow audio to run)
  closeIntro.addEventListener('click', theraPhone.noteOn.bind(theraPhone));

  // Mute button
  muteButton.addEventListener('touchstart', theraPhone.mute.bind(theraPhone));
  muteButton.addEventListener('touchend', theraPhone.unMute.bind(theraPhone));
});

// Setup Accelerometer
if (window.DeviceMotionEvent) {
  window.ondevicemotion = function(e) {
    // displayMotionValues(e) // Display values in debug div

    // Pitch adjust
    const yFreq = e.accelerationIncludingGravity.y + 10; // Make value 0 - 20
    if (yFreq > 0) { theraPhone.updateNotePitch((yFreq * 30) + 200); }
  };
} else {
  // TODO: No Accelerometer detected
}
