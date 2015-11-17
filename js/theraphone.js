class TheraPhone {
  constructor(
      config = {
        useReverb: true,
        useVibrato: true,
        reverbImpulseFile: 'audio/factory.hall.wav'
      }
  ) {
    this._setupCoreAudio(config)
  }

  _setupCoreAudio(config) {
    this.ctx = this._createContext()
    this.note = {
      gain: this._createGain(0)
    }
    this.master = {
      gain: this._createGain(1)
    }

    if(config.useReverb) {
      this._createReverb(config.reverbImpulseFile)
      this.note.gain.connect(this.reverb.gain)
    }
    else {
      this.note.gain.connect(this.master.gain)
    }
    if(config.useVibrato) this._createVibrato()

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
      gain: this._createGain(.5)
    }
    this._loadImpulse(reverbImpulseFile)
    this.reverb.convolver.connect(this.reverb.gain)
    this.reverb.gain.connect(this.master.gain)
  }

  _createDelay(time=.03) {
    var delay = this.ctx.createDelay()
    delay.delayTime.value = 0.03
    return delay
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

  noteOn() {
    if(this.note.osc) return // Note already playing
    console.info('Note On!')
    this.note.osc = this._createOsc()
    this.note.osc.connect(this.note.gain)
    if(this.reverb) this.note.gain.connect(this.reverb.convolver)

    // Bit of a hacky vibrato, hopefully work out a web audio equivalent
    if(this.vibrato) {
      this.vibrato.intervalFunction = setInterval(() => {
          // Forwards!
          if(this.vibrato.direction === 1) {
            if(this.vibrato.currentVal < this.vibrato.range) {
              this.vibrato.currentVal = this.vibrato.currentVal + this.vibrato.increment
            }
            else this.vibrato.direction = 0 // change direction
          }
          // Backwards!
          else if(this.vibrato.direction === 0) {
            if(this.vibrato.currentVal > 0) {
              this.vibrato.currentVal = this.vibrato.currentVal - this.vibrato.increment
            }
            else this.vibrato.direction = 1 // change direction
          }
          this.updateNoteDetune(this.vibrato.currentVal)
      }, this.vibrato.interval)
    }
    this.note.gain.connect(this.master.gain)
    this.note.osc.start(0)
  }

  noteOff() {
    if(!this.note.osc) return false
    console.info('Note Off')
    this.note.osc.stop(0)
    this.note.osc = null
    clearInterval(this.vibrato.intervalFunction)
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

  updateVolume(vol) {
    if(!this.note.gain) return false
    this.note.gain.value = vol
  }

  startEvent() {
    // console.info('Start event')
    if(!this.note.osc) this.noteOn()
    this.note.gain.gain.value = 1
  }

  stopEvent() {
    // console.info('Stop event')
    this.note.gain.gain.value = 0
  }

  updateEvent(values) {
    // console.log(values)
  }

}

export default TheraPhone
