// Import dependencies
import TheraPhone from './TheraPhone';
import AudioPad from './AudioPad';
// import { displayMotionValues } from './debug';
import RippleCanvas from './RippleCanvas';


// Modernizr require
require('browsernizr/test/touchevents');
const Modernizr = require('browsernizr');

// On DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Setup class instances
  const theraPhone = new TheraPhone();
  const rippleCanvas = new RippleCanvas('audioPad', {
    useTouchEvents: Modernizr.touchevents,
    updateRipplePosition: true,
  });
  function updateEvent(values) {
    theraPhone.updateEvent(values);
    // rippleCanvas.updateEvent(values);
  }

  const audioPad = new AudioPad({
    elID: 'audioPad',
    useTouchEvents: Modernizr.touchevents,
    startEvent: theraPhone.startEvent,
    stopEvent: theraPhone.stopEvent,
    updateEvent,
    bindEventsTo: theraPhone,
  });

  // Store elements
  const intro = document.getElementById('intro');
  const closeIntro = document.getElementById('closeIntro');
  // const muteButton = document.getElementById('mute');

  // Intro Screen
  function hideIntro() {
    intro.style.display = 'none';
  }

  closeIntro.addEventListener('click', hideIntro); // Hide intro window on button click

  // iOS Fix (use intro closing button to allow audio to run)
  closeIntro.addEventListener('click', theraPhone.noteOn.bind(theraPhone));

  // Mute button
  // muteButton.addEventListener('touchstart', theraPhone.mute.bind(theraPhone));
  // muteButton.addEventListener('touchend', theraPhone.unMute.bind(theraPhone));

  // Setup Accelerometer
  if (window.DeviceMotionEvent) {
    window.ondevicemotion = function(e) {
      // displayMotionValues(e) // Display values in debug div
      const hue = parseInt((e.accelerationIncludingGravity.y + 10) * 18, 0);
      rippleCanvas.updateBaseColor(hue);
      // Pitch adjust
      const yFreq = e.accelerationIncludingGravity.y + 10; // Make value 0 - 20
      if (yFreq > 0) { theraPhone.updateNotePitch((yFreq * 30) + 200); }
    };
  } else {
    // TODO: No Accelerometer detected
  }
});
