class TheraPhone {
  constructor(
      config = {
        useReverb: true,
        useVibrato: true,
        reverbImpulseFile: 'audio/factory.hall.wav',
      }
  ) {
    this.isPlaying = false
    this._setupCoreAudio(config)
  }

  _setupCoreAudio(config) {
    this.ctx = this._createContext()
    this.note = {
      gain: this._createGain()
    }
    this.master = {
      gain: this._createGain(1)
    }

    if(config.useReverb) this._createReverb(config.reverbImpulseFile)
    if(config.useVibrato) this._createVibrato();

    this.note.gain.connect(this.master.gain)
    this.master.gain.connect(this.ctx.destination)
  }

  _createContext() {
    // Create an audio context.
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    return new window.AudioContext()
  }

  _createGain(vol=.5) {
    let gain = this.ctx.createGain()
    gain.gain.value = vol
    return gain
  }

  _createOsc(freq=440, type="sine") {
    let osc = this.ctx.createOscillator()
    osc.type = type
    osc.frequency.value = 440
    return osc
  }

  _createReverb(reverbImpulseFile) {
    this.reverb = {
      convolver: this.ctx.createConvolver(),
      gain: this._createGain(.25)
    }
    this._loadImpulse(reverbImpulseFile)
    this.reverb.convolver.connect(this.reverb.gain)
    this.reverb.gain.connect(this.master.gain)
  }

  _createDelay(time=.03) {
    var delay = this.ctx.createDelay()
    delay.delayTime.value = 0.03
    return delay;
  }

  _createVibrato() {
    this.vibrato = {
      range: 150,
      interval: 1,
      increment: 10,
      currentVal: 0,
      direction: 1
    }
  }

  _loadImpulse(fileName) {
    var url = fileName
    var request = new XMLHttpRequest()
    request.open("GET", url, true)
    request.responseType = "arraybuffer"
    request.onload = () => {
      this.ctx.decodeAudioData( request.response, (buffer) => {
        this.reverb.convolver.buffer = buffer
      },
      function (e) { console.log(e) } )
    }
    request.onerror = function (e) { console.log(e) }
    request.send()
  }

  _logProps() {
    console.log(
      this.ctx,
      this.note,
      this.reverb,
      this.vibrato,
      this.master,
      this.isPlaying
    )
  }

  noteOn() {
    var self = this // Grrr
    console.info('Note On!')
    this.note.osc = this._createOsc()
    this.note.osc.connect(this.note.gain)
    if(this.reverb) this.note.osc.connect(this.reverb.convolver)

    // Bit of a hacky vibrato, hopefully work out a web audio equivalent
    if(this.vibrato) {
      this.vibrato.intervalFunction = setInterval(function() {
          // Forwards!
          if(self.vibrato.direction === 1) {
            if(self.vibrato.currentVal < self.vibrato.range) {
              self.vibrato.currentVal = self.vibrato.currentVal + self.vibrato.increment
            }
            else self.vibrato.direction = 0 // change direction
          }
          // Backwards!
          else if(self.vibrato.direction === 0) {
            if(self.vibrato.currentVal > 0) {
              self.vibrato.currentVal = self.vibrato.currentVal - self.vibrato.increment
            }
            else self.vibrato.direction = 1 // change direction
          }
          // console.log(self.vibrato.currentVal);
          self.updateNoteDetune(self.vibrato.currentVal);
      }, this.vibrato.interval)
    }
    this.note.gain.connect(this.master.gain)
    this.note.osc.start(0)
    this.note.gain.value = .75
    this.isPlaying = true

    // this._logProps(); // Testing
  }

  noteOff() {
    console.info('Note Off')
    if(!this.note.osc) return false
    this.note.gain.value = 0
    this.note.osc.stop(0)
    this.note.osc = null
    this.isPlaying = false
    clearInterval(this.vibrato.intervalFunction)
  }

  togglePlayback() {
    if(this.isPlaying) { this.noteOff() }
    else { this.noteOn() }
  }

  updateNotePitch(freq) {
    // console.log('Pitch: '+ freq)
    if(!this.note.osc) return false
    this.note.osc.frequency.value = freq
  }

  updateNoteDetune(cents) {
    if(!this.note.osc) return false
    this.note.osc.detune.value = cents
  }

}

export default TheraPhone
