import createAudioContext from 'ios-safe-audio-context';
class TheraPhone {
  constructor(
      config = {
        useReverb: true,
        useVibrato: true,
        reverbImpulseFile: 'audio/factory.hall.wav',
      }
  ) {
    this.setupCoreAudio(config);
  }
  // Setup core components
  setupCoreAudio(config) {
    this.ctx = this.createContext();
    this.note = {
      gain: this.createGain(0),
    };
    this.master = {
      gain: this.createGain(1),
    };

    // Create reverb and connect to note
    if (config.useReverb) {
      this.createReverb(config.reverbImpulseFile);
      this.note.gain.connect(this.reverb.gain);
    } else {
      this.note.gain.connect(this.master.gain);
    }
    if (config.useVibrato) this.vibrato = this.createVibrato();
    this.master.gain.connect(this.ctx.destination);
  }

  // Create audio context
  createContext(sampleRate) {
    // window.AudioContext = window.AudioContext || window.webkitAudioContext
    // return new window.AudioContext()

    // iOS fixed audio context
    return createAudioContext(sampleRate);
  }

  // Create default gain node
  createGain(vol = 0.5) {
    const gain = this.ctx.createGain();
    gain.gain.value = vol;
    return gain;
  }

  // Create default oscillator node
  createOsc(freq = 440, type = 'sine') {
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = 440;
    return osc;
  }

  // Create covolver reverb
  createReverb(reverbImpulseFile) {
    this.reverb = {
      convolver: this.ctx.createConvolver(),
      gain: this.createGain(0.5),
    };
    this.loadImpulse(reverbImpulseFile);
    this.reverb.convolver.connect(this.reverb.gain);
    this.reverb.gain.connect(this.master.gain);
  }

  // Load impluse file for reverb
  loadImpulse(fileName) {
    const url = fileName;
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
      this.ctx.decodeAudioData(request.response, (buffer) => {
        this.reverb.convolver.buffer = buffer;
      },
      () => {
        // console.log(e);
      });
    };
    // request.onerror = function (e) { console.log(e); };
    request.send();
  }

  // Create vibrato object
  createVibrato() {
    return {
      range: 150,
      interval: 1,
      increment: 10,
      currentVal: 0,
      direction: 1,
      update: this.updateNoteDetune,
    };
  }

  // Util function to oscillate between range of values
  oscillateValues(params) {
    if (params) {
      const obj = params;
      if (obj.direction === 1) {
        // Forwards!
        if (obj.currentVal < obj.range) {
          obj.currentVal = obj.currentVal + obj.increment;
        } else {
          obj.direction = 0; // change direction
        }
      } else if (obj.direction === 0) {
        // Backwards!
        if (obj.currentVal > 0) {
          obj.currentVal = obj.currentVal - obj.increment;
        } else {
          obj.direction = 1; // change direction
        }
      }
      const updateFunction = params.update.bind(this);
      updateFunction(params.currentVal);
      setTimeout(() => {
        this.oscillateValues(params);
      }, params.interval);
    }
  }

  // Start web audio chain (important: Note gain is silent at this point)
  noteOn() {
    if (this.note.osc) return; // Note already playing
    // console.info('Note On!');
    this.note.osc = this.createOsc();
    this.note.osc.connect(this.note.gain);
    if (this.reverb) this.note.gain.connect(this.reverb.convolver);

    // Bit of a hacky vibrato, hopefully work out a web audio equivalent
    if (this.vibrato) this.oscillateValues(this.vibrato);
    this.note.gain.connect(this.master.gain);
    this.note.osc.start(0);
  }

  // Stop audio chain (will destroy the one-use note oscillator)
  noteOff() {
    // console.info('Note Off');
    if (this.note.osc) {
      this.note.osc.stop(0);
      this.note.osc = null;
      clearInterval(this.vibrato.intervalFunction);
    }
  }

  // Mute master gain
  mute() {
    this.master.gain.gain.value = 0;
  }

  // Unmute master gain
  unMute() {
    this.master.gain.gain.value = 1;
  }

  // Update pitch of main note oscillator
  updateNotePitch(freq) {
    if (this.note.osc) this.note.osc.frequency.value = freq;
  }

  // Update main note oscillator detune value
  updateNoteDetune(cents) {
    if (this.note.osc) this.note.osc.detune.value = cents;
  }

  // Update main note gain
  updateVolume(vol) {
    if (this.note.gain && vol >= 0 && vol < 1) this.note.gain.gain.value = vol;
  }

  // Update range of note vibrato
  updateVibratoRange(range = 150) {
    if (this.vibrato) this.vibrato.range = range;
  }

  // Update increment used in vibrato oscillator function
  updateVibratoIncrement(increment = 10) {
    if (this.vibrato) this.vibrato.increment = increment;
  }

  // Start playback external callback event
  startEvent() {
    // console.info('Start event');
    document.body.classList.add('playing'); // Add body CSS class
    // this.updateVolume(1) // Turn up main note gain
  }

  // Stop playback external callback event
  stopEvent() {
    // console.info('Stop event');
    document.body.classList.remove('playing'); // Remove body CSS class
    this.updateVolume(0); // Silence main note gain
  }

  // Update values external callback event (dynamically update class values)
  updateEvent(values = { x: 0, y: 0 }) {
    const volume = 1 - values.y;
    const range = (values.x) * 250;
    const increment = values.x * 10 + 1;
    if (values.x >= 0) this.updateVibratoIncrement(increment);
    if (values.x >= 0) this.updateVibratoRange(range);
    if (values.y >= 0) this.updateVolume(volume);
  }

}

export default TheraPhone;
