import TheraPhone from './TheraPhone'
import AudioPad from './AudioPad'
import {displayMotionValues} from './debug'

let theraPhone = new TheraPhone()
let audioPad = new AudioPad({
  elID: "audioPad",
  startEvent: theraPhone.startEvent,
  stopEvent: theraPhone.stopEvent,
  updateEvent: theraPhone.updateEvent,
  bindEventsTo: theraPhone
})

document.addEventListener("DOMContentLoaded", function() {
  // Allow user triggered audio playback on iPhone (better fix needed)
  var iOSFix = document.getElementById('audioPad')
  iOSFix.addEventListener('click', theraPhone.noteOn.bind(theraPhone))
})

// Setup Accelerometer
if(window.DeviceMotionEvent != undefined) {
  window.ondevicemotion = function(e) {
    displayMotionValues(e) // Display values in debug div

    // Pitch adjust
    var yFreq = e.accelerationIncludingGravity.y + 10 // Make value 0 - 20
    if(yFreq > 0) { theraPhone.updateNotePitch((yFreq*30)+200) }
  }
}
else { console.log('No accelerometer: (TO DO)') }
