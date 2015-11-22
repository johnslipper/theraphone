// Import dependencies
import TheraPhone from './TheraPhone'
import AudioPad from './AudioPad'
import {displayMotionValues} from './debug'

// Modernizr require
require('browsernizr/test/touchevents')
var Modernizr = require('browsernizr')

// Setup class instances
let theraPhone = new TheraPhone()
let audioPad = new AudioPad({
  elID: "audioPad",
  useTouchEvents: Modernizr.touchevents,
  startEvent: theraPhone.startEvent,
  stopEvent: theraPhone.stopEvent,
  updateEvent: theraPhone.updateEvent,
  bindEventsTo: theraPhone
})

// On DOM Ready
document.addEventListener("DOMContentLoaded", function() {

  // Store elements
  var iOSFix = document.getElementById('audioPad')
  var muteButton = document.getElementById('mute')
  var intro = document.getElementById('intro')
  var closeIntro = document.getElementById('closeIntro')

  // Intro Screen
  var hideIntro = function() {
    intro.style.display = 'none'
  }

  closeIntro.addEventListener('click', hideIntro) // Hide intro window on button click

  // iOS Fix (use intro closing button to allow audio to run)
  closeIntro.addEventListener('click', theraPhone.noteOn.bind(theraPhone))

  // Mute button
  muteButton.addEventListener('touchstart', theraPhone.mute.bind(theraPhone))
  muteButton.addEventListener('touchend', theraPhone.unMute.bind(theraPhone))
})

// Setup Accelerometer
if(window.DeviceMotionEvent) {
  window.ondevicemotion = function(e) {
    // displayMotionValues(e) // Display values in debug div

    // Pitch adjust
    var yFreq = e.accelerationIncludingGravity.y + 10 // Make value 0 - 20
    if(yFreq > 0) { theraPhone.updateNotePitch((yFreq*30)+200) }
  }
}
else { console.log('No accelerometer: (TO DO)') }
